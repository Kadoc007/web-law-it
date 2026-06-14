# Architecture Analysis - WEB-LAW Project

วันที่วิเคราะห์: 2026-05-20

## Executive Summary

โปรเจคนี้เป็นเว็บกฎหมาย IT แบบ static frontend + Node/Express backend + Firebase/Firestore
โดย frontend หลายหน้าดึงและเขียน Firestore โดยตรง ขณะที่ backend มี API และ admin middleware อยู่แล้วแต่ยังไม่ได้ถูกใช้เป็นเส้นทางหลักของหน้า admin

สถานะโดยรวม: ยังไม่พร้อม deploy production เพราะมี security blocking หลายจุด โดยเฉพาะ service account key ที่อยู่ใน workspace, ความเสี่ยง XSS จาก `innerHTML`, และยังไม่พบ Firebase Security Rules ใน repo

สถานะ migration ล่าสุด: เฟส 1-5 ย้าย frontend/admin ให้ผ่าน backend แล้ว, เพิ่ม backend hardening, เพิ่ม `firestore.rules`, และเพิ่ม regression tests แล้ว แต่ยังต้อง rotate/lบ service account key จริงก่อน production

## Architecture Overview

- `frontend/`: HTML/CSS/JS แบบ static pages, ใช้ Firebase compat SDK โดยตรง
- `backend/`: Express 5 API, Firebase Admin SDK, Helmet, CORS, rate limit
- Data store: Firestore collections `law/{category}/items` และ `cards`
- Admin flow ปัจจุบัน: `frontend/js/admin.js` login ด้วย Firebase Auth แล้วเขียน Firestore โดยตรง
- Backend admin flow ที่มีอยู่: `adminAuth` ตรวจ Firebase ID token/custom claims/`ADMIN_EMAILS`

## Blocking Findings

### S1 - Firebase service account key อยู่ใน workspace

สถานะล่าสุด: ลบ `backend/serviceAccountKey.json` ออกจาก workspace แล้ว แต่ยังต้อง rotate/revoke key เดิม และล้าง git history ถ้าเคย commit

เดิมไฟล์ `backend/serviceAccountKey.json` มี service account private key จริงอยู่ใน workspace แม้ `.gitignore` จะกัน `backend/serviceAccountKey.json` แล้วก็ตาม

ผลกระทบ:
- ถ้าเคย commit หรือหลุดออกนอกเครื่อง ต้องถือว่า key ถูก compromise แล้ว
- ผู้ถือ key สามารถใช้สิทธิ์ Firebase Admin SDK ได้ตาม permission ของ service account

หลักฐาน:
- `backend/serviceAccountKey.json:2` ระบุชนิด `service_account`
- `backend/serviceAccountKey.json:4` มี `private_key_id`
- `backend/serviceAccountKey.json:5` มี private key จริง
- `implementation_plan.md:10` และ `วิเคราะห์สถาปัตยกรรม.md:62` ก็ระบุความเสี่ยงนี้ไว้แล้ว

คำแนะนำ:
- Rotate/revoke service account key ทันทีใน Google Cloud Console
- ลบไฟล์จริงออกจาก workspace และเก็บเฉพาะ `serviceAccountKey.example.json`
- ตรวจและล้าง git history ถ้าไฟล์เคยถูก commit
- ใช้ environment variables ตาม `backend/firebaseAdmin.js:9-31`

### S1 - XSS จาก HTML ที่มาจาก Firestore

หลายจุด render ข้อมูล Firestore ผ่าน `innerHTML` โดยตรง โดยเฉพาะ `pageContent` ที่ admin ใส่ HTML ได้

หลักฐาน:
- `frontend/js/card-detail.js:98-99` ใส่ `card.pageContent` เข้า DOM ด้วย `innerHTML`
- `frontend/admin.html:119-122` ระบุว่า field นี้รองรับ HTML
- `frontend/home.html:196-201` interpolate `card.title`, `card.subtitle`, `card.description`, `imageUrl` เข้า template HTML
- `frontend/js/viewer.js:50` render `law.section`, `law.title`, `law.description`, `penalty` ผ่าน `div.innerHTML`
- `frontend/js/admin.js:108` และ `frontend/js/admin.js:255` render admin list ด้วย `innerHTML +=`

ผลกระทบ:
- ผู้ที่เขียน Firestore ได้ หรือผู้โจมตีที่ได้สิทธิ์ admin สามารถฝัง script/event handler เพื่อขโมย token/session หรือ redirect ผู้ใช้
- ถ้า Firestore Rules เปิดกว้าง ความเสี่ยงจะสูงมากขึ้น

คำแนะนำ:
- เปลี่ยนข้อมูลทั่วไปเป็น `textContent` และสร้าง DOM node ด้วย `createElement`
- ถ้าจำเป็นต้องรองรับ HTML จริง ให้ sanitize ด้วย allowlist เช่น DOMPurify ก่อน render
- จำกัด HTML tags/attributes ที่อนุญาตใน `pageContent`

### S1 - ไม่พบ Firebase Security Rules ใน repo (Mitigated in Phase 5)

สถานะล่าสุด: เพิ่ม `firestore.rules` และ `firebase.json` แล้ว โดย rules ปิด client read/write ทั้งหมด และให้ backend Admin SDK เป็น gateway เดียว

หมายเหตุ: รายละเอียดด้านล่างเป็น finding จาก audit ก่อนเฟส 5 ซึ่งถูกแก้ด้วย rules แบบ deny-all แล้ว

ไม่พบไฟล์ `firestore.rules` หรือ rules config ที่ใช้ deploy

ผลกระทบ:
- frontend อ่าน/เขียน Firestore โดยตรง จึงต้องพึ่ง rules เป็นด่านหลัก
- backend มี `adminAuth` แต่ admin frontend ไม่ได้ใช้ backend API เป็นหลัก

