import logging

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

NOTION_API_VERSION = "2022-06-28"
NOTION_BASE_URL = "https://api.notion.com/v1"


def _make_headers(api_key: str) -> dict:
    return {
        "Authorization": f"Bearer {api_key}",
        "Notion-Version": NOTION_API_VERSION,
        "Content-Type": "application/json",
    }


def _markdown_to_blocks(markdown: str) -> list[dict]:
    """
    Convert a markdown string into a list of Notion block objects.

    Supports: headings (# ##), bullet lists (- *), plain paragraphs.
    Notion API blocks are limited to 2000 chars of rich text per block;
    long paragraphs are split at that boundary.
    """
    MAX_RICH_TEXT = 2000
    blocks: list[dict] = []

    for line in markdown.splitlines():
        stripped = line.strip()

        if not stripped:
            # Empty lines become empty paragraph separators
            blocks.append({"object": "block", "type": "paragraph", "paragraph": {"rich_text": []}})
            continue

        if stripped.startswith("# "):
            heading_text = stripped[2:].strip()
            blocks.append({
                "object": "block",
                "type": "heading_1",
                "heading_1": {
                    "rich_text": [{"type": "text", "text": {"content": heading_text[:MAX_RICH_TEXT]}}]
                },
            })

        elif stripped.startswith("## "):
            heading_text = stripped[3:].strip()
            blocks.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [{"type": "text", "text": {"content": heading_text[:MAX_RICH_TEXT]}}]
                },
            })

        elif stripped.startswith(("- ", "* ", "• ")):
            bullet_text = stripped[2:].strip()
            # Split long bullets
            for chunk_start in range(0, max(1, len(bullet_text)), MAX_RICH_TEXT):
                chunk = bullet_text[chunk_start: chunk_start + MAX_RICH_TEXT]
                blocks.append({
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {
                        "rich_text": [{"type": "text", "text": {"content": chunk}}]
                    },
                })

        else:
            # Plain paragraph — split at 2000-char boundary
            for chunk_start in range(0, max(1, len(stripped)), MAX_RICH_TEXT):
                chunk = stripped[chunk_start: chunk_start + MAX_RICH_TEXT]
                blocks.append({
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": chunk}}]
                    },
                })

    return blocks


async def create_analysis_page(analysis: dict) -> str:
    """
    Create a Notion page in the configured database.

    Args:
        analysis: Parsed dict from claude_service with keys:
                  title, summary, key_insights, content_ideas,
                  captions, hashtags, markdown_content

    Returns:
        The public URL of the created Notion page.
    """
    settings = get_settings()
    headers = _make_headers(settings.NOTION_API_KEY)
    title = analysis.get("title") or "Video Analysis"
    markdown = analysis.get("markdown_content") or ""

    # Notion has a hard limit of 100 children per append call
    all_blocks = _markdown_to_blocks(markdown)

    payload = {
        "parent": {"database_id": settings.NOTION_DATABASE_ID},
        "properties": {
            "Name": {
                "title": [{"type": "text", "text": {"content": title[:2000]}}]
            }
        },
        # Pass the first batch (≤100) as page children on creation
        "children": all_blocks[:100],
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Create the page
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
            raise RuntimeError(
                f"Notion API error {response.status_code}: {response.text[:200]}"
            )

        page_data = response.json()
        page_id = page_data["id"]
        page_url = page_data.get("url", f"https://www.notion.so/{page_id.replace('-', '')}")

        logger.info("Notion page created: %s", page_url)

        # 2. Append remaining blocks in batches of 100 if content was truncated
        remaining = all_blocks[100:]
        while remaining:
            batch = remaining[:100]
            remaining = remaining[100:]

            append_response = await client.patch(
                f"{NOTION_BASE_URL}/blocks/{page_id}/children",
                headers=headers,
                json={"children": batch},
            )

            if append_response.status_code not in (200, 201):
                # Log but don't fail — the page exists, just missing some content
                logger.error(
                    "Notion block append failed: %d %s",
                    append_response.status_code,
                    append_response.text[:300],
                )
                break

    return page_url
