# PRD: IT LAW CENTER

## 1. Product Summary

**Product name:** IT LAW CENTER  
**Product type:** Thai IT law information portal  
**Primary users:** Students, general visitors, and administrators  
**Primary goal:** Provide easy-to-understand Thai IT law summaries and related legal help resources through a frontend that reads and writes Firestore only through the backend API.

IT LAW CENTER is a static frontend with a Node/Express backend and Firebase Firestore. Public visitors can browse law categories, read legal help cards, open article/help details, and contact a LINE chatbot. Admin users can log in with Firebase Authentication and manage laws/cards through protected backend endpoints.

## 2. TestSprite Objective

This PRD is intended for TestSprite automated test generation. The generated tests should verify:

- Public frontend navigation and rendering.
- Backend-required behavior for dynamic `cards` and `laws`.
- Safe rendering of user-provided content.
- Admin authentication and protected CRUD behavior.
- API response handling, error states, and security expectations.

## 3. System Architecture

### Frontend

- Static HTML/CSS/JavaScript.
- Main folder: `frontend/`
- API base URL configured in `frontend/js/api-config.js`.
- Default backend base URL: `http://localhost:3000`
- Main public pages:
  - `/home.html`
  - `/index.html?category=computer`
  - `/index.html?category=privacy`
  - `/index.html?category=copyright`
  - `/card-detail.html?id={cardId}`
  - `/card-detail.html?slug={slug}`
  - `/consult.html`
  - `/admin.html`

### Backend

- Node.js + Express.
- Main folder: `backend/`
- Default local API URL: `http://localhost:3000`
- Firebase Admin SDK reads/writes Firestore.
- Public read endpoints do not require authentication.
- Admin write endpoints require a Firebase ID token in `Authorization: Bearer <token>`.

### Database

- Firebase Firestore.
- Client-side Firestore read/write should be disabled by `firestore.rules`.
- Frontend should not directly read or write Firestore documents.

## 4. User Roles

### Visitor

Unauthenticated user who can:

- Open home page.
- Navigate to law category pages.
- View dynamic cards from backend.
- Open card detail pages by `id` or `slug`.
- Read consultation resources.
- Click LINE contact CTA/buttons.

### Admin

Authenticated Firebase user with admin permission through Firebase custom claim `admin: true` or backend `ADMIN_EMAILS`.

Admin can:

- Log in from `/admin.html`.
- View existing laws and cards.
- Create, edit, and delete laws.
- Create, edit, and delete cards.
- Add card metadata such as title, subtitle, description, image URL, category, and page content.

## 5. Key Routes and Pages

| Page | Purpose | Dynamic Data Source | Expected Without Backend |
|---|---|---|---|
| `/home.html` | Landing page and card listing | `GET /api/cards` | Dynamic cards must not render; show backend-required message |
| `/` | Root route in deploy | Vercel rewrite to `/home.html` | Should display home page |
| `/index.html?category=computer` | Computer law list | `GET /api/laws/computer` | Law cards must not render; show backend-required message |
| `/index.html?category=privacy` | PDPA law list | `GET /api/laws/privacy` | Law cards must not render; show backend-required message |
| `/index.html?category=copyright` | Copyright law list | `GET /api/laws/copyright` | Law cards must not render; show backend-required message |
| `/index.html` | No category | None | Redirect to `/home.html` |
| `/card-detail.html?slug={slug}` | Card detail by slug | `GET /api/cards/slug/{slug}` | Show not-found/error state |
| `/card-detail.html?id={id}` | Card detail by ID | `GET /api/cards/{id}` | Show not-found/error state |
| `/consult.html` | Static consultation information | Static page | Should render without backend |
| `/admin.html` | Admin CRUD panel | Firebase Auth + backend API | Login visible; data operations fail without backend |

## 6. Core Features and Acceptance Criteria

### F1. Home Page

**Description:** The home page introduces IT LAW CENTER, displays law category navigation, a LINE consultation CTA card, and dynamic cards loaded from backend.

**Acceptance criteria:**

