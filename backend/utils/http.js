export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function getFirebaseErrorResponse(err) {
  if (err.code === 7 || err.code === "permission-denied") {
    return {
      status: 403,
      message: "Firebase Admin ไม่มีสิทธิ์เขียนข้อมูล กรุณาตรวจ IAM/service account",
    };
  }

  if (err.code === 3 || err.code === "invalid-argument") {
    return {
      status: 400,
      message: "รูปแบบข้อมูลไม่ถูกต้อง กรุณาตรวจค่าที่กรอกอีกครั้ง",
    };
  }

  if (err.code === 16 || err.code === "unauthenticated") {
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

  console.error(`[${context}]`, err.message);

  const firebaseError = getFirebaseErrorResponse(err);
  if (firebaseError) {
    return res.status(firebaseError.status).json({ message: firebaseError.message });
  }

  return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
}