หลักฐาน:
- `frontend/js/admin.js:167-182` เขียน collection `law` โดยตรง
- `frontend/js/admin.js:309-319` เขียน collection `cards` โดยตรง
- เดิม `frontend/js/firebase-config.example.js` expose `db` และ `auth` เป็น global; ตอนนี้เหลือเฉพาะ Firebase Auth แล้ว
- ค้นหา `firestore.rules`, `rules_version`, `allow read`, `allow write` แล้วไม่พบ rules จริงใน repo

คำแนะนำ:
- เพิ่ม `firestore.rules` และ deploy rules พร้อมโปรเจค
- Public read ควร allow เฉพาะ fields/path ที่ต้องใช้
- Write ควร require authenticated user และ custom claim `admin == true`
- พิจารณาให้ admin เขียนผ่าน backend API เท่านั้น แล้วปิด direct write จาก client

### S2 - CORS เปิดทุก origin เมื่อไม่ได้ตั้งค่า env (Mitigated in Phase 4)

สถานะล่าสุด: เฟส 4 เพิ่ม production guard แล้ว หาก `NODE_ENV=production` แต่ไม่ตั้ง `ALLOWED_ORIGINS` backend จะหยุดทันที

ถ้า `ALLOWED_ORIGINS` ว่าง backend จะอนุญาตทุก origin

หลักฐาน:
- `backend/server.js:21-24` อ่าน `ALLOWED_ORIGINS`
- `backend/server.js:32-37` ถ้าไม่ได้ตั้งค่า จะ `callback(null, true)`

ผลกระทบ:
- ใน production ที่ลืมตั้งค่า env จะเปิด API ให้ทุก origin เรียกได้

คำแนะนำ:
- ให้ production fail-fast ถ้า `ALLOWED_ORIGINS` ว่าง
- แยก `NODE_ENV=development` สำหรับ fallback dev เท่านั้น

## High Priority Findings

### H1 - Backend ส่ง `err.message` กลับ client หลาย route (Mitigated in Phase 4)

สถานะล่าสุด: routes ถูกปรับให้ใช้ `handleRouteError` แล้ว โดย unknown errors ส่ง generic message กลับ client และ log รายละเอียดไว้ฝั่ง server

หลักฐาน:
- `backend/routes/lawRoutes.js:29`, `58`, `100`, `147`, `175`
- `backend/routes/cardRoutes.js:18`, `29`, `43`, `67`, `81`

ผลกระทบ:
- อาจ leak รายละเอียด Firestore/index/schema/internal error

คำแนะนำ:
- ใช้ generic error message ต่อ client
- log รายละเอียดฝั่ง server เท่านั้น
- ส่งต่อ error ให้ global error handler หรือสร้าง helper `handleRouteError`

### H1 - Input validation ยังตื้นและไม่มี allowlist (Mitigated in Phase 4)

สถานะล่าสุด: เพิ่ม validation กลางสำหรับ category, doc id, field length/type, URL, slug และ sanitize `pageContent`

หลักฐาน:
- `backend/routes/lawRoutes.js:68-78` validate แค่ required fields
- `backend/routes/cardRoutes.js:36-39` validate แค่ `title`
- `backend/routes/cardRoutes.js:50-62` รับ optional fields ทุกค่าโดยไม่จำกัด type/length/format

ผลกระทบ:
- เขียน category/doc path ที่ไม่คาดคิดได้
- เก็บ HTML/URL/slug ที่เป็น payload อันตรายได้
- ข้อมูลผิดรูปอาจทำให้ frontend แตกหรือเกิด XSS

คำแนะนำ:
- เพิ่ม schema validation เช่น Zod/Joi
- allowlist category เป็น `computer`, `privacy`, `copyright`
- validate `slug`, `imageUrl`, field length และ type ทุก field

### H2 - HTML หลายหน้าไม่มี viewport meta

หลักฐาน:
- `frontend/home.html:1-11` ไม่มี `<meta name="viewport">`
- `frontend/index.html:1-12` ไม่มี `<meta name="viewport">`
- `frontend/admin.html:1-10` ไม่มี `<meta name="viewport">`
- `frontend/consult.html:1-10` ไม่มี `<meta name="viewport">`
- `frontend/card-detail.html:6` มี viewport แล้ว

ผลกระทบ:
- responsive CSS อาจไม่ทำงานถูกต้องบน mobile

คำแนะนำ:
- เพิ่ม `<meta name="viewport" content="width=device-width, initial-scale=1.0">` ทุก HTML page

### H2 - Broken local links

หลักฐาน:
- `frontend/home.html:43` link ไป `article2.html`
- `frontend/home.html:51` link ไป `article3.html`
- `frontend/home.html:219` และ `frontend/home.html:227` fallback cards ก็อ้างไฟล์เดียวกัน
- ไม่พบ `frontend/article2.html` และ `frontend/article3.html`

คำแนะนำ:
- สร้างไฟล์ปลายทางจริง หรือเปลี่ยนเป็น `card-detail.html?slug=...`

### H2 - โครงสร้าง HTML มี stray closing tag

หลักฐาน:
- `frontend/index.html:25` มี `</section>` แต่ไม่มี opening `<section>` ที่ตรงกัน

คำแนะนำ:
- ลบ closing tag นี้หรือแก้โครงสร้างให้ถูกต้อง

## Frontend Accessibility and UX Findings

- `frontend/home.html:36`, `44`, `52` มี `<img>` ใน banner ที่ไม่มี `alt`
- Link ที่ `target="_blank"` ขาด `rel="noopener noreferrer"` เช่น `frontend/index.html:27`, `frontend/home.html:100`, `frontend/consult.html:49`, `50`, `79`, `114`
- Card navigation ใช้ `<div onclick>` หลายจุด เช่น `frontend/home.html:71`, `76`, `81` ทำให้ keyboard navigation/accessibility ไม่ดีเท่า `<a>` หรือ `<button>`
- Navbar hamburger เป็น clickable div/button pattern ที่ควรตรวจ ARIA เพิ่มเติมใน `frontend/components/navbar.html`

## Performance Findings

