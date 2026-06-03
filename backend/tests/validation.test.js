import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeCardRecord,
  sanitizeHtml,
  sanitizeLawRecord,
  validateCardInput,
  validateCategory,
  validateDocId,
  validateLawInput,
  validateSlugParam,
} from "../utils/validation.js";

test("validateCategory allows known law categories only", () => {
  assert.equal(validateCategory("computer"), "computer");
  assert.throws(() => validateCategory("unknown"), /หมวดหมู่ไม่ถูกต้อง/);
});

test("validateDocId rejects path-like values", () => {
  assert.equal(validateDocId("abc_123-xyz"), "abc_123-xyz");
  assert.throws(() => validateDocId("../secret"), /id ไม่ถูกต้อง/);
});

test("validateLawInput trims fields and requires penalty outside privacy", () => {
  assert.deepEqual(validateLawInput("privacy", {
    section: " 1 ",
    title: " หัวข้อ ",
    description: " รายละเอียด ",
  }), {
    section: "1",
    title: "หัวข้อ",
    description: "รายละเอียด",
  });

  assert.throws(() => validateLawInput("computer", {
    section: "1",
    title: "หัวข้อ",
    description: "รายละเอียด",
  }), /กรุณากรอก โทษ/);
});

test("validateCardInput normalizes safe values", () => {
  assert.deepEqual(validateCardInput({
    title: " Card ",
    imageUrl: "https://example.com/a.jpg",
    slug: "Test-Slug",
    category: "help",
    pageContent: "<p>Hello <strong>world</strong></p>",
  }), {
    title: "Card",
    subtitle: "",
    description: "",
    imageUrl: "https://example.com/a.jpg",
    slug: "test-slug",
    pageContent: "<p>Hello <strong>world</strong></p>",
    category: "help",
  });
});

test("validateCardInput rejects dangerous urls and empty update title", () => {
  assert.throws(() => validateCardInput({
    title: "Card",
    imageUrl: "javascript:alert(1)",
  }), /URL รูปภาพ/);

  assert.throws(() => validateCardInput({ title: "" }, { partial: true }), /กรุณากรอก หัวข้อ/);
});

test("validateSlugParam normalizes and validates slug params", () => {
  assert.equal(validateSlugParam("Consult-Center"), "consult-center");
  assert.throws(() => validateSlugParam("bad slug"), /slug ใช้ได้เฉพาะ/);
});

test("sanitizeHtml removes scripts, event handlers, styles, and javascript URLs", () => {
  assert.equal(
    sanitizeHtml("<p onclick='alert(1)' style='color:red'>Hi <a href='javascript:alert(1)'>x</a></p><script>alert(1)</script>"),
    "<p>Hi <a>x</a></p>"
  );
});

test("response sanitizers protect legacy Firestore records", () => {
  assert.deepEqual(sanitizeLawRecord({
    section: "<b>1</b>",
    title: "<img src=x>",
    description: "ok<script>x</script>",
  }), {
    section: "&lt;b&gt;1&lt;/b&gt;",
    title: "&lt;img src=x&gt;",
    description: "ok&lt;script&gt;x&lt;/script&gt;",
  });

  assert.deepEqual(sanitizeCardRecord({
    title: "<img src=x onerror=1>",
    imageUrl: "javascript:alert(1)",
    pageContent: "<p onclick=1>ok</p><script>x</script>",
  }), {
    title: "&lt;img src=x onerror=1&gt;",
    subtitle: "",
    description: "",
    imageUrl: "",
    slug: "",
    pageContent: "<p>ok</p>",
    category: "",
    createdAt: undefined,
    updatedAt: undefined,
  });
});
