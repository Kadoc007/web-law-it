---
name: IT LAW CENTER
description: ศูนย์รวมกฎหมายด้านเทคโนโลยีสารสนเทศ ฉบับสรุปเข้าใจง่าย
colors:
  slate-deep: "#0f172a"
  slate-dark: "#1e293b"
  slate-muted: "#374151"
  slate-soft: "#64748b"
  slate-light: "#94a3b8"
  cloud-pale: "#e2e8f0"
  cloud-wash: "#f1f5f9"
  cloud-white: "#f8fafc"
  periwinkle-accent: "#667eea"
  periwinkle-deep: "#5a6fd6"
  sky-highlight: "#38bdf8"
  penalty-red: "#dc2626"
  penalty-blush: "#fef2f2"
  line-green: "#06c755"
typography:
  display:
    fontFamily: "\"TH Sarabun New\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "\"TH Sarabun New\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "\"TH Sarabun New\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "\"TH Sarabun New\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "\"Segoe UI\", system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  pill: "50px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "30px"
  xl: "40px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.periwinkle-accent}"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.periwinkle-deep}"
  button-secondary:
    backgroundColor: "{colors.cloud-wash}"
    textColor: "{colors.slate-dark}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-danger:
    backgroundColor: "{colors.penalty-red}"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  card-surface:
    backgroundColor: "{colors.cloud-white}"
    rounded: "{rounded.lg}"
    padding: "25px"
  input-default:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.slate-dark}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  nav-bar:
    backgroundColor: "{colors.slate-dark}"
    textColor: "{colors.cloud-white}"
    height: "64px"
  chip-category:
    backgroundColor: "{colors.periwinkle-accent}"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
---

# Design System: IT LAW CENTER

## 1. Overview

**Creative North Star: "ห้องสมุดกฎหมายดิจิทัล"**

ระบบดีไซน์สำหรับเว็บพอร์ทัลข้อมูลกฎหมาย IT ไทย ที่ทำให้ข้อมูลกฎหมายเข้าถึงได้ง่ายเหมือนเดินเข้าห้องสมุดที่จัดระเบียบดี: สงบ เป็นระบบ แต่มีชีวิตชีวาด้วยจุดสีที่ดึงดูดสายตาไปยังข้อมูลสำคัญ ทุกหน้าจอต้องบอกตำแหน่งและทิศทางได้ทันที

ดีไซน์ยึดโมเดลจาก Linear และ Notion: สะอาด ใช้งานได้ทันทีโดยไม่ต้องคิดมาก สารสนเทศเป็นตัวเอก ไม่ใช่การตกแต่ง ระบบนี้ปฏิเสธความรกรุงรังของเว็บราชการยุคเก่า, ปฏิเสธ Wikipedia-style ที่เป็นข้อความล้วนไม่มี visual hierarchy, และปฏิเสธการตกแต่งเกินจำเป็นที่ทำให้ดูไม่จริงจัง

**Key Characteristics:**
- ข้อมูลนำ ดีไซน์ตาม: ทุกองค์ประกอบ visual ต้องช่วยให้ผู้ใช้เข้าถึงข้อมูลเร็วขึ้น
- สีสงวน: Periwinkle accent ใช้เฉพาะจุดสำคัญ (primary action, active state, link) ไม่ใช่ตกแต่ง
- Layered depth: shadow เบาๆ สม่ำเสมอ ให้ความรู้สึก depth โดยไม่หนัก
- Thai-first typography: TH Sarabun New เป็นฟอนต์หลัก ขนาดใหญ่กว่ามาตรฐาน Latin เพื่อ readability ของอักษรไทย

## 2. Colors: ชุดสีห้องสมุดดิจิทัล

สีเป็นแบบ Restrained: พื้นหลังเป็นกลุ่ม slate-neutral ที่แตกต่างกันตาม layer ของ content พร้อม periwinkle accent ที่ถูกควบคุมให้ใช้เฉพาะจุดที่ต้องการความสนใจ

### Primary

