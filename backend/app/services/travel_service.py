"""
travel_service.py — Orchestrates the full travel video analysis pipeline.

Pipeline:
1. Extract frames from video via ffmpeg (1 frame/10 s, 400 px wide)
2. Analyse all frames with Claude Vision using a Vietnamese travel prompt
3. Determine the next #N tag from the Notion Travel parent page
4. Create a Notion page (child of the Travel parent, NOT in a database)
5. Upload frames to freeimage.host and append as image blocks to the page
6. Clean up the temp frames directory
"""

import asyncio
import logging
import re
import shutil
from pathlib import Path

import httpx

from app.core.config import get_settings
from app.services.firebase_service import update_job

logger = logging.getLogger(__name__)

# ── Constants ──────────────────────────────────────────────────────────────────

NOTION_API_VERSION = "2022-06-28"
NOTION_BASE_URL = "https://api.notion.com/v1"

# Travel parent page that all analysis pages are created under
TRAVEL_PARENT_PAGE_ID = "32729321-fe1b-819f-ae08-d658478bf790"

# freeimage.host public API key
FREEIMAGE_API_KEY = "6d207e02198a847aa98d0a2a901485a5"
FREEIMAGE_UPLOAD_URL = "https://freeimage.host/api/1/upload"

MAX_RICH_TEXT = 2000   # Notion hard limit per rich_text block
MAX_BLOCKS_PER_CALL = 100  # Notion hard limit per append call


# ── Notion helpers (duplicated locally to keep service self-contained) ─────────

def _notion_headers(api_key: str) -> dict:
    return {
        "Authorization": f"Bearer {api_key}",
        "Notion-Version": NOTION_API_VERSION,
        "Content-Type": "application/json",
    }


def _markdown_to_blocks(markdown: str) -> list[dict]:
    """
    Convert markdown text into Notion block objects.

    Handles: # h1, ## h2, ### h3, bullet lists (- * •), plain paragraphs.
    Long text is split at the 2000-char Notion limit.
    """
    blocks: list[dict] = []

    for line in markdown.splitlines():
        stripped = line.strip()

        if not stripped:
            blocks.append({"object": "block", "type": "paragraph", "paragraph": {"rich_text": []}})
            continue

        if stripped.startswith("### "):
            text = stripped[4:].strip()
            blocks.append({
                "object": "block",
                "type": "heading_3",
                "heading_3": {
                    "rich_text": [{"type": "text", "text": {"content": text[:MAX_RICH_TEXT]}}]
                },
            })

        elif stripped.startswith("## "):
            text = stripped[3:].strip()
            blocks.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [{"type": "text", "text": {"content": text[:MAX_RICH_TEXT]}}]
                },
            })

        elif stripped.startswith("# "):
            text = stripped[2:].strip()
            blocks.append({
                "object": "block",
                "type": "heading_1",
                "heading_1": {
                    "rich_text": [{"type": "text", "text": {"content": text[:MAX_RICH_TEXT]}}]
                },
            })

        elif stripped.startswith(("- ", "* ", "• ")):
            text = stripped[2:].strip()
            for i in range(0, max(1, len(text)), MAX_RICH_TEXT):
                chunk = text[i: i + MAX_RICH_TEXT]
                blocks.append({
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": chunk}}]
                    },
                })

        else:
            for i in range(0, max(1, len(stripped)), MAX_RICH_TEXT):
                chunk = stripped[i: i + MAX_RICH_TEXT]
                blocks.append({
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": chunk}}]
                    },
                })

    return blocks


# ── Step 1: Frame extraction ───────────────────────────────────────────────────