- ยังไม่พบ `loading="lazy"` ในรูปภาพ static/dynamic
- มี inline scripts หลายจุดใน HTML ทำให้ caching/reuse ยากและต้องเปิด CSP `'unsafe-inline'`
- `innerHTML +=` ใน loop มี O(n^2) และ reparse DOM เช่น `frontend/home.html:196`, `frontend/js/admin.js:108`, `frontend/js/admin.js:255`
- Firebase compat SDK ถูกโหลดในหลายหน้าและเป็น blocking script; ควรพิจารณา `defer` หรือย้าย logic เป็น module
- `backend/node_modules` มีอยู่ใน workspace แต่ `.gitignore` กันไว้แล้ว ต้องตรวจว่าไม่ได้ถูก track ใน git

## Code Quality Findings

- มี duplication ของ navbar loader script ใน `admin.html`, `card-detail.html`, `consult.html`, `home.html`, `index.html`
- มี duplication ของ LINE floating button script ในหลายหน้า
- Logic ดึง cards ซ้ำระหว่าง `frontend/home.html`, `frontend/js/card-detail.js`, `frontend/js/admin.js`
- เพิ่ม backend validation tests แล้วในเฟส 5; ยังควรเพิ่ม API/e2e tests เพิ่มเติม
- `git status` ยังตรวจไม่ได้เพราะ repository ถูกมองเป็น dubious ownership ระหว่าง user `MSI/USER` กับ `MSI/CodexSandboxOffline`

## Existing Strengths

- `.gitignore` ครอบคลุม `.env`, service account key และ frontend config จริง
- Backend ใช้ `helmet`, `express-rate-limit`, body size limit และ CORS allowlist mechanism
- `adminAuth` รองรับ Firebase custom claims และ fallback `ADMIN_EMAILS`
- Backend แยก routes และ middleware ชัดเจน
- มี example config files ช่วย onboarding
- CSS มี media queries หลายจุด เช่น navbar, line button, main, consult, card detail, admin

## Recommended Remediation Order

1. Rotate Firebase service account key และยืนยันว่า `backend/serviceAccountKey.json` ไม่มีใน workspace/history
2. เพิ่มและ deploy Firebase Security Rules โดยล็อก write เฉพาะ admin claim
3. แก้ XSS: sanitize/เลิกใช้ `innerHTML` กับข้อมูลจาก Firestore
4. บังคับ `ALLOWED_ORIGINS` ใน production และปิด fallback allow-all
5. เปลี่ยน admin frontend ให้เรียก backend API หรืออย่างน้อยให้ Firestore Rules enforce admin claim
6. เพิ่ม backend schema validation และ generic route errors
7. แก้ viewport meta, broken links, stray tag, image alt, `rel=noopener`
8. เพิ่ม smoke tests/API tests และ lint/format checks

## Deployment Readiness

ยังไม่ควร deploy production จนกว่า S1 ทั้งหมดจะถูกแก้และยืนยันแล้ว:
- key ถูก rotate แล้ว
- ไม่มี secret ใน repo/history
- Firestore Rules ถูกเพิ่มและทดสอบ
- XSS paths ถูก sanitize หรือเปลี่ยนเป็น safe DOM rendering

## Backend Gateway Migration - Phase 1

เริ่มเฟส 1 แล้ว:

- เพิ่ม `API_CONTRACT.md` เพื่อกำหนด backend endpoints ที่ frontend ต้องย้ายไปใช้
- เพิ่ม `frontend/js/api.js` เป็น client helper กลางสำหรับเรียก backend
- เพิ่ม `frontend/js/api-config.js` และ `frontend/js/api-config.example.js` ให้มี `window.API_CONFIG.baseUrl`
- เพิ่ม backend endpoint `GET /api/cards/slug/:slug` เพื่อรองรับ flow เดิมของ `card-detail.html?slug=...`

ยังไม่ได้ย้ายหน้า public/admin ออกจาก direct Firestore ในเฟสนี้ เพื่อให้เปลี่ยนแบบคุมความเสี่ยงทีละหน้าในเฟส 2 และ 3

## Backend Gateway Migration - Phase 2

ย้าย public reads ให้ผ่าน backend แล้ว:

- `frontend/index.html` โหลด `js/api-config.js` + `js/api.js` แทน Firebase Firestore SDK
- `frontend/js/viewer.js` เปลี่ยนจาก `db.collection("law")...` เป็น `window.apiClient.laws.list(category)`
- `frontend/card-detail.html` โหลด backend API client แทน Firebase Firestore SDK
- `frontend/js/card-detail.js` เปลี่ยนการดึง card ด้วย id/slug เป็น backend API
- `frontend/home.html` โหลด `js/api-config.js` + `js/api.js` และเปลี่ยน dynamic cards จาก direct Firestore เป็น `window.apiClient.cards.list()`

ยังเหลือ direct Firestore ใน `frontend/admin.html` และ `frontend/js/admin.js` สำหรับเฟส 3

## Backend Gateway Migration - Phase 3

ย้าย admin read/write ให้ผ่าน backend แล้ว:

- `frontend/admin.html` โหลด Firebase Auth เท่านั้นสำหรับ login และโหลด `js/api-config.js` + `js/api.js` สำหรับ backend calls
- `frontend/js/admin.js` เปลี่ยน law list/create/update/delete เป็น `window.apiClient.laws.*`
- `frontend/js/admin.js` เปลี่ยน card list/get/create/update/delete เป็น `window.apiClient.cards.*`
- ทุก admin write ส่ง Firebase ID token ใน `Authorization: Bearer <token>` ผ่าน API helper
- `frontend/js/firebase-config.js` และ example เหลือเฉพาะ Firebase Auth initialization

หลังเฟสนี้ frontend ไม่ควรมี direct Firestore SDK usage เหลือใน runtime pages

## Backend Hardening - Phase 4

เริ่ม hardening ฝั่ง backend แล้ว:

