# Week 1 Progress Notes

## Overview
The goal for Week 1 was to establish a solid technical foundation for the project: project scaffolding, strict TypeScript setup, Tailwind CSS v4 styling architecture, foundational models and API client layer, basic authentication, responsive layout components, and the full catalog browsing experience with search, debounce, filtering, sorting, and pagination.

---

## Completed Tasks

1. **Project Initialization & Scaffolding:**
   - Initialized React 19 + Vite 6 template with strict TypeScript configuration (`noImplicitAny`, `strictNullChecks`, `noUnusedLocals`).
   - Configured Tailwind CSS v4 using `@tailwindcss/vite` and standard theme extensions.
   - Setup ESLint with React Hooks and React Refresh rules; cleaned all starter template warnings.

2. **Core TypeScript Architecture & API Client:**
   - Defined strict domain interfaces: `Product`, `Category`, `Review`, `User`, `CartItem`, `Order`.
   - Built custom `ApiError` class extending native `Error` with HTTP status and structured message.
   - Implemented generic `ApiClient` class providing strongly-typed `get<T>` methods with `AbortSignal` support.
   - Built type-safe `StorageService<T>` with defensive JSON serialization and error fallbacks.

3. **Global Layout & Navigation:**
   - Created reusable UI primitives: `Container`, `Button`, `Input`, `Select`, `Badge`, `Spinner`, `Skeleton`.
   - Implemented sticky `Header` with responsive navigation, logo, cart indicator badge, search access, and user session toggle.
   - Built `AuthContext` with mock login/logout, session persistence in `localStorage`, and username validation.
   - Built `Footer` component with links and project metadata.

4. **Catalog Module (CORE & FULL):**
   - Implemented `CatalogPage` with responsive 1/2/3/4-column product grid (`ProductGrid`, `ProductCard`).
   - Integrated DummyJSON `/products` API with 12 items per page pagination (`Pagination` component).
   - Added keyword search input with 300ms custom debounce hook (`useDebounce`) to avoid excessive API requests.
   - Added horizontal category pill selector with "All" and dynamic category loading.
   - Added sorting dropdown (Price: Low/High, Rating: High/Low, Title: A-Z).
   - Implemented `AbortController` cancellation for rapid filter switches to eliminate race conditions.
   - Added two-way URL query parameter synchronization (`?search=`, `?category=`, `?page=`, `?sort=`).
   - Added skeleton loading state (12 pulsing card placeholders) and error retry view.

---

## Blockers & Challenges Encountered

- **Tailwind v4 Configuration Syntax:**
  Tailwind v4 replaces the traditional `tailwind.config.js` file with pure CSS `@theme` directives and `@import "tailwindcss";`. Adjusting custom utility classes and container max-widths required migrating to CSS custom properties rather than JS export objects.
- **DummyJSON Sort Route Inconsistencies:**
  DummyJSON's `/products/search` and `/products/category/:name` routes ignore standard `sortBy` and `order` URL parameters. We resolved this by implementing client-side sorting fallback logic when category or search filters are active.

---

## Time Spent Breakdown

| Task Area | Estimated | Actual |
| :--- | :---: | :---: |
| Vite Scaffolding, TypeScript Strict Config & ESLint | 3h | 3.5h |
| Domain Models, Types, ApiClient & StorageService | 4h | 4h |
| App Shell, Header, AuthContext, Container Components | 4h | 3.5h |
| Catalog Grid, ProductCard, Skeleton Placeholders | 5h | 5h |
| Search Debounce, Category Filter & URL Sync | 5h | 6h |
| Pagination, Sorting & AbortController Race-condition Fix | 4h | 4.5h |
| **Total Week 1 Hours** | **25h** | **26.5h** |