async def _extract_frames(video_path: str, job_id: str) -> Path:
    """
    Run ffmpeg to extract one frame every 10 seconds at 400 px width.

    Returns the directory containing the extracted .jpg files.
    Raises RuntimeError on ffmpeg failure.
    """
    frames_dir = Path(f"/tmp/video_frames_{job_id}")
    frames_dir.mkdir(parents=True, exist_ok=True)

    cmd = [
        "ffmpeg",
        "-y",
        "-i", video_path,
        "-vf", "fps=1/10,scale=400:-1",
        "-q:v", "2",
        str(frames_dir / "frame_%03d.jpg"),
    ]

    logger.info("[job %s] Extracting frames from %s → %s", job_id, video_path, frames_dir)

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    _, stderr_bytes = await proc.communicate()

    if proc.returncode != 0:
        stderr_text = stderr_bytes.decode("utf-8", errors="replace").strip()
        logger.error("[job %s] ffmpeg failed (exit %d): %s", job_id, proc.returncode, stderr_text[:400])
        raise RuntimeError(f"Frame extraction failed: {stderr_text[:200]}")

    frame_files = sorted(frames_dir.glob("frame_*.jpg"))
    if not frame_files:
        raise RuntimeError("ffmpeg succeeded but no frames were written to disk")

    logger.info("[job %s] Extracted %d frames", job_id, len(frame_files))
    return frames_dir


# ── Step 2: Claude Vision analysis ────────────────────────────────────────────

_TRAVEL_SYSTEM_PROMPT = """\
Bạn là chuyên gia du lịch người Việt, am hiểu sâu về các điểm đến châu Á và quốc tế.
Nhiệm vụ của bạn là phân tích các frame ảnh từ video du lịch và tạo ra hướng dẫn du lịch chi tiết bằng tiếng Việt.

Hãy xác định:
- Địa điểm (tên, địa chỉ chính xác tìm được trên Google Maps, điểm tham quan)
- Ẩm thực (nhà hàng, quán cà phê, món ăn, giá cả bằng tiền địa phương + VNĐ)
- Hoạt động có thể thực hiện tại mỗi địa điểm
- Thời điểm lý tưởng (ngày/đêm, mùa tốt nhất để đi)
- Cách di chuyển chi tiết (tên ga MRT/BTS/Metro, số bus, app gọi xe)

QUAN TRỌNG:
- Mỗi section ### phải chỉ rõ FRAME NÀO đại diện tốt nhất cho section đó bằng cách ghi: [BEST_FRAME: frame_XXX.jpg]
- Chỉ chọn 1 frame duy nhất cho mỗi section, chọn frame thể hiện rõ nhất địa điểm/món ăn đó
- Giá cả LUÔN quy đổi sang VNĐ bên cạnh giá local
- Địa chỉ phải đầy đủ, có thể tìm trên Google Maps

Trả lời ĐÚNG theo định dạng sau (không thêm bất kỳ văn bản nào trước hoặc sau):

# [Quốc gia/Vùng] — [Mô tả ngắn gọn nhưng hấp dẫn]

## Tổng Quan
Tóm tắt ngắn gọn về hành trình, tổng chi phí ước tính, thời gian phù hợp.

## Lịch Trình Chi Tiết

### 📍 1. [Tên Địa Điểm]
[BEST_FRAME: frame_XXX.jpg]
- Địa chỉ: địa chỉ đầy đủ (Google Maps friendly)
- Giờ mở cửa: giờ hoạt động
- Giá vé: giá local + (~XXX.XXX VNĐ)
- Cách di chuyển: hướng dẫn phương tiện cụ thể (tên ga, số bus)
- Thời điểm lý tưởng: thời gian đẹp nhất để đến
- Điểm nhấn: những điều đặc biệt, đáng trải nghiệm
- Mẹo: lời khuyên insider, tips tiết kiệm

### 🍽️ [Tên Nhà Hàng / Quán Ăn]
[BEST_FRAME: frame_XXX.jpg]
- Địa chỉ: địa chỉ đầy đủ
- Món nên thử: món đặc trưng (mô tả ngắn)
- Giá trung bình: khoảng giá cho 1 người (local + VNĐ)
- Mẹo: tips order, giờ nào nên đến

## Gợi Ý Caption & Hashtags
- 3 caption tiếng Việt hấp dẫn cho mạng xã hội
- Hashtags tiếng Anh + tiếng Việt phù hợp

## Lưu Ý Chung
- Di chuyển: transit card nào nên mua, app nào dùng (Grab, Bolt...)
- Thời tiết & trang phục phù hợp
- Budget ước tính mỗi ngày (local + VNĐ)
- Tips đặt vé/khách sạn (Klook, Traveloka, Booking...)
- Lịch trình gợi ý (Ngày 1 → ..., Ngày 2 → ...)
"""


