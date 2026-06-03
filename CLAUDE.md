# CLAUDE.md — WEB-LAW Project

## Project Overview
Thai IT Law information portal. Frontend: static HTML/JS/CSS deployed on Vercel.
Backend: Express.js + Firebase Admin (currently unused in production).
Database: Firebase Firestore. Auth: Firebase Authentication.

## Tech Stack
- Frontend: Vanilla HTML/CSS/JavaScript (no framework)
- Backend: Node.js + Express 5 (ES Modules)
- Database: Firebase Firestore
- Auth: Firebase Authentication
- Deployment: Vercel (frontend only)

## Project Structure
- `frontend/` — Static website files (HTML, CSS, JS)
- `backend/` — Express.js API (currently not deployed)
- `frontend/components/` — Shared HTML fragments (navbar)
- `frontend/js/` — Page-specific JavaScript
- `frontend/css/` — Page-specific stylesheets

## Key Patterns
- Navbar loaded via fetch() into each page
- Firebase client SDK used directly (not through backend)
- Admin panel uses Firebase Auth for login, then direct Firestore writes
- All pages are standalone HTML files (no SPA routing)

## Important Warnings
- NEVER commit API keys or service account keys
- firebase-config.js contains hardcoded Firebase config — should use env vars
- admin.js uses implicit DOM globals (elements referenced by ID as variables)
- pageContent field in cards collection contains raw HTML — must sanitize

## Commands
- Backend: `cd backend && node server.js` (runs on port 3000)
- Frontend: Use VS Code Live Server (port 5501)

## Firestore Structure
- `law/{category}/items/{id}` — Law entries (section, title, description, penalty)
- `cards/{id}` — Content cards (title, subtitle, description, imageUrl, slug, pageContent, category)

## Coding Conventions
- Comments may be in Thai — preserve them
- Use ES modules in backend (type: "module" in package.json)
- Frontend uses global script tags (no module system yet)
- All user-facing text is in Thai
