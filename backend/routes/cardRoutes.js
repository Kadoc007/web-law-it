import express from "express";
import { db } from "../firebaseAdmin.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { handleRouteError } from "../utils/http.js";
import {
  sanitizeCardRecord,
  validateCardCategory,
  validateCardInput,
  validateDocId,
  validateSlugParam,
} from "../utils/validation.js";

const router = express.Router();

// GET /api/cards -> ดึงทุก card (optionally by category)
router.get("/", async (req, res) => {
  try {
    const category = validateCardCategory(req.query.category);
    let q = db.collection("cards").orderBy("createdAt", "desc");
    if (category) q = q.where("category", "==", category);

    const snap = await q.get();
    const cards = snap.docs.map((doc) => ({ id: doc.id, ...sanitizeCardRecord(doc.data()) }));
    res.json(cards);
  } catch (err) {
    handleRouteError(res, err, "CardRoutes:list");
  }
});

// GET /api/cards/slug/:slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const slug = validateSlugParam(req.params.slug);

    const snap = await db
      .collection("cards")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snap.empty) return res.status(404).json({ message: "Not found" });

    const doc = snap.docs[0];
    res.json({ id: doc.id, ...sanitizeCardRecord(doc.data()) });
  } catch (err) {
    handleRouteError(res, err, "CardRoutes:getBySlug");
  }
});

// GET /api/cards/:id
router.get("/:id", async (req, res) => {
  try {
    const id = validateDocId(req.params.id);
    const doc = await db.collection("cards").doc(id).get();

    if (!doc.exists) return res.status(404).json({ message: "Not found" });

    res.json({ id: doc.id, ...sanitizeCardRecord(doc.data()) });
  } catch (err) {
    handleRouteError(res, err, "CardRoutes:get");
  }
});

// POST /api/cards (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const data = {
      ...validateCardInput(req.body),
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection("cards").add(data);
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    handleRouteError(res, err, "CardRoutes:create");
  }
});

// PUT /api/cards/:id (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const id = validateDocId(req.params.id);
    const docRef = db.collection("cards").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ message: "Not found" });

    const data = {
      ...validateCardInput(req.body, { partial: true }),
      updatedAt: new Date(),
    };

    await docRef.set(data, { merge: true });
    res.json({ message: "updated" });
  } catch (err) {
    handleRouteError(res, err, "CardRoutes:update");
  }
});

// DELETE /api/cards/:id (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const id = validateDocId(req.params.id);
    const docRef = db.collection("cards").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ message: "Not found" });

    await docRef.delete();
    res.json({ message: "deleted" });
  } catch (err) {
    handleRouteError(res, err, "CardRoutes:delete");
  }
});

export default router;
