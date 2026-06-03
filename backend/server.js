import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import lawRoutes from "./routes/lawRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";

// โหลด environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// === Security Middleware ===

// Helmet — ตั้ง HTTP security headers อัตโนมัติ
app.use(helmet());

// CORS — จำกัดเฉพาะ origins ที่อนุญาต
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

if (isProduction && allowedOrigins.length === 0) {
  console.error("[CORS] production ต้องตั้งค่า ALLOWED_ORIGINS ก่อนเริ่ม server");
  process.exit(1);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // อนุญาต requests ที่ไม่มี origin เช่น Postman หรือ server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.length === 0) {
        console.warn(
          "[CORS] ALLOWED_ORIGINS ยังไม่ได้ตั้งค่า — อนุญาตทุก origin เฉพาะ dev mode"
        );
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} ไม่ได้รับอนุญาต`));
    },
    credentials: true,
  })
);

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

app.get("/", (req, res) => {
  res.send("Computer Law API is running");
});

// === Global Error Handler ===
app.use((err, req, res, _next) => {
  console.error("[Server Error]", err.message);
  res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
