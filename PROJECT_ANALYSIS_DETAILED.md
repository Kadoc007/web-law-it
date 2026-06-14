# เธฃเธฒเธขเธเธฒเธเธงเธดเน€เธเธฃเธฒเธฐเธซเนเนเธเธฃเน€เธเธ WEB-LAW เนเธเธเธฅเธฐเน€เธญเธตเธขเธ”

เธงเธฑเธเธ—เธตเนเธงเธดเน€เธเธฃเธฒเธฐเธซเน: 2026-06-06
เธเธทเนเธเธ—เธตเนเธเธฒเธ: `D:\web test`
เธชเธ–เธฒเธเธฐเน€เธญเธเธชเธฒเธฃ: เธชเธณเธซเธฃเธฑเธเนเธเนเธ•เธฃเธงเธ readiness, เธชเนเธเธ•เนเธญเธ—เธตเธกเธ—เธ”เธชเธญเธ, เนเธฅเธฐเธงเธฒเธเนเธเธเธเธฑเธ’เธเธฒเธ•เนเธญ

## 1. เธชเธฃเธธเธเธเธนเนเธเธฃเธดเธซเธฒเธฃ

เนเธเธฃเน€เธเธเธเธตเนเน€เธเนเธเน€เธงเนเธเธเธญเธฃเนเธ—เธฑเธฅเธเธเธซเธกเธฒเธข IT เธ เธฒเธฉเธฒเนเธ—เธข เธกเธต frontend เนเธเธ static HTML/CSS/JavaScript เนเธฅเธฐ backend เนเธเธ Node.js/Express เธ—เธณเธซเธเนเธฒเธ—เธตเนเน€เธเนเธ API gateway เนเธเธขเธฑเธ Firebase Admin SDK เนเธฅเธฐ Firestore

เธ เธฒเธเธฃเธงเธกเธเธฑเธเธเธธเธเธฑเธเธ–เธทเธญเธงเนเธฒเนเธเธฃเธเธชเธฃเนเธฒเธเธซเธฅเธฑเธเธ–เธนเธเธขเธเธฃเธฐเธ”เธฑเธเธเธถเนเธเธกเธฒเธเนเธฅเนเธง:

- Frontend เนเธกเนเธเธงเธฃเธญเนเธฒเธเธซเธฃเธทเธญเน€เธเธตเธขเธ Firestore เนเธ”เธขเธ•เธฃเธเธชเธณเธซเธฃเธฑเธเธเนเธญเธกเธนเธฅเธซเธฅเธฑเธ `laws` เนเธฅเธฐ `cards`
- Firestore rules เธเธดเธ” client read/write เธ—เธฑเนเธเธซเธกเธ” เธ—เธณเนเธซเนเธ•เนเธญเธเธเนเธฒเธ backend เธเนเธญเธ
- Backend เธกเธต input validation, sanitizer, admin authentication, CORS, Helmet เนเธฅเธฐ rate limiting
- เธซเธเนเธฒ frontend เธ–เธนเธเธเธฃเธฑเธเนเธซเนเนเธเน Bootstrap เธเนเธงเธขเน€เธฃเธทเนเธญเธเธซเธเนเธฒเธ•เธฒเนเธฅเธฐ responsive layout
- เธเธฒเธฃ render เธเนเธญเธกเธนเธฅ dynamic เธชเนเธงเธเนเธซเธเนเน€เธฅเธดเธเนเธเน `innerHTML` เนเธฅเธฐเน€เธเธฅเธตเนเธขเธเน€เธเนเธ DOM API / `textContent`
- เธซเธเนเธฒ `home.html` เน€เธเนเธเธซเธเนเธฒเนเธฃเธเธเธญเธเน€เธงเนเธเนเธฅเนเธง
- เธกเธต PRD เธชเธณเธซเธฃเธฑเธ TestSprite เนเธฅเนเธงเธ—เธตเน `TESTSPRITE_PRD.md`

เธญเธขเนเธฒเธเนเธฃเธเนเธ•เธฒเธกเธขเธฑเธเนเธกเนเธเธงเธฃเธกเธญเธเธงเนเธฒ production-ready เนเธเธเน€เธ•เนเธก 100% เธเธเธเธงเนเธฒเธเธฐเธเธดเธ”เธเธฃเธฐเน€เธ”เนเธเน€เธซเธฅเนเธฒเธเธตเน:

- เธ•เนเธญเธเธขเธทเธเธขเธฑเธเธงเนเธฒ service account key เธ—เธตเนเน€เธเธขเธ–เธนเธเนเธเนเธซเธฃเธทเธญเน€เธเธขเธซเธฅเธธเธ”เนเธ repo เธ–เธนเธ revoke/rotate เนเธฅเนเธง
- เธขเธฑเธเธกเธต `script-src 'unsafe-inline'` เนเธ CSP เน€เธเธฃเธฒเธฐเธขเธฑเธเธกเธต inline script เนเธฅเธฐ inline event handlers เธเธฒเธเธเธธเธ”
- เธเธฒเธฃเนเธซเธฅเธ” navbar เธขเธฑเธเนเธเน `innerHTML` เธเธฑเธเนเธเธฅเน local static เธเธถเนเธเธเธงเธฒเธกเน€เธชเธตเนเธขเธเธ•เนเธณ เนเธ•เนเธเธงเธฃเธเธฃเธฑเธเธ–เนเธฒเธ•เนเธญเธเธเธฒเธฃ harden CSP เธเธฃเธดเธ
- เธขเธฑเธเนเธกเนเธกเธต automated E2E test, route integration test, CI/CD เนเธฅเธฐ health endpoint
- API list เธขเธฑเธเนเธกเนเธกเธต pagination/cache strategy เธซเธฒเธเธเนเธญเธกเธนเธฅ Firestore เนเธ•เธเธถเนเธ
- เธ•เนเธญเธเธ•เธฑเนเธเธเนเธฒ `ALLOWED_ORIGINS`, backend URL, Firebase env เนเธฅเธฐ authorized domains เนเธซเนเธ–เธนเธเธเนเธญเธ deploy เธเธฃเธดเธ

เธเนเธญเธชเธฃเธธเธ: เนเธเธฃเน€เธเธเธเธฃเนเธญเธกเธฃเธฑเธเนเธฅเธฐเธ—เธ”เธชเธญเธเนเธ local/dev เนเธ”เน เนเธ•เนเธเนเธญเธ production เธเธงเธฃเธ—เธณ hardening phase เน€เธเธดเนเธก เนเธ”เธขเน€เธเธเธฒเธฐ secret rotation, CSP cleanup, production env เนเธฅเธฐ automated smoke tests

## 2. เธงเธฑเธ•เธ–เธธเธเธฃเธฐเธชเธเธเนเธเธญเธเธฃเธฐเธเธ

เธฃเธฐเธเธเธเธตเนเธ—เธณเธซเธเนเธฒเธ—เธตเนเน€เธเนเธเธจเธนเธเธขเนเธเนเธญเธกเธนเธฅเธเธเธซเธกเธฒเธข IT เธชเธณเธซเธฃเธฑเธเธเธนเนเนเธเนเธ—เธฑเนเธงเนเธเนเธฅเธฐเธเธนเนเธ”เธนเนเธฅเธฃเธฐเธเธ เนเธ”เธขเธกเธตเธเธงเธฒเธกเธชเธฒเธกเธฒเธฃเธ–เธซเธฅเธฑเธ:

