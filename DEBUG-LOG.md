# Debug Log

This document tracks real issues identified and resolved during development, formatted according to the PRD O2 specification.

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

### Issue 2: "Add to cart" Click Triggers Product Navigation

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
