import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Container } from "../components/ui/Container";
import { CartItemRow } from "../components/cart/CartItemRow";
import { formatPrice } from "../utils/format";

export function CartPage() {
  const { items, itemCount, subtotal, totalDiscount, total, clearCart } =
    useCart();
  const navigate = useNavigate();

  const handleClearCart = () => {
    if (window.confirm("Clear the cart? This cannot be undone.")) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Shopping Cart
          </h1>
          <p className="mt-3 text-base text-slate-600">Your cart is empty.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Shopping Cart
        </h1>
        <p className="mt-1 text-sm text-slate-500">
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
              className="cursor-pointer text-sm font-medium text-slate-500 transition hover:text-red-600"
            >
              Clear cart
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-4">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <dt>Subtotal</dt>
              <dd className="font-medium text-slate-900">
                {formatPrice(subtotal)}
              </dd>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <dt>Discount</dt>
                <dd className="font-medium">-{formatPrice(totalDiscount)}</dd>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <dt>Shipping</dt>
              <dd className="font-medium text-slate-900">Free</dd>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="cursor-pointer mt-6 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </Container>
  );
}