- เนเธชเธ”เธเธเนเธญเธกเธนเธฅเธเธเธซเธกเธฒเธขเธ•เธฒเธกเธซเธกเธงเธ” เน€เธเนเธ เธเธเธซเธกเธฒเธขเธเธญเธกเธเธดเธงเน€เธ•เธญเธฃเน, PDPA, เธฅเธดเธเธชเธดเธ—เธเธดเน
- เนเธชเธ”เธเธเธฒเธฃเนเธ”เธเธ—เธเธงเธฒเธกเธซเธฃเธทเธญเธเนเธญเธเธ—เธฒเธเนเธซเนเธเธณเธเธฃเธถเธเธฉเธฒเน€เธเธดเนเธกเน€เธ•เธดเธกเธเธเธซเธเนเธฒ home
- เนเธชเธ”เธเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธเธฒเธฃเนเธ”เธเนเธฒเธ slug เน€เธเนเธ `card-detail.html?slug=consult`
- เธกเธตเธซเธเนเธฒ admin เธชเธณเธซเธฃเธฑเธเน€เธเธดเนเธก/เนเธเนเนเธ/เธฅเธเธเนเธญเธกเธนเธฅเธเธเธซเธกเธฒเธขเนเธฅเธฐเธเธฒเธฃเนเธ”
- เนเธเน Firebase Authentication เธชเธณเธซเธฃเธฑเธเธขเธทเธเธขเธฑเธเธ•เธฑเธงเธ•เธ admin
- เนเธเน Firestore เน€เธเนเธเธเธฒเธเธเนเธญเธกเธนเธฅเธเธฅเธฒเธ
- เธเธฑเธเธเธฑเธเนเธซเนเธเนเธญเธกเธนเธฅ dynamic เธ•เนเธญเธเธเนเธฒเธ backend API เธเนเธญเธเธ–เธถเธเธเธฐเธญเนเธฒเธ/เน€เธเธตเธขเธเนเธ”เน

## 3. เธ เธฒเธเธฃเธงเธกเธชเธ–เธฒเธเธฑเธ•เธขเธเธฃเธฃเธก

```mermaid
flowchart LR
  User["เธเธนเนเนเธเนเธ—เธฑเนเธงเนเธ"] --> FE["Static Frontend<br/>HTML CSS JS Bootstrap"]
  Admin["เธเธนเนเธ”เธนเนเธฅเธฃเธฐเธเธ"] --> FE
  FE --> API["Backend API<br/>Express"]
  API --> Auth["Firebase Auth<br/>verifyIdToken"]
  API --> AdminSDK["Firebase Admin SDK"]
  AdminSDK --> FS["Firestore"]
  FE -. "Firebase client auth เน€เธเธเธฒเธฐ login admin" .-> Auth
  FE -. "Firestore direct access เธ–เธนเธเธเธดเธ”" .-> Rules["firestore.rules<br/>deny all client read/write"]
```

เนเธเธงเธเธดเธ”เธซเธฅเธฑเธเธ–เธนเธเธ•เนเธญเธเธชเธณเธซเธฃเธฑเธเธฃเธฐเธเธเธ—เธตเนเธ•เนเธญเธเธเธฒเธฃเธเธงเธเธเธธเธกเธเนเธญเธกเธนเธฅ:

- Client เธ—เธณเธซเธเนเธฒเธ—เธตเนเนเธชเธ”เธเธเธฅเนเธฅเธฐเธชเนเธเธเธณเธเธญ
- Backend เน€เธเนเธ trust boundary เธชเธณเธซเธฃเธฑเธ validation, auth, sanitization เนเธฅเธฐ policy
- Firestore เนเธกเนเน€เธเธดเธ”เนเธซเน client query เนเธ”เธขเธ•เธฃเธ
- Admin write เธ•เนเธญเธเธเนเธฒเธ backend เนเธฅเธฐ token verification

## 4. เนเธเธฃเธเธชเธฃเนเธฒเธเนเธเธฅเนเธชเธณเธเธฑเธ

```text
D:\web test
โ”โ”€โ”€ backend
โ”   โ”โ”€โ”€ server.js
โ”   โ”โ”€โ”€ firebaseAdmin.js
โ”   โ”โ”€โ”€ routes
โ”   โ”   โ”โ”€โ”€ cardRoutes.js
โ”   โ”   โ””โ”€โ”€ lawRoutes.js
โ”   โ”โ”€โ”€ middleware
โ”   โ”   โ””โ”€โ”€ adminAuth.js
โ”   โ”โ”€โ”€ utils
โ”   โ”   โ”โ”€โ”€ http.js
โ”   โ”   โ””โ”€โ”€ validation.js
โ”   โ”โ”€โ”€ tests
โ”   โ”   โ””โ”€โ”€ validation.test.js
โ”   โ””โ”€โ”€ package.json
โ”โ”€โ”€ frontend
โ”   โ”โ”€โ”€ home.html
โ”   โ”โ”€โ”€ index.html
โ”   โ”โ”€โ”€ card-detail.html
โ”   โ”โ”€โ”€ consult.html
โ”   โ”โ”€โ”€ admin.html
โ”   โ”โ”€โ”€ api-docs.html
โ”   โ”โ”€โ”€ components
โ”   โ”   โ””โ”€โ”€ navbar.html
โ”   โ”โ”€โ”€ css
โ”   โ”   โ”โ”€โ”€ style.css
โ”   โ”   โ””โ”€โ”€ bootstrap-custom.css
โ”   โ”โ”€โ”€ js
โ”   โ”   โ”โ”€โ”€ api.js
โ”   โ”   โ”โ”€โ”€ api-config.js
โ”   โ”   โ”โ”€โ”€ api-config.example.js
โ”   โ”   โ”โ”€โ”€ admin.js
โ”   โ”   โ”โ”€โ”€ card-detail.js
โ”   โ”   โ”โ”€โ”€ viewer.js
โ”   โ”   โ”โ”€โ”€ firebase-config.js
โ”   โ”   โ””โ”€โ”€ firebase-config.example.js
โ”   โ””โ”€โ”€ vercel.json
โ”โ”€โ”€ firestore.rules
โ”โ”€โ”€ firebase.json
โ”โ”€โ”€ API_CONTRACT.md
โ”โ”€โ”€ TESTSPRITE_PRD.md
โ”โ”€โ”€ DESIGN.md
โ””โ”€โ”€ PROJECT_ANALYSIS_DETAILED.md
```

## 5. Frontend Analysis

### 5.1 เธซเธเนเธฒเน€เธงเนเธเธซเธฅเธฑเธ

Frontend เน€เธเนเธ static pages เนเธกเนเธกเธต bundler:

- `frontend/home.html`
  - เธซเธเนเธฒเนเธฃเธเธเธญเธเน€เธงเนเธ
  - เธกเธตเธซเธกเธงเธ”เธเธเธซเธกเธฒเธขเธซเธฅเธฑเธ
  - เธกเธต dynamic cards เธเธฒเธ backend
  - เธกเธต CTA เน€เธเธดเนเธกเน€เธเธทเนเธญเธ LINE เธ—เธตเนเนเธ—เธ line icon เน€เธ”เธดเธก
  - เธ–เนเธฒ backend เนเธกเนเธฃเธฑเธ เธเธฐเนเธกเน render dynamic cards เนเธฅเธฐเนเธชเธ”เธเธชเธ–เธฒเธเธฐเนเธซเนเธเธนเนเนเธเนเธฃเธนเน

- `frontend/index.html`
  - เธซเธเนเธฒเนเธชเธ”เธเธฃเธฒเธขเธเธฒเธฃเธเธเธซเธกเธฒเธขเธ•เธฒเธก `category`
  - เธ–เนเธฒเนเธกเนเธกเธต category เธเธฐ redirect เธเธฅเธฑเธ `home.html`
  - เธ”เธถเธเธเนเธญเธกเธนเธฅเธเนเธฒเธ `apiClient.laws.list(category)`
  - เธ–เนเธฒ backend เนเธกเนเธฃเธฑเธ เธเธฐเนเธกเนเนเธชเธ”เธเธเนเธญเธกเธนเธฅเธเธเธซเธกเธฒเธขเธเธฅเธญเธก

- `frontend/card-detail.html`
  - เธซเธเนเธฒเนเธชเธ”เธเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธเธฒเธฃเนเธ”เธเธฒเธ `slug`
  - เนเธเน `card-detail.js` เธเธฑเธ”เธเธฒเธฃ safe rich content rendering

- `frontend/consult.html`
  - เธซเธเนเธฒเน€เธเธทเนเธญเธซเธฒ consult เนเธเธ static
  - เนเธเน navbar component เธฃเนเธงเธกเธเธฑเธเธซเธเนเธฒเธญเธทเนเธ