- เพิ่ม `backend/utils/http.js` สำหรับ `HttpError` และ generic route error responses
- เพิ่ม `backend/utils/validation.js` สำหรับ category allowlist, doc id validation, field length/type validation, URL/slug validation, response sanitization และ HTML sanitizer แบบ allowlist
- `backend/routes/lawRoutes.js` ใช้ validation กลาง และเลิกส่ง `err.message` กลับ client
- `backend/routes/cardRoutes.js` ใช้ validation/sanitizer กลางสำหรับ cards, `pageContent` และ response ของข้อมูลเก่าใน Firestore
- `backend/server.js` เพิ่ม production guard: ถ้า `NODE_ENV=production` แต่ไม่มี `ALLOWED_ORIGINS` server จะหยุดทันที
- `backend/.env.example` เพิ่ม `NODE_ENV=development`

ข้อควรพิจารณาต่อ: sanitizer ปัจจุบันเป็น allowlist ในโค้ดเองเพราะยังไม่ได้เพิ่ม dependency ภายนอก หาก production ต้องรองรับ HTML ซับซ้อน ควรเปลี่ยนเป็นไลบรารีเฉพาะทาง เช่น `sanitize-html` หรือ DOMPurify ฝั่ง server

## Firestore Rules and Regression - Phase 5

เพิ่ม deployment guardrails แล้ว:

- เพิ่ม `firestore.rules` เพื่อปิด client read/write ทั้งหมด
- เพิ่ม `firebase.json` สำหรับ deploy Firestore rules
- เพิ่ม `backend/tests/validation.test.js` ครอบ validation, slug/id checks, URL validation, sanitizer และ legacy response sanitization
- เปลี่ยน `backend/package.json` script `test` เป็น `node --test tests/*.test.js`
- เพิ่ม `DEPLOYMENT_CHECKLIST.md` สำหรับ production rollout

ข้อควรระวัง: rules แบบ deny-all เหมาะกับสถาปัตยกรรมใหม่ที่ frontend ต้องผ่าน backend เท่านั้น ถ้ามีหน้าเก่าหรือเครื่องมือภายนอกที่ยังอ่าน Firestore โดยตรง จะต้องย้ายมาก่อน deploy rules นี้

## Cleanup and Readiness Pass

ทำความสะอาดไฟล์และ readiness เพิ่มเติมแล้ว:

- ลบ `backend/serviceAccountKey.json` ออกจาก workspace
- ลบไฟล์ frontend ที่ไม่ถูกโหลดแล้ว: `frontend/js/home.js`, `frontend/js/navbar.js`, `frontend/js/config.js`, `frontend/js/config.example.js`
- เพิ่ม `frontend/js/api-config.example.js` เพื่อแทน config template ชื่อเก่า
- อัปเดต `Readme.md`, `.gitignore`, และ `DEPLOYMENT_CHECKLIST.md` ให้ตรงกับ backend gateway architecture
- เพิ่ม viewport meta ให้ HTML หลักทุกหน้า
- แก้ลิงก์ `article2.html` และ `article3.html` ที่ไม่มีไฟล์ปลายทาง ให้ไปยัง category pages แทน
- เพิ่ม `alt` ให้ banner images ที่ขาด
- เพิ่ม `rel="noopener noreferrer"` ให้ external links ที่เปิดแท็บใหม่
- ลบ stray closing `</section>` ใน `frontend/index.html`

ผลตรวจล่าสุด:

- `npm.cmd test` ผ่าน 8 tests
- `node --check` ผ่านสำหรับ frontend/backend JS ที่เกี่ยวข้อง
- ไม่พบ direct Firestore client usage ใน `frontend/`
- ไม่พบ reference ไปไฟล์ frontend ที่ลบแล้ว

## Frontend Visual QA and Performance Cleanup - Phase 6

Completed final frontend QA and cleanup pass:

- Removed 83 generated browser profile directories from `visual-qa-screenshots`, reducing workspace noise by about 745 MB.
- Added `.gitignore` entries for future Visual QA browser profiles.
- Preserved screenshot PNG files as QA evidence.
- Added preconnect hints for Bootstrap CDN, Firebase CDN, and image CDN where used.
- Added image `decoding`, lazy loading for non-critical banner/dynamic images, and high fetch priority for primary hero images.
- Removed hidden LINE button image markup that was not visually used.
- Added reduced-motion handling for banner autoplay and LINE wiggle animation.
- Paused banner autoplay while the document is hidden.
- Added `content-visibility: auto` to below-fold dynamic content on `home.html`.
- Added moderate Vercel cache headers for `/css/*` and `/js/*`.
- Fixed duplicate `rel` attributes and a broken multiline consult link.

Validation:

- `node --check` passed for updated frontend JS files.
- `frontend/vercel.json` parses successfully.
- XSS pattern scan found no `innerHTML +=`, `insertAdjacentHTML`, inline handlers, `javascript:` URLs, `word-break: break-all`, or negative letter spacing in scoped frontend files, excluding `api-docs.html`.
- HTML scan found no duplicate `rel` attributes and no images missing `alt`, excluding `api-docs.html`.
- `backend` regression tests passed: 8/8.
- `frontend/api-docs.html` was intentionally left untouched.

## Law Field Config Foundation - Phase 1

Added the foundation for category-driven law fields without changing the current law schema:

- Added `backend/config/lawCategoryConfig.js` as the backend source of truth for active law categories.
- Current active law categories remain `computer`, `privacy`, and `copyright`.
- Moved backend law category allowlist from hardcoded `Set(["computer", "privacy", "copyright"])` to config-backed validation.
- Moved law `penalty` behavior from hardcoded `category === "privacy"` to `hiddenFields.includes("penalty")`.
- Added `GET /api/laws/config/categories` so frontend admin can read the active category config from backend.
- Updated frontend API client with `apiClient.laws.categories()`.
- Updated admin law category select to remove the duplicate `copyright` value for digital transaction law.
- Updated admin penalty visibility and save payload logic to use category config, with fallback config for offline/dev resilience.
- Kept existing law data shape unchanged: `section`, `title`, `description`, and optional/hidden `penalty` behavior by category.