- **Periwinkle Accent** (#667eea): สีหลักสำหรับ primary actions, active tabs, focus rings, links และ category badges ใช้เฉพาะจุดที่ต้องการดึงความสนใจ
- **Periwinkle Deep** (#5a6fd6): สำหรับ hover state ของ primary elements

### Secondary

- **Sky Highlight** (#38bdf8): โลโก้ navbar, hover state ของ nav links เป็นจุดเน้นที่สว่างกว่าบน dark surface

### Neutral

- **Slate Deep** (#0f172a): พื้นหลังมืดสุดสำหรับ law-listing pages และ code blocks สีหลักของ headings บน light surface
- **Slate Dark** (#1e293b): navbar background, hero section, dark page gradients
- **Slate Muted** (#374151): body text บน light background
- **Slate Soft** (#64748b): secondary text, separators, breadcrumb dividers
- **Slate Light** (#94a3b8): placeholder text, tertiary labels, breadcrumb links
- **Cloud Pale** (#e2e8f0): borders บน dark surface, breadcrumb titles
- **Cloud Wash** (#f1f5f9): light page backgrounds (consult, secondary surfaces)
- **Cloud White** (#f8fafc): card surfaces, primary content background

### Semantic

- **Penalty Red** (#dc2626): penalty callouts, error messages, danger actions
- **Penalty Blush** (#fef2f2): penalty callout background tint
- **LINE Green** (#06c755): LINE chatbot floating button (brand-locked, never alter)

### Named Rules

**The Periwinkle Discipline Rule.** Periwinkle accent ปรากฏบนพื้นผิวใดก็ตามไม่เกิน 10% ของ surface area ความหายากคือจุดที่ทำให้มันดึงสายตา: primary buttons, active tabs, focus rings, links ถ้าเห็น periwinkle ทุกที่ แสดงว่าใช้ผิด

## 3. Typography

**Display / Body Font:** TH Sarabun New (with Segoe UI, system-ui, sans-serif fallback)
**Label / Admin Font:** Segoe UI (with system-ui, sans-serif fallback)

**Character:** ฟอนต์ไทยที่อ่านง่ายและคุ้นเคย คู่กับ system sans-serif ที่ให้ความรู้สึกทันสมัย ขนาด body ที่ 22px (ใหญ่กว่ามาตรฐาน Latin) เพราะตัวอักษรไทยมีรายละเอียดมากกว่าและต้องการพื้นที่มากกว่าเพื่อ readability ที่ดี

### Hierarchy

- **Display** (700, 48px, 1.2): หัวข้อหลักของหน้า (h1 บน hero section, law category title) ใช้ที่ละหนึ่งต่อหน้าเท่านั้น
- **Headline** (700, 32px, 1.3): section headings, section titles (h2) เช่น "ศูนย์ช่วยเหลือ / ความรู้เพิ่มเติม"
- **Title** (700, 26px, 1.4): card headings (h3), law card titles, list item headings
- **Body** (400, 22px, 1.7): เนื้อหาหลักทุกที่ (descriptions, paragraphs, list items) Max line length 65-75ch สำหรับ prose content
- **Label** (600, 14px, 1.4, Segoe UI): ปุ่ม, form labels, badges, metadata text ในส่วน admin

### Named Rules

**The Thai-First Rule.** Body text ต้องไม่เล็กกว่า 18px บนจอใดก็ตาม รวม mobile อักษรไทยมีรายละเอียดเยอะกว่าตัวอักษรละตินและต้องการพื้นที่มากกว่า ถ้าข้อความรู้สึกเล็กเกินไป มันเล็กเกินไป

## 4. Elevation

ระบบนี้ใช้ shadow แบบ layered: surface ทุกชิ้นมี shadow เบาๆ ตั้งแต่ state ปกติ เพื่อสร้างความรู้สึก depth ที่สม่ำเสมอ ให้ข้อมูลรู้สึกเหมือน "ลอย" เหนือ background อย่างเบาๆ เหมือนหน้ากระดาษในห้องสมุด ไม่ใช่ flat design ที่ทุกอย่างติดพื้น แต่ก็ไม่หนักจนเงาเด่นกว่าเนื้อหา

### Shadow Vocabulary

- **Ambient Rest** (`box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)`): สำหรับ card surfaces ใน state ปกติ depth เพียงพอให้รู้ว่าเป็น surface แยก
- **Ambient Hover** (`box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18)`): เมื่อ hover บน card elements ลอยขึ้นเล็กน้อย feedback ที่ชัดเจน
- **Deep Hero** (`box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4)`): สำหรับ hero images, card-detail hero section เท่านั้น ใช้บน dark surface
- **Focus Ring** (`box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2)`): focus state สำหรับ inputs และ interactive elements ring สี periwinkle จางๆ

### Named Rules

**The Proportional Depth Rule.** Shadow blur ไม่เกิน 3x ของ offset-y ถ้า offset-y คือ 4px, blur ไม่เกิน 12px ถ้า shadow ดูเหมือนหมอก ไม่ใช่เงา blur มากเกินไป

## 5. Components

### Buttons

สะอาดและมั่นใจ: ปุ่มให้ feedback ชัดเจนแต่ไม่ฟุ่มเฟือย

- **Shape:** ขอบมนพอดี (10px radius)
- **Primary:** Periwinkle accent (#667eea), white text, padding 12px 20px, font-weight 600
- **Hover / Focus:** translateY(-2px) lift, deeper shadow, ไม่มี color shift ที่หนักเกินไป transition 0.25s ease
- **Secondary:** Cloud Wash (#f1f5f9) background, Slate Dark text ใช้สำหรับ cancel, secondary actions
- **Danger:** Penalty Red (#dc2626), white text, shadow สีแดงจาง สำหรับ destructive actions เท่านั้น

### Chips

- **Style:** Periwinkle accent background, white text, pill radius (50px), padding 6px 14px
- **Usage:** Category badges (help, article, resource) บน card-detail pages และ admin list items

### Cards / Containers

- **Corner Style:** มนนุ่ม (14px radius)
- **Background:** Cloud White (#f8fafc), near-opaque (rgba 0.98 บน dark backgrounds)
- **Shadow Strategy:** Ambient Rest เป็นค่าเริ่มต้น, Ambient Hover เมื่อ interactive
- **Border:** ไม่มี border ภายนอก (shadow ทำหน้าที่แยก surface)
- **Internal Padding:** 25px standard, 35px สำหรับ card-detail body

### Inputs / Fields

- **Style:** White background, 2px solid border (#e0e0e0), 10px radius
- **Focus:** Border shifts to Periwinkle (#667eea), focus ring 3px rgba(102, 126, 234, 0.2), transition 0.3s
- **Error:** Border shifts to Penalty Red
- **Disabled:** Reduced opacity, cursor not-allowed

### Navigation

- **Fixed top bar:** Slate Dark (#1e293b) background, 64px height, max-width 1200px centered content
- **Logo:** Sky Highlight (#38bdf8), ⚖️ emoji + "IT LAW CENTER", bold
- **Links:** White default, Sky Highlight on hover, 16px Segoe UI
- **Mobile:** Hamburger toggle, dropdown panel same background, stacked layout at 768px breakpoint

### Banner Slider

- **Signature component:** Full-width image carousel ที่หน้า home, 260px height, 14px radius
- **Overlay text:** Dark gradient overlay (rgba(0,0,0,0.55)) บน bottom-left, white text
- **Controls:** Circular buttons (42px), semi-transparent dark background, centered vertically
- **Transition:** opacity 0.6s crossfade, auto-slide ทุก 6 วินาที

### LINE Floating Button

- **Signature component:** Fixed position bottom-right, LINE Green (#06c755), pill shape
- **Desktop:** Icon + text label, 36px icon
- **Mobile:** Icon only, circular, 768px breakpoint
- **Animation:** Wiggle (translateX oscillation) ทุก 5 วินาที, 0.8s ease-in-out

## 6. Do's and Don'ts

### Do:

- **Do** ใช้ Periwinkle (#667eea) เฉพาะ primary actions, active states, focus rings, links เท่านั้น ไม่เกิน 10% ของ surface area
- **Do** ใช้ TH Sarabun New body text ขนาดไม่ต่ำกว่า 18px ทุก breakpoint เพื่อ readability ภาษาไทย
- **Do** ใช้ shadow แบบ layered สม่ำเสมอ: ทุก card surface มี ambient shadow ตั้งแต่ rest state
- **Do** ใช้ semantic color สำหรับ state: Penalty Red สำหรับ error/danger เท่านั้น, Periwinkle สำหรับ interactive elements เท่านั้น
- **Do** ใช้ transition 150-250ms สำหรับ state changes ผู้ใช้ต้องการคำตอบเร็ว ไม่ใช่ดู animation
- **Do** ทดสอบ contrast ratio ≥ 4.5:1 สำหรับ body text ทุกครั้ง (WCAG AA)
- **Do** ใช้ Cloud Wash (#f1f5f9) หรือ Cloud White (#f8fafc) สำหรับ content backgrounds ไม่ใช่ #fff หรือ #000 ตรงๆ

### Don't:

- **Don't** ใช้ border-left หนากว่า 1px เป็น colored stripe accent บน cards, list items, callouts (side-stripe pattern เป็นสิ่งต้องห้าม; ใช้ full border, background tint หรือ leading icon แทน)
- **Don't** ใช้ gradient text (background-clip: text + gradient) ใช้สีเดียว solid color เน้นด้วย weight หรือ size
- **Don't** ทำให้หน้าดูเหมือนเว็บราชการเก่า: เลย์เอาท์ล้าสมัย ตารางซ้ำซ้อน ฟอนต์เล็ก ไม่ responsive
- **Don't** ทำ Wikipedia-style ที่เป็นข้อความล้วน ไม่มี visual hierarchy ที่ช่วยนำทาง
- **Don't** ใช้ glassmorphism (backdrop-filter + transparency) เป็น default surface treatment ใช้เฉพาะกรณีที่จำเป็นจริงๆ
- **Don't** ใช้ identical card grids (icon + heading + text ซ้ำๆ) สำหรับทุก section
- **Don't** ใช้ decorative motion ที่ไม่ได้สื่อ state เปลี่ยนแปลง (no page-load choreography, no parallax)
- **Don't** ใช้ #000 หรือ #fff ตรงๆ ทุก neutral ต้อง tint เข้าหา hue ของ brand (slate family)
- **Don't** ใช้ modal เป็นทางออกแรก ลอง inline editing, progressive disclosure หรือ expand-in-place ก่อน