async def _analyse_frames_with_claude(frames_dir: Path, job_id: str) -> str:
    """
    Use Claude Code CLI (`claude -p`) to analyse extracted frames.

    This uses the user's Claude subscription instead of Anthropic API credits.
    The CLI can read image files directly via the Read tool.
    """
    frame_files = sorted(frames_dir.glob("frame_*.jpg"))

    if not frame_files:
        raise RuntimeError("No frames available for Claude analysis")

    logger.info("[job %s] Sending %d frames to Claude Code CLI", job_id, len(frame_files))

    # Build the prompt with file paths for Claude to read
    frame_paths_str = "\n".join(str(f) for f in frame_files)

    prompt = f"""{_TRAVEL_SYSTEM_PROMPT}

Đây là các frame ảnh từ một video du lịch. Hãy đọc TẤT CẢ các ảnh bên dưới, phân tích kỹ nội dung từng frame, rồi tạo hướng dẫn du lịch chi tiết theo đúng format.

Các file ảnh cần đọc:
{frame_paths_str}

HƯỚNG DẪN:
1. Đọc từng ảnh một và ghi nhận nội dung (địa điểm, biển hiệu, món ăn, cảnh quan)
2. Xác định quốc gia/vùng và các địa điểm chính
3. Với mỗi section ###, chọn 1 frame đại diện tốt nhất và ghi [BEST_FRAME: frame_XXX.jpg]
4. Chỉ trả về markdown content, không thêm giải thích hay comment nào khác
5. Nội dung phải chi tiết, thực tế, có giá cả cụ thể"""

    cmd = [
        "claude",
        "-p",                    # Print mode (non-interactive)
        "--allowedTools", "Read",  # Allow reading image files
        "--max-turns", "3",      # Limit turns
        prompt,
    ]

    logger.info("[job %s] Running claude CLI...", job_id)

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        cwd=str(frames_dir),
    )

    stdout_bytes, stderr_bytes = await proc.communicate()

    if proc.returncode != 0:
        stderr_text = stderr_bytes.decode("utf-8", errors="replace").strip()
        logger.error("[job %s] claude CLI failed (exit %d): %s", job_id, proc.returncode, stderr_text[:500])
        raise RuntimeError(f"Claude Code CLI failed: {stderr_text[:300]}")

    raw = stdout_bytes.decode("utf-8", errors="replace").strip()

    if not raw:
        raise RuntimeError("Claude Code CLI returned empty response")

    logger.info("[job %s] Claude Code CLI response: %d chars", job_id, len(raw))
    return raw


# ── Step 3: Determine next #N tag ─────────────────────────────────────────────

async def _get_next_n_tag(client: httpx.AsyncClient, headers: dict) -> int:
    """
    Query the children of the Travel parent page and find the highest existing #N
    tag number, then return N+1.

    Returns 1 if no tagged pages exist yet.
    """
    response = await client.get(
        f"{NOTION_BASE_URL}/blocks/{TRAVEL_PARENT_PAGE_ID}/children",
        headers=headers,
        params={"page_size": 100},
    )

    if response.status_code != 200:
        logger.warning(
            "Could not fetch Travel page children (status %d), defaulting N=1",
            response.status_code,
        )
        return 1

    data = response.json()
    results = data.get("results", [])

    max_n = 0
    pattern = re.compile(r"#(\d+)")

    for block in results:
        # Child pages expose their title under child_page.title
        block_type = block.get("type", "")
        if block_type == "child_page":
            title = block.get("child_page", {}).get("title", "")
            match = pattern.search(title)
            if match:
                n = int(match.group(1))
                if n > max_n:
                    max_n = n

    logger.info("Highest existing #N tag: %d → next will be #%d", max_n, max_n + 1)
    return max_n + 1


