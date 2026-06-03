# เฟส 0: แก้ไขความปลอดภัยฉุกเฉิน (วันที่ 1) ⚡

> [!CAUTION]
> **Private key ของ Firebase service account หลุดอยู่ใน repository** — ต้องแก้ไขทันที

## สรุปปัญหาที่ต้องแก้ไข

| # | ปัญหา | ระดับ | ไฟล์ |
|---|-------|-------|------|
| 1 | Private key หลุดใน git | 🔴 วิกฤต | `serviceAccountKey.json` |
| 2 | Firebase API key ไม่ได้อยู่ใน `.gitignore` | 🔴 วิกฤต | `firebase-config.js` |
| 3 | Hardcode อีเมลแอดมิน | 🔴 วิกฤต | `adminAuth.js` |
| 4 | Backend ใช้ JSON import แทน env vars | 🟠 สูง | `firebaseAdmin.js` |
| 5 | CORS เปิดกว้างทุก origin | 🟠 สูง | `server.js` |
| 6 | ไม่มี rate limiting / security headers | 🟠 สูง | `server.js` |
| 7 | ไม่มี security headers ใน Vercel | 🟡 ปานกลาง | `vercel.json` |

---

## การเปลี่ยนแปลงโค้ด (อัตโนมัติ)

### Backend

#### [MODIFY] [.gitignore](file:///d:/web%20test/.gitignore)
- เพิ่ม `frontend/js/firebase-config.js` ใน gitignore
- เพิ่ม `.env` patterns ที่ครอบคลุมมากขึ้น
- เพิ่ม `backend/.env`

#### [MODIFY] [firebaseAdmin.js](file:///d:/web%20test/backend/firebaseAdmin.js)
- เปลี่ยนจาก `require("./serviceAccountKey.json")` เป็นอ่านจาก environment variables
- ใช้ `dotenv` สำหรับโหลด `.env` file
- เพิ่ม error handling เมื่อ env vars ไม่ครบ

#### [MODIFY] [adminAuth.js](file:///d:/web%20test/backend/middleware/adminAuth.js)
- ลบ hardcode อีเมล `nattapat110803@gmail.com`
- เปลี่ยนเป็นตรวจสอบจาก Firebase Custom Claims (`admin: true`) หรือ env var `ADMIN_EMAILS`
- รองรับหลาย admin emails

#### [MODIFY] [server.js](file:///d:/web%20test/backend/server.js)
- เพิ่ม `helmet` สำหรับ security headers
- เพิ่ม `express-rate-limit` สำหรับ rate limiting
- จำกัด CORS เฉพาะ origins ที่กำหนด (จาก env var)
- ใช้ `PORT` จาก environment variable

#### [MODIFY] [package.json](file:///d:/web%20test/backend/package.json)
- แก้ `"main"` จาก `"index.js"` เป็น `"server.js"`
- เพิ่ม `"start"` script
- เพิ่ม dependencies: `dotenv`, `helmet`, `express-rate-limit`

---

### Frontend

#### [NEW] [firebase-config.example.js](file:///d:/web%20test/frontend/js/firebase-config.example.js)
- สร้างไฟล์ template สำหรับ Firebase config (ไม่มี keys จริง)

#### [MODIFY] [vercel.json](file:///d:/web%20test/frontend/vercel.json)
- เพิ่ม security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy

---

### Root

#### [NEW] [backend/.env.example](file:///d:/web%20test/backend/.env.example)
- สร้างไฟล์ template สำหรับ environment variables ที่ต้องตั้งค่า

---

## ขั้นตอนที่ต้องทำด้วยตนเอง (Manual)

> [!IMPORTANT]
> ขั้นตอนเหล่านี้ต้องดำเนินการในคอนโซลภายนอก ไม่สามารถทำอัตโนมัติได้

1. **Rotate Firebase service account key** ใน [Google Cloud Console](https://console.cloud.google.com/) → IAM → Service Accounts → สร้าง key ใหม่ → ลบ key เก่า
2. **ล้าง git history** ของ `serviceAccountKey.json`:
   ```bash
   # ติดตั้ง git-filter-repo (ถ้ายังไม่มี)
   pip install git-filter-repo
   
   # ลบไฟล์ออกจาก history ทั้งหมด
   git filter-repo --path backend/serviceAccountKey.json --invert-paths
   
   # Force push (ระวัง: จะเปลี่ยน history ของ remote)
   git push --force --all
   ```
3. **ตรวจสอบ Firebase Security Rules** ใน Firebase Console → Firestore → Rules
4. **เปิด Firebase App Check** ใน Firebase Console → App Check

---

## Verification Plan

### Automated Tests
- รัน `node backend/server.js` เพื่อตรวจว่า backend เริ่มได้ปกติกับ env vars
- ตรวจสอบ `.gitignore` ว่าครอบคลุมไฟล์ sensitive ทั้งหมด
- ตรวจสอบไม่มี hardcoded secrets ในโค้ดที่แก้ไข

### Manual Verification
- ผู้ใช้ rotate key ใน Google Cloud Console
- ผู้ใช้ตรวจ Firebase Security Rules
