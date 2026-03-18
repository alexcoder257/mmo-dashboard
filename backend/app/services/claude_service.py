import base64
import logging
import re
from pathlib import Path

import anthropic

from app.core.config import get_settings

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """You are an AI assistant that analyzes video content.
Your task is to analyze the uploaded video and create a structured report.
Steps:
1. Analyze the video content carefully.
2. Extract and generate: Title, Summary, Key Insights, Content Ideas, Captions, Hashtags
3. Format your response into Markdown with exactly these sections:

# Title
<single-line title here>

## Summary
<paragraph summary>

## Key Insights
- <insight 1>
- <insight 2>
- <insight 3>

## Content Ideas
- <idea 1>
- <idea 2>
- <idea 3>

## Captions
- <caption 1>
- <caption 2>
- <caption 3>

## Hashtags
#hashtag1 #hashtag2 #hashtag3"""


def _extract_section(markdown: str, heading: str) -> str:
    """Extract the text under a given ## heading, stopping at the next heading."""
    pattern = rf"#{{1,2}}\s+{re.escape(heading)}\s*\n(.*?)(?=\n#|\Z)"
    match = re.search(pattern, markdown, re.DOTALL | re.IGNORECASE)
    return match.group(1).strip() if match else ""


def _parse_bullet_list(text: str) -> list[str]:
    """Convert a markdown bullet list block into a Python list of strings."""
    items = []
    for line in text.splitlines():
        line = line.strip().lstrip("-*•").strip()
        if line:
            items.append(line)
    return items


def _parse_hashtags(text: str) -> list[str]:
    """Extract individual hashtags from a string like '#foo #bar baz'."""
    # Support both '#tag' and 'tag' entries on the same line
    tags = re.findall(r"#?\w+", text)
    return [t.lstrip("#") for t in tags if t.lstrip("#")]


def _parse_response(content: str) -> dict:
    """Parse the structured markdown response from Claude into a typed dict."""
    # Title may be under a # heading or ## heading
    title_match = re.search(r"^#\s+(.+)", content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else "Untitled"

    summary = _extract_section(content, "Summary")
    key_insights = _parse_bullet_list(_extract_section(content, "Key Insights"))
    content_ideas = _parse_bullet_list(_extract_section(content, "Content Ideas"))
    captions = _parse_bullet_list(_extract_section(content, "Captions"))
    hashtags_raw = _extract_section(content, "Hashtags")
    hashtags = _parse_hashtags(hashtags_raw)

    return {
        "title": title,
        "summary": summary,
        "key_insights": key_insights,
        "content_ideas": content_ideas,
        "captions": captions,
        "hashtags": hashtags,
        "markdown_content": content,
    }


async def analyze_video(file_path: str) -> dict:
    """
    Send a video/audio file to Claude for analysis.

    The file is base64-encoded and sent as a document block.
    Returns a structured dict parsed from Claude's markdown response.
    """
    settings = get_settings()
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    file_bytes = path.read_bytes()
    encoded = base64.standard_b64encode(file_bytes).decode("utf-8")

    # Determine media type — Claude supports mp4 and common audio formats
    suffix = path.suffix.lower()
    media_type_map = {
        ".mp4": "video/mp4",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".m4a": "audio/mp4",
        ".aac": "audio/aac",
        ".ogg": "audio/ogg",
    }
    media_type = media_type_map.get(suffix, "video/mp4")

    logger.info("Sending %s (%d bytes, type=%s) to Claude", path.name, len(file_bytes), media_type)

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    message = client.messages.create(
        model=settings.CLAUDE_MODEL,
        max_tokens=4096,
        system=_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": encoded,
                        },
                    },
                    {
                        "type": "text",
                        "text": (
                            "Please analyze this video and produce the structured Markdown report "
                            "as described in your instructions. Be specific and actionable."
                        ),
                    },
                ],
            }
        ],
    )

    raw_content = message.content[0].text
    logger.info("Claude response received (%d chars)", len(raw_content))

    return _parse_response(raw_content)
