# IT Law Portal Website Prompt

## Project Overview

สร้างเว็บไซต์เผยแพร่กฎหมายด้านเทคโนโลยีสารสนเทศ (IT Law Portal) พร้อมระบบจัดการข้อมูล (Admin Dashboard)

### Technologies

* HTML5
* CSS3
* Bootstrap 5
* JavaScript ES6+
* Firebase Authentication
* Firebase Storage

### Requirements

* Responsive Design
* Desktop / Tablet / Mobile Support
* Modern UI
* Clean Architecture
* Production Ready

### Important Notes

ใช้ Firebase Storage เป็นแหล่งจัดเก็บไฟล์ PDF และรูปภาพ

ระบบรูปภาพต้องรองรับ:

* Upload รูปภาพเข้าสู่ Firebase Storage
* ใช้งานรูปภาพผ่าน URL ภายนอกได้

---

# Theme Design

## Colors

| Type      | Color   |
| --------- | ------- |
| Primary   | #0D47A1 |
| Secondary | #FFFFFF |
| Accent    | #F5F5F5 |

## Style

* Modern
* Professional
* Government Portal
* Accessibility Friendly
* Mobile First

---

# Public Pages

## Home Page

### Components

* Sticky Navbar
* Hero Banner
* Search Box
* Featured Laws
* Latest Articles
* Auto Sliding Knowledge Cards
* Footer

### Features

* Search Laws
* Responsive Layout
* Smooth Animation
* Quick Access Sections

---

## Laws Page

### Features

* List All Laws
* Search by Name
* Filter by Category
* Pagination
* View Detail
* Download PDF

### Data

* Title
* Category
* Description
* Content
* PDF URL
* Publish Date

---

## Knowledge Cards Page

### Features

* Card Grid Layout
* Image
* Title
* Description
* Read More

### Categories

* PDPA
* Cyber Security
* Computer Crime Act
* Digital Law
* Technology Law

---

## Law Detail Page

### Components

* Law Title
* Cover Image
* Full Content
* Embedded PDF Viewer
* Related Articles
* Share Buttons

---

# Navigation Bar

Sticky Header

### Menu

* Home
* Laws
* Knowledge Cards
* Contact
* Admin Login

### Mobile

* Hamburger Menu

---

# Auto Sliding Cards

Requirements

* Auto Slide
* Infinite Loop
* Responsive
* Hover Animation
* Click to Open Detail

Display

* Image
* Title
* Description

---

# Admin Dashboard

## Authentication

Use Firebase Authentication

### Features

* Login
* Logout
* Session Persistence

---

## Dashboard Overview

Display Statistics

* Total Laws
* Total Knowledge Cards
* Total Categories
* Recent Updates

---

# Law Management

## CRUD Operations

### Create

Fields

* Title
* Category
* Description
* Content
* PDF File

### Update

Edit All Fields

### Delete

Delete Selected Record

### Upload

Store PDF Files in Firebase Storage

---

# Knowledge Card Management

## CRUD Operations

### Create

Fields

* Title
* Image Upload
* Image URL
* Short Description
* Content
* Category

### Update

Edit Card Information

### Delete

Delete Card

---

# Image Support

## Option 1: Upload Image

Upload image to Firebase Storage

Example:

```javascript
const imageRef = ref(storage, `images/cards/${file.name}`);
await uploadBytes(imageRef, file);
const imageUrl = await getDownloadURL(imageRef);
```

---

## Option 2: External URL

Use external image URL

Example:

```text
https://example.com/image.jpg
https://images.unsplash.com/photo-123456
```

---

## URL Validation

```javascript
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

---

## Display Logic

```javascript
imageElement.src = card.imageUrl;
```

รองรับทั้ง Firebase Storage URL และ External URL

---

# Firebase Services

## Firebase Authentication

Used For:

* Admin Login
* Session Management

---

## Firebase Storage

Used For:

* Images
* PDF Files

---

# Data Structure

## laws

```json
{
  "id": "",
  "title": "",
  "category": "",
  "description": "",
  "content": "",
  "pdfUrl": "",
  "createdAt": "",
  "updatedAt": ""
}
```

---

## cards

```json
{
  "id": "",
  "title": "",
  "imageUrl": "",
  "shortDescription": "",
  "content": "",
  "category": "",
  "createdAt": "",
  "updatedAt": ""
}
```

---

## categories

```json
{
  "id": "",
  "name": "",
  "createdAt": ""
}
```

---

# Auto ID Generation

Do not allow users to input IDs manually.

Generate IDs automatically.

Example:

```javascript
const id = crypto.randomUUID();
```

Requirements

* Auto Generate ID
* Success Notification
* Refresh Table Automatically
* Display Generated ID
* Redirect After Save

---

# Firebase SDK

Use Firebase Modular SDK (v9+)

Do NOT use Firebase Compat SDK

```javascript
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
```

---

# Storage Structure

```text
storage/
│
├── pdfs/
│   └── law-files/
│
└── images/
    └── cards/
```

---

# Responsive Requirements

## Desktop

* Full Layout

## Tablet

* Adaptive Grid

## Mobile

* Single Column Layout
* Hamburger Menu
* Touch Friendly Interface

---

# UI Requirements

Use Bootstrap 5 Components

### Components

* Navbar
* Cards
* Carousel
* Modal
* Forms
* Tables
* Alerts
* Toast Notifications

### Animations

* Hover Effects
* Fade In
* Smooth Scroll
* Card Transition

---

# Project Structure

```text
project/
│
├── index.html
├── laws.html
├── law-detail.html
├── cards.html
│
├── admin/
│   ├── dashboard.html
│   ├── laws.html
│   ├── cards.html
│   └── login.html
│
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── firebase.js
│   │   ├── laws.js
│   │   ├── cards.js
│   │   └── admin.js
│   └── images/
│
└── firebase/
    └── config.js
```

---

# Output Requirements

Generate complete production-ready source code including:

1. Responsive Frontend
2. Admin Dashboard
3. Firebase Authentication
4. Firebase Storage Integration
5. Image Upload System
6. External Image URL Support
7. URL Validation
8. PDF Management
9. Bootstrap 5 UI
10. Auto Generated IDs
11. Search System
12. Filter System
13. Mobile Friendly Design
14. Clean Folder Structure
15. Ready for Deployment