- `frontend/admin.html`
  - เธซเธเนเธฒ admin login เธเนเธฒเธ Firebase client auth
  - เธซเธฅเธฑเธ login เธเธฐเน€เธฃเธตเธขเธ backend API เธเธฃเนเธญเธก Bearer token
  - เนเธเนเธเธฑเธ”เธเธฒเธฃ laws เนเธฅเธฐ cards

- `frontend/api-docs.html`
  - เน€เธญเธเธชเธฒเธฃ API เนเธเธ static เธชเธณเธซเธฃเธฑเธเธญเนเธฒเธเธญเธดเธ
  - เธกเธต inline script/handlers เน€เธเธทเนเธญเธเธฑเธเธเนเธเธฑเธเน€เธญเธเธชเธฒเธฃ เนเธกเนเนเธเน runtime เธซเธฅเธฑเธเธเธญเธเน€เธงเนเธ

### 5.2 API Client

เนเธเธฅเน `frontend/js/api.js` เน€เธเนเธ abstraction เธ—เธตเนเธ”เธตเธชเธณเธซเธฃเธฑเธเน€เธฃเธตเธขเธ backend:

- เธกเธต `baseUrl` เน€เธฃเธดเนเธกเธ•เนเธเน€เธเนเธ `http://localhost:3000`
- เธฃเธญเธเธฃเธฑเธ override เธเนเธฒเธ `window.API_CONFIG`
- เธกเธต timeout เธ”เนเธงเธข `AbortController`
- เธชเนเธ JSON body เน€เธกเธทเนเธญเธเธณเน€เธเนเธ
- เธชเนเธ `Authorization: Bearer <token>` เธชเธณเธซเธฃเธฑเธ admin routes
- เนเธเธฅเธ error message เธเธฒเธ backend เนเธซเน frontend เนเธเนเธเธฒเธเธเนเธฒเธข

เธเธธเธ”เธ—เธตเนเธเธงเธฃเธฃเธฐเธงเธฑเธ:

- Production เธ•เนเธญเธเธ•เธฑเนเธ `frontend/js/api-config.js` เธซเธฃเธทเธญเธงเธดเธเธต inject config เนเธซเนเธเธตเน backend URL เธเธฃเธดเธ
- เธซเธฒเธ backend เนเธขเธ domain เธ•เนเธญเธเน€เธเธดเนเธก domain เธเธฑเนเธเนเธ CSP `connect-src`
- เธ–เนเธฒเนเธเน Vercel frontend + backend host เธญเธทเนเธ เธ•เนเธญเธเธ•เธฃเธงเธ CORS เธ—เธฑเนเธเธชเธญเธเธเธฑเนเธเธเธฃเนเธญเธกเธเธฑเธ

### 5.3 Bootstrap เนเธฅเธฐเธซเธเนเธฒเธ•เธฒ

Frontend เธ–เธนเธเน€เธเธดเนเธก Bootstrap 5.3.8 เธเธฒเธ CDN เนเธฅเธฐเธกเธต custom CSS เนเธ `frontend/css/bootstrap-custom.css`

เธเธฅเธ”เธต:

- เนเธเน utility/layout class เนเธ”เนเธเนเธฒเธขเธเธถเนเธ
- เธซเธเนเธฒ admin เนเธฅเธฐ cards เธ”เธนเธชเธกเนเธณเน€เธชเธกเธญเธเธถเนเธ
- responsive behavior เธ”เธตเธเธถเนเธเนเธ”เธขเนเธกเนเธ•เนเธญเธเน€เธเธตเธขเธ CSS เน€เธญเธเธ—เธฑเนเธเธซเธกเธ”

เธเนเธญเธเธงเธฃเธฃเธฐเธงเธฑเธ:

- CDN เน€เธเนเธ external dependency เธซเธฒเธเธ•เนเธญเธเธเธฒเธฃเธเธงเธฒเธกเน€เธชเธ–เธตเธขเธฃ/เธเธงเธฒเธกเธเธฅเธญเธ”เธ เธฑเธขเธชเธนเธ เธเธงเธฃ self-host asset เธซเธฃเธทเธญเนเธเน Subresource Integrity
- เธ•เนเธญเธเธเธงเธเธเธธเธกเนเธกเนเนเธซเน Bootstrap class เธเธเธเธฑเธ class เน€เธ”เธดเธก เน€เธเนเธ `.card`, `.btn`, `.container`
- เธเธงเธฃเธ—เธ”เธชเธญเธเธ—เธตเน 320px, 768px, 1200px เธ•เนเธญเธ—เธธเธเธเธฃเธฑเนเธเธซเธฅเธฑเธเธเธฃเธฑเธ layout

### 5.4 XSS เนเธฅเธฐเธเธฒเธฃ render

เธชเธ–เธฒเธเธฐเธเธฑเธเธเธธเธเธฑเธ:

- Dynamic data เธเธญเธ `viewer.js`, `admin.js`, `home.html` เธ–เธนเธเธเธฃเธฑเธเนเธเนเธเน DOM API เนเธฅเธฐ `textContent`
- `card-detail.js` เธกเธต sanitizer เธเธฑเนเธ frontend เธชเธณเธซเธฃเธฑเธ rich HTML เธเธฒเธ backend
- Backend `validation.js` sanitize เธ—เธฑเนเธ plain text เนเธฅเธฐ HTML เธเนเธญเธเธ•เธญเธเธเธฅเธฑเธเธซเธฃเธทเธญเธเธฑเธเธ—เธถเธ
- Backend block event attributes, `style`, script-like tags, unsafe protocols เน€เธเนเธ `javascript:`

เธเธธเธ”เธ—เธตเนเธขเธฑเธเธเธเธเธฒเธ scan:

- `frontend/admin.html`, `home.html`, `index.html`, `card-detail.html`, `consult.html` เนเธซเธฅเธ” `components/navbar.html` เนเธฅเนเธงเนเธชเนเธ”เนเธงเธข `innerHTML`
- เธกเธต inline event handlers เน€เธเนเธ `onclick` เนเธ HTML เธซเธฅเธฒเธขเธเธธเธ”
- `frontend/vercel.json` เธขเธฑเธเธกเธต `script-src 'unsafe-inline'`

เธเธฒเธฃเธเธฃเธฐเน€เธกเธดเธ:

- `innerHTML` เธชเธณเธซเธฃเธฑเธ navbar local static เธกเธตเธเธงเธฒเธกเน€เธชเธตเนเธขเธเธ•เนเธณ เน€เธเธฃเธฒเธฐเนเธกเนเนเธ”เนเธกเธฒเธเธฒเธ user input เธซเธฃเธทเธญ database
- เธเธงเธฒเธกเน€เธชเธตเนเธขเธ XSS เธเธฒเธเธเนเธญเธกเธนเธฅ Firestore เธฅเธ”เธฅเธเธกเธฒเธ เน€เธเธฃเธฒเธฐ sanitize เธ—เธฑเนเธ backend เนเธฅเธฐ frontend
- เธ–เนเธฒเธ•เนเธญเธเธเธฒเธฃ production hardening เธเธฃเธดเธ เธเธงเธฃเน€เธฅเธดเธ inline handlers เนเธฅเธฐเธขเนเธฒเธข script เธ—เธฑเนเธเธซเธกเธ”เธญเธญเธเน€เธเนเธเนเธเธฅเน JS เน€เธเธทเนเธญเธ–เธญเธ” `'unsafe-inline'`

### 5.5 Accessibility

เธชเธดเนเธเธ—เธตเนเธ”เธต:

- เธซเธเนเธฒ HTML เธซเธฅเธฑเธเธกเธต viewport meta
- Dynamic cards เธเธฒเธเธชเนเธงเธเธฃเธญเธเธฃเธฑเธ keyboard interaction
- เธฃเธนเธ dynamic เธ–เธนเธเธเธณเธซเธเธ” alt เธเธฒเธเธเนเธญเธกเธนเธฅเธ—เธตเน sanitize เนเธฅเนเธง
- Bootstrap เธเนเธงเธขเน€เธฃเธทเนเธญเธ focus style เนเธฅเธฐ responsive components เธเธฒเธเธชเนเธงเธ

เธชเธดเนเธเธ—เธตเนเธเธงเธฃเนเธเน:

- เธซเธกเธงเธ”เธเธเธซเธกเธฒเธขเนเธ `home.html` เน€เธเนเธ `<div onclick="...">` เธเธงเธฃเน€เธเธฅเธตเนเธขเธเน€เธเนเธ `<a>` เธซเธฃเธทเธญ `<button>` เน€เธเธทเนเธญ keyboard เนเธฅเธฐ screen reader
- Logo เนเธ navbar เนเธเน `onclick` เธเธงเธฃเน€เธเธฅเธตเนเธขเธเน€เธเนเธเธฅเธดเธเธเน
- เธเธงเธฃเน€เธเธดเนเธก `aria-current` เนเธซเน navigation item เธ•เธฒเธกเธซเธเนเธฒเธเธฑเธเธเธธเธเธฑเธ
- เธเธงเธฃเธ•เธฃเธงเธ contrast เธเธญเธเธเนเธญเธเธงเธฒเธกเธชเธตเธเนเธฒเธเธเธเธทเนเธ navy เนเธฅเธฐเธเนเธญเธเธงเธฒเธกเธชเธตเน€เธ—เธฒเธเธฒเธเธชเนเธงเธ
- เธเธธเนเธก floating LINE เธญเธฒเธเธเธ”เธเธฑเธเน€เธเธทเนเธญเธซเธฒเธเธเธเธญเน€เธฅเนเธ เธเธงเธฃเธกเธต responsive spacing เธซเธฃเธทเธญ safe area

## 6. Backend Analysis

### 6.1 Server เนเธฅเธฐ middleware

`backend/server.js` เนเธเน Express 5 เนเธฅเธฐ middleware เธ—เธตเนเน€เธซเธกเธฒเธฐเธชเธก:

- `helmet()` เธ•เธฑเนเธ security headers
- `cors()` เธเธฃเนเธญเธก allowlist เธเธฒเธ `ALLOWED_ORIGINS`
- production mode เธเธฑเธเธเธฑเธเธงเนเธฒเธ•เนเธญเธเธ•เธฑเนเธ `ALLOWED_ORIGINS`
- `express-rate-limit` เธเธณเธเธฑเธ” 100 requests เธ•เนเธญ 15 เธเธฒเธ—เธตเธ•เนเธญ IP
- `express.json({ limit: "10kb" })` เธฅเธ”เธเธงเธฒเธกเน€เธชเธตเนเธขเธ body abuse
- global error handler เธเนเธญเธเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ” error เธเธฒเธ client

เธเนเธญเธ”เธต:

- เธกเธต security baseline เธ—เธตเนเธ”เธต
- Development mode เน€เธเธดเธ” CORS เนเธ”เนเธชเธฐเธ”เธงเธ
- Production fail-fast เธ–เนเธฒ CORS config เนเธกเนเธเธฃเนเธญเธก

เธเนเธญเธเธงเธฃเน€เธเธดเนเธก:

- `GET /health` เธซเธฃเธทเธญ `/api/health` เธชเธณเธซเธฃเธฑเธ uptime monitor เนเธฅเธฐ smoke test
- route-level rate limit เธชเธณเธซเธฃเธฑเธ admin write เธซเธฃเธทเธญ login-heavy actions
- request logging เนเธเธ sanitize เนเธฅเนเธง เน€เธเนเธ method/path/status/duration
- graceful shutdown เธซเธฒเธ deploy เธเธ environment เธ—เธตเนเธ•เนเธญเธ handle SIGTERM

### 6.2 Firebase Admin

`backend/firebaseAdmin.js` เนเธเน env variables:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

เธเนเธญเธ”เธต:

- เนเธกเนเธเธงเธฃเธกเธต service account JSON เธญเธขเธนเนเนเธ repo
- server exit เธ—เธฑเธเธ—เธตเธ–เนเธฒ env เนเธกเนเธเธฃเธ
- private key เนเธเธฅเธ `\\n` เน€เธเนเธ newline เธเธฃเธดเธ

เธเนเธญเธเธงเธฃเธฃเธฐเธงเธฑเธ:

- เธ•เนเธญเธเธ•เธฃเธงเธ `.env` เนเธฅเธฐ service account key เนเธกเนเนเธซเนเธซเธฅเธธเธ”เน€เธเนเธฒ git
- เธ–เนเธฒ key เน€เธเธขเธ–เธนเธ commit เธซเธฃเธทเธญเนเธเธฃเน เธ•เนเธญเธ rotate/revoke เธเธฒเธ Firebase/GCP
- เธเธงเธฃเนเธเน secret manager เธเธญเธ platform เนเธ—เธเนเธเธฅเน `.env` เนเธ production

### 6.3 Routes

#### Laws API

`backend/routes/lawRoutes.js`

Endpoints:

- `GET /api/laws/:category`
- `GET /api/laws/:category/:id`
- `POST /api/laws/:category`
- `PUT /api/laws/:category/:id`
- `DELETE /api/laws/:category/:id`

เธเนเธญเธ”เธต:

- validate category เน€เธเธเธฒเธฐ `computer`, `privacy`, `copyright`
- validate doc id เธเนเธญเธ query Firestore
- write routes เนเธเน `adminAuth`
- response 404 เน€เธกเธทเนเธญเนเธกเนเธเธเธเนเธญเธกเธนเธฅ
- route error เธ–เธนเธเธชเนเธเธเนเธฒเธ `handleRouteError`

เธเนเธญเธเธงเธฃเน€เธเธดเนเธก:

- pagination เธซเธฃเธทเธญ cursor เธซเธฒเธเนเธ•เนเธฅเธฐเธซเธกเธงเธ”เธกเธตเธเนเธญเธกเธนเธฅเน€เธขเธญเธฐ
- createdAt/updatedAt เธชเธณเธซเธฃเธฑเธ laws เน€เธเธทเนเธญเธเธฑเธ”เน€เธฃเธตเธขเธเนเธฅเธฐ audit
- route integration tests เธ—เธตเน mock Firestore

#### Cards API

`backend/routes/cardRoutes.js`

Endpoints:

- `GET /api/cards`
- `GET /api/cards?category=...`
- `GET /api/cards/slug/:slug`
- `GET /api/cards/:id`
- `POST /api/cards`
- `PUT /api/cards/:id`
- `DELETE /api/cards/:id`

เธเนเธญเธ”เธต:

- validate category, slug เนเธฅเธฐ id
- write routes เนเธเน `adminAuth`
- create/update เนเธชเน timestamps
- sanitize record เธเนเธญเธ response
- slug route เนเธเน `limit(1)`

เธเนเธญเธเธงเธฃเน€เธเธดเนเธก:

- enforce unique slug เธเธฑเนเธ backend เธเนเธญเธ create/update
- pagination เธชเธณเธซเธฃเธฑเธ `GET /api/cards`
- index definition เน€เธญเธเธชเธฒเธฃ Firestore เธซเธฒเธ query `where + orderBy` เธ•เนเธญเธเนเธเน composite index
- cache headers เธซเธฃเธทเธญ ETag เธชเธณเธซเธฃเธฑเธ public read routes

### 6.4 Admin Authentication

`backend/middleware/adminAuth.js`

เธฃเธญเธเธฃเธฑเธ:

- Firebase ID Token เธเนเธฒเธ `Authorization: Bearer`
- custom claim `admin: true`
- fallback `ADMIN_EMAILS`

เธเนเธญเธ”เธต:

- เนเธกเนเน€เธเธทเนเธญ email เธเธฒเธ client เธ•เธฃเธ เน เนเธ•เน verify ID token เธเนเธญเธ
- เนเธขเธ admin policy เนเธงเนเนเธ middleware
- response status เนเธขเธ 401/403/500 เนเธ”เนเน€เธซเธกเธฒเธฐเธชเธก

เธเนเธญเธเธงเธฃเธเธฃเธฑเธ:

- เธญเธขเนเธฒเนเธเน `ADMIN_EMAILS` เน€เธเนเธ policy เธฃเธฐเธขเธฐเธขเธฒเธงเธ–เนเธฒเธฃเธฐเธเธเนเธ• เธเธงเธฃเนเธเน custom claims เธซเธฃเธทเธญ role collection
- เธ•เธฃเธงเธ log เนเธกเนเนเธซเนเธกเธต sensitive token เธซเธฃเธทเธญเธเนเธญเธกเธนเธฅเธเธนเนเนเธเนเธฅเธฐเน€เธญเธตเธขเธ”เน€เธเธดเธ
- เน€เธเธดเนเธก tests เธชเธณเธซเธฃเธฑเธ missing token, invalid token, non-admin, admin success