- The page loads at `/home.html`.
- Root `/` should show `/home.html` in deployed environment.
- Hero section is visible.
- Static law category cards are visible and link to category pages.
- LINE consultation CTA is visible and links to `https://line.me/R/ti/p/@640smsos`.
- Dynamic cards are fetched from `GET /api/cards`.
- If backend is not running, dynamic cards do not render and a clear backend-required message is shown.
- If backend returns an empty array, dynamic cards do not render and an empty-state message is shown.
- If backend returns cards, each card displays title, subtitle/description, image, and opens its detail page.
- Card content must use safe DOM rendering. HTML/script from backend must not execute.

### F2. Law Category Pages

**Description:** Law category pages list law summaries by category.

**Acceptance criteria:**

- `/index.html?category=computer` displays title for computer law.
- `/index.html?category=privacy` displays title for PDPA.
- `/index.html?category=copyright` displays title for copyright law.
- `/index.html` without `category` redirects to `/home.html`.
- Law category page titles and visible fields are driven by `GET /api/laws/config/categories`.
- Laws are fetched from `GET /api/laws/{category}`.
- If backend is not running, no law cards render and a backend-required message is shown.
- If backend returns an empty array, an empty-state message is shown.
- If backend returns laws, each law card displays configured fields: section, title, description, and optional penalty.
- Law fields must be rendered as text, not executable HTML.

### F3. Card Detail Page

**Description:** Card detail page displays one card by slug or ID.

**Acceptance criteria:**

- `/card-detail.html?slug={slug}` loads card through `GET /api/cards/slug/{slug}`.
- `/card-detail.html?id={id}` loads card through `GET /api/cards/{id}`.
- If neither `slug` nor `id` is provided, an error state is shown.
- If backend returns 404/error, an error state is shown.
- Card title, subtitle, description, category badge, and hero image render correctly.
- `pageContent` may contain safe rich HTML and should render allowed tags such as `h1`, `h2`, `h3`, `p`, `ul`, `ol`, `li`, `b`, `strong`, `i`, `em`, `a`, `br`, `table`.
- Unsafe content must not execute:
  - `script` tags are removed.
  - Event handler attributes such as `onclick` and `onerror` are removed.
  - `javascript:` URLs are rejected.
  - Unsafe image URLs are rejected.
- Links in rich content only allow `http`, `https`, `mailto`, and `tel`.

### F4. Consultation Page

**Description:** Consultation page provides legal help resources.

**Acceptance criteria:**

- `/consult.html` renders static content without backend.
- Navbar is visible.
- Contact/help content is readable.
- Links open valid external resources where present.
- Page is responsive on desktop and mobile.

### F5. Admin Login

**Description:** Admin page uses Firebase Authentication for login, then backend API for CRUD.

**Acceptance criteria:**

- `/admin.html` shows login form by default.
- Login requires email and password.
- Invalid login shows an error alert or visible failure state.
- Valid login hides the login box and shows admin panel.
- After login, admin token is attached to write requests as `Authorization: Bearer <Firebase ID token>`.
- Logout clears token, edit states, and admin lists.

### F6. Admin Law Management

**Description:** Admin can manage law records through protected backend endpoints.

**Acceptance criteria:**

- Admin can select law category.
- Admin law fields are driven by backend category config with a local fallback.
- Laws list loads from `GET /api/laws/{category}`.
- Admin can create law with required section, title, and description.
- Admin can create optional penalty for any active law category.
- Penalty is not required for any active law category.
- Admin can edit existing law.
- Admin can delete existing law after confirmation.
- Create/update/delete calls must fail without token.
- Law list rendering must not execute HTML/script from backend.

### F7. Admin Card Management

**Description:** Admin can manage cards through protected backend endpoints.

**Acceptance criteria:**

- Admin can view card list from `GET /api/cards`.
- Admin can create card with required title.
- Admin can provide subtitle, description, image URL, category, and page content.
- Admin card form does not expose slug; newly created cards open by Firestore document ID.
- Admin can edit existing card.
- Admin can delete existing card after confirmation.
- Image preview only uses safe URLs.
- Card list rendering must not execute HTML/script from backend.
- Page content may be stored as rich text/HTML-like content, but public rendering must sanitize it.

### F8. Backend API

