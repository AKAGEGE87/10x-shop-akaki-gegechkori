# Week 2 Progress Notes

## Overview
Week 2 was dedicated to the core shopping workflow and business logic: comprehensive product details with user reviews and related item recommendations, advanced cart state management combining an OOP domain model with a strictly-typed React reducer, checkout processing, order history with live delivery simulation, user profile management, and global toast notifications.

---

## Completed Tasks

1. **Product Detail Page (CORE & FULL):**
   - Implemented dynamic route `/products/:id` fetching product details from DummyJSON.
   - Built multi-image thumbnail gallery with interactive primary image preview.
   - Added interactive quantity selector with stock boundary enforcement.
   - Designed tabbed navigation interface ("Description" and "Customer Reviews").
   - Implemented review summary with calculated average rating, star rating distribution bars, and formatted review cards.
   - Added "Write a Review" form with rating selector, comment input, and reviewer name. Saved user reviews to `localStorage` via `reviewsStorage`, merging seamlessly with API reviews.
   - Built "Related Products" recommendation carousel/grid displaying 4 products from the same category with current item excluded.

2. **Global Toast Notification System:**
   - Built `ToastContext` and `useToast()` hook.
   - Supported three toast variants: `success`, `error`, and `info` with auto-dismiss (3500ms) and manual close.
   - Embedded toast triggers across cart operations, review submissions, and profile updates.

3. **Cart Architecture & State Management:**
   - Designed OOP domain model `Cart` (`src/models/Cart.ts`) with methods for item manipulation, subtotal calculation, discount deduction, shipping calculation, and final total.
   - Refactored `CartContext` to use `useReducer` with discriminated unions (`CartAction = AddItemAction | RemoveItemAction | UpdateQuantityAction | ApplyPromoAction | ClearCartAction`).
   - Implemented exhaustive `switch-case` handling using TypeScript's `assertNever(action)` idiom.
   - Added promo code validation supporting `10X10` (10% off subtotal).
   - Enforced free shipping on orders over $50 ($5 flat rate otherwise).
   - Built full `CartPage` with item rows (`CartItemRow`), interactive stepper, promo code form, order summary breakdown, and empty cart call-to-action.

4. **Checkout & Order Placement:**
   - Built `CheckoutPage` with 4 validated shipping fields: Full Name, Email (RFC regex), Shipping Address, and City.
   - Added instant inline validation with Georgian/English error messaging and touch tracking.
   - Implemented order snapshot capture preventing $0 total reset bug during checkout confirmation.
   - Created `OrderModel` class and `ordersStorage` service with persistent order history.

5. **Order History & Details (Live Status Simulation):**
   - Built `OrdersPage` listing past orders with timestamps, status badges, thumbnail previews, and order totals.
   - Built `OrderDetailsPage` displaying shipping destination, breakdown of items, financial summary, and a "Reorder" action button.
   - Implemented dynamic status simulation: orders transition automatically based on elapsed time (`Processing` -> `Shipped` after 60s -> `Delivered` after 180s) with auto-updating visual timeline step indicator.

6. **User Profile & Storage Management:**
   - Built `ProfilePage` (`/profile`) allowing users to view and update personal contact info.
   - Displayed lifetime shopping statistics (total orders, total spend).
   - Added "Clear Local Data" danger action resetting cart, orders, and custom reviews with toast confirmation.

---

## Blockers & Challenges Encountered

- **Cart State Synchronization with LocalStorage:**
  When persisting cart state across browser reloads, hydrating class instances vs plain JSON objects required careful serialization and reconstruction in `StorageService`.
- **Checkout Stale State Race:**
  Calling `clearCart()` right before rendering the order confirmation view caused the confirmation screen to momentarily flash $0.00 total and 0 items. Resolved by taking an immutable snapshot of the order before triggering the cart clear action.

---

## Time Spent Breakdown

| Task Area | Estimated | Actual |
| :--- | :---: | :---: |
| Product Details, Image Gallery & Stock Stepper | 5h | 4.5h |
| Product Reviews, Form, Validation & LocalStorage Persistence | 5h | 5.5h |
| Related Products Recommendation Logic & API Integration | 3h | 3h |
| OOP Cart Model, Discriminated Union cartReducer & Tests | 6h | 6h |
| CartPage UI, CartItemRow, Promo Code (10X10) & Shipping Rules | 5h | 5h |
| Checkout Form Validation, Order Snapshot & Order Placement | 5h | 5.5h |
| Orders List, Order Details & Real-Time Status Simulation | 5h | 5.5h |
| Profile Page, Lifetime Stats & Clear Cache Action | 3h | 3h |
| Global Toast Notification System | 2h | 2h |
| **Total Week 2 Hours** | **39h** | **40h** |
