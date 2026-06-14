const LAW_FIELD_KEYS = Object.freeze({
  SECTION: "section",
  TITLE: "title",
  DESCRIPTION: "description",
  PENALTY: "penalty",
});

const rawLawCategoryConfig = {
  computer: {
    id: "computer",
    label: "กฎหมายคอมพิวเตอร์",
    viewerLabel: "กฎหมายคอมพิวเตอร์",
    fields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
      LAW_FIELD_KEYS.PENALTY,
    ],
    requiredFields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
    ],
    hiddenFields: [],
  },
  privacy: {
    id: "privacy",
    label: "กฎหมายคุ้มครองข้อมูลส่วนบุคคล",
    viewerLabel: "กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)",
    fields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
      LAW_FIELD_KEYS.PENALTY,
    ],
    requiredFields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
    ],
    hiddenFields: [],
  },
  copyright: {
    id: "copyright",
    label: "กฎหมายเกี่ยวกับการพัฒนาโครงสร้างพื้นฐานสารสนเทศให้ทั่วถึง และเท่าเทียมกัน",
    viewerLabel: "กฎหมายเกี่ยวกับการพัฒนาโครงสร้างพื้นฐานสารสนเทศให้ทั่วถึง และเท่าเทียมกัน",
    fields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
      LAW_FIELD_KEYS.PENALTY,
    ],
    requiredFields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
    ],
    hiddenFields: [],
  },
  eft: {
    id: "eft",
    label: "กฎหมายเกี่ยวกับการโอนเงินทางอิเล็กทรอนิกส์",
    viewerLabel: "กฎหมายเกี่ยวกับการโอนเงินทางอิเล็กทรอนิกส์",
    fields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
      LAW_FIELD_KEYS.PENALTY,
    ],
    requiredFields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
    ],
    hiddenFields: [],
  },
  etl: {
    id: "etl",
    label: "กฎหมายเกี่ยวกับลายมือชื่ออิเล็กทรอนิกส์",
    viewerLabel: "กฎหมายเกี่ยวกับลายมือชื่ออิเล็กทรอนิกส์",
    fields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
      LAW_FIELD_KEYS.PENALTY,
    ],
    requiredFields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
    ],
    hiddenFields: [],
  },
  eta: {
    id: "eta",
    label: "กฎหมายเกี่ยวกับธุรกรรมทางอิเล็กทรอนิกส์",
    viewerLabel: "กฎหมายเกี่ยวกับธุรกรรมทางอิเล็กทรอนิกส์",
    fields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
      LAW_FIELD_KEYS.PENALTY,
    ],
    requiredFields: [
      LAW_FIELD_KEYS.SECTION,
      LAW_FIELD_KEYS.TITLE,
      LAW_FIELD_KEYS.DESCRIPTION,
    ],
    hiddenFields: [],
  },
};

function freezeConfig(config) {
  return Object.freeze(Object.fromEntries(
    Object.entries(config).map(([key, category]) => [
      key,
      Object.freeze({
        ...category,
        fields: Object.freeze([...category.fields]),
        requiredFields: Object.freeze([...category.requiredFields]),
        hiddenFields: Object.freeze([...category.hiddenFields]),
      }),
    ])
  ));
}

export const LAW_CATEGORY_CONFIG = freezeConfig(rawLawCategoryConfig);
export const LAW_CATEGORY_IDS = Object.freeze(Object.keys(LAW_CATEGORY_CONFIG));

export function hasLawCategory(category) {
  return Object.hasOwn(LAW_CATEGORY_CONFIG, category);
}

export function getLawCategoryConfig(category) {
  return LAW_CATEGORY_CONFIG[category] || null;
}

export function listLawCategoryConfigs() {
  return Object.values(LAW_CATEGORY_CONFIG).map((category) => ({
    id: category.id,
    label: category.label,
    viewerLabel: category.viewerLabel,
    fields: [...category.fields],
    requiredFields: [...category.requiredFields],
    hiddenFields: [...category.hiddenFields],
  }));
}