# ── Step 4: Create Notion page ─────────────────────────────────────────────────

async def _create_notion_page(
    client: httpx.AsyncClient,
    headers: dict,
    title: str,
    markdown: str,
) -> tuple[str, str]:
    """
    Create a Notion page as a child of the Travel parent page (page_id parent,
    not database_id). Appends remaining blocks in batches of 100.

    Returns (page_id, page_url).
    """
    all_blocks = _markdown_to_blocks(markdown)

    payload = {
        "parent": {"page_id": TRAVEL_PARENT_PAGE_ID},
        "properties": {
            "title": {
                "title": [{"type": "text", "text": {"content": title[:MAX_RICH_TEXT]}}]
            }
        },
        "children": all_blocks[:MAX_BLOCKS_PER_CALL],
    }

    response = await client.post(
        f"{NOTION_BASE_URL}/pages",
        headers=headers,
        json=payload,
    )

    if response.status_code not in (200, 201):
        logger.error(
            "Notion page creation failed: %d %s",
            response.status_code,
            response.text[:500],
        )
        raise RuntimeError(f"Notion API error {response.status_code}: {response.text[:300]}")

    page_data = response.json()
    page_id = page_data["id"]
    page_url = page_data.get("url", f"https://www.notion.so/{page_id.replace('-', '')}")
    logger.info("Notion page created: %s (%s)", title, page_url)

    # Append remaining blocks in batches of 100
    remaining = all_blocks[MAX_BLOCKS_PER_CALL:]
    while remaining:
        batch = remaining[:MAX_BLOCKS_PER_CALL]
        remaining = remaining[MAX_BLOCKS_PER_CALL:]

        append_resp = await client.patch(
            f"{NOTION_BASE_URL}/blocks/{page_id}/children",
            headers=headers,
            json={"children": batch},
        )

        if append_resp.status_code not in (200, 201):
            logger.error(
                "Block append failed (batch): %d %s",
                append_resp.status_code,
                append_resp.text[:300],
            )
            break  # Page exists; skip remaining batches rather than crashing

    return page_id, page_url


# ── Step 5: Upload frames to freeimage.host ────────────────────────────────────

async def _upload_frame(client: httpx.AsyncClient, frame_path: Path) -> str | None:
    """
    Upload a single JPEG frame to freeimage.host.

    Returns the direct image URL or None on failure (non-fatal).
    """
    try:
        with frame_path.open("rb") as f:
            response = await client.post(
                FREEIMAGE_UPLOAD_URL,
                data={"key": FREEIMAGE_API_KEY, "format": "json"},
                files={"source": (frame_path.name, f, "image/jpeg")},
                timeout=30.0,
            )

        if response.status_code == 200:
            data = response.json()
            if data.get("status_code") == 200:
                url = data.get("image", {}).get("url")
                logger.info("Uploaded %s → %s", frame_path.name, url)
                return url

        logger.warning("freeimage.host upload failed for %s: %s", frame_path.name, response.text[:200])
    except Exception as exc:
        logger.warning("freeimage.host upload exception for %s: %s", frame_path.name, exc)

    return None