## 7. Data Model

### 7.1 Firestore collections

เนเธเธฃเธเธชเธฃเนเธฒเธเธ—เธตเนเนเธเน:

```text
law/{category}/items/{id}
cards/{id}
```

เธซเธกเธงเธ” `law`:

- `computer`
- `privacy`
- `copyright`

เธ•เธฑเธงเธญเธขเนเธฒเธ law item:

```json
{
  "section": "เธกเธฒเธ•เธฃเธฒ ...",
  "title": "เธซเธฑเธงเธเนเธญเธเธเธซเธกเธฒเธข",
  "description": "เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”",
  "penalty": "เนเธ—เธฉ"
}
```

เธซเธกเธฒเธขเน€เธซเธ•เธธ:

- เธซเธกเธงเธ” `privacy` เนเธกเนเธเธฑเธเธเธฑเธ `penalty`
- เธซเธกเธงเธ”เธญเธทเนเธเธเธฑเธเธเธฑเธ `penalty`

เธ•เธฑเธงเธญเธขเนเธฒเธ card:

```json
{
  "title": "เธเธทเนเธญเธเธฒเธฃเนเธ”",
  "subtitle": "เธซเธฑเธงเธเนเธญเธขเนเธญเธข",
  "description": "เธเธณเธญเธเธดเธเธฒเธข",
  "imageUrl": "https://...",
  "slug": "consult",
  "pageContent": "<p>safe rich content</p>",
  "category": "help",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 7.2 Firestore Rules

`firestore.rules` เธเธฑเธเธเธธเธเธฑเธ:

```rules
match /{document=**} {
  allow read, write: if false;
}
```

เธเธฒเธฃเธเธฃเธฐเน€เธกเธดเธ:

- เน€เธซเธกเธฒเธฐเธเธฑเธ architecture เธ—เธตเนเธเธฑเธเธเธฑเธเธเนเธฒเธ backend เน€เธ—เนเธฒเธเธฑเนเธ
- เธฅเธ”เธเธงเธฒเธกเน€เธชเธตเนเธขเธ client bypass policy
- เธ•เนเธญเธเนเธเนเนเธเธงเนเธฒ frontend เนเธกเนเธกเธต code เธ—เธตเนเธขเธฑเธเธเธฒเธ”เธซเธงเธฑเธ Firestore direct read/write เธชเธณเธซเธฃเธฑเธเธเนเธญเธกเธนเธฅเธซเธฅเธฑเธ

## 8. API Contract Summary

Public read:

- `GET /api/laws/:category`
- `GET /api/laws/:category/:id`
- `GET /api/cards`
- `GET /api/cards?category=help`
- `GET /api/cards/slug/:slug`
- `GET /api/cards/:id`

Admin write:

- `POST /api/laws/:category`
- `PUT /api/laws/:category/:id`
- `DELETE /api/laws/:category/:id`
- `POST /api/cards`
- `PUT /api/cards/:id`
- `DELETE /api/cards/:id`

Admin write เธ•เนเธญเธเธกเธต:

```http
Authorization: Bearer <Firebase ID Token>
Content-Type: application/json
```

เธเธงเธฃเน€เธเธดเนเธกเนเธเธญเธเธฒเธเธ•:

- `GET /api/health`
- `GET /api/cards?limit=...&cursor=...`
- `GET /api/laws/:category?limit=...&cursor=...`
- endpoint เธซเธฃเธทเธญ script เธชเธณเธซเธฃเธฑเธ seed data

## 9. Security Assessment เธ•เธฒเธกเธเธ—เธเธฒเธ— Security Agent

### 9.1 Hardcoded secrets

เธชเธ–เธฒเธเธฐ:

- Backend เนเธเน env variables เธชเธณเธซเธฃเธฑเธ Firebase Admin credentials
- `.gitignore` เธกเธตเนเธเธฅเน sensitive เธ•เธฒเธกเนเธเธงเธ—เธฒเธเธเนเธญเธเธซเธเนเธฒ
- `frontend/js/firebase-config.js` เน€เธเนเธ Firebase client config เนเธกเนเนเธเน secret เนเธเธ service account เนเธ•เนเน€เธเนเธเธเนเธญเธกเธนเธฅเธเธฃเธดเธเธเธญเธ project

เธเธงเธฒเธกเน€เธชเธตเนเธขเธเธ—เธตเนเน€เธซเธฅเธทเธญ:

- เธซเธฒเธ service account key เน€เธเธขเธ–เธนเธ commit เธซเธฃเธทเธญ paste เนเธ repo/history เธ•เนเธญเธ revoke/rotate เธ—เธฑเธเธ—เธต
- เธ•เนเธญเธเธ•เธฃเธงเธ git history เธ”เนเธงเธขเน€เธเธฃเธทเนเธญเธเธกเธทเธญ secret scanning เธเนเธญเธ deploy
- เธเธงเธฃ restrict Firebase authorized domains เนเธฅเธฐเน€เธเธดเธ”เนเธเน App Check เธซเธฒเธเน€เธซเธกเธฒเธฐเธเธฑเธ production

Priority: P0 เธซเธฒเธเธขเธฑเธเนเธกเน rotate key เธ—เธตเนเน€เธเธขเธซเธฅเธธเธ”

### 9.2 XSS

เธชเธดเนเธเธ—เธตเนเนเธเนเนเธฅเนเธง:

- dynamic data เธชเนเธงเธเนเธซเธเนเนเธเน `textContent` เนเธฅเธฐ DOM APIs
- backend sanitize HTML allowlist
- frontend detail page เธกเธต safe rich renderer

เธเธธเธ”เธ—เธตเนเน€เธซเธฅเธทเธญ:

- navbar static เธขเธฑเธ inject เธ”เนเธงเธข `innerHTML`
- เธกเธต inline event handlers
- CSP เธขเธฑเธเธ•เนเธญเธเธเธถเนเธ `'unsafe-inline'`

Priority: P1 เธชเธณเธซเธฃเธฑเธ hardening, P0 เธซเธฒเธเธกเธต content เธเธฒเธเนเธซเธฅเนเธเนเธกเน trusted เธ–เธนเธ inject เธเนเธฒเธ `innerHTML`

### 9.3 Firebase Security Rules

เธชเธ–เธฒเธเธฐ:

- rules deny all client read/write
- เน€เธซเธกเธฒเธฐเธเธฑเธ backend-gateway architecture

เธเนเธญเธเธงเธฃเธ—เธณ:

- deploy rules เธเธฃเธดเธเธ”เนเธงเธข Firebase CLI
- เน€เธเธดเนเธก test/checklist เธงเนเธฒ frontend read/write Firestore เธ•เธฃเธเนเธกเนเนเธ”เน

Priority: P0 เธเนเธญเธ production

### 9.4 CORS, CSP เนเธฅเธฐ Rate Limiting

CORS:

- production เธเธฑเธเธเธฑเธ `ALLOWED_ORIGINS`
- dev เน€เธเธดเธ”เธ—เธธเธ origin เธซเธฒเธเนเธกเนเนเธ”เนเธ•เธฑเนเธเธเนเธฒ

CSP:

- เธกเธต CSP เธ—เธตเนเธเธธเธก default-src, script-src, style-src, font-src, img-src, connect-src, frame-src
- เน€เธเธดเนเธก jsDelivr เธชเธณเธซเธฃเธฑเธ Bootstrap เนเธฅเนเธง
- เธขเธฑเธเธกเธต `'unsafe-inline'`

Rate limiting:

- เธกเธต global limit 100 requests เธ•เนเธญ 15 เธเธฒเธ—เธตเธ•เนเธญ IP

เธเนเธญเธเธงเธฃเธเธฃเธฑเธ:

- เน€เธเธดเนเธก backend production URL เนเธ `connect-src` เธซเธฒเธเนเธกเนเนเธเน same-origin
- เธฅเธ”เธเธฒเธฃเธเธถเนเธ `'unsafe-inline'`
- เน€เธเธดเนเธก stricter rate limit เธชเธณเธซเธฃเธฑเธ write routes

## 10. Frontend Agent Checklist

### Viewport

เธชเธ–เธฒเธเธฐ: เธซเธเนเธฒเน€เธงเนเธเธซเธฅเธฑเธเธกเธต viewport meta เนเธฅเนเธง

### Broken links

เธ•เนเธญเธเธ•เธฃเธงเธเธเนเธณเนเธเธ automated เน€เธเธดเนเธกเน€เธ•เธดเธก เนเธ”เธขเน€เธเธเธฒเธฐ:

- nav links เนเธ `components/navbar.html`
- links เธเธฒเธ card detail rich content
- external links เธ—เธตเนเธขเธฒเธงเธซเธฃเธทเธญ encode เนเธฅเนเธง

### HTML structure

เธเธธเธ”เธ—เธตเนเธ•เนเธญเธเน€เธเนเธฒเธฃเธฐเธงเธฑเธ:

- เธซเธเนเธฒ detail เน€เธเธขเธกเธตเธเธฑเธเธซเธฒเนเธชเธ”เธ raw HTML เน€เธเนเธ text เธ•เธญเธเธเธตเนเธเธงเธฃเธ—เธ”เธชเธญเธเธเนเธณเธ”เนเธงเธขเธเนเธญเธกเธนเธฅเธเธฃเธดเธ
- `api-docs.html` เน€เธเนเธเนเธเธฅเนเนเธซเธเนเนเธฅเธฐเธกเธต inline code เธเธงเธฃเนเธขเธเธเธฒเธ production navigation เธซเธฒเธเนเธกเนเธ•เนเธญเธเธเธฒเธฃเน€เธเธดเธ”เธชเธฒเธเธฒเธฃเธ“เธฐ

### Responsive

เน€เธเธขเธ•เธฃเธงเธเธ”เนเธงเธข browser เธ—เธตเน 1200px เนเธฅเธฐ 320px เธซเธฅเธฑเธเธเธฃเธฑเธ Bootstrap เนเธฅเนเธงเธเธฅเนเธ”เธขเธฃเธงเธกเนเธเนเธเธฒเธเนเธ”เน

เธเธงเธฃเน€เธเธดเนเธก matrix:

- 320px mobile narrow
- 375px mobile common
- 768px tablet
- 1200px desktop
- 1440px desktop wide

### Images

เธเนเธญเธเธงเธฃเธ•เธฃเธงเธ:

- เธ—เธธเธ `<img>` static เธ•เนเธญเธเธกเธต `alt`
- dynamic image เธ•เนเธญเธเธกเธต fallback alt
- เนเธเน `loading="lazy"` เธเธฑเธเธฃเธนเธเธ—เธตเนเนเธกเนเนเธเน hero/first viewport

### Accessibility

เธเธงเธฃเธ—เธณเธ•เนเธญ:

- เน€เธเธฅเธตเนเธขเธ clickable div เน€เธเนเธ semantic links/buttons
- เน€เธเธดเนเธก keyboard focus state เธ—เธตเนเธเธฑเธ”เน€เธเธ
- เน€เธเธดเนเธก active navigation state
- เธ•เธฃเธงเธ color contrast

## 11. Backend Agent Checklist

### Error handling

เธชเธ–เธฒเธเธฐ:

- routes เนเธเน try/catch เนเธฅเธฐ `handleRouteError`
- global error handler เธเนเธญเธ internal details

เธเธงเธฃเน€เธเธดเนเธก:

- integration tests เธชเธณเธซเธฃเธฑเธ 400/401/403/404/500
- เนเธกเน log sensitive fields

### Input validation

เธชเธ–เธฒเธเธฐ:

- POST/PUT routes validate input เนเธฅเนเธง
- category, id, slug, URL เนเธฅเธฐ HTML content เธ–เธนเธ validate/sanitize

เธเธงเธฃเน€เธเธดเนเธก:

- schema-based validation เน€เธเนเธ Zod/Joi เธซเธฒเธเธฃเธฐเธเธเนเธ•เธเธถเนเธ
- unique slug validation

### Auth middleware

เธชเธ–เธฒเธเธฐ:

- admin write routes เธ–เธนเธเธเธฃเธญเธเธ”เนเธงเธข `adminAuth`

เธเธงเธฃเน€เธเธดเนเธก:

- tests เธเธญเธ middleware
- custom claims เน€เธเนเธ source of truth เธฃเธฐเธขเธฐเธขเธฒเธง

### HTTP status codes

เธชเธ–เธฒเธเธฐ:

- 201 create
- 404 not found
- 401 auth fail
- 403 no admin permission
- 400 validation error เธเนเธฒเธ `HttpError`

เธเธงเธฃเน€เธเธดเนเธก:

- เน€เธญเธเธชเธฒเธฃ error response เธ—เธตเนเน€เธเนเธเธกเธฒเธ•เธฃเธเธฒเธเน€เธ”เธตเธขเธงเธเธฑเธเธ—เธธเธ endpoint

## 12. Code Quality Assessment

เธเนเธญเธ”เธต:

- frontend เนเธขเธเนเธเธฅเน JS เธ•เธฒเธกเธซเธเนเธฒเธ—เธตเน
- backend เนเธขเธ routes, middleware, utils เธเธฑเธ”เน€เธเธ
- validation/sanitization เธญเธขเธนเนเธจเธนเธเธขเนเธเธฅเธฒเธ
- เนเธกเนเธกเธต bundler เธ—เธณเนเธซเน onboarding เธเนเธฒเธข

เธเนเธญเธเธงเธฃเธเธฃเธฑเธ:

- เธเธทเนเธญ README เธกเธตเธเธงเธฒเธกเนเธกเนเธชเธกเนเธณเน€เธชเธกเธญเธเธฒเธเธชเธ–เธฒเธเธฐ git เธ—เธตเนเนเธชเธ”เธ `Readme.md` เนเธ•เนเนเธ directory เธกเธต `README.md` เธเธงเธฃ normalize casing
- เธขเธฑเธเธกเธต inline JS เนเธ HTML เธ—เธณเนเธซเนเนเธขเธ concern เนเธกเนเธชเธธเธ”
- `api-docs.html` เนเธซเธเนเธกเธฒเธ เธญเธฒเธเนเธขเธเนเธ docs folder เธซเธฃเธทเธญ generate เธเธฒเธ source
- เธเธงเธฃเธกเธต `.env.example` เธเธฑเนเธ backend เธ—เธตเน sync เธเธฑเธ env เธเธฃเธดเธ
- เธเธงเธฃเน€เธเธดเนเธก lint/format script
- เธเธงเธฃเน€เธเธดเนเธก route tests เนเธกเนเนเธเนเธกเธตเน€เธเธเธฒเธฐ validation tests

เธเธฑเธเธเนเธเธฑเธเธ—เธตเนเธเธงเธฃเธเธฑเธเธ•เธฒ:

- sanitizer เนเธ `backend/utils/validation.js` เธกเธต logic เธขเธฒเธงเนเธฅเธฐเธชเธณเธเธฑเธ เธเธงเธฃเธกเธต tests เธเธฃเธญเธเธเธฅเธธเธกเน€เธเธดเนเธก
- renderer เธเธฑเนเธ `frontend/js/card-detail.js` เธเธงเธฃเธกเธต regression tests เธชเธณเธซเธฃเธฑเธ malicious HTML

## 13. Performance Assessment

เธเนเธญเธ”เธต:

- Static frontend เนเธซเธฅเธ”เน€เธฃเนเธงเนเธฅเธฐเธเนเธฒเธข
- เนเธกเนเธกเธต bundle เธเธเธฒเธ”เนเธซเธเน
- API client เธกเธต timeout
- backend body limit เธเนเธงเธขเธฅเธ” abuse

เธเธงเธฒเธกเน€เธชเธตเนเธขเธ:

- Bootstrap/CDN/font external เธญเธฒเธเธเธฃเธฐเธ—เธ first load เนเธฅเธฐ availability
- `GET /api/cards` เธ”เธถเธเธ—เธฑเนเธเธซเธกเธ”เนเธฅเธฐ order by `createdAt`
- `GET /api/laws/:category` เธ”เธถเธเธ—เธฑเนเธเธซเธกเธงเธ” เนเธกเนเธกเธต pagination
- เธขเธฑเธเนเธกเนเธกเธต caching headers เธชเธณเธซเธฃเธฑเธ API read
- เนเธกเนเธกเธต image optimization pipeline

เธเธณเนเธเธฐเธเธณ:

- เน€เธเธดเนเธก pagination/cursor เน€เธกเธทเนเธญเธเนเธญเธกเธนเธฅเน€เธฃเธดเนเธกเน€เธเธดเธ 50-100 เธฃเธฒเธขเธเธฒเธฃเธ•เนเธญ collection
- เธ•เธฑเนเธ `Cache-Control` เธชเธณเธซเธฃเธฑเธ public read เธ—เธตเนเน€เธเธฅเธตเนเธขเธเนเธกเนเธเนเธญเธข
- เนเธเน `loading="lazy"` เธเธฑเธเธฃเธนเธเธ—เธตเนเธญเธขเธนเนเธเธญเธ viewport
- self-host Bootstrap/font เธ–เนเธฒเธ•เนเธญเธเธเธฒเธฃเธฅเธ” external dependency
- เธ•เธฃเธงเธ Firestore indexes เธชเธณเธซเธฃเธฑเธ query เธ—เธตเนเนเธเน `where + orderBy`

## 14. Deployment Readiness

### เธชเธดเนเธเธ—เธตเนเธเธฃเนเธญเธก

- Frontend static deploy เนเธ”เน
- `frontend/vercel.json` เธกเธต security headers เนเธฅเธฐ rewrite `/` เนเธ `home.html`
- Backend เธกเธต `npm start` เนเธฅเธฐ `npm test`
- Firestore rules เธกเธตเนเธเธงเธ—เธฒเธเธเธดเธ” direct client access
- Backend เนเธเน env variables เนเธ—เธ service account file

### เธชเธดเนเธเธ—เธตเนเธ•เนเธญเธเธ•เธฑเนเธเธเนเธญเธ production

Backend env:

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://your-frontend-domain.example
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
ADMIN_EMAILS=admin@example.com
```

