import { HttpError } from "./http.js";
import {
  getLawCategoryConfig,
  hasLawCategory,
} from "../config/lawCategoryConfig.js";

const CARD_CATEGORIES = new Set(["", "help", "article", "resource"]);

const LAW_FIELD_SPECS = Object.freeze({
  section: { label: "มาตรา", maxLength: 80 },
  title: { label: "หัวข้อ", maxLength: 200 },
  description: { label: "รายละเอียด", maxLength: 5000 },
  penalty: { label: "โทษ", maxLength: 2000 },
});

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "a",
  "img"
]);

const SELF_CLOSING_TAGS = new Set(["br", "img"]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizePlainText(value, field, maxLength) {
  return escapeHtml(normalizeString(value, field, maxLength));
}

function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => safeCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);?/g, (_, dec) => safeCodePoint(parseInt(dec, 10)))
    .replace(/&colon;/gi, ":")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function safeCodePoint(codePoint) {
  if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
    return "";
  }
  return String.fromCodePoint(codePoint);
}

function requireObject(body) {
  if (!isPlainObject(body)) {
    throw new HttpError(400, "รูปแบบข้อมูลไม่ถูกต้อง");
  }
}

function normalizeString(value, field, maxLength, { required = false } = {}) {
  if (value === undefined || value === null) {
    if (required) throw new HttpError(400, `กรุณากรอก ${field}`);
    return "";
  }

  if (typeof value !== "string" && typeof value !== "number") {
    throw new HttpError(400, `${field} ต้องเป็นข้อความ`);
  }

  const normalized = String(value).trim();
  if (required && normalized.length === 0) {
    throw new HttpError(400, `กรุณากรอก ${field}`);
  }

  if (normalized.length > maxLength) {
    throw new HttpError(400, `${field} ยาวเกิน ${maxLength} ตัวอักษร`);
  }

  return normalized;
}

function validateOptionalUrl(value, field) {
  const normalized = normalizeString(value, field, 2048);
  if (!normalized) return "";

  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new HttpError(400, `${field} ต้องเป็น URL ที่ถูกต้อง`);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new HttpError(400, `${field} ต้องขึ้นต้นด้วย http หรือ https`);
  }

  return parsed.toString();
}

function sanitizeOptionalUrl(value, field) {
  try {
    return validateOptionalUrl(value, field);
  } catch {
    return "";
  }
}

function validateOptionalSlug(value) {
  const normalized = normalizeString(value, "slug", 100).toLowerCase();
  if (!normalized) return "";

  if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(normalized)) {
    throw new HttpError(400, "slug ใช้ได้เฉพาะ a-z, 0-9, - และ _");
  }

  return normalized;
}

export function validateSlugParam(value) {
  const normalized = validateOptionalSlug(value);
  if (!normalized) {
    throw new HttpError(400, "slug ไม่ถูกต้อง");
  }
  return normalized;
}

function sanitizeUrl(value, allowedProtocols) {
  const decoded = decodeHtmlEntities(value).trim();
  if (!decoded) return "";

  let parsed;
  try {
    parsed = new URL(decoded, "https://example.local");
  } catch {
    return "";
  }

  if (!allowedProtocols.includes(parsed.protocol)) return "";
  return decoded;
}

function sanitizeClass(value) {
  return decodeHtmlEntities(value)
    .split(/\s+/)
    .filter((token) => /^[a-zA-Z0-9_-]{1,50}$/.test(token))
    .slice(0, 8)
    .join(" ");
}

