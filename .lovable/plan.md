

# Phoney — Premium Phone Review Platform

## Overview
A modern, feature-rich phone review and comparison platform with a sleek mixed design aesthetic (light/dark mode, glassmorphism, vibrant accents). Built with React, TypeScript, and Tailwind CSS with mock JSON data stored in the frontend.

---

## 🎨 Design System
- **Theme:** Light/dark mode toggle with preference saved to localStorage
- **Style:** Glassmorphism cards, soft shadows, vibrant gradient accents, modern typography
- **Animations:** Smooth page transitions, fade-ins, hover scales, skeleton loading states
- **Layout:** Mobile-first responsive design throughout
- **Colors:** Deep blues/purples as primary, vibrant accent colors for highlights

---

## 📦 Mock Data
Create realistic sample data for ~15-20 phones across 5 brands (Apple, Samsung, Google, OnePlus, Xiaomi) with specs, benchmark scores, images (placeholder), ratings, and tips & tricks.

---

## 🏠 Home Page
- **Hero section** with animated headline and featured phone showcase
- **Brand cards** with glassmorphism styling and hover animations
- **Sections:** Most Viewed, Most Liked, Best Value — dynamically rendered from data
- **Smart search bar** with live filtering and debounced input
- **Filters:** Price range, brand, benchmark score
- **Skeleton loading states** for all content sections
- **Smooth scroll animations** on section entry

## 📱 Brand Page
- Phone cards in a modern grid layout (newest to oldest)
- Hover animations and lazy-loaded images
- Sorting options: Price, Performance, Popularity
- Pagination controls

## 📄 Phone Details Page
- **Image gallery** with left/right slider
- **YouTube review embed** section
- **Full specs table** with clean layout
- **Benchmark visualization** using animated progress bars
- **Expandable "Tips & Tricks"** section
- **Wishlist heart button** with animation
- **Star rating system** with dynamic average display
- **Comment section** (per-user, stored in localStorage)
- **Share button** and **Compare button**
- Micro-animations and smooth transitions

---

## 🔐 Auth System
- **Register page** with real-time validation (email format, strong password checker, duplicate email check)
- **Login page** with session persistence via localStorage
- **Role-based access:** `user` and `admin` roles
- **Auto-login** on return visits
- **Protected admin routes** — redirects non-admins
- **Logout** functionality
- **Toast notifications** for all auth events
- **Input sanitization** to prevent XSS

## 👑 Admin Dashboard
- Professional dashboard layout with sidebar navigation
- **Brand management:** Add, edit, delete brands
- **Phone management:** Add, edit, delete phones with multiple image uploads, YouTube links, benchmark scores, tips & tricks
- **Phone badges:** Mark as Most Viewed / Most Liked / Best Value
- **Pricing editor**
- **Comment moderation** panel
- All changes persist to localStorage mock data

---

## ❤️ Wishlist System
- Per-user wishlist (tied to logged-in account)
- Add/remove phones with heart animation
- Dedicated wishlist page showing saved phones
- Persistent across sessions via localStorage

## ⚖️ Comparison System
- Compare 2 or 3 phones side-by-side
- Visual highlighting of better specs (green/red indicators)
- Compare: Display, CPU, GPU, RAM, Storage, Camera, Battery, Benchmark, Price
- Responsive layout that stacks on mobile
- Add-to-compare from phone cards and detail page

---

## ⚡ Extra Features
- **Toast notification system** (already available via shadcn)
- **Modal confirmation dialogs** for destructive actions
- **Back-to-top button** with smooth scroll
- **404 page** with branded design
- **Fallback image handling** for broken images
- **Clean error states** throughout
- **SEO-friendly meta tags** per page

---

## 📐 Pages & Routes
1. `/` — Home
2. `/brand/:brandId` — Brand page
3. `/phone/:phoneId` — Phone details
4. `/compare` — Comparison page
5. `/wishlist` — Wishlist (protected)
6. `/login` — Login
7. `/register` — Register
8. `/admin` — Admin dashboard (protected, admin only)
9. `/*` — 404 page