Frontend config:

```js
window.API_CONFIG = {
  baseUrl: "https://your-backend-domain.example",
  timeoutMs: 4000
};
```

Firebase:

- deploy `firestore.rules`
- set authorized domains
- verify Firebase Auth provider
- rotate service account key เธซเธฒเธเน€เธเธข expose
- เธ•เธฃเธงเธ IAM permission เธเธญเธ service account เนเธซเนเธเธณเธเธฑเธ”เธ—เธตเนเธชเธธเธ”เน€เธ—เนเธฒเธ—เธตเนเธ—เธณเนเธ”เน

Vercel/static hosting:

- เธ•เธฃเธงเธ CSP `connect-src`
- เธ•เธฃเธงเธ CDN allowlist
- เธ•เธฃเธงเธ route rewrite
- เธเธดเธเธฒเธฃเธ“เธฒเธเธดเธ”เธซเธฃเธทเธญเธเธณเธเธฑเธ”เธเธฒเธฃเน€เธเนเธฒเธ–เธถเธ `api-docs.html` เธซเธฒเธเนเธกเนเธ•เนเธญเธเธเธฒเธฃเน€เธเธดเธ” public

## 15. Testing Assessment

### เธ—เธ”เธชเธญเธเธ—เธตเนเธกเธต

Backend:

