import admin from "firebase-admin";
import dotenv from "dotenv";

// โหลด environment variables จากไฟล์ .env
dotenv.config();

// ตรวจสอบ environment variables ที่จำเป็น
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(
    `[Firebase Admin] ❌ ขาด environment variables: ${missingVars.join(", ")}`
  );
  console.error(
    "[Firebase Admin] กรุณาสร้างไฟล์ .env ตาม .env.example"
  );
  process.exit(1);
}

// Initialize Firebase Admin ด้วย environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // แทนที่ \\n ด้วย newline จริง (dotenv อ่านเป็น string literal)
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

export const db = admin.firestore();
export const auth = admin.auth();