async def _append_images_to_page(
    client: httpx.AsyncClient,
    headers: dict,
    page_id: str,
    frames_dir: Path,
    job_id: str,
    frame_assignments: dict[str, str] | None = None,
) -> None:
    """
    Upload assigned frames to freeimage.host and insert 1 image per heading_3 section.

    Uses frame_assignments (from [BEST_FRAME: ...] markers in Claude's output) to pick
    the best frame for each section. Only 1 image per section — matching the skill quality.
    """
    if not frame_assignments:
        frame_assignments = {}

    # Upload only the assigned frames (not all frames)
    assigned_filenames = set(frame_assignments.values())
    if not assigned_filenames:
        # Fallback: use all frames
        assigned_filenames = {f.name for f in sorted(frames_dir.glob("frame_*.jpg"))}

    # Upload frames and build filename -> URL map
    frame_url_map: dict[str, str] = {}
    for filename in assigned_filenames:
        frame_path = frames_dir / filename
        if frame_path.exists():
            url = await _upload_frame(client, frame_path)
            if url:
                frame_url_map[filename] = url

    if not frame_url_map:
        logger.warning("[job %s] No frames uploaded — skipping image insert", job_id)
        return

    logger.info("[job %s] Uploaded %d frames", job_id, len(frame_url_map))

    # Fetch all existing blocks to find heading_3 positions
    all_blocks: list[dict] = []
    cursor = None
    while True:
        params: dict = {"page_size": 100}
        if cursor:
            params["start_cursor"] = cursor
        resp = await client.get(
            f"{NOTION_BASE_URL}/blocks/{page_id}/children",
            headers=headers,
            params=params,
        )
        if resp.status_code != 200:
            break
        data = resp.json()
        all_blocks.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")

    # Build a map: heading_3 text -> block_id
    h3_blocks: list[tuple[str, str]] = []  # (heading_text, block_id)
    for block in all_blocks:
        if block.get("type") == "heading_3":
            rt = block["heading_3"].get("rich_text", [])
            text = rt[0]["text"]["content"] if rt else ""
            h3_blocks.append((text, block["id"]))

    if not h3_blocks:
        logger.warning("[job %s] No heading_3 blocks found", job_id)
        return

    # Match frame_assignments to heading_3 blocks and insert images
    inserted = 0
    used_urls: set[str] = set()

    for h3_text, h3_id in h3_blocks:
        # Find the matching frame assignment
        matched_frame: str | None = None
        for section_title, frame_name in frame_assignments.items():
            # Fuzzy match: check if the key words overlap
            if section_title in h3_text or h3_text in section_title:
                matched_frame = frame_name
                break

        # If no exact match, try partial keyword matching
        if not matched_frame:
            for section_title, frame_name in frame_assignments.items():
                # Compare significant words (skip emoji and numbers)
                s_words = set(re.findall(r"[\w]{3,}", section_title.lower()))
                h_words = set(re.findall(r"[\w]{3,}", h3_text.lower()))
                if s_words & h_words:  # Any common words
                    matched_frame = frame_name
                    break

        if not matched_frame or matched_frame not in frame_url_map:
            continue

        image_url = frame_url_map[matched_frame]
        if image_url in used_urls:
            continue
        used_urls.add(image_url)

        # Find the last block in this section (before next heading)
        after_block_id = h3_id
        found_h3 = False
        for block in all_blocks:
            if block["id"] == h3_id:
                found_h3 = True
                continue
            if found_h3:
                if block.get("type") in ("heading_1", "heading_2", "heading_3"):
                    break
                after_block_id = block["id"]

        # Insert 1 image after the section's last bullet
        image_block = {
            "object": "block",
            "type": "image",
            "image": {"type": "external", "external": {"url": image_url}},
        }

        resp = await client.patch(
            f"{NOTION_BASE_URL}/blocks/{page_id}/children",
            headers=headers,
            json={"after": after_block_id, "children": [image_block]},
        )

        if resp.status_code in (200, 201):
            inserted += 1
            logger.info("[job %s] Inserted image for '%s' after block %s", job_id, h3_text[:40], after_block_id)
        else:
            logger.warning("[job %s] Image insert failed for '%s': %d", job_id, h3_text[:40], resp.status_code)

    logger.info("[job %s] Inserted %d images across %d sections", job_id, inserted, len(h3_blocks))


# ── Step 6: Cleanup ────────────────────────────────────────────────────────────

def _cleanup_frames(frames_dir: Path, job_id: str) -> None:
    """Remove the temp frames directory. Non-fatal on failure."""
    try:
        shutil.rmtree(frames_dir, ignore_errors=True)
        logger.info("[job %s] Cleaned up frames directory: %s", job_id, frames_dir)
    except Exception as exc:
        logger.warning("[job %s] Could not clean up %s: %s", job_id, frames_dir, exc)


# ── Public entry point ─────────────────────────────────────────────────────────

