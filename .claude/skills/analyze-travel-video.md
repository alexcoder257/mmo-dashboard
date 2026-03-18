---
name: analyze-travel-video
description: Analyze a travel video and create a Vietnamese tour guide in Notion under the Travel group, with auto-incrementing #N tag.
metadata:
  {
    "openclaw":
      {
        "emoji": "✈️",
        "requires": { "env": ["NOTION_API_KEY"] },
        "primaryEnv": "NOTION_API_KEY",
      },
  }
---

# analyze-travel-video

Phân tích video du lịch và tạo hướng dẫn du lịch chi tiết bằng tiếng Việt trên Notion.

## When to trigger

When the user says things like:

- "analyze this travel video"
- "analyze travel video `<path>`"
- "phân tích video du lịch"
- "analyze this video" (if it's clearly a travel video)

## Notion Structure

All travel analysis pages are stored under:

```
MMO Dashboard (32629321-fe1b-8052-bd73-ce7a13b63e49)
  └── ✈️ Travel (32729321-fe1b-819f-ae08-d658478bf790)
      ├── #1 Singapore — Sentosa, ArtScience Museum & Văn Hoá Peranakan
      ├── #2 Thailand — Bangkok Street Food & Temples
      ├── #3 ...
      └── ...
```

**Each analysis creates a NEW page** — never merge or overwrite existing ones.

## Flow

### Step 1 — Determine next #N tag

Read `NOTION_API_KEY` from `/Users/macbook/Working/mmo-dashboard/backend/.env`.

Query the Travel page children to find the highest existing #N:

```bash
NOTION_KEY="<from .env>"
curl -s "https://api.notion.com/v1/blocks/32729321-fe1b-819f-ae08-d658478bf790/children" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2022-06-28"
```

Parse child pages, find the highest `#N` number in titles, and use `#(N+1)` for the new page. If no pages exist, start with `#1`.

### Step 2 — Extract frames

Extract key frames every 10-15 seconds:

```bash
mkdir -p /tmp/video_frames
ffmpeg -y -i "<input_video>" -vf "fps=1/10,scale=400:-1" -q:v 2 /tmp/video_frames/frame_%03d.jpg
```

### Step 3 — Analyze frames with Claude

Read all extracted frame images using the Read tool. Identify:

- **Địa điểm (Places):** Name, exact address, what to see/do
- **Ẩm thực (Food):** Restaurants, cafes, dishes, prices
- **Hoạt động (Activities):** What the creator did at each location
- **Thời điểm (Timing):** Day/night, best time to visit

### Step 4 — Create Notion tour guide page

Create a new page under the **Travel** page (ID: `32729321-fe1b-819f-ae08-d658478bf790`).

Title format: `#N [Country] — [Brief Description]`

**ALL content MUST be in Vietnamese.**

Structure:

```
#N [Country] — [Brief Description]

## Tổng Quan
Brief overview of the trip.

## Lịch Trình Chi Tiết

### 📍 1. [Tên Địa Điểm]
- Địa chỉ: Full address (Google Maps friendly)
- Giờ mở cửa: Opening hours
- Giá vé: Ticket price in local currency + VNĐ
- Cách di chuyển: How to get there (transit station, bus, walk)
- Thời điểm lý tưởng: Best time to visit
- Điểm nhấn: What to see/do
- Mẹo: Insider tips

### 🍽️ [Tên Quán/Nhà Hàng] (for food spots)
- Địa chỉ: Full address
- Món nên thử: Must-try items
- Giá trung bình: Price range in local currency + VNĐ
- Mẹo: Tips

## Gợi Ý Caption & Hashtags
- 3 captions in Vietnamese
- Relevant hashtags

## Lưu Ý Chung
- Transport tips (transit card, app to use)
- Weather & clothing
- Budget estimate per day in local currency + VNĐ
- Booking tips (Klook, Traveloka, etc.)
- Suggested itinerary (Day 1 → ..., Day 2 → ...)
```

### Step 5 — Add images to each section

After creating the page, add relevant images from the extracted frames to each section.

1. **Select best frames** — pick 1 frame per section (place/food) that best represents it
2. **Upload to freeimage.host** — use the free API (no auth needed):
   ```bash
   curl -s -X POST "https://freeimage.host/api/1/upload" \
     -F "key=6d207e02198a847aa98d0a2a901485a5" \
     -F "source=@/tmp/video_frames/frame_XXX.jpg" \
     -F "format=json"
   ```
   Parse response: `response.image.url` gives the hosted URL.
3. **Extract at 400px width** — use `scale=400:-1` in ffmpeg to keep images compact in Notion
4. **Insert image blocks** — use Notion API to append image blocks after each section's last bullet:
   ```bash
   curl -s -X PATCH "https://api.notion.com/v1/blocks/<PAGE_ID>/children" \
     -H "Authorization: Bearer $NOTION_KEY" \
     -H "Content-Type: application/json" \
     -H "Notion-Version: 2022-06-28" \
     -d '{"after":"<LAST_BULLET_BLOCK_ID>","children":[{"object":"block","type":"image","image":{"type":"external","external":{"url":"<HOSTED_IMAGE_URL>"}}}]}'
   ```

### Step 6 — Report results

Show:
- Notion page URL
- The #N tag assigned
- Summary of places and food spots found

### Step 7 — Cleanup

```bash
rm -rf /tmp/video_frames /tmp/analysis_audio.mp3
```

## Merging Pages

When the user asks to merge (e.g., "merge #1 and #2"):

1. Read both pages' content from the Travel group in Notion
2. Create a new merged page with combined itinerary
3. Re-number locations sequentially
4. Keep both original pages intact (don't delete)
5. Title: `#1+#2 [Combined Description]`

## Key Rules

- **Always Vietnamese** — target audience is Vietnamese travelers
- **Always new page** — never overwrite existing analyses
- **Auto-increment #N** — check existing pages first
- **Real addresses** — searchable on Google Maps
- **Transit info** — MRT stations (Singapore), BTS (Bangkok), Metro (Japan), etc.
- **Prices in VNĐ** — always convert to VNĐ alongside local currency

## Config

- Travel parent page ID: `32729321-fe1b-819f-ae08-d658478bf790`
- MMO Dashboard page ID: `32629321-fe1b-8052-bd73-ce7a13b63e49`
- NOTION_API_KEY: `/Users/macbook/Working/mmo-dashboard/backend/.env`
- ffmpeg required: `brew install ffmpeg`
- Max 2000 chars per rich_text block, max 100 blocks per API call