Validation:

- `node --check` passed for updated backend/frontend JS files.
- Backend regression tests passed: 9/9.
- Added tests for unique active law category ids and validation of every configured category.
- Scan found no remaining `LAW_CATEGORIES` hardcode and no remaining `category === "privacy"` logic in scoped project files.
- `frontend/api-docs.html` was intentionally left untouched.

## Law Field Config - Phase 2

Implemented the first config-driven law field set for active categories:

- Active law categories now share the same editable field list: `section`, `title`, `description`, and `penalty`.
- `penalty` remains part of the schema but is optional for every active category.
- Backend `requiredFields` now only requires `section`, `title`, and `description`.
- Frontend admin fallback config now matches the backend config for all active categories.
- Admin law form now renders fields dynamically from category config instead of relying on static hardcoded inputs.
- Admin law save validation now checks required fields from config before sending to the backend.
- Admin law edit/cancel flow now works with the dynamic field renderer.
- Did not add or change `subtitle`, `imageUrl`, `slug`, or `pageContent` for law records in this phase.
- `frontend/api-docs.html` was intentionally left untouched.

Validation:

- `node --check` passed for updated backend/frontend JS files.
- Backend regression tests passed: 10/10.
- Runtime scan found no remaining `category === "privacy"`, `LAW_CATEGORIES`, `isLawFieldHidden`, or `penalty-box` references outside excluded docs/tests.

## Public Law Viewer Config - Phase 3

Moved the public law viewer toward category-driven rendering:

- Added `viewerLabel` to backend law category config so public page titles can be controlled by config without changing admin labels.
- Updated `GET /api/laws/config/categories` output to include `viewerLabel`.
- Updated `frontend/js/viewer.js` to load category config before rendering laws.
- Public law page title now uses `viewerLabel || label`.
- Public law cards now render from `fields` and `hiddenFields` instead of hardcoding all display decisions.
- `section` and `title` still render as the card heading for the current schema.
- `description` still renders as prose only when configured and present.
- `penalty` remains optional and renders only when configured and non-empty.
- Added a generic extra-field renderer for future configured law fields without changing the current law record shape.
- Did not add or change `subtitle`, `imageUrl`, `slug`, or `pageContent` for law records in this phase.
- `frontend/api-docs.html` was intentionally left untouched.

Validation:

- Backend regression tests include a contract check that every active category config exposes `viewerLabel`.
- `node --check` passed for updated backend/frontend JS files.
- Backend regression tests passed: 10/10.
- Runtime scan found no remaining hardcoded viewer title map, no old privacy branch logic, and no scoped XSS pattern matches outside excluded docs/tests.
- `frontend/api-docs.html` was intentionally left untouched.

## Config-Driven Law Scope Closeout

Final cleanup after PDF scope was removed from the roadmap:

- Kept the completed scope focused on law category config, admin dynamic law fields, and public config-driven law rendering.
- Confirmed the active law record shape remains `section`, `title`, `description`, and optional `penalty`.
- Confirmed `subtitle`, `imageUrl`, `slug`, `pageContent`, and PDF/document layout features are not part of law records in the current scope.
- Updated `TESTSPRITE_PRD.md` so automated tests target the current category config behavior and do not expect PDF features.
- Updated `API_CONTRACT.md` to document `GET /api/laws/config/categories` and the current optional `penalty` behavior.
- Updated `DEPLOYMENT_CHECKLIST.md` to include the law category config endpoint in backend smoke checks.
- `frontend/api-docs.html` was intentionally left untouched.

Current completed phases:

- Phase 1: backend law category config foundation.
- Phase 2: admin law fields driven by config, with optional `penalty`.
- Phase 3: public law viewer driven by config.

Current deferred/out-of-scope items:

- PDF layout config and PDF viewer features.
- New law record fields such as `subtitle`, `imageUrl`, `slug`, or `pageContent`.

Final cleanup validation:

- Backend regression tests passed: 10/10.
- `node --check` passed for the active admin/viewer/config/test JavaScript files.
- Runtime scan found no old `category === "privacy"` branch, no `LAW_CATEGORIES`, no old hardcoded viewer title map, and no scoped XSS render pattern matches outside excluded docs/tests.
- Direct Firestore scan found Firestore collection calls only in backend routes, not frontend runtime pages.
- Secret pattern scan found no real secret matches outside ignored example/config placeholders.
- `.gitignore` covers `.env`, backend env files, service account keys, generated Firebase frontend config, and Visual QA browser profiles.
- Markdown scan found no active PDF roadmap references beyond this closeout note marking PDF out of scope.

## Admin Card Slug UI Removal

Removed slug editing from the admin card form while keeping backend/public slug compatibility:

- Removed the `Slug` field and URL hint from `frontend/admin.html`.
- Removed `card-slug` reads/writes from `frontend/js/admin.js`.
- New cards created from the admin UI no longer send `slug`; the backend will store an empty slug value on create and the home page will link by Firestore document `id`.
- Editing old cards from the admin UI no longer overwrites an existing slug because update payloads omit `slug`.
- Existing cards and static links that already use `card-detail.html?slug=...` continue to work through `GET /api/cards/slug/:slug`.
- `frontend/api-docs.html` was intentionally left untouched.

## Conservative Code Cleanup Pass

Cleaned only code that was provably unused without removing public routes or configuration templates:

- Removed unused breadcrumb styles from `frontend/css/card-detail.css`; the current `card-detail.html` markup no longer renders breadcrumb elements.
- Removed the unused `.loading` style from `frontend/css/card-detail.css`; the detail page currently uses inline DOM error/empty states instead.
- Kept `frontend/consult.html` and `frontend/css/consult.css` because they remain a documented public route, even though navbar now uses `card-detail.html?slug=consult`.
- Kept `frontend/js/firebase-config.js` because admin Firebase Auth depends on the local ignored config file.
- Kept example config files because they are onboarding/deployment templates, not runtime dead code.
- `frontend/api-docs.html` was intentionally left untouched.