function sanitizeAttributes(tag, rawAttrs) {
  const attrs = [];
  const attrPattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+)/g;
  let match;

  while ((match = attrPattern.exec(rawAttrs)) !== null) {
    const name = match[1].toLowerCase();
    const rawValue = match[2].replace(/^["']|["']$/g, "");

    if (name.startsWith("on") || name === "style") continue;

    if (name === "class") {
      const className = sanitizeClass(rawValue);
      if (className) attrs.push(`class="${escapeHtml(className)}"`);
      continue;
    }

    if (tag === "a" && name === "href") {
      const href = sanitizeUrl(rawValue, ["http:", "https:", "mailto:", "tel:"]);
      if (href) attrs.push(`href="${escapeHtml(href)}" rel="noopener noreferrer"`);
      continue;
    }

    if (tag === "img" && name === "src") {
      const src = sanitizeUrl(rawValue, ["http:", "https:"]);
      if (src) attrs.push(`src="${escapeHtml(src)}"`);
      continue;
    }

    if ((tag === "img" && ["alt", "title"].includes(name)) || (tag === "a" && name === "title")) {
      attrs.push(`${name}="${escapeHtml(decodeHtmlEntities(rawValue).slice(0, 200))}"`);
    }
  }

  return attrs.length > 0 ? ` ${attrs.join(" ")}` : "";
}

export function sanitizeHtml(input) {
  const source = normalizeString(input, "เนื้อหา", 20000)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");

  let output = "";
  let lastIndex = 0;
  const tagPattern = /<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g;
  let match;

  while ((match = tagPattern.exec(source)) !== null) {
    output += escapeHtml(source.slice(lastIndex, match.index));

    const tag = match[1].toLowerCase();
    const isClosing = /^<\s*\//.test(match[0]);

    if (ALLOWED_TAGS.has(tag)) {
      if (isClosing) {
        if (!SELF_CLOSING_TAGS.has(tag)) output += `</${tag}>`;
      } else {
        const attrs = sanitizeAttributes(tag, match[2] || "");
        output += SELF_CLOSING_TAGS.has(tag) ? `<${tag}${attrs}>` : `<${tag}${attrs}>`;
      }
    }

    lastIndex = tagPattern.lastIndex;
  }

  output += escapeHtml(source.slice(lastIndex));
  return output;
}

export function validateCategory(category) {
  const normalized = normalizeString(category, "หมวดหมู่", 40, { required: true });
  if (!hasLawCategory(normalized)) {
    throw new HttpError(400, "หมวดหมู่ไม่ถูกต้อง");
  }
  return normalized;
}

export function validateDocId(id) {
  const normalized = normalizeString(id, "id", 128, { required: true });
  if (!/^[a-zA-Z0-9_-]+$/.test(normalized)) {
    throw new HttpError(400, "id ไม่ถูกต้อง");
  }
  return normalized;
}

export function validateLawInput(category, body) {
  requireObject(body);

  const config = getLawCategoryConfig(category);
  if (!config) {
    throw new HttpError(400, "หมวดหมู่ไม่ถูกต้อง");
  }

  const hiddenFields = new Set(config.hiddenFields);
  const requiredFields = new Set(config.requiredFields);
  const data = {};

  config.fields.forEach((field) => {
    if (hiddenFields.has(field)) return;

    const spec = LAW_FIELD_SPECS[field];
    if (!spec) return;

    data[field] = normalizeString(body[field], spec.label, spec.maxLength, {
      required: requiredFields.has(field),
    });
  });

  return data;
}

export function sanitizeLawRecord(record, category = "") {
  const config = getLawCategoryConfig(category);
  const hiddenFields = new Set(config ? config.hiddenFields : []);
  const fields = config ? config.fields : ["section", "title", "description"];
  const data = {};

  fields.forEach((field) => {
    if (hiddenFields.has(field)) return;

    const spec = LAW_FIELD_SPECS[field];
    if (!spec) return;

    data[field] = sanitizePlainText(record[field], spec.label, spec.maxLength);
  });

  if (!config && record.penalty !== undefined) {
    const spec = LAW_FIELD_SPECS.penalty;
    data.penalty = sanitizePlainText(record.penalty, spec.label, spec.maxLength);
  }

  return data;
}

export function validateCardCategory(category) {
  const normalized = normalizeString(category, "หมวดหมู่", 40);
  if (!CARD_CATEGORIES.has(normalized)) {
    throw new HttpError(400, "หมวดหมู่การ์ดไม่ถูกต้อง");
  }
  return normalized;
}

export function validateCardInput(body, { partial = false } = {}) {
  requireObject(body);

  const data = {};

  if (!partial || body.title !== undefined) {
    data.title = normalizeString(body.title, "หัวข้อ", 200, { required: true });
  }

  if (!partial || body.subtitle !== undefined) {
    data.subtitle = normalizeString(body.subtitle, "หัวข้อย่อย", 300);
  }

  if (!partial || body.description !== undefined) {
    data.description = normalizeString(body.description, "รายละเอียด", 1000);
  }

  if (!partial || body.imageUrl !== undefined) {
    data.imageUrl = validateOptionalUrl(body.imageUrl, "URL รูปภาพ");
  }

  if (!partial || body.slug !== undefined) {
    data.slug = validateOptionalSlug(body.slug);
  }

  if (!partial || body.pageContent !== undefined) {
    data.pageContent = sanitizeHtml(body.pageContent);
  }

  if (!partial || body.category !== undefined) {
    data.category = validateCardCategory(body.category);
  }

  if (partial && Object.keys(data).length === 0) {
    throw new HttpError(400, "ไม่มีข้อมูลสำหรับอัปเดต");
  }

  return data;
}

export function sanitizeCardRecord(record) {
  return {
    title: sanitizePlainText(record.title, "หัวข้อ", 200),
    subtitle: sanitizePlainText(record.subtitle, "หัวข้อย่อย", 300),
    description: sanitizePlainText(record.description, "รายละเอียด", 1000),
    imageUrl: sanitizeOptionalUrl(record.imageUrl, "URL รูปภาพ"),
    slug: sanitizePlainText(record.slug, "slug", 100),
    pageContent: sanitizeHtml(record.pageContent),
    category: sanitizePlainText(record.category, "หมวดหมู่", 40),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}
