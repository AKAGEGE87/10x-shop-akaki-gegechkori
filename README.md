# 10x Shop

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg?logo=vite)](https://vitejs.dev/)

A modern, high-performance e-commerce web application built with React 19, strict TypeScript, and Tailwind CSS v4. Powered by the DummyJSON API, 10x Shop provides a seamless shopping experience with real-time search, dynamic category filtering, cart management, simulated order tracking, comprehensive dark mode, and high-standard accessibility.

🔗 **Live Demo:** [https://10x-shop-akaki-gegechkori.vercel.app](https://10x-shop-akaki-gegechkori.vercel.app) *(Placeholder / Deployment URL)*

---

## Features

### 🌟 CORE Features
- **Responsive Layout & App Shell:** Fixed navigation header with dynamic cart item counter, sticky container, and theme controls.
- **Product Catalog Grid:** Responsive grid (1 to 4 columns) with product cards displaying thumbnail, title, rating, price, and instant "Add to cart" triggers.
- **Product Details:** Dedicated route (`/products/:id`) with multi-image thumbnail gallery, live stock tracking, quantity steppers, and pricing calculations.
- **Persistent Shopping Cart:** Context-backed cart state hydrated with `localStorage`, preserving items across browser reloads.
- **Streamlined Checkout:** Form validation for shipping info (Name, Email, Address, City) with touch state tracking and instant order confirmation.
- **Mock User Authentication:** Lightweight `AuthContext` supporting login/logout with session storage persistence.
- **Custom 404 & Error Boundary:** Graceful handling of invalid product IDs, unmatched routes, and unhandled client-side runtime errors.

### 🚀 FULL & Advanced Features
- **Debounced Catalog Search:** Real-time search with a 300ms custom debounce hook (`useDebounce`) to minimize redundant network requests.
- **Dynamic Category & Sorting Filter:** Filter by category pills and sort by Price (Low/High), Rating, or Title with client-side sort fallback.
- **Abortable API Requests:** `AbortController` integration eliminating race conditions during fast typing or rapid category switching.
- **URL Query Parameter Sync:** Two-way URL synchronization (`?search=`, `?category=`, `?sort=`, `?page=`) enabling bookmarkable and shareable search states.
- **Skeleton Placeholders:** 12 pulsing skeleton cards for smooth perceived loading performance.
- **Customer Reviews & Local Submissions:** Tabbed view for product specifications and reviews, featuring average rating distribution bars and a "Write a Review" form backed by `localStorage`.
- **Related Products Recommendations:** Category-based product recommendations displaying 4 relevant items with the current product excluded.
- **OOP Cart & Order Models:** Encapsulated domain logic classes (`Cart`, `OrderModel`) paired with a strictly-typed discriminated union `cartReducer` with compile-time exhaustiveness checks.
- **Promo Code Engine:** Apply promo code `10X10` for an instant 10% discount on order subtotal.
- **Dynamic Shipping Threshold:** Free shipping for orders over $50 ($5 flat rate otherwise).
- **Order Management & Real-Time Simulation:** Order history (`/orders`) and visual order progress timeline (`/orders/:id`) with automatic status progression (`Processing` → `Shipped` → `Delivered`) every 30-60 seconds, plus a one-click "Reorder" action.
- **User Profile Management:** Controlled form for user contact details, lifetime shopping statistics, and a "Clear Local Data" storage reset utility.
- **Global Toast Notification System:** Non-intrusive stacked toast notifications with auto-dismiss (3500ms).
- **Tailwind CSS v4 Design Tokens & Dark Mode:** Native `@theme` tokens and `@custom-variant dark` providing a rich, high-contrast dark theme across all 7 views.
- **Route-Level Code Splitting:** `React.lazy()` and `<Suspense>` splitting every view into independent chunks (main entry chunk only ~89 kB gzipped).
- **React DevTools Memoization:** Profiler-verified `React.memo` and `useCallback` implementations preventing unnecessary child re-renders.
- **Accessibility & Cross-Browser Tested:** WCAG AA contrast compliance, explicit `aria-label` and `htmlFor` tags, full keyboard navigation (`Tab` / `Enter`), and zero horizontal overflow on mobile viewports (375px).

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI library utilizing hooks, concurrent features, lazy loading, and context |
| **TypeScript 5.7** | Strict type system (`noImplicitAny`, strict null checks, zero `any` usage) |
| **Vite 6** | Next-generation frontend build tooling and rapid HMR development server |
| **Tailwind CSS v4** | Utility-first CSS engine configured via CSS `@theme` tokens and custom variants |
| **React Router v7** | Client-side routing with nested layouts, dynamic params, and query state |
| **DummyJSON API** | External REST API providing product and category datasets |

---

## Architecture & Project Structure

```
10x-shop-akaki-gegechkori/
├── public/                 # Static assets & favicon
├── docs/                   # Developer documentation
│   └── progress/           # Weekly progress reports (week-1, week-2, week-3)
├── src/
│   ├── api/                # API client, custom ApiError, and product endpoints
│   │   ├── ApiClient.ts
│   │   ├── ApiError.ts
│   │   └── products.api.ts
│   ├── components/         # Modular, reusable UI components
│   │   ├── cart/           # Cart item rows, summary components
│   │   ├── layout/         # Header, Footer, Navigation
│   │   ├── product/        # ProductCard, ProductGrid, ProductReviews, Skeletons
│   │   └── ui/             # Primitives: Container, Button, Input, Select, Pagination, Toast
│   ├── context/            # React Context providers (Auth, Cart, Theme, Toast)
│   ├── hooks/              # Custom React hooks (useDebounce, useMediaQuery)
│   ├── models/             # OOP domain models (Cart, Order, StorageService)
│   ├── pages/              # Route-level views (Catalog, Product, Cart, Checkout, Orders, Profile, Login, 404)
│   ├── types/              # Domain interfaces & discriminated union action types
│   ├── utils/              # Formatting helpers (currency, date, discount)
│   ├── App.tsx             # Root router with React.lazy and Suspense boundaries
│   ├── ErrorBoundary.tsx   # Top-level React error boundary component
│   ├── index.css           # Tailwind v4 theme configuration & dark mode variant
│   └── main.tsx            # Application entrypoint
├── COMPATIBILITY.md        # Cross-browser & responsive QA verification matrix
├── DEBUG-LOG.md            # Documented real issues (Symptom -> Root Cause -> Fix -> Takeaway)
├── REPORT.md               # Final project delivery report & quantitative metrics
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Data Flow Overview
1. **API Layer (`src/api/`):** The `ApiClient` communicates with the DummyJSON endpoints, attaching `AbortSignal` for request cancellation and mapping non-200 responses to typed `ApiError` instances.
2. **State Management (`src/context/`):** State is segregated by concern across lightweight context providers (`AuthContext`, `CartContext`, `ThemeContext`, `ToastContext`).
3. **Cart Engine (`src/models/Cart.ts` & `src/context/CartContext.tsx`):** All financial computations (discounts, tax, free shipping) are encapsulated in the pure `Cart` class, driven by an immutable `cartReducer` verifying actions exhaustively.
4. **Local Persistence (`src/models/StorageService.ts`):** Cart items, orders, custom reviews, authentication sessions, and theme preferences are defensively saved and retrieved from `localStorage`.

---

## How to Run Locally

### Prerequisites
- **Node.js:** v18.0.0 or later (Node 20+ recommended)
- **npm:** v9.0.0 or later

### Installation & Startup
```bash
# 1. Clone the repository
git clone https://github.com/AKAGEGE87/10x-shop-akaki-gegechkori.git

# 2. Navigate to project root
cd 10x-shop-akaki-gegechkori

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```
Open your browser at `http://localhost:5173` to browse the store.

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches the local Vite development server with HMR |
| `npm run build` | Runs TypeScript type checking and builds optimized production bundle into `dist/` |
| `npm run preview` | Locally serves the production build from `dist/` |
| `npm run lint` | Lints the codebase with ESLint, enforcing strict React & TypeScript rules |
| `npm run typecheck` | Validates TypeScript types across the entire project with `tsc --noEmit` |

---

## Test Accounts & Credentials

The authentication system runs in mock mode for instant evaluation:
- **Username:** `emilys` (or any non-empty username)
- **Password:** `emilyspass` (any password with >= 6 characters)
- **Promo Code:** Enter `10X10` on the Cart page for a 10% discount on your order subtotal.

---

## Quality & Documentation References

- 📋 [REPORT.md](./REPORT.md) – Detailed deliverables checklist, Lighthouse metrics, and technical challenge reflections.
- 🐞 [DEBUG-LOG.md](./DEBUG-LOG.md) – 5 real issues documented according to the PRD O2 specification.
- 📱 [COMPATIBILITY.md](./COMPATIBILITY.md) – Comprehensive cross-browser (Chrome, Firefox, Edge) and device viewport (375px–1440px) matrix.
- 📅 [docs/progress/](./docs/progress/) – Weekly developer progress logs (Weeks 1, 2, and 3).

---

## Author & Credits

Developed by **Akaki Gegechkori** as part of the 10x Web Development Academy final assessment project.
- Product data provided by [DummyJSON](https://dummyjson.com/).
- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/).
