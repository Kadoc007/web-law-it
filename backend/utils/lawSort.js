const THAI_DIGITS = new Map([
  ["๐", "0"],
  ["๑", "1"],
  ["๒", "2"],
  ["๓", "3"],
  ["๔", "4"],
  ["๕", "5"],
  ["๖", "6"],
  ["๗", "7"],
  ["๘", "8"],
  ["๙", "9"],
]);

function normalizeSection(value) {
  return String(value || "")
    .replace(/[๐-๙]/g, (digit) => THAI_DIGITS.get(digit) || digit)
    .trim();
}

function getSectionParts(value) {
  const normalized = normalizeSection(value);
  const matches = normalized.match(/\d+/g);
  return matches ? matches.map((part) => Number(part)) : [];
}

export function compareLawSections(a, b) {
  const aSection = normalizeSection(a?.section);
  const bSection = normalizeSection(b?.section);
  const aParts = getSectionParts(aSection);
  const bParts = getSectionParts(bSection);

  if (aParts.length !== bParts.length && (aParts.length === 0 || bParts.length === 0)) {
    return aParts.length === 0 ? 1 : -1;
  }

  const maxLength = Math.max(aParts.length, bParts.length);
  for (let index = 0; index < maxLength; index += 1) {
    const aPart = aParts[index] ?? -1;
    const bPart = bParts[index] ?? -1;

    if (aPart !== bPart) {
      return aPart - bPart;
    }
  }

  return aSection.localeCompare(bSection, "th", {
    numeric: true,
    sensitivity: "base",
  });
}

export function sortLawsBySection(laws) {
  return [...laws].sort(compareLawSections);
}
