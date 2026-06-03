import admin from "firebase-admin";

/**
 * Admin Authentication Middleware
 * ตรวจสอบ Firebase ID Token และสิทธิ์แอดมิน
 *
 * รองรับ 2 วิธีตรวจสอบ (เรียงตามลำดับความสำคัญ):
 * 1. Firebase Custom Claims — ถ้า token มี claim `admin: true`
 * 2. Environment Variable — ถ้าอีเมลอยู่ใน ADMIN_EMAILS (.env)
 */
export async function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "ไม่พบ token การยืนยันตัวตน" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    // วิธีที่ 1: ตรวจ Firebase Custom Claims
    if (decoded.admin === true) {
      req.user = decoded;
      return next();
    }

    // วิธีที่ 2: ตรวจจาก ADMIN_EMAILS ใน environment variable
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0);

    if (adminEmails.length === 0) {
      console.error(
        "[AdminAuth] ❌ ไม่ได้ตั้งค่า ADMIN_EMAILS ใน .env และไม่มี custom claims"
      );
      return res.status(500).json({ message: "ระบบยังไม่ได้ตั้งค่าสิทธิ์แอดมิน" });
    }

    if (!adminEmails.includes(decoded.email?.toLowerCase())) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์แอดมิน" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("[AdminAuth] AUTH ERROR:", err.message);
    res.status(401).json({ message: "การยืนยันตัวตนล้มเหลว" });
  }
}
