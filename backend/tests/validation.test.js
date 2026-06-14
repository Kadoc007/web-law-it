import test from "node:test";
import assert from "node:assert/strict";
import {
  LAW_CATEGORY_CONFIG,
  listLawCategoryConfigs,
} from "../config/lawCategoryConfig.js";
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
import {
  createCorsOptionsDelegate,
  getRequestOrigin,
  getVercelOrigin,
  parseOriginList,
} from "../utils/corsConfig.js";
import { sortLawsBySection } from "../utils/lawSort.js";

test("law category config has unique active ids", () => {
  const categories = listLawCategoryConfigs();
  const ids = categories.map((category) => category.id);

  assert.deepEqual(ids, Object.keys(LAW_CATEGORY_CONFIG));
  assert.equal(new Set(ids).size, ids.length);
  categories.forEach((category) => {
    assert.equal(typeof category.viewerLabel, "string");
    assert.ok(category.viewerLabel.length > 0);
  });
});

test("validateCategory allows configured law categories only", () => {
  listLawCategoryConfigs().forEach((category) => {
    assert.equal(validateCategory(category.id), category.id);
  });

  assert.equal(validateCategory("computer"), "computer");
  assert.throws(() => validateCategory("unknown"), /หมวดหมู่ไม่ถูกต้อง/);
});

test("validateDocId rejects path-like values", () => {
  assert.equal(validateDocId("abc_123-xyz"), "abc_123-xyz");
  assert.throws(() => validateDocId("../secret"), /id ไม่ถูกต้อง/);
});

test("law category config keeps penalty optional for active categories", () => {
  listLawCategoryConfigs().forEach((category) => {
    assert.ok(category.fields.includes("penalty"));
    assert.equal(category.requiredFields.includes("penalty"), false);
  });
});

test("sortLawsBySection sorts numeric law sections in ascending order", () => {
  const laws = [
    { section: "มาตรา 10" },
    { section: "มาตรา 2" },
    { section: "มาตรา 1" },
    { section: "มาตรา 2/1" },
    { section: "มาตรา ๓" },
  ];

  assert.deepEqual(sortLawsBySection(laws).map((law) => law.section), [
    "มาตรา 1",
    "มาตรา 2",
    "มาตรา 2/1",
    "มาตรา ๓",
    "มาตรา 10",
  ]);
});

test("validateLawInput trims fields and keeps penalty optional", () => {
  assert.deepEqual(validateLawInput("privacy", {
    section: " 1 ",
    title: " หัวข้อ ",
    description: " รายละเอียด ",
  }), {
    section: "1",
    title: "หัวข้อ",
    description: "รายละเอียด",
    penalty: "",
  });

  assert.deepEqual(validateLawInput("computer", {
    section: " 2 ",
    title: " Topic ",
    description: " Detail ",
    penalty: " Fine ",
  }), {
    section: "2",
    title: "Topic",
    description: "Detail",
    penalty: "Fine",
  });

  assert.deepEqual(validateLawInput("copyright", {
    section: "3",
    title: "Topic",
    description: "Detail",
  }), {
    section: "3",
    title: "Topic",
    description: "Detail",
    penalty: "",
  });
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

test("cors config allows current same-origin Vercel host", async () => {
  assert.deepEqual(parseOriginList("https://a.com, https://b.com "), [
    "https://a.com",
    "https://b.com",
  ]);
  assert.equal(getVercelOrigin("web-law-it.vercel.app"), "https://web-law-it.vercel.app");

  const req = {
    headers: {
      origin: "https://web-law-it.vercel.app",
      "x-forwarded-proto": "https",
      "x-forwarded-host": "web-law-it.vercel.app",
    },
    protocol: "http",
  };

  assert.equal(getRequestOrigin(req), "https://web-law-it.vercel.app");

  const delegate = createCorsOptionsDelegate({
    configuredOrigins: [],
    isProduction: true,
    vercelOrigin: "https://web-law-it-git-main-user.vercel.app",
  });

  const options = await new Promise((resolve, reject) => {
    delegate(req, (err, corsOptions) => (err ? reject(err) : resolve(corsOptions)));
  });

  assert.deepEqual(options, { origin: true, credentials: true });
});

test("cors config rejects unknown production origins", async () => {
  const req = {
    headers: {
      origin: "https://evil.example",
      "x-forwarded-proto": "https",
      "x-forwarded-host": "web-law-it.vercel.app",
    },
    protocol: "http",
  };

  const delegate = createCorsOptionsDelegate({
    configuredOrigins: ["https://web-law-it.vercel.app"],
    isProduction: true,
  });

  await assert.rejects(
    new Promise((resolve, reject) => {
      delegate(req, (err, corsOptions) => (err ? reject(err) : resolve(corsOptions)));
    }),
    /ไม่ได้รับอนุญาต/
  );
});