- `npm test` เนเธ `backend`
- เนเธเน `node --test tests/*.test.js`
- validation tests เธเนเธฒเธ 8/8 เนเธเธฃเธญเธเธ•เธฃเธงเธเธฅเนเธฒเธชเธธเธ”

Syntax check เธ—เธตเนเน€เธเธขเธ•เธฃเธงเธ:

- `frontend/js/viewer.js`
- `frontend/js/card-detail.js`
- `frontend/js/admin.js`
- `frontend/js/api.js`

Browser smoke เธ—เธตเนเน€เธเธขเธ•เธฃเธงเธ:

- home
- laws
- card detail
- consult
- admin
- desktop 1200px
- mobile 320px

### Test gaps

เธเธงเธฃเน€เธเธดเนเธก:

- Backend route integration tests
- Admin auth middleware tests
- Firestore mock tests เธซเธฃเธทเธญ emulator tests
- Frontend DOM rendering tests เธชเธณเธซเธฃเธฑเธ XSS regression
- E2E tests:
  - backend down เนเธฅเนเธง cards/laws เนเธกเนเนเธชเธ”เธ
  - backend up เนเธฅเนเธง cards/laws เนเธชเธ”เธ
  - admin login เนเธฅเนเธง create/update/delete เธชเธณเน€เธฃเนเธ
  - malicious content เนเธกเน execute script
  - mobile layout เนเธกเนเธกเธต horizontal overflow

## 16. เธฃเธฒเธขเธเธฒเธฃเธเธงเธฒเธกเน€เธชเธตเนเธขเธเนเธเธเธเธฑเธ”เธฅเธณเธ”เธฑเธ

| Priority | เธเธฃเธฐเน€เธ”เนเธ | เธเธฅเธเธฃเธฐเธ—เธ | เธเธณเนเธเธฐเธเธณ |
|---|---|---|---|
| P0 | Service account key เน€เธเธขเธซเธฅเธธเธ”เธซเธฃเธทเธญเธขเธฑเธเนเธกเน rotate | เธ–เธนเธเนเธเนเน€เธเนเธฒเธ–เธถเธ Firebase/GCP เนเธ”เน | revoke/rotate เนเธฅเธฐ scan git history |
| P0 | Production env/CORS/API URL เธขเธฑเธเนเธกเนเธขเธทเธเธขเธฑเธ | เน€เธงเนเธเน€เธฃเธตเธขเธ backend เนเธกเนเนเธ”เน เธซเธฃเธทเธญเน€เธเธดเธ” origin เธเธงเนเธฒเธเน€เธเธดเธ | เธ•เธฑเนเธ `ALLOWED_ORIGINS` เนเธฅเธฐ `API_CONFIG` |
| P0 | Firestore rules เธ•เนเธญเธ deploy เธเธฃเธดเธ | client เธญเธฒเธเธญเนเธฒเธ/เน€เธเธตเธขเธเธ•เธฃเธเนเธ”เนเธ–เนเธฒ rules เน€เธเนเธฒเธขเธฑเธเธญเธขเธนเน | deploy rules เนเธฅเธฐ verify |
| P1 | CSP เธขเธฑเธเนเธเน `'unsafe-inline'` | CSP hardening เธขเธฑเธเนเธกเนเธชเธกเธเธนเธฃเธ“เน | เธขเนเธฒเธข inline JS เนเธ external files |
| P1 | เนเธกเนเธกเธต E2E tests | regression เธซเธฅเธธเธ”เธเนเธฒเธข | เน€เธเธดเนเธก Playwright/TestSprite smoke |
| P1 | เนเธกเนเธกเธต health endpoint | monitor backend เธขเธฒเธ | เน€เธเธดเนเธก `/api/health` |
| P1 | เนเธกเนเธกเธต pagination | Firestore reads เนเธ•เนเธฅเธฐเธเนเธฒ | เน€เธเธดเนเธก limit/cursor |
| P2 | CDN dependency | เน€เธงเนเธเธเธถเนเธ external asset | เน€เธเธดเนเธก SRI เธซเธฃเธทเธญ self-host |
| P2 | clickable div/inline handlers | accessibility เนเธฅเธฐ CSP เธญเนเธญเธ | เนเธเน semantic links/buttons |
| P2 | docs/api page เนเธซเธเน | maintain เธขเธฒเธ | เนเธขเธ docs เธซเธฃเธทเธญ generate |

## 17. Roadmap เนเธเธฐเธเธณ

### Phase A: Production hardening

เธฃเธฐเธขเธฐเน€เธงเธฅเธฒเนเธเธฐเธเธณ: 1-2 เธงเธฑเธ

เธเธฒเธ:

