# WEB-LAW Project

เว็บพอร์ทัลข้อมูลกฎหมาย IT ภาษาไทย

## Current Architecture

- Frontend: static HTML/CSS/JavaScript in `frontend/`
- Backend: Node.js + Express 5 API in `backend/`
- Database: Firebase Firestore, accessed only through backend Admin SDK
- Auth: Firebase Authentication for admin login
- Firestore client access: disabled by `firestore.rules`

## Important Runtime Flow

- Public pages call backend API through `frontend/js/api.js`
- `home.html`, `index.html`, and `card-detail.html` do not load Firestore SDK
- `admin.html` uses Firebase Auth for login only
- Admin create/update/delete calls backend with `Authorization: Bearer <Firebase ID token>`
- Backend validates and sanitizes data before writing to Firestore

## Required Local Config

Backend:

```bash
cd backend
copy .env.example .env
```

Fill these values in `backend/.env`:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ADMIN_EMAILS` or Firebase custom claim `admin: true`
- `ALLOWED_ORIGINS`

Frontend:

- `frontend/js/api-config.js` sets the backend API base URL
- `frontend/js/firebase-config.js` is required for admin Firebase Auth
- `frontend/js/firebase-config.js` is ignored by git; use `frontend/js/firebase-config.example.js` as the template

## Commands

Backend:

```bash
cd backend
npm install
npm test
npm start
```

Frontend:

Serve `frontend/` with a static file server such as VS Code Live Server.

## Firestore Rules

Rules are configured in `firestore.rules` and deployed via `firebase.json`.

```bash
firebase deploy --only firestore:rules
```

The current rules deny all client reads and writes. Backend access through Firebase Admin SDK still works.

## Security Notes

- Do not commit `.env`, service account keys, or real Firebase frontend config files.
- `backend/serviceAccountKey.json` has been removed from the workspace; rotate/revoke any key that was previously exposed.
- `pageContent` accepts limited HTML and is sanitized on backend write and read.
- Production backend must set `NODE_ENV=production` and non-empty `ALLOWED_ORIGINS`.

## Key Files

- `API_CONTRACT.md` - backend endpoint contract
- `DEPLOYMENT_CHECKLIST.md` - production rollout checklist
- `architecture_analysis.md` - audit notes and migration history
- `firestore.rules` - Firestore client access policy
- `backend/tests/validation.test.js` - validation and sanitizer regression tests