Validation:

- Local HTML `href`/`src` references for runtime pages resolve successfully.
- Backend regression tests passed: 10/10.
- `node --check` passed for active frontend JS files touched by recent work.
- Runtime XSS pattern scan found no `innerHTML +=`, `insertAdjacentHTML`, `document.write`, or `javascript:` matches in scoped runtime files.

## UI Modernization - Phase 1

Started low-risk visual modernization at the shared token/component layer:

- Updated global design tokens in `frontend/css/navbar.css` for softer shadows, shared border colors, focus ring, easing, and motion durations.
- Improved shared Bootstrap integration in `frontend/css/bootstrap-custom.css` for button alignment, hover/disabled states, form focus/disabled states, surface card borders, and interactive card hover behavior.
- Moved `.backend-required` empty/error notice styling into `bootstrap-custom.css` as a shared component.
- Removed the duplicate `.backend-required` block from `frontend/css/main.css`.
- Did not change DOM ids, API calls, backend data shape, script order, or route behavior.
- `frontend/api-docs.html` was intentionally left untouched.

Validation:

- `node --check` passed for active frontend JavaScript files.
- CSS brace check passed for updated CSS files.
- Local runtime HTML references still resolve successfully.
- Backend regression tests passed: 10/10.
- Runtime XSS scan found no `innerHTML +=`, `insertAdjacentHTML`, `document.write`, or `javascript:` matches in scoped runtime files.

## UI Modernization - Phase 2

Modernized the home page and navbar while preserving route and data behavior:

- Updated the Home hero treatment in `frontend/css/main.css` with clearer dark overlay, stable vertical sizing, improved Thai line-height, and bounded text width.
- Improved the Home banner slider as a media panel with stronger border/shadow, clearer text overlay, and better button affordance while preserving `.banner`, `.banner.active`, and `.banner-btn` selectors used by `frontend/js/home.js`.
- Removed Bootstrap `shadow-sm` from the banner container in `frontend/home.html` because it uses `!important` and would override the page-specific banner elevation.
- Improved static category cards and backend-loaded dynamic cards with consistent spacing, minimum heights, hover/active feedback, and keyboard-visible focus behavior.
- Tightened static category card spacing after visual review by removing `space-between`, reducing desktop minimum height, and using a smaller internal gap so cards with short text no longer look overly empty.
- Kept all existing Home routes intact, including `card-detail.html?slug=consult` for the consultation card.
- Polished `frontend/css/navbar.css` with a darker stable header surface, link underline states, better logo/toggle feedback, and improved mobile menu focus states.
- Did not change `NAV_ITEMS`, backend API calls, Firestore behavior, card id/slug fallback behavior, or admin law/card data fields.
- `frontend/api-docs.html` was intentionally left untouched.

Validation:

- `node --check` passed for `frontend/js/home.js` and `frontend/js/navbar-loader.js`.
- CSS brace check passed for `frontend/css/main.css`, `frontend/css/navbar.css`, and `frontend/css/bootstrap-custom.css`.
- Backend regression tests passed: 10/10.
- Runtime XSS pattern scan found no `innerHTML +=`, `insertAdjacentHTML`, or `outerHTML =` matches in scoped frontend/backend runtime files.
- Local runtime HTML references still resolve successfully, excluding `frontend/api-docs.html` per user instruction.
- Ephemeral local static server check returned HTTP 200 for `frontend/home.html`, `frontend/css/main.css`, `frontend/css/navbar.css`, `frontend/js/home.js`, and `frontend/components/navbar.html`.
- Headless Chrome screenshot/DOM capture could not complete in this environment because the Chrome GPU process exits before capture; no application code changes were made for that environment issue.

## UI Modernization - Phase 3

Modernized the law listing and card detail reading surfaces while preserving API and route behavior:

- Updated `frontend/js/viewer.js` so law list records render as semantic `article` elements instead of clickable-looking cards.
- Removed the misleading `interactive-lift` affordance from law listing cards because law records are read-only in the public listing.
- Added a class-based law empty/error notice in `viewer.js` without using `innerHTML`.
- Refined `frontend/css/index.css` for a clearer law listing hierarchy, better Thai typography, numbered read-only law cards, structured extra-field rows, penalty callouts, and mobile spacing.
- Balanced law listing cards after visual review by making the card number a compact header badge and allowing penalty callouts to span the full card width.
- Added a follow-up balance pass for Phase 3 by constraining the law list width, tightening the law card grid rhythm, capping prose line length to the design target, and centering the card-detail article column inside the reading surface.
- Added a second balance follow-up after re-checking the law card layout: removed the numbered pseudo-element entirely, returned the card to a single-column grid, and removed the paragraph max-width cap so the content and penalty callout use the available card width without leaving a large empty right side.
- Updated `frontend/js/card-detail.js` to remove inline presentation styles for empty/error states while preserving the existing id/slug loading and HTML sanitizer behavior.
- Refined `frontend/css/card-detail.css` for a more article-like reading layout: stronger hero, larger Thai body text, clearer content headings, safer long-text wrapping, responsive tables, styled `org/time/address/travel` legacy content classes, and class-based empty/error states.
- Kept `card-detail.html?slug=consult` compatibility and id-based card detail behavior intact.
- Did not change backend routes, Firestore shape, law field config, card slug/id fallback, or sanitizer allowlists.
- `frontend/api-docs.html` was intentionally left untouched.

Validation:

- `node --check` passed for `frontend/js/viewer.js` and `frontend/js/card-detail.js`.
- CSS brace check passed for `frontend/css/index.css`, `frontend/css/card-detail.css`, `frontend/css/navbar.css`, and `frontend/css/bootstrap-custom.css`.
- Backend regression tests passed: 10/10.
- Runtime XSS pattern scan found no `innerHTML +=`, `insertAdjacentHTML`, or `outerHTML =` matches in scoped frontend/backend runtime files.
- Ephemeral local static server check returned HTTP 200 for law listing/detail HTML, CSS, JS, and navbar component assets.
- Local runtime HTML references still resolve successfully, excluding `frontend/api-docs.html` per user instruction.
- Headless Chrome and Edge screenshot capture could not complete in this environment because the browser GPU/headless process failed or timed out before writing screenshots; the temporary static QA ports were confirmed closed afterward.