**Description:** Backend is the only gateway to Firestore.

**Acceptance criteria:**

- `GET /api/cards` returns array of cards.
- `GET /api/cards/:id` returns one card or 404.
- `GET /api/cards/slug/:slug` returns one card or 404.
- `POST /api/cards` requires admin auth.
- `PUT /api/cards/:id` requires admin auth.
- `DELETE /api/cards/:id` requires admin auth.
- `GET /api/laws/config/categories` returns active law category config.
- `GET /api/laws/:category` returns array of laws.
- `GET /api/laws/:category/:id` returns one law or 404.
- `POST /api/laws/:category` requires admin auth.
- `PUT /api/laws/:category/:id` requires admin auth.
- `DELETE /api/laws/:category/:id` requires admin auth.
- Invalid category, ID, slug, or unsafe URL returns proper error response.
- Errors must not leak sensitive internal data.

### F9. Security Requirements

**Acceptance criteria:**

- Frontend does not directly read/write Firestore.
- Firestore rules deny client reads and writes.
- Backend uses Firebase Admin SDK.
- Backend requires admin auth for writes.
- Backend has CORS allowlist support.
- Backend has rate limiting.
- Backend uses security headers through Helmet.
- Sensitive files such as `.env` and service account keys are not committed.
- User-provided content does not execute scripts in frontend.

## 7. Test Data Requirements

### Example cards

```json
[
  {
    "id": "consult-card",
    "slug": "consult",
    "title": "ศูนย์รับปรึกษากฎหมาย",
    "subtitle": "แหล่งรวมหน่วยงานให้คำปรึกษาและช่วยเหลือทางกฎหมาย",
    "description": "ข้อมูลติดต่อหน่วยงานที่ให้คำปรึกษากฎหมายสำหรับประชาชน",
    "imageUrl": "https://example.com/legal-help.jpg",
    "category": "help",
    "pageContent": "<h2>สำนักงานอัยการสูงสุด</h2><p class=\"org\">สำนักงานอัยการสูงสุด</p><ul><li><b>บริการ:</b> ให้คำปรึกษาด้านกฎหมาย</li></ul><a href=\"https://example.com\">เว็บไซต์</a>"
  }
]
```

### Example laws

```json
[
  {
    "id": "law-001",
    "section": "มาตรา 5",
    "title": "การเข้าถึงระบบคอมพิวเตอร์โดยมิชอบ",
    "description": "ห้ามเข้าถึงระบบคอมพิวเตอร์ของผู้อื่นโดยไม่ได้รับอนุญาต",
    "penalty": "จำคุกหรือปรับตามที่กฎหมายกำหนด"
  }
]
```

### XSS test payloads

These payloads must never execute:

```html
<script>window.xss = 1</script>
<img src=x onerror="window.xss = 1">
<svg onload="window.xss = 1"></svg>
<a href="javascript:window.xss = 1">unsafe link</a>
<h2 onclick="window.xss = 1">unsafe heading</h2>
```

Expected result:

- `window.xss` remains unset or `0`.
- Unsafe tags/attributes are removed.
- Safe text remains visible.

## 8. API Contract Summary

### Public endpoints

| Method | Path | Expected |
|---|---|---|
| GET | `/api/cards` | Returns cards array |
| GET | `/api/cards/:id` | Returns one card or 404 |
| GET | `/api/cards/slug/:slug` | Returns one card or 404 |
| GET | `/api/laws/config/categories` | Returns active law category config |
| GET | `/api/laws/:category` | Returns laws array |
| GET | `/api/laws/:category/:id` | Returns one law or 404 |

### Admin endpoints

| Method | Path | Auth | Expected |
|---|---|---|---|
| POST | `/api/cards` | Required | Creates card |
| PUT | `/api/cards/:id` | Required | Updates card |
| DELETE | `/api/cards/:id` | Required | Deletes card |
| POST | `/api/laws/:category` | Required | Creates law |
| PUT | `/api/laws/:category/:id` | Required | Updates law |
| DELETE | `/api/laws/:category/:id` | Required | Deletes law |

## 9. Suggested Test Cases for TestSprite

### Public UI tests

