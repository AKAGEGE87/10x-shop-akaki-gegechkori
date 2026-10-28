# 10x Shop - Project Final Report (D3)

**Author:** Akaki Gegechkori  
**Repository:** [10x-shop-akaki-gegechkori](https://github.com/AKAGEGE87/10x-shop-akaki-gegechkori)  
**Date:** October 2026  

---

## 1. Planned vs. Delivered Feature Checklist

| Module / Requirement | Scope | Status | Notes |
| :--- | :---: | :---: | :--- |
| **React Fundamentals (P0 - P7)** | | | |
| P0.1 Responsive Layout Shell & Navigation | CORE | ✓ Delivered | Header, Footer, Container, NavLinks |
| P0.2 User Authentication State & Mock Login | CORE | ✓ Delivered | `AuthContext`, localStorage session persistence |
| P0.3 Notification / Toast Feedback System | FULL | ✓ Delivered | `ToastContext`, auto-dismiss (3.5s), stacked toasts |
| P0.4 Global Theme Switcher (Dark/Light) | FULL | ✓ Delivered | `ThemeContext`, root `.dark` sync, header toggle |
| P1.0 Product Catalog Grid & Dynamic Route | CORE | ✓ Delivered | 1/2/3/4-col grid, `/products/:id` navigation |
| P2.1 Search with 300ms Debounce | FULL | ✓ Delivered | `useDebounce`, instant UI response, input reset |
| P2.2 Dynamic Category Filtering | FULL | ✓ Delivered | Category pills, "All" pill, active state |
| P2.3 Sorting Options & Client Fallback | FULL | ✓ Delivered | Price Low/High, Rating, Title A-Z |
| P2.4 Pagination (12 items per page) | FULL | ✓ Delivered | First, Prev, Page numbers, Next, Last |
| P2.5 URL Query Parameter Synchronization | FULL | ✓ Delivered | `useSearchParams` 2-way sync (`search`, `category`, `page`, `sort`) |
| P2.6 Skeleton Loaders & AbortController | FULL | ✓ Delivered | 12 pulsing cards, race condition cancellation |
| P3.1 Multi-image Gallery & Stock Stepper | CORE | ✓ Delivered | Thumbnail selector, main image preview, stock clamp |
| P3.2 Product Description & Reviews Tabs | FULL | ✓ Delivered | Tab switcher, rating breakdown bars |
| P3.3 Customer Review Form & Storage | FULL | ✓ Delivered | Review validation, `localStorage` persistence |
| P3.4 Category Breadcrumb Link | FULL | ✓ Delivered | Navigates back to catalog with category pre-filtered |
| P3.5 Related Products Recommendation | FULL | ✓ Delivered | 4 category items, current product excluded |
| P4.1 Cart State & Persistent Storage | CORE | ✓ Delivered | `CartContext`, localStorage hydration |
| P4.2 OOP Domain Model & Discriminator Reducer | FULL | ✓ Delivered | `Cart` class, `cartReducer`, `assertNever` check |
| P4.3 Promo Code System (`10X10`) | FULL | ✓ Delivered | 10% subtotal discount, inline error feedback |
| P4.4 Dynamic Shipping Rules | FULL | ✓ Delivered | Free over $50, $5 flat rate otherwise |
| P5.1 Checkout Form & Inline Validation | CORE | ✓ Delivered | Name, Email (RFC regex), Address, City validation |
| P5.2 Order Confirmation & Snapshot State | CORE | ✓ Delivered | Immutable snapshot prevents $0 total reset bug |
| P6.1 Orders History & Visual Order Timeline | FULL | ✓ Delivered | List orders, status badge, 3-step timeline |
| P6.2 Real-time Order Status Simulation | FULL | ✓ Delivered | Processing -> Shipped (60s) -> Delivered (180s) |
| P6.3 Reorder Capability | FULL | ✓ Delivered | One-click cart rehydration and redirection |
| P7.1 User Profile View & Contact Editing | FULL | ✓ Delivered | Controlled form, local storage update |
| P7.2 Lifetime Statistics & Data Reset | FULL | ✓ Delivered | Total orders, total spend, "Clear Local Data" |
| **TypeScript & Architecture (T1 - T4)** | | | |
| T1 Strict TypeScript (`noImplicitAny`) | CORE | ✓ Delivered | 100% strict typing, zero `any` usage |
| T2 Rich Domain Models & Utility Types | FULL | ✓ Delivered | `Product`, `Order`, `CartItem`, `Pick`, `Omit`, `Record` |
| T3 Generic ApiClient & Custom ApiError | FULL | ✓ Delivered | `ApiClient.get<T>`, status codes, AbortSignal |
| T4 StorageService Generic & OOP Encapsulation | FULL | ✓ Delivered | Type-safe localStorage wrapper, error fallbacks |
| **Styling & Tailwind CSS v4 (TW1 - TW6)** | | | |
| TW1 Modern Fluid Design System | CORE | ✓ Delivered | Inter typography, sleek cards, micro-animations |
| TW2 Fully Responsive Breakpoints | CORE | ✓ Delivered | Mobile (375px), Tablet (768px), Desktop (1440px) |
| TW3 Clean UI States (Empty, Loading, Error) | CORE | ✓ Delivered | Custom illustrations, friendly error retry cards |
| TW5 Tailwind CSS v4 `@theme` Tokens | FULL | ✓ Delivered | Brand tokens (`brand-500`, `brand-600`, `brand-700`) |
| TW6 Complete Dark Mode System | FULL | ✓ Delivered | `@custom-variant dark`, high contrast across all 7 views |
| **Optimization & Process (O1 - O3, D1 - D3)** | | | |
| O1 Route-Level Code Splitting & Memoization | FULL | ✓ Delivered | `React.lazy`, `<Suspense>`, `React.memo(ProductCard)` |
| O2 Comprehensive Debugging Log | FULL | ✓ Delivered | `DEBUG-LOG.md` (5 diverse issues with root cause & fix) |
| O3 Cross-Browser QA & a11y Compliance | FULL | ✓ Delivered | `COMPATIBILITY.md`, a11y labels, Lighthouse >= 95 |
| D1 Clean Commit History & Conventional Messages | FULL | ✓ Delivered | Exactly 40 granular commits, no large bulk dumps |
| D2 Weekly Progress Notes | FULL | ✓ Delivered | `docs/progress/week-1.md`, `week-2.md`, `week-3.md` |
| D3 Final Report & English README | FULL | ✓ Delivered | `REPORT.md`, `README.md` |

---

## 2. Quantitative Performance & Project Metrics

### 2.1 Production Bundle Size
Compiled with Vite 6.4 + Rollup:
- **Main Application Chunk (`index-*.js`):** 280.65 kB uncompressed / **89.26 kB gzipped** (Under the 100 kB initial load target).
- **Global CSS Bundle (`index-*.css`):** 45.58 kB uncompressed / **8.07 kB gzipped**.
- **Dynamic Route-Level Lazy Chunks:**
  - `CatalogPage`: 9.76 kB (gzip: 3.04 kB)
  - `ProductPage`: 13.47 kB (gzip: 4.06 kB)
  - `CartPage`: 7.61 kB (gzip: 2.15 kB)
  - `CheckoutPage`: 11.92 kB (gzip: 2.83 kB)
  - `OrdersPage`: 4.31 kB (gzip: 1.49 kB)
  - `OrderDetailsPage`: 7.66 kB (gzip: 2.29 kB)
  - `ProfilePage`: 9.26 kB (gzip: 2.37 kB)
  - `LoginPage`: 3.50 kB (gzip: 1.26 kB)
  - `NotFoundPage`: 0.87 kB (gzip: 0.46 kB)

### 2.2 Lighthouse Audit Targets vs. Actual Results (Averaged Across Core Views)

| Lighthouse Metric | Target | Actual Score | Status |
| :--- | :---: | :---: | :---: |
| **Performance** | >= 85 | **96** | ✓ Surpassed |
| **Accessibility (a11y)** | >= 95 | **98** | ✓ Surpassed |
| **Best Practices** | >= 90 | **100** | ✓ Surpassed |
| **SEO** | >= 90 | **95** | ✓ Surpassed |

### 2.3 Commit Count & Hours Breakdown

- **Total Commits:** **40 Commits** (Clean, conventional commit history).
- **Total Project Hours:** **105 Hours** across 3 weeks.

| Epic / Work Breakdown Structure | Hours Spent |
| :--- | :---: |
| Project Scaffolding, Strict TypeScript Config & Domain Types | 7.5h |
| App Shell, Layout, AuthContext & Global Toast System | 7.5h |
| Catalog, Debounced Search, Category Filter, Sort & URL Sync | 15.5h |
| Product Details, Gallery, Custom Reviews & Related Products | 13.0h |
| OOP Cart Model, Discriminated cartReducer & Promo Rules | 11.0h |
| Checkout Validation, Snapshot Safety & Order Confirmation | 8.5h |
| Orders Management, Live Status Simulation & Reorder Flow | 11.0h |
| Profile Page, Lifetime Spend & Storage Service Management | 6.0h |
| Tailwind v4 Tokens, Dark Mode System & Universal Styling | 12.0h |
| Route Code Splitting, DevTools Profiler & React.memo Optimization | 7.0h |
| Error Boundary, Accessibility Audit, Cross-Browser Matrix & Docs | 6.0h |
| **Total** | **105.0h** |

---

## 3. Top 3 Hardest Technical Challenges & Solutions

### 1) Asynchronous State Loss vs. Cart Clearing on Checkout Confirmation
- **Challenge:** After submitting the checkout form, calling `clearCart()` directly caused the confirmation screen to display an Order Total of `$0.00` and `0` items, because the confirmation screen was reading volatile live state from `useCart()` that had just been purged.
- **Solution:** Designed an immutable snapshot object `placedOrder` captured synchronously at the point of form submission. The confirmation view binds strictly to this captured order instance, allowing `clearCart()` to execute safely in the background without affecting the rendered receipt.

### 2) DummyJSON Sorting Endpoint Inconsistencies & Race Conditions
- **Challenge:** The DummyJSON API does not apply `sortBy` and `order` parameters when querying `/products/search` or `/products/category/{category}`. Furthermore, rapid keystrokes or category changes created race conditions where earlier in-flight network requests finished after newer ones, overwriting active data.
- **Solution:** Paired `AbortController` in `useEffect` (aborting obsolete in-flight requests on each query change) with an in-memory client-side sorting fallback that executes when category or search filters are engaged.

### 3) Reducer Type Safety with Exhaustive Checking & OOP Domain Encapsulation
- **Challenge:** Maintaining strict TypeScript guarantees (`noImplicitAny`, zero type assertions `as`) across complex cart mutations while keeping business logic (discounts, tax, shipping thresholds) cohesive and maintainable.
- **Solution:** Combined an OOP domain class `Cart` (housing pure financial calculation methods) with a discriminated union action type (`CartAction = AddItemAction | RemoveItemAction | ...`). In `cartReducer`, implemented an `assertNever(action)` default branch that guarantees compile-time exhaustiveness checking if any new action variant is introduced.

---

## 4. What Would I Do Differently?

1. **Adopt TanStack Query (React Query) for Server State:**  
   While custom `useEffect` hooks paired with `AbortController` and `StorageService` allowed complete control without extra dependencies, TanStack Query would have provided automated background re-fetching, deduplication, stale-time caching, and optimistic mutations out of the box.
2. **Implement MSW (Mock Service Worker) for Automated Network Testing:**  
   Using MSW would allow writing robust Playwright or Vitest component tests that simulate network errors, latency, and rate-limiting without relying on live external APIs like DummyJSON.
3. **End-to-End Testing with Playwright:**  
   Automating the critical checkout flow (Catalog -> Add to Cart -> Promo Code -> Checkout -> Order History -> Reorder) using headless browser tests would give even higher confidence during rapid UI iterations.

---

## 5. AI Assistance Summary

During this project, AI was utilized as an intelligent pair programmer for boilerplate generation, drafting repetitive mock data structures, and suggesting Tailwind utility classes. All generated code was subjected to strict human review: AI proposals using `any` or loose type assertions were systematically rejected, and subtle flaws—such as event bubbling on clickable product cards, state loss during cart clearing, and race conditions in asynchronous API filtering—were diagnosed and corrected manually.
