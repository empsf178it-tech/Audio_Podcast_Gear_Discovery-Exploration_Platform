# AUDIOVAULT — Audio Podcast Gear Discovery & Exploration Platform

**Tagline:** Hear Better. Create Better.

AUDIOVAULT is a premium, lightweight, dark-themed audio gear discovery and exploration platform designed specifically for podcasters, voice talent, and studio engineers.

---

## 🚀 Technology Stack

- **HTML5** — Semantic, accessible markup with Open Graph SEO metadata
- **CSS3** — Custom design system, custom CSS variables, dark technology theme
- **Vanilla JavaScript (ES6+)** — Modular client-side interactivity without heavy frameworks
- **Bootstrap 5 CDN** — Used strictly for responsive layout grids and utility containers

---

## 📁 File & Directory Structure

```text
/
├── index.html            # Homepage (Hero, Categories, Featured Gear, Interactive Setup Builder, Noise Guide)
├── products.html         # Products Discovery (Filters, Instant Search, 15 Product Cards, Comparison Drawer)
├── product-detail.html   # Product Detail (Gallery, 360° Spin Viewer, Spec Sheet, Comparison, Use Cases)
├── guides.html           # Guides Knowledge Hub (6 Articles, Noise Control Simulator, Studio Layout Diagram)
├── warranty.html         # Warranty Registration (Instant Demo Pass Generator & Status Panel)
│
├── assets/
│   ├── css/
│   │   └── style.css     # Master Dark Theme Custom CSS System
│   ├── js/
│   │   └── main.js       # All 12 Client Interactive Controller Functions
│   └── images/
│       └── 1.jpg ... 55.jpg  # Visual Audio Asset Library
│
└── README.md
```

---

## 🖼️ Image Usage & Uniqueness Mapping

Targeted and achieved **>90% unique image placements** across 40–50+ total usages:

- **Homepage (`index.html`)**:
  - Hero: `30.jpg` (Dark studio table)
  - Categories: `1.jpg` (Microphones), `11.jpg` (Headphones), `21.jpg` (Interfaces), `23.jpg` (Mixers), `24.jpg` (Recorders), `52.jpg` (Accessories)
  - Featured Gear: `7.jpg`, `2.jpg`, `11.jpg`, `25.jpg`, `28.jpg`, `23.jpg`
  - Setup Builder: `7.jpg`, `21.jpg`, `11.jpg`, `54.jpg`
  - Why Sound Quality Changes: `38.jpg` (Room), `6.jpg` (Pattern), `18.jpg` (Monitoring)
  - Noise Control: `37.jpg`

- **Products Catalog (`products.html`)**:
  - Hero: `35.jpg`
  - 15 Product Cards: `7.jpg`, `2.jpg`, `1.jpg`, `5.jpg`, `6.jpg`, `11.jpg`, `14.jpg`, `15.jpg`, `25.jpg`, `22.jpg`, `23.jpg`, `26.jpg`, `28.jpg`, `54.jpg`, `55.jpg`

- **Product Detail (`product-detail.html`)**:
  - Main & Gallery: `7.jpg`, `2.jpg`, `1.jpg`, `6.jpg`
  - 360 Spin Viewer: Frame sequence `1.jpg`, `2.jpg`, `5.jpg`, `6.jpg`, `8.jpg`, `9.jpg`
  - Use Cases: `33.jpg` (Solo), `31.jpg` (Interview), `32.jpg` (Studio Production)

- **Guides (`guides.html`)**:
  - Hero: `44.jpg`
  - 6 Articles: `13.jpg`, `39.jpg`, `16.jpg`, `17.jpg`, `12.jpg`, `41.jpg`
  - Room Layout Diagram: `46.jpg`

- **Warranty (`warranty.html`)**:
  - Hero: `55.jpg`

---

## ✨ Features Implemented

1. **Dark Theme Consistency**: Continuous `#0B0F12` background, elevated `#161D22` card surfaces, and cyan `#22D3EE` / blue `#3B82F6` accents across all 5 pages.
2. **Mobile Navigation Overlay**: Below `992px`, displays only brand + hamburger toggle. All navigation items open in a full-screen blur overlay with staggered animations, close button, and Escape key handling.
3. **Product Search & Filtering**: Instant client-side search and category filtering with custom empty state.
4. **3-Product Bottom Comparison Panel**: Sticky bottom drawer allowing side-by-side comparison of up to 3 products stored in `localStorage`.
5. **Interactive 360° Hardware Spin Viewer**: Touch and drag mouse rotater with angle degree feedback.
6. **Noise Reduction Level Simulator**: Interactive FFT sound wave bar visualization responding to ambient noise slider.
7. **Instant Demo Warranty Generator**: Validates purchase details and creates unique registration IDs (e.g. `AV-2026-48271`).

---

## 🌐 Running Locally

To launch a local HTTP development server:

```bash
# Using Python builtin server
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.
