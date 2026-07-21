# TechAssess App

Expo React Native app for the TechAssess frontend.

## Run

1. Install dependencies:

```bash
npm install
```

2. Set environment variables in `.env`:

```env
EXPO_PUBLIC_BASE_URL="https://experttech-backend.onrender.com"
EXPO_PUBLIC_FEED_USER_ID="3"
```

3. Start the app:

```bash
npm start
```

Optional:

```bash
npm run android
npm run ios
npm run web
```

## Endpoints

Base URL: `EXPO_PUBLIC_BASE_URL`

- `GET /posts?limit=10&offset=0` - fetch paginated feed posts
- `GET /posts/:postId/comments?limit=20&offset=0` - fetch comments for a post
- `POST /posts/:postId/comments` - create a comment
- `POST /posts/:postId/like` - like a post

Note: live API feed support exists, but the UI currently keeps `ENABLE_REMOTE_FEED = false`, so the local mock feed is used unless that flag is turned on.

## Schema

### Create comment request

```json
{
  "content": "Nice listing",
  "user_id": 3
}
```

### Like post request

```json
{
  "user_id": 3
}
```

### Post response item

```json
{
  "id": 12,
  "content": "Newly serviced 3-bedroom apartment...",
  "created_at": "2026-07-21T10:00:00Z",
  "image_url": "https://example.com/image.jpg",
  "likes_count": 23,
  "comments_count": 4,
  "author": {
    "id": 7,
    "username": "boyd",
    "display_name": "Boyd From"
  }
}
```

### Comment response item

```json
{
  "id": 33,
  "post_id": 12,
  "content": "Interested",
  "created_at": "2026-07-21T10:05:00Z",
  "author": {
    "id": 3,
    "username": "you",
    "display_name": "You"
  }
}
```

### Paginated list shape

```json
{
  "items": [],
  "limit": 10,
  "offset": 0,
  "next_offset": 10,
  "total": 100
}
```