- Home page loads and displays hero.
- Root path routes to home page in deployed environment.
- Home dynamic cards render only when backend returns cards.
- Home shows backend-required message when backend is unavailable.
- Law category page redirects to home when no category is provided.
- Law category page loads category config and uses `viewerLabel` for the page title.
- Law category page shows backend-required message when backend is unavailable.
- Law category page renders laws returned by backend.
- Card detail page loads by slug.
- Card detail page loads by ID.
- Card detail page shows error when card does not exist.
- Card detail page renders safe rich HTML and blocks XSS.
- Consultation page renders static content.
- LINE CTA link points to expected LINE URL.

### Admin UI tests

- Admin login form is visible by default.
- Invalid login fails.
- Valid login opens admin panel.
- Admin can switch between laws and cards tabs.
- Admin can create law.
- Admin can edit law.
- Admin can delete law.
- Admin can create card.
- Admin can edit card.
- Admin can delete card.
- Admin forms show useful validation or failure states.

### API tests

- Public GET endpoints return expected data shape.
- Invalid category returns 400.
- Invalid document ID returns 400.
- Not-found document returns 404.
- Write endpoint without token returns 401.
- Write endpoint with non-admin token returns 403.
- Write endpoint with admin token succeeds.
- Unsafe URL input is rejected or sanitized.
- Large request body is rejected by body size limit.
- Rate limiting eventually returns 429 when exceeded.

### Security tests

- XSS payload in card title does not execute.
- XSS payload in card subtitle does not execute.
- XSS payload in card page content does not execute.
- XSS payload in law title/description/penalty does not execute.
- `javascript:` links in rich content are removed.
- Event attributes such as `onclick` and `onerror` are removed.
- Frontend does not call Firestore directly for public reads/writes.

## 10. Non-Functional Requirements

### Performance

- Public pages should render initial static layout immediately.
- Backend API timeout on frontend defaults to 4 seconds.
- Dynamic data loading should not block navbar, hero, or static page content.

### Accessibility

- Pages should include viewport meta tag.
- Images should include `alt` text.
- Interactive cards should be keyboard accessible where implemented.
- Body text should remain readable on mobile.

### Responsive behavior

Minimum viewport checks:

- 320px mobile.
- 768px tablet.
- 1200px desktop.

Expected:

- No horizontal overflow.
- Navigation remains usable.
- Cards stack properly on small screens.
- Text does not overlap or clip.

## 11. Environment and Setup Notes

### Frontend

Serve the `frontend/` folder with a static server.

Example:

```bash
python -m http.server 5500 --directory frontend
```

Then open:

```text
http://127.0.0.1:5500/home.html
```

### Backend

Run from `backend/`:

```bash
npm install
npm start
```

Required backend environment variables:

```text
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
ALLOWED_ORIGINS=
ADMIN_EMAILS=
NODE_ENV=development
PORT=3000
```

### Test credentials

Do not commit real credentials. Provide test credentials to TestSprite through its secure project configuration.

```text
Admin email: <provide in TestSprite secure credentials>
Admin password: <provide in TestSprite secure credentials>
```

## 12. Out of Scope

- Legal advice correctness verification.
- Payment or subscription flows.
- Multi-language content beyond current Thai UI.
- PDF layout or document viewer features for law pages.
- Real LINE chatbot conversation testing after leaving the website.
- Firebase Console configuration automation.

## 13. Known Risks and Watch Items

- Existing content may contain legacy HTML in `pageContent`; frontend now renders only whitelisted safe tags.
- Admin requires Firebase Auth config in `frontend/js/firebase-config.js`, which is intentionally ignored from git.
- Backend must be running for dynamic cards/laws to display.
- Firestore rules must be deployed separately.
- Previously exposed service account keys, if any, must be rotated outside this codebase.

## 14. Definition of Done

The product is considered ready for automated regression testing when:

- Backend starts successfully with test Firebase environment variables.
- Frontend can reach backend through `window.API_CONFIG.baseUrl`.
- Public pages load.
- Dynamic cards and laws render only through backend API.
- Admin login works with a test admin account.
- CRUD operations work through backend.
- XSS payloads do not execute in public or admin views.
- Backend tests pass.