## UI Modernization - Phase 4

Modernized the admin surface into a clearer dashboard while preserving the existing JavaScript id contract:

- Reworked `frontend/admin.html` from one large panel into a dashboard structure with a hero summary, secure login block, admin top bar, segmented tabs, and separate form/list panels for laws and cards.
- Preserved all ids used by `frontend/js/admin.js`, including `login-box`, `admin-panel`, `category`, `law-fields`, `admin-laws`, `admin-cards`, card form ids, action button ids, and `tab-laws` / `tab-cards`.
- Replaced the old admin CSS with a focused dashboard layout in `frontend/css/admin.css`: two-column desktop workspace, single-column tablet/mobile layout, clearer section headers, consistent form controls, and better list item density.
- Styled JS-rendered `law-item` and `card-item` records without changing their render logic or API behavior.
- Kept admin tabs wired through the existing `data-admin-tab` attributes and `.tab-btn` / `.tab-content` selectors.
- Updated only one small display behavior in `frontend/js/admin.js` so the login panel returns as a grid after logout instead of falling back to block layout.
- Did not change backend routes, Firebase Auth flow, Firestore data shape, card/law validation, API clients, or `frontend/api-docs.html`.

Validation:

- `node --check` passed for `frontend/js/admin.js`.
- CSS brace check passed for `frontend/css/admin.css`.
- Admin id contract check found no missing static ids for the ids used by `admin.js`; dynamic law field ids remain generated by `renderLawFields`.
- Local `href` / `src` references in `frontend/admin.html` resolve successfully.
- Runtime XSS pattern scan found no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, or `javascript:` matches in scoped admin files.
- Backend regression tests passed: 10/10 via `npm.cmd test`.
- Ephemeral local static server check returned HTTP 200 for `frontend/admin.html`, `frontend/css/admin.css`, `frontend/js/admin.js`, `frontend/js/ui-utils.js`, and `frontend/js/constants.js`; the temporary QA port was confirmed closed afterward.

## UI Modernization - Phase 5

Completed responsive and accessibility QA for active frontend pages while continuing to exclude `frontend/api-docs.html` from edits:

- Checked active pages in scope: `home.html`, `index.html`, `card-detail.html`, `admin.html`, and `consult.html`.
- Improved WCAG AA contrast by darkening the active periwinkle token, adding an accessible LINE action token, applying the stronger LINE token to text-bearing buttons, and using a stronger red for penalty callout text.
- Added global media overflow protection for responsive media elements and strengthened keyboard focus visibility with an outline offset plus the existing focus ring.
- Added 360px-specific responsive guards for navbar, home/banner/LINE consultation card, law listing, card detail, consult page, admin dashboard, and floating LINE button. These cover the requested 320px class of devices while preserving the existing 768px and 1200px layouts.
- Added semantic admin tab accessibility with `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-controls`, and `aria-selected`, plus JS updates that keep `aria-selected` and hidden panels in sync.
- Preserved all existing admin ids used by `frontend/js/admin.js`, public routes, backend API calls, Firestore data shape, and `card-detail.html?slug=consult`.

Validation:

- `node --check` passed for `frontend/js/navbar-loader.js`, `frontend/js/admin.js`, `frontend/js/home.js`, `frontend/js/viewer.js`, and `frontend/js/card-detail.js`.
- CSS brace check passed for active frontend CSS files.
- Static accessibility audit passed for scoped active pages: viewport meta, image alt attributes, static form labels, button accessible names, local `href` / `src` references, navbar menu aria, and admin tab semantics.
- Contrast audit passed for key token pairs: body text, muted text, periwinkle text/background, LINE action text/background, danger callout, dark hero text, and sky accent on dark background. All checked pairs are at least 4.5:1.
- Static responsive audit confirmed breakpoints for 360px, 768px, 900px navbar, and 1200px container behavior across the active CSS set.
- Ephemeral local static server check returned HTTP 200 for active pages and core CSS/JS assets; the temporary QA port was confirmed closed afterward.
- Backend regression tests passed: 10/10 via `npm.cmd test`.
- Headless Chrome still cannot be used in this environment, even for a blank `data:` page, because the browser GPU/headless process times out before DOM/screenshot capture. The temporary Chrome QA profile was removed.

## UI Modernization - Phase 6

Completed cleanup and regression validation for the active frontend/backend scope:

- Reconfirmed active frontend scope as `home.html`, `index.html`, `card-detail.html`, `admin.html`, `consult.html`, shared navbar component, active CSS, and runtime JS files.
- Continued excluding `frontend/api-docs.html` from edits and Phase 6 active-page QA per user instruction. The file may still appear dirty from earlier worktree state, but it was not modified in this phase.
- No additional cleanup edits were required after the regression scans. Temporary static QA servers were stopped and the QA port was confirmed closed.
- Existing screenshot files in `visual-qa-screenshots` were inspected only as supporting stale/previous visual references; no new screenshot capture was possible in this environment.

Validation:

- Backend regression tests passed: 10/10 via `npm.cmd test`.
- `node --check` passed for runtime JS in scope: `admin.js`, `api-config.js`, `api.js`, `card-detail.js`, `constants.js`, `firebase-config.js`, `home.js`, `line-float.js`, `navbar-loader.js`, `ui-utils.js`, and `viewer.js`.
- `git diff --check` passed for active frontend files and `architecture_analysis.md`; only Windows LF/CRLF warnings were emitted.
- Runtime XSS pattern scan found no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, or `javascript:` matches in runtime scope. Matches found in `backend/tests/validation.test.js` are intentional sanitizer test payloads.
- DOM id contract check found no missing ids for active JS lookups; dynamic law field ids remain generated by `renderLawFields`.
- Local `href` / `src` reference check found no missing active-page assets.
- CSS brace integrity check passed for active CSS files.
- Static accessibility and contrast audit remained clean for active pages: viewport meta, alt text, form labels, button names, navbar aria, admin tab semantics, and checked token pairs at 4.5:1 or better.
- Ephemeral local static server check returned HTTP 200 for active pages, navbar component, key CSS assets, and key JS assets; the temporary QA port was confirmed closed afterward.
- Browser visual QA through new screenshots remains blocked because no Browser tool is available in this session and Chromium headless previously fails in this environment before DOM/screenshot capture.

## Safe Project Cleanup - 2026-06-13

Performed a non-destructive cleanup pass focused on reducing workspace noise without changing runtime behavior:

- Added `visual-qa-screenshots/` to `.gitignore` so generated visual QA PNGs no longer appear as untracked source changes. Existing files were not deleted.
- Restored `backend/.env.example` and `frontend/js/firebase-config.example.js` as placeholder templates only; no real secrets were added.
- Preserved existing dirty worktree changes and did not revert, delete, or move application source files.
- Confirmed active HTML local `href` / `src` references resolve successfully across the 5 active frontend pages.
- Confirmed `frontend/js/firebase-config.js` exists locally and remains ignored, matching the intended admin Firebase Auth setup.

Validation:

- `node --check` passed for 25 frontend/backend JavaScript files outside `node_modules`.
- Backend regression tests passed: 11/11 via `npm.cmd test`.
- Runtime XSS pattern scan found no `innerHTML`, `insertAdjacentHTML`, `document.write`, or `eval` matches in frontend/backend source.

## Admin Card Article Formatting - 2026-06-14

Added a frontend-only article-formatting helper for card page content so newly added cards can use a consistent article structure without changing the backend contract:

- Added an article helper panel in `frontend/admin.html` beside the `card-pageContent` textarea.
- Added buttons for inserting a standard article template, `h2` heading, `h3` subheading, and `strong` emphasis.
- Kept the existing `pageContent` field, card API routes, Firestore shape, and card-detail lookup behavior unchanged.
- Updated admin copy to reflect that safe basic HTML is supported and sanitized before display.
- Strengthened `frontend/css/card-detail.css` typography for card article headings and bold text so headings are visually clear and emphasis is obvious.

Validation:

- `node --check` passed for `frontend/js/admin.js` and `frontend/js/card-detail.js`.
- CSS brace check passed for `frontend/css/admin.css` and `frontend/css/card-detail.css`.
- Scoped XSS pattern scan found no new `innerHTML`, `insertAdjacentHTML`, `document.write`, `outerHTML`, `eval`, or `new Function` usage in the edited admin/card-detail files.

## Vercel Deployment Prep - 2026-06-14

Prepared the project for a single Vercel deployment from the repository root so the static frontend and Express backend can work together under one origin:

- Added root `package.json` with Vercel build script and backend runtime dependencies.
- Added root `vercel.json` to build `frontend/` into `dist/`, serve static frontend pages, keep existing security/cache headers, and expose API functions from `api/`.
- Added `scripts/build-vercel.mjs` to copy deployable frontend assets into `dist/` while excluding nested `frontend/vercel.json`.
- Added Vercel API entry files `api/index.js` and `api/[...path].js` that export the existing Express app.
- Updated `backend/server.js` to export the app for Vercel, listen only when run directly, support `/api` health checks, and support both `/api/laws`/`/api/cards` and stripped `/laws`/`/cards` paths for serverless routing compatibility.
- Updated backend dotenv loading so `backend/.env` resolves correctly regardless of current working directory.
- Updated frontend API config to use `http://localhost:3000` only on local hosts and `window.location.origin` on deployed hosts.
- Added `dist/` to `.gitignore` because it is generated by the build step.
- Updated `DEPLOYMENT_CHECKLIST.md` for root Vercel deployment and same-origin API behavior.

Validation:

- `npm.cmd run build` passed and generated active frontend HTML/JS/CSS in `dist/`.
- Backend regression tests passed: 11/11 via `npm.cmd --prefix backend test`.
- `node --check` passed for `backend/server.js`, `backend/firebaseAdmin.js`, `frontend/js/api-config.js`, and `frontend/js/api.js`.
- Vercel API entry imports passed for `api/index.js` and `api/[...path].js`.
- Local Express smoke test returned HTTP 200 for `/api` and `/api/laws/config/categories`.

## Safe Whole-Project Cleanup - 2026-06-14

Performed a conservative cleanup pass focused on files that are proven not to affect runtime behavior:

- Removed orphaned `frontend/js/api-docs.js` after `frontend/api-docs.html` had already been deleted and no active HTML/JS/CSS file referenced it.
- Kept `frontend/consult.html` and `frontend/css/consult.css` because they remain documented public routes even though navigation currently uses `card-detail.html?slug=consult`.
- Kept both frontend and backend law sort helpers because both runtimes actively use them: backend sorts API responses and frontend sorts admin/viewer rendering.
- Kept `frontend/vercel.json` for now as a legacy/static-frontend deployment fallback, while root `vercel.json` remains the current Vercel deployment path.
- Removed the generated `dist/` folder created during verification; Vercel regenerates it with `npm run build`.

Validation:

- `npm.cmd run build` passed before removing generated `dist/`.
- Backend regression tests passed: 11/11 via `npm.cmd --prefix backend test`.
- `node --check` passed for frontend/backend/API/scripts JavaScript files outside `node_modules`.
- Runtime XSS pattern scan found no `innerHTML +=`, `innerHTML =`, `insertAdjacentHTML`, `document.write`, `outerHTML`, `eval`, or `new Function` matches in active frontend/backend/API/scripts scope.
- No active runtime references to `api-docs.js` or `api-docs.html` were found outside historical documentation notes.
