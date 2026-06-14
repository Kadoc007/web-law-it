export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function getErrorCode(err) {
  return err && err.code !== undefined ? String(err.code) : "";
}

function getNormalizedErrorCode(err) {
  return getErrorCode(err).toLowerCase().replace(/_/g, "-");
}

function getFirebaseErrorResponse(err) {
  const code = getNormalizedErrorCode(err);

  if (code === "7" || code === "permission-denied") {
    return {
      status: 403,
      message: "Firebase Admin ไม่มีสิทธิ์เขียนข้อมูล กรุณาตรวจ IAM/service account",
    };
  }

  if (code === "3" || code === "invalid-argument") {
    return {
      status: 400,
      message: "รูปแบบข้อมูลไม่ถูกต้อง กรุณาตรวจค่าที่กรอกอีกครั้ง",
    };
  }

  if (code === "5" || code === "not-found") {
    return {
      status: 404,
      message: "ไม่พบข้อมูลที่ต้องการแก้ไข",
    };
  }

  if (code === "9" || code === "failed-precondition") {
    return {
      status: 409,
      message: "Firestore ยังไม่พร้อมสำหรับคำขอนี้ กรุณาตรวจ index หรือสถานะฐานข้อมูล",
    };
  }

  if (code === "16" || code === "unauthenticated") {
    return {
      status: 401,
      message: "Firebase Admin authentication ไม่สมบูรณ์ กรุณาตรวจ environment variables",
    };
  }

  return null;
}

export function handleRouteError(res, err, context) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  const errorCode = getErrorCode(err) || err?.name || "unknown";
  console.error(`[${context}]`, errorCode, err.message);

  const firebaseError = getFirebaseErrorResponse(err);
  if (firebaseError) {
    return res.status(firebaseError.status).json({
      message: firebaseError.message,
      errorCode,
      context,
    });
  }

  return res.status(500).json({
    message: "เกิดข้อผิดพลาดภายในระบบ",
    errorCode,
    context,
  });
}