- rotate/revoke Firebase service account key
- scan secrets เธ—เธฑเนเธ working tree เนเธฅเธฐ git history
- เธขเธทเธเธขเธฑเธ `.gitignore`, `.env.example`, env variables
- deploy Firestore rules
- เธ•เธฑเนเธ `ALLOWED_ORIGINS`
- เธ•เธฑเนเธ frontend `API_CONFIG` เธชเธณเธซเธฃเธฑเธ production
- เน€เธเธดเนเธก `/api/health`
- เธ•เธฃเธงเธ CSP `connect-src`

เธเธฅเธฅเธฑเธเธเน:

- เธฅเธ”เธเธงเธฒเธกเน€เธชเธตเนเธขเธ P0
- เธเธฃเนเธญเธก smoke test เธเธ staging

### Phase B: CSP/XSS cleanup

เธฃเธฐเธขเธฐเน€เธงเธฅเธฒเนเธเธฐเธเธณ: 1-2 เธงเธฑเธ

เธเธฒเธ:

- เธขเนเธฒเธข inline scripts เธญเธญเธเธเธฒเธ HTML
- เน€เธเธฅเธตเนเธขเธ inline `onclick` เน€เธเนเธ `addEventListener`
- เน€เธเธฅเธตเนเธขเธ navbar loader เนเธซเนเนเธกเนเธ•เนเธญเธเนเธเน `innerHTML` เธซเธฃเธทเธญเนเธเน static include strategy เธ—เธตเนเธเธงเธเธเธธเธกเนเธ”เน
- เธ–เธญเธ” `script-src 'unsafe-inline'`
- เน€เธเธดเนเธก XSS regression tests

เธเธฅเธฅเธฑเธเธเน:

- CSP เนเธเนเธเธเธถเนเธ
- เธฅเธ” surface XSS เน€เธเธดเนเธกเน€เธ•เธดเธก

### Phase C: Test coverage

เธฃเธฐเธขเธฐเน€เธงเธฅเธฒเนเธเธฐเธเธณ: 2-3 เธงเธฑเธ

เธเธฒเธ:

- เน€เธเธดเนเธก backend route tests
- เน€เธเธดเนเธก admin auth tests
- เน€เธเธดเนเธก frontend smoke/E2E tests
- เน€เธเธดเนเธก TestSprite scenarios เธเธฒเธ PRD
- เน€เธเธดเนเธก CI command เธชเธณเธซเธฃเธฑเธ test

เธเธฅเธฅเธฑเธเธเน:

- regression เธ•เนเธณเธฅเธ
- เธชเนเธเธ•เนเธญเธ—เธตเธก test เนเธ”เนเธกเธฑเนเธเนเธเธเธถเนเธ

### Phase D: UX เนเธฅเธฐ accessibility polish

เธฃเธฐเธขเธฐเน€เธงเธฅเธฒเนเธเธฐเธเธณ: 1-2 เธงเธฑเธ

เธเธฒเธ:

- เน€เธเธฅเธตเนเธขเธ clickable cards เน€เธเนเธ `<a>`
- เน€เธเธดเนเธก active nav state
- เธ•เธฃเธงเธ contrast
- เธ•เธฃเธงเธ focus/keyboard flow
- เธ•เธฃเธงเธ mobile safe area เธเธญเธเธเธธเนเธก LINE

เธเธฅเธฅเธฑเธเธเน:

- เน€เธงเนเธเนเธเนเธเนเธฒเธขเธเธถเนเธ
- เธเนเธฒเธ accessibility basic checklist เธ”เธตเธเธถเนเธ

### Phase E: Scalability เนเธฅเธฐ performance

เธฃเธฐเธขเธฐเน€เธงเธฅเธฒเนเธเธฐเธเธณ: 2-4 เธงเธฑเธ

เธเธฒเธ:

- pagination/cursor
- cache headers
- Firestore indexes
- lazy images
- asset strategy
- request logging/monitoring

เธเธฅเธฅเธฑเธเธเน:

- เธฃเธญเธเธฃเธฑเธเธเนเธญเธกเธนเธฅเธกเธฒเธเธเธถเนเธ
- เธเนเธฒ Firestore reads เธเธธเธกเนเธ”เนเธ”เธตเธเธถเนเธ

## 18. Definition of Ready เธเนเธญเธเน€เธเธดเธ”เนเธเนเธเธฒเธเธเธฃเธดเธ

เธเธงเธฃเธเนเธฒเธ checklist เธเธตเนเธเนเธญเธ production:

- `npm test` backend เธเนเธฒเธ
- route smoke tests เธเนเธฒเธ
- frontend เน€เธเธดเธ”เนเธ”เนเธ—เธตเน 320px, 768px, 1200px เนเธ”เธขเนเธกเนเธกเธต horizontal overflow
- backend production เธกเธต `ALLOWED_ORIGINS`
- frontend production เธเธตเน backend URL เธเธฃเธดเธ
- Firestore rules deploy เนเธฅเนเธงเนเธฅเธฐ client direct access เธ–เธนเธ deny
- Firebase service account key เธเธฑเธเธเธธเธเธฑเธเนเธกเนเน€เธเธขเธ–เธนเธ commit
- Firebase authorized domains เธ–เธนเธเธ•เนเธญเธ
- admin login/write เธ—เธ”เธชเธญเธเธชเธณเน€เธฃเนเธ
- public read เธ—เธ”เธชเธญเธเธชเธณเน€เธฃเนเธ
- backend down เนเธฅเนเธง frontend เนเธกเนเนเธชเธ”เธเธเนเธญเธกเธนเธฅเธเธฅเธญเธกเธซเธฃเธทเธญ error raw
- CSP เนเธกเน block asset เธ—เธตเนเธเธณเน€เธเนเธ
- เนเธกเนเธกเธต secret เนเธ repo เธซเธฃเธทเธญ deployment logs

## 19. เธชเธฃเธธเธเธชเธ–เธฒเธเธฐเธเธฑเธเธเธธเธเธฑเธ

เนเธเธฃเน€เธเธเธญเธขเธนเนเนเธเธชเธ–เธฒเธเธฐเธ”เธตเธชเธณเธซเธฃเธฑเธ local development เนเธฅเธฐ staging smoke test เนเธเธฃเธเธชเธฃเนเธฒเธเธ—เธตเนเนเธซเน frontend เธ•เนเธญเธเธเนเธฒเธ backend เธเนเธญเธเธญเนเธฒเธ/เน€เธเธตเธขเธ Firestore เธ–เธนเธเธงเธฒเธเธ–เธนเธเธ—เธฒเธเนเธฅเนเธง เนเธฅเธฐเธเธฒเธ XSS เธ—เธตเนเธชเธณเธเธฑเธเธ–เธนเธเธฅเธ”เธเธงเธฒเธกเน€เธชเธตเนเธขเธเนเธเธกเธฒเธ

เธชเธดเนเธเธ—เธตเนเธเธงเธฃเธ—เธณเธ•เนเธญเธ—เธฑเธเธ—เธตเนเธกเนเนเธเนเธเธฒเธฃเน€เธเธดเนเธกเธเธตเน€เธเธญเธฃเนเนเธซเธกเน เนเธ•เนเน€เธเนเธเธเธฒเธฃเธเธดเธ”เธเนเธญเธ production readiness:

1. rotate/verify secrets
2. deploy เนเธฅเธฐ verify Firestore rules
3. เธ•เธฑเนเธ production env/CORS/API config
4. เน€เธเธดเนเธก health endpoint เนเธฅเธฐ smoke tests
5. เธ—เธณ CSP cleanup เน€เธเธทเนเธญเธฅเธ”เธเธฒเธฃเธเธถเนเธ `'unsafe-inline'`

เธซเธฅเธฑเธเธเธดเธ” 5 เธเนเธญเธเธตเน เธฃเธฐเธเธเธเธฐเธเธฃเนเธญเธกเธเธถเนเธเธกเธฒเธเธชเธณเธซเธฃเธฑเธเธเธณเนเธเธ—เธ”เธชเธญเธเธเธฃเธดเธเนเธฅเธฐเน€เธ•เธฃเธตเธขเธกเน€เธเธดเธ”เนเธเนเธเธฒเธ
