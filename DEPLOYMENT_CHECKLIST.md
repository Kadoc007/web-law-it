# Deployment Checklist

## Required Before Production

- Rotate and revoke any Firebase service account key that was previously exposed.
- Confirm `backend/serviceAccountKey.json` is absent from the workspace and remove it from git history if it was ever committed.
- Create `backend/.env` from `backend/.env.example`.
- Set `NODE_ENV=production` for backend production runtime.
- Set `ALLOWED_ORIGINS` to the exact deployed frontend origins.
- Set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in backend secrets.
- Set admin authorization with Firebase custom claim `admin: true` or `ADMIN_EMAILS`.

## Backend

- Run `npm test` from `backend/`.
- Start backend with production environment variables.
- Confirm health check returns `Computer Law API is running`.
- Confirm public endpoints work:
  - `GET /api/laws/computer`
  - `GET /api/cards`
  - `GET /api/cards/slug/<slug>`
- Confirm admin write endpoints reject requests without `Authorization: Bearer <token>`.
- Confirm admin write endpoints accept a valid admin Firebase ID token.

## Frontend

- Set `frontend/js/api-config.js` `baseUrl` to the deployed backend URL.
- Confirm public pages do not load Firestore SDK.
- Confirm `home.html`, `index.html`, and `card-detail.html` load data from backend.
- Confirm `admin.html` can login with Firebase Auth and create/update/delete through backend.

## Firestore Rules

- Deploy rules from the repo root:

```bash
firebase deploy --only firestore:rules
```

- Confirm `firestore.rules` denies all client reads and writes.
- Confirm backend still reads and writes Firestore through Firebase Admin SDK.

## Rollback Notes

- If frontend cannot reach backend, restore the previous deployment while keeping Firestore direct writes disabled.
- If admin writes fail, check Firebase token claims, `ADMIN_EMAILS`, backend CORS, and backend env vars first.
- Do not re-enable client Firestore writes as a rollback shortcut.
