import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Container } from "../components/ui/Container";
import { CartItemRow } from "../components/cart/CartItemRow";
import { Cart } from "../models/Cart";
import { formatPrice } from "../utils/format";

export function CartPage() {
  const {
    items,
    itemCount,
    promoCode,
    subtotal,
    discount,
    shippingCost,
    total,
    clearCart,
    applyPromo,
    removePromo,
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleClearCart = () => {
    if (window.confirm("Clear the cart? This cannot be undone.")) {
      clearCart();
      showToast("Removed from cart", "info");
    }
  };

  const handleApplyPromo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (applyPromo(promoInput)) {
      setPromoInput("");
      setPromoError(null);
    } else {
      setPromoError("Invalid promo code");
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Your cart is empty.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Browse products
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Shopping Cart
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          You have {itemCount} item{itemCount > 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-4 lg:col-span-8">
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleClearCart}
              className="cursor-pointer text-sm font-medium text-slate-500 transition hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
            >
              Clear cart
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Order Summary
          </h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <dt>Subtotal</dt>
              <dd className="font-medium text-slate-900 dark:text-white">
                {formatPrice(subtotal)}
              </dd>
            </div>

            {promoCode && discount > 0 && (
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <dt className="flex items-center gap-2">
                  <span>Discount ({promoCode} −10%)</span>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="cursor-pointer text-xs font-medium text-slate-500 underline transition hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                  >
                    Remove
                  </button>
                </dt>
                <dd className="font-medium">-{formatPrice(discount)}</dd>
              </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <dt>Shipping</dt>
              <dd className="font-medium text-slate-900 dark:text-white">
                {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
              </dd>
            </div>
            {shippingCost > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Free shipping on orders from{" "}
                {formatPrice(Cart.FREE_SHIPPING_FROM)}
              </p>
            )}

            <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900 dark:border-slate-800 dark:text-white">
              <dt>Total</dt>
              <dd className="text-brand-600 dark:text-brand-400">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>

          {!promoCode && (
            <form onSubmit={handleApplyPromo} noValidate className="mt-6">
              <label
                htmlFor="promo-input"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Promo code
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  id="promo-input"
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    if (promoError) {
                      setPromoError(null);
                    }
                  }}
                  className={`min-w-0 flex-1 rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-xs transition focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                    promoError
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-brand-600 focus:ring-brand-200 dark:border-slate-700"
                  }`}
                  placeholder="Enter 10X10"
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="mt-1 text-xs text-rose-600">{promoError}</p>
              )}
            </form>
          )}

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="cursor-pointer mt-6 flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </Container>
  );
}
