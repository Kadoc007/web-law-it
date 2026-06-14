import express from "express";
import { db } from "../firebaseAdmin.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { handleRouteError } from "../utils/http.js";
import { sortLawsBySection } from "../utils/lawSort.js";
import { listLawCategoryConfigs } from "../config/lawCategoryConfig.js";
import {
  sanitizeLawRecord,
  validateCategory,
  validateDocId,
  validateLawInput,
} from "../utils/validation.js";

const router = express.Router();

router.get("/config/categories", (req, res) => {
  res.json(listLawCategoryConfigs());
});

/**
 * GET /api/laws/:category
 * ดูกฎหมายตามหมวด
 */
router.get("/:category", async (req, res) => {
  try {
    const category = validateCategory(req.params.category);

    const snapshot = await db
      .collection("law")
      .doc(category)
      .collection("items")
      .get();

    const laws = sortLawsBySection(snapshot.docs.map((doc) => ({
      id: doc.id,
      ...sanitizeLawRecord(doc.data(), category),
    })));

    res.json(laws);
  } catch (err) {
    handleRouteError(res, err, "LawRoutes:list");
  }
});

/**
 * GET /api/laws/:category/:id
 * ดูกฎหมายรายตัว
 */
router.get("/:category/:id", async (req, res) => {
  try {
    const category = validateCategory(req.params.category);
    const id = validateDocId(req.params.id);

    const docRef = db
      .collection("law")
      .doc(category)
      .collection("items")
      .doc(id);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "ไม่พบข้อมูลกฎหมาย" });
    }

    res.json({
      id: docSnap.id,
      ...sanitizeLawRecord(docSnap.data(), category),
    });
  } catch (err) {
    handleRouteError(res, err, "LawRoutes:get");
  }
});

/**
 * POST /api/laws/:category
 * เพิ่มข้อมูล (admin เท่านั้น)
 */
router.post("/:category", adminAuth, async (req, res) => {
  try {
    const category = validateCategory(req.params.category);
    const data = validateLawInput(category, req.body);

    await db
      .collection("law")
      .doc(category)
      .collection("items")
      .add(data);

    res.status(201).json({ message: "เพิ่มข้อมูลกฎหมายสำเร็จ" });
  } catch (err) {
    handleRouteError(res, err, "LawRoutes:create");
  }
});

/**
 * PUT /api/laws/:category/:id
 * แก้ไขข้อมูล (admin เท่านั้น)
 */
router.put("/:category/:id", adminAuth, async (req, res) => {
  try {
    const category = validateCategory(req.params.category);
    const id = validateDocId(req.params.id);
    const data = validateLawInput(category, req.body);

    const docRef = db
      .collection("law")
      .doc(category)
      .collection("items")
      .doc(id);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "ไม่พบข้อมูลกฎหมาย" });
    }

    await docRef.set(data, { merge: true });

    res.json({ message: "แก้ไขข้อมูลกฎหมายสำเร็จ" });
  } catch (err) {
    handleRouteError(res, err, "LawRoutes:update");
  }
});

/**
 * DELETE /api/laws/:category/:id
 * ลบข้อมูล (admin เท่านั้น)
 */
router.delete("/:category/:id", adminAuth, async (req, res) => {
  try {
    const category = validateCategory(req.params.category);
    const id = validateDocId(req.params.id);

    const docRef = db
      .collection("law")
      .doc(category)
      .collection("items")
      .doc(id);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "ไม่พบข้อมูลกฎหมาย" });
    }

    await docRef.delete();

    res.json({ message: "ลบข้อมูลกฎหมายสำเร็จ" });
  } catch (err) {
    handleRouteError(res, err, "LawRoutes:delete");
  }
});

export default router;
