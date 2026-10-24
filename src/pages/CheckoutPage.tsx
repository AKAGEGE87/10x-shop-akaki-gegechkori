import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Container } from "../components/ui/Container";
import { formatPrice, discountedPrice } from "../utils/format";
import { OrderModel } from "../models/Order";
import { ordersStorage } from "../models/ordersStorage";
import type { Order } from "../types/order";

interface FormErrors {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
}

export function CheckoutPage() {
  const { user } = useAuth();
  const {
    items,
    promoCode,
    subtotal,
    discount,
    shippingCost,
    total,
    clearCart,
  } = useCart();

  const [fullName, setFullName] = useState(user?.username || "");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (fullName.trim().length < 3) {
      nextErrors.fullName = "Full name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (address.trim().length < 5) {
      nextErrors.address = "Address must be at least 5 characters";
    }

    if (!city.trim()) {
      nextErrors.city = "City is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const existingOrders = ordersStorage.get() || [];
    const newOrder = OrderModel.create({
      items: [...items],
      shipping: {
        fullName: fullName.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
      },
      subtotal,
      discount,
      shippingCost,
      total,
      existingOrdersCount: existingOrders.length,
    });

    ordersStorage.set([newOrder, ...existingOrders]);
    setPlacedOrder(newOrder);
    clearCart();
    setIsSubmitting(false);
  };

  if (placedOrder) {
    const itemsCount = placedOrder.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return (
      <Container className="py-12">
        <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-white p-6 text-center shadow-xs sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Thank you! Your order has been placed.
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Order #{placedOrder.number} has been received and will begin processing shortly.
          </p>

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-6 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              Order Details
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <dt className="text-slate-500">Order Number</dt>
                <dd className="font-semibold text-indigo-600">
                  #{placedOrder.number}
                </dd>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <dt className="text-slate-500">Recipient</dt>
                <dd className="font-medium text-slate-900">
                  {placedOrder.shipping.fullName}
                </dd>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">
                  {placedOrder.shipping.email}
                </dd>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <dt className="text-slate-500">Shipping Address</dt>
                <dd className="font-medium text-slate-900">
                  {placedOrder.shipping.address}, {placedOrder.shipping.city}
                </dd>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <dt className="text-slate-500">Items</dt>
                <dd className="font-medium text-slate-900">
                  {itemsCount}
                </dd>
              </div>

              <div className="flex justify-between pt-1 text-base font-bold text-slate-900">
                <dt>Order Total</dt>
                <dd className="text-indigo-600">
                  {formatPrice(placedOrder.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={`/orders/${placedOrder.id}`}
              state={{ justPlaced: true }}
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 sm:w-auto"
            >
              View order details
            </Link>
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Checkout
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Your cart is empty. Add items before checking out.
          </p>
          <div className="mt-6">
            <Link
              to="/cart"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Return to cart
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
          Checkout
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Please provide your shipping and contact information
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 lg:col-span-7"
        >
          <h2 className="text-lg font-bold text-slate-900">
            Shipping Information
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }
                }}
                className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-xs transition focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-200"
                }`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-xs transition focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-200"
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-700"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                autoComplete="street-address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) {
                    setErrors((prev) => ({ ...prev, address: undefined }));
                  }
                }}
                className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-xs transition focus:outline-none focus:ring-2 ${
                  errors.address
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-200"
                }`}
                placeholder="123 Main Street"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-slate-700"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (errors.city) {
                    setErrors((prev) => ({ ...prev, city: undefined }));
                  }
                }}
                className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-xs transition focus:outline-none focus:ring-2 ${
                  errors.city
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-200"
                }`}
                placeholder="Tbilisi"
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">{errors.city}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer mt-4 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Processing..." : "Place order"}
          </button>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-5">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          <div className="mt-4 max-h-64 divide-y divide-slate-100 overflow-y-auto pr-1">
            {items.map((item) => {
              const unitPrice = discountedPrice(
                item.price,
                item.discountPercentage
              );
              return (
                <div
                  key={item.productId}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-md bg-slate-50 object-contain p-1"
                    />
                    <div>
                      <p className="line-clamp-1 font-medium text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <span className="font-semibold text-slate-900">
                    {formatPrice(unitPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <dl className="mt-4 space-y-3 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <dt>Subtotal</dt>
              <dd className="font-medium text-slate-900">
                {formatPrice(subtotal)}
              </dd>
            </div>

            {promoCode && discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <dt>Discount ({promoCode} −10%)</dt>
                <dd className="font-medium">-{formatPrice(discount)}</dd>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <dt>Shipping</dt>
              <dd className="font-medium text-slate-900">
                {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
              </dd>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
              <dt>Total</dt>
              <dd className="text-indigo-600">{formatPrice(total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Container>
  );
}
