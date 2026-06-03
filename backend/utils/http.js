export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function handleRouteError(res, err, context) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(`[${context}]`, err.message);
  return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
}
