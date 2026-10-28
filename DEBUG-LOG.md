# Debug Log

This document tracks real issues identified and resolved during development, formatted according to the PRD O2 specification (Symptom -> Reproduction -> Tool Used -> Root Cause -> Fix -> Takeaway).

---

### Issue 1: Cart Badge Displayed on Zero Items

- **Symptom:** When the cart was empty or freshly initialized, the Header still showed an active badge containing `0`.
- **Reproduction:**
  1. Open the application in a fresh browser session.
  2. Inspect the Header navigation.
  3. Observe the "0" badge next to the Cart link.
- **Tool Used:** React DevTools Components tab and Chrome DOM Elements inspector.
- **Root Cause:** The badge component inside `Header.tsx` was rendered unconditionally, rendering `<span>0</span>` even when `cartItemCount` was `0`.
- **Fix:** Commit `75130fc` (`fix: hide cart badge in header when count is zero`). Added condition `{itemCount > 0 && <span ...>}` so the element only renders when items exist.
- **Takeaway:** Numerical badge indicators in e-commerce headers should be conditionally rendered to avoid confusing zero-state indicators.

---

### Issue 2: "Add to Cart" Click Triggers Product Navigation

- **Symptom:** Clicking the "Add to cart" button inside a product card in the catalog grid added the item to cart, but also immediately navigated the user to `/products/:id`.
- **Reproduction:**
  1. Go to the Catalog page (`/`).
  2. Click the "Add to cart" button on any in-stock product card.
  3. Observe unintended navigation to the product detail view instead of staying on the catalog.
- **Tool Used:** Chrome DevTools Event Listener Breakpoints and React DevTools.
- **Root Cause:** The outer `<article>` tag had an `onClick` handler navigating to `/products/${product.id}`. The click event on the `<button>` bubbled up the DOM tree to the parent card.
- **Fix:** Commit `3f7ae63` (`feat: create product card and responsive grid`). Added `e.stopPropagation()` in `handleAddToCart` on the button before delegating the action.
- **Takeaway:** Always prevent event bubbling when nesting interactive buttons inside clickable container cards.

---

### Issue 3: Order Total Resets to $0.00 on Checkout Confirmation

- **Symptom:** After submitting the checkout form, the confirmation screen ("Thank you! Your order has been placed.") displayed an Order Total of `$0.00` and `0` items.
- **Reproduction:**
  1. Add items to cart.
  2. Proceed to `/checkout`.
  3. Fill out the 4 required fields with valid input and click "Place order".
  4. Notice the confirmation screen shows blank/zero totals.
- **Tool Used:** React DevTools Components inspector.
- **Root Cause:** The component cleared the cart (`clearCart()`) upon successful submission. The confirmation view was referencing live `total` and `itemCount` from `useCart()`, which had just been reset to 0.
- **Fix:** Commit `2112b90` (`feat: implement checkout page with form validation and order confirmation`). Captured an immutable snapshot `placedOrder` with current `total`, `itemCount`, and shipping details in local state before triggering `clearCart()`.
- **Takeaway:** Confirmation and receipt screens must reference captured transaction snapshots rather than volatile live state that gets reset after the action.

---

### Issue 4: DummyJSON Endpoint Sort Parameter Incompatibility & Rapid Filter Race Condition

- **Symptom:** In the catalog, selecting sort options like "Price: Low to High" or "Rating" produced inconsistent ordering when combined with specific categories or active search keywords. Furthermore, rapidly switching category tabs or typing quickly in the search box occasionally resulted in stale responses overwriting newer search results.
- **Reproduction:**
  1. Go to the catalog page (`/`).
  2. Type a query (e.g. `phone`) or select the `smartphones` category.
  3. Quickly change sort to "Price: High to Low" and switch back to "All Categories" while the network is throttled to Fast 3G.
  4. Observe out-of-order results and broken sort order.
- **Tool Used:** Chrome DevTools Network Tab (waterfall analysis, 3G throttling) and Console.
- **Root Cause:** 
  1. DummyJSON's `/products/category/{category}` and `/products/search` endpoints do not consistently apply `sortBy` and `order` query parameters across all endpoints.
  2. Unaborted in-flight requests resolved out-of-order, overwriting newer state with obsolete data (Race Condition).
- **Fix:** Commit `6adaa0e` (`feat: implement catalog search, categories, sort, pagination and skeleton`).
  - Integrated `AbortController` in `fetchProducts` inside `useEffect`, aborting in-flight network requests on dependency change or unmount.
  - Added client-side fallback sorting in `fetchProducts`: if category or search query is present, items are explicitly sorted in JavaScript before updating state.
- **Takeaway:** Never assume 3rd-party REST APIs honor all query parameters across all composite routes; provide client-side fallback sorting and always guard asynchronous fetches with `AbortController`.

---

### Issue 5: Unnecessary Re-rendering of All ProductCards on Catalog Search Keystrokes

- **Symptom:** While typing in the catalog search input, each keystroke exhibited minor visual lag and high CPU activity, even before the 300ms debounce triggered a network fetch.
- **Reproduction:**
  1. Open the Catalog page (`/`).
  2. Start the React DevTools Profiler with "Highlight updates when components render" enabled.
  3. Type characters into the Search input.
  4. Notice all 12 `ProductCard` components and their sub-elements flash and re-render on every single keystroke.
- **Tool Used:** React DevTools Profiler (Flamegraph & "Record why each component rendered") and Chrome Performance tab.
- **Root Cause:** 
  1. `CatalogPage` maintained `searchTerm` in local state. Every keystroke triggered a re-render of `CatalogPage`.
  2. The callback function `handleAddToCart` passed to `ProductGrid` and `ProductCard` was defined as an inline function recreated on every render.
  3. `ProductCard` was not wrapped in `React.memo`, causing all child cards to re-render whenever parent state updated, even though their props (`product`, `onAddToCart`) were semantically unchanged.
- **Fix:** Commit `e0e56f4` (`perf: memoize ProductCard and stabilize catalog callbacks`).
  - Wrapped `ProductCard` in `React.memo(ProductCard)`.
  - Stabilized `handleAddToCart` with `useCallback(..., [addItem, showToast])`.
- **Takeaway:** Pairing `React.memo` with stabilized `useCallback` function references prevents costly subtree re-renders during high-frequency parent state changes such as search input typing.
