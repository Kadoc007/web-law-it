import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import lawRoutes from "./routes/lawRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import {
  createCorsOptionsDelegate,
  getVercelOrigin,
  parseOriginList,
} from "./utils/corsConfig.js";

// โหลด environment variables
dotenv.config({ path: fileURLToPath(new URL(".env", import.meta.url)) });

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const vercelOrigin = getVercelOrigin(process.env.VERCEL_URL);

// === Security Middleware ===
app.set("trust proxy", 1);

// Helmet — ตั้ง HTTP security headers อัตโนมัติ
app.use(helmet());

// CORS — จำกัดเฉพาะ origins ที่อนุญาต
const allowedOrigins = parseOriginList(process.env.ALLOWED_ORIGINS || "");

if (isProduction && allowedOrigins.length === 0 && !vercelOrigin) {
  console.error("[CORS] production ต้องตั้งค่า ALLOWED_ORIGINS หรือ VERCEL_URL ก่อนเริ่ม server");
  throw new Error("ALLOWED_ORIGINS or VERCEL_URL is required in production");
}

app.use(cors(createCorsOptionsDelegate({
  configuredOrigins: allowedOrigins,
  isProduction,
  vercelOrigin,
})));

// Rate Limiting — จำกัดจำนวน requests ต่อ IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 100, // จำกัด 100 requests ต่อ IP ต่อ 15 นาที
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "คำขอมากเกินไป กรุณาลองใหม่ภายหลัง" },
});
app.use(limiter);

// Body Parser
app.use(express.json({ limit: "10kb" })); // จำกัดขนาด body เพื่อป้องกัน abuse

// === Routes ===
app.use("/api/laws", lawRoutes);
app.use("/api/cards", cardRoutes);
app.use("/laws", lawRoutes);
app.use("/cards", cardRoutes);

app.get("/", (req, res) => {
  res.send("Computer Law API is running");
});

app.get("/api", (req, res) => {
  res.send("Computer Law API is running");
});

// === Global Error Handler ===
app.use((err, req, res, _next) => {
  console.error("[Server Error]", err.message);
  const status = Number.isInteger(err.status) ? err.status : 500;
  const payload = {
    message: status === 403 && err.code === "cors-origin-denied"
      ? "Origin ไม่ได้รับอนุญาต"
      : "เกิดข้อผิดพลาดภายในระบบ",
  };

  if (err.code) payload.errorCode = err.code;
  if (err.code === "cors-origin-denied") payload.context = "CORS";

  res.status(status).json(payload);
});

function isDirectRun() {
  if (!process.argv[1]) return false;
  return import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
}

// === Start Server ===
if (isDirectRun()) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