async def run_travel_pipeline(job_id: str, video_path: str) -> None:
    """
    Execute the full travel analysis pipeline for a downloaded video.

    Updates Firestore job status at each step via firebase_service.update_job().
    On any unrecoverable error, marks the job as "failed" and re-raises.

    Steps:
        1. Extract frames (ffmpeg)
        2. Analyse with Claude Vision
        3. Determine next #N tag (Notion)
        4. Create Notion page
        5. Upload frames → append as image blocks
        6. Cleanup temp files
    """
    settings = get_settings()
    frames_dir: Path | None = None

    try:
        # ── 1. Extract frames ──────────────────────────────────────────────────
        await update_job(job_id, status="extracting_frames")
        logger.info("[job %s] Step 1: extracting frames from %s", job_id, video_path)

        frames_dir = await _extract_frames(video_path, job_id)

        # ── 2. Analyse with Claude Vision ──────────────────────────────────────
        await update_job(job_id, status="analyzing")
        logger.info("[job %s] Step 2: sending frames to Claude Vision", job_id)

        markdown_content = await _analyse_frames_with_claude(frames_dir, job_id)

        # Extract [BEST_FRAME: ...] assignments before cleaning markdown
        # Maps section heading text -> frame filename
        frame_assignments: dict[str, str] = {}
        current_section: str | None = None
        for line in markdown_content.splitlines():
            stripped = line.strip()
            if stripped.startswith("### "):
                current_section = stripped[4:].strip()
            frame_match = re.search(r"\[BEST_FRAME:\s*(frame_\d+\.jpg)\]", stripped)
            if frame_match and current_section:
                frame_assignments[current_section] = frame_match.group(1)

        logger.info("[job %s] Frame assignments: %s", job_id, frame_assignments)

        # Remove [BEST_FRAME: ...] lines from markdown before creating Notion blocks
        clean_markdown = re.sub(r"^\s*\[BEST_FRAME:.*?\]\s*$", "", markdown_content, flags=re.MULTILINE)

        # Extract the title from the first non-empty line
        title = "Travel Analysis"
        for line in clean_markdown.splitlines():
            stripped = line.strip()
            if stripped:
                # Strip leading "# " markdown heading syntax
                title = re.sub(r"^#+\s*", "", stripped).strip()[:200]
                break

        await update_job(job_id, title=title)

        # ── 3 & 4. Create Notion page with correct #N tag ──────────────────────
        await update_job(job_id, status="creating_notion")
        logger.info("[job %s] Step 3-4: determining #N tag and creating Notion page", job_id)

        notion_headers = _notion_headers(settings.NOTION_API_KEY)

        async with httpx.AsyncClient(timeout=60.0) as http_client:
            next_n = await _get_next_n_tag(http_client, notion_headers)

            # Build title with proper #N tag
            final_title = f"#{next_n} {title}"

            # Remove the first heading line from markdown (it becomes the page title)
            lines = clean_markdown.splitlines()
            first_content_idx = 0
            for i, line in enumerate(lines):
                if line.strip():
                    first_content_idx = i + 1
                    break
            final_markdown = "\n".join(lines[first_content_idx:])

            page_id, page_url = await _create_notion_page(
                http_client,
                notion_headers,
                title=final_title,
                markdown=final_markdown,
            )

            await update_job(job_id, notion_url=page_url, title=final_title)

            # ── 5. Upload images ───────────────────────────────────────────────
            await update_job(job_id, status="uploading_images")
            logger.info("[job %s] Step 5: uploading frames and appending to Notion", job_id)

            await _append_images_to_page(
                http_client,
                notion_headers,
                page_id,
                frames_dir,
                job_id,
                frame_assignments,
            )

        # ── Done ───────────────────────────────────────────────────────────────
        await update_job(job_id, status="completed")
        logger.info("[job %s] Pipeline completed. Notion page: %s", job_id, page_url)

    except Exception as exc:
        logger.exception("[job %s] Pipeline failed: %s", job_id, exc)
        await update_job(job_id, status="failed", error=str(exc))
        raise

    finally:
        # ── 6. Cleanup ─────────────────────────────────────────────────────────
        if frames_dir and frames_dir.exists():
            _cleanup_frames(frames_dir, job_id)
