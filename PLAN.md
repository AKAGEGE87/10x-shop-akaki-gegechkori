# 10X Shop — Implementation Plan

## Project Overview & Objectives
Build a fast, responsive e-commerce Single Page Application (SPA) using React 19, TypeScript (strict mode), and Tailwind CSS v4, backed by the DummyJSON products API. The primary objective is delivering a solid CORE MVP followed by advanced FULL features.

---

## Scope Definition

### CORE Scope (Mandatory Baseline)
- **Authentication:** Simulated auth in React Context (`isLoggedIn`, `username`), controlled login form with validation, guest redirect on checkout.
- **Catalog:** Product list from DummyJSON (`GET /products?limit=12&skip=0`), responsive grid, product cards with discounts and stock status, basic loading/error/empty states.
- **Product Details:** Dynamic route (`/products/:id`), photo selection, quantity stepper constrained by stock, add to cart.
- **Cart:** Global cart state with immutable updates and `localStorage` persistence (`shop_cart`), quantity adjustment, item removal, clear cart confirmation, live subtotal/total calculations.
- **Checkout:** Protected checkout route, 4-field controlled form (Full name, Email, Address, City) with validation, order summary, local order confirmation, automatic cart reset.
- **Technical & Design:** Tailwind CSS v4 responsive layout (mobile-first, 375px+ without horizontal scroll), error boundary, zero TypeScript errors (`tsc --noEmit`), zero `any`.

### FULL Scope (Extended Features)
- **Discovery:** Debounced live search (`useDebounce`), category filtering, sorting (price, rating, title), URL query params synchronization (`useSearchParams`), pagination.
- **Catalog/Product UX:** Product reviews tab, related products slider/grid, skeleton loaders, abortable fetch via `AbortController`.
- **Cart/Checkout Extras:** Promo code support (`10X10` - 10% discount), shipping calculation threshold.
- **Orders & Profile:** Local orders history page (`/orders`, `/orders/:id`) with simulated order progress timeline (Processing -> Shipped -> Delivered), local profile editor (`/profile`).
- **Optimization:** Route-level code splitting (`React.lazy` + `Suspense`), Lighthouse audit optimization (Performance >= 85, A11y >= 90).

---

## Work Breakdown Structure (WBS)

| Epic | Task / Deliverable | Target Week | Est. Hours |
| :--- | :--- | :---: | :---: |
| **Setup & Arch** | Project scaffolding (Vite, TS strict, Tailwind v4, linting, routing) | Week 1 | 3h |
| **Auth (Simulated)** | AuthContext, controlled login form, validation, checkout redirect | Week 1 | 4h |
| **Catalog (CORE)** | Product API integration, ProductGrid, ProductCard, responsive layout | Week 1 | 6h |
| **Catalog (FULL)** | Search debouncing, category filter, sorting, pagination, URL state | Week 1 | 6h |
| **Product Details** | Dynamic route `/products/:id`, gallery, stock controls, Add to Cart | Week 2 | 5h |
| **Cart** | CartContext, storage sync, stepper, item removal, price calculation | Week 2 | 6h |
| **Checkout** | Protected route, controlled inputs, validation, local order confirmation | Week 2 | 5h |
| **Orders & Profile** | Orders list, status progression simulation, profile page (FULL) | Week 2 | 5h |
| **Quality & Error** | Class ErrorBoundary, basic debugging, custom 404 page | Week 3 | 4h |
| **Responsive & A11y** | 375px mobile optimization, semantic markup, focus states | Week 3 | 4h |
| **Optimization** | Lazy routes, CLS mitigation, bundle analysis, Lighthouse run | Week 3 | 4h |
| **Documentation** | README.md, DEBUG-LOG.md, REPORT.md, final QA | Week 3 | 4h |
| **Total** | | | **56h** |

---

## Risk Management

| # | Risk | Impact | Mitigation Strategy |
| :- | :--- | :---: | :--- |
| 1 | **DummyJSON API Downtime / Network Latency** | High | Implement clear error states with a Retry action; maintain mock fallback data if external API fails completely. |
| 2 | **DummyJSON Search / Category Sort Inconsistencies** | Medium | Some DummyJSON filtered endpoints ignore sorting params; fallback to client-side sorting for the current dataset slice and document it in `DEBUG-LOG.md`. |
| 3 | **Stale API Requests on Fast Navigation** | Medium | Use `AbortController` in `useEffect` cleanup to cancel pending fetch requests when product ID or query parameters change. |

---

## Definition of Done (DoD)

For each module and task:
1. **Type Safety:** Code compiles with zero errors under `npm run typecheck` (`strict: true`, no `any`).
2. **Code Quality:** `npm run lint` passes without warnings/errors.
3. **Responsiveness:** Works cleanly from 375px mobile screens up to desktop (no horizontal scrollbar).
4. **Resilience:** Async operations handle loading, error, and empty states without UI crashes.
5. **Functionality:** Meets exact acceptance criteria and validation rules defined in the PRD.
