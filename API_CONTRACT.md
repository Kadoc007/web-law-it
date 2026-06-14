# Backend API Contract

Current scope: the backend is the single gateway for Firestore reads and writes.
Frontend public/admin pages should use `window.apiClient` instead of direct Firestore reads or writes.

## Base URL

Frontend code reads the backend origin from `window.API_CONFIG.baseUrl`.
The tracked local default lives in `frontend/js/api-config.js`.

Example local value:

```js
window.API_CONFIG = {
  baseUrl: "http://localhost:3000"
};
```

## Authentication

Public read endpoints do not require authentication.

Admin write endpoints require a Firebase ID token:

```http
Authorization: Bearer <firebase-id-token>
```

The backend validates this token with `adminAuth`.

## Laws

### GET `/api/laws/config/categories`

Returns the active law category config used by admin and public viewers.

Response:

```json
[
  {
    "id": "computer",
    "label": "กฎหมายคอมพิวเตอร์",
    "viewerLabel": "กฎหมายคอมพิวเตอร์",
    "fields": ["section", "title", "description", "penalty"],
    "requiredFields": ["section", "title", "description"],
    "hiddenFields": []
  }
]
```

### GET `/api/laws/:category`

Returns all law items for one category, ordered by `section`.

Active categories are config-backed:

- `computer`
- `privacy`
- `copyright`
- `eft`
- `etl`
- `eta`

Response:

```json
[
  {
    "id": "doc-id",
    "section": "มาตรา ...",
    "title": "หัวข้อ",
    "description": "รายละเอียด",
    "penalty": "โทษ"
  }
]
```

### GET `/api/laws/:category/:id`

Returns one law item.

### POST `/api/laws/:category`

Admin only. Creates a law item.

Body:

```json
{
  "section": "มาตรา ...",
  "title": "หัวข้อ",
  "description": "รายละเอียด",
  "penalty": "โทษ"
}
```

`section`, `title`, and `description` are required. `penalty` is optional for every active category.

### PUT `/api/laws/:category/:id`

Admin only. Replaces editable fields for a law item.

### DELETE `/api/laws/:category/:id`

Admin only. Deletes one law item.

## Cards

### GET `/api/cards`

Returns all cards ordered by `createdAt desc`.

Optional query:

```http
?category=help
```

Response:

```json
[
  {
    "id": "doc-id",
    "title": "หัวข้อ",
    "subtitle": "หัวข้อย่อย",
    "description": "รายละเอียด",
    "imageUrl": "https://example.com/image.jpg",
    "slug": "consult",
    "pageContent": "<p>HTML content</p>",
    "category": "help"
  }
]
```

### GET `/api/cards/slug/:slug`

Returns one card by slug. This supports the existing `card-detail.html?slug=...` flow.

The admin UI no longer exposes slug editing. This endpoint remains for legacy cards, static links, and API-created records that already have a slug.

### GET `/api/cards/:id`

Returns one card by Firestore document id.

### POST `/api/cards`

Admin only. Creates a card.

Required body:

```json
{
  "title": "หัวข้อ"
}
```

Optional body:

```json
{
  "subtitle": "หัวข้อย่อย",
  "description": "รายละเอียด",
  "imageUrl": "https://example.com/image.jpg",
  "slug": "consult",
  "pageContent": "<p>HTML content</p>",
  "category": "help"
}
```

### PUT `/api/cards/:id`

Admin only. Updates card fields.

### DELETE `/api/cards/:id`

Admin only. Deletes one card.

## Phase 2/3 Migration Notes

- Public pages should use `window.apiClient.laws.*` and `window.apiClient.cards.*`.
- Admin pages should keep Firebase Auth for login, then call `apiClient` with the ID token.
- Direct Firestore reads/writes in frontend should be removed after each page is migrated.
- `pageContent` remains an HTML field for compatibility and is sanitized on the backend.

## Phase 4 Validation Notes

The backend now validates and normalizes request data before writing to Firestore.

- Law categories are allowlisted to `computer`, `privacy`, `copyright`, `eft`, `etl`, and `eta`.
- Card categories are allowlisted to empty, `help`, `article`, and `resource`.
- Firestore document ids accepted by the API must use letters, numbers, `_`, or `-`.
- Card `imageUrl` must be `http` or `https`.
- Card `slug` is normalized to lowercase and allows letters, numbers, `_`, and `-`.
- Frontend admin no longer sends `slug`; new admin-created cards rely on Firestore document `id` links.
- Card `pageContent` is sanitized with a conservative HTML allowlist before storage.
- Card and law read responses are sanitized before returning JSON, including existing Firestore data.
- Unknown server errors return a generic message; details stay in server logs.
