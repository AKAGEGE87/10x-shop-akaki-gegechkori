import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/ui/Container";
import { NotFoundPage } from "./NotFoundPage";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { ordersStorage } from "../models/ordersStorage";
import { OrderModel } from "../models/Order";
import { discountedPrice, formatDate, formatPrice } from "../utils/format";
import type { OrderStatus } from "../types/order";

const TIMELINE_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: "Processing", label: "Processing", desc: "Order confirmed & packing" },
  { status: "Shipped", label: "Shipped", desc: "Dispatched & in transit" },
  { status: "Delivered", label: "Delivered", desc: "Package delivered" },
];

const STATUS_RANK: Record<OrderStatus, number> = {
  Processing: 0,
  Shipped: 1,
  Delivered: 2,
};

function getStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "Processing":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Shipped":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Delivered":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
}

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  const orders = ordersStorage.get() || [];
  const order = orders.find((o) => String(o.id) === id);

  if (!order) {
    return <NotFoundPage />;
  }

  const isJustPlaced = Boolean(
    (location.state as { justPlaced?: boolean } | null)?.justPlaced
  );
  const currentStatus = OrderModel.getStatus(order.placedAt);
  const currentRank = STATUS_RANK[currentStatus];

  const handleReorder = () => {
    for (const item of order.items) {
      addItem(
        {
          id: item.productId,
          title: item.title,
          thumbnail: item.thumbnail,
          price: item.price,
          discountPercentage: item.discountPercentage,
          stock: item.stock,
          description: "",
          category: "",
          rating: 5,
          images: [item.thumbnail],
          reviews: [],
        },
        item.quantity
      );
    }
    showToast("Items added to cart ✓", "success");
    navigate("/cart");
  };

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          ← Back to orders
        </Link>
      </div>

      {isJustPlaced && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              ✓
            </span>
            <span className="font-semibold">
              Thank you! Your order #{order.number} was placed successfully.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Order #{order.number}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Placed on {formatDate(order.placedAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                currentStatus
              )}`}
            >
              {currentStatus}
            </span>
            <button
              type="button"
              onClick={handleReorder}
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700"
            >
              Reorder
            </button>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="py-8">
          <div className="relative flex items-center justify-between">
            <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-slate-200" />
            <div
              className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-indigo-600 transition-all duration-500"
              style={{
                width:
                  currentRank === 0 ? "0%" : currentRank === 1 ? "50%" : "100%",
              }}
            />

            {TIMELINE_STEPS.map((step, idx) => {
              const isCompleted = currentRank >= idx;
              const isCurrent = currentRank === idx;

              return (
                <div
                  key={step.status}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                      isCompleted
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 bg-white text-slate-400"
                    } ${isCurrent ? "ring-4 ring-indigo-100" : ""}`}
                  >
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold sm:text-sm ${
                      isCurrent
                        ? "text-indigo-600"
                        : isCompleted
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="hidden text-xs text-slate-400 sm:inline-block">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-4">
          <h2 className="text-base font-semibold text-slate-900">Items Ordered</h2>
          <div className="mt-4 divide-y divide-slate-100 border-t border-b border-slate-100">
            {order.items.map((item) => {
              const unitPrice = discountedPrice(
                item.price,
                item.discountPercentage
              );
              const lineTotal = unitPrice * item.quantity;

              return (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-16 w-16 rounded-xl border border-slate-100 object-cover bg-slate-50"
                    />
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-medium text-slate-900 transition hover:text-indigo-600"
                      >
                        {item.title}
                      </Link>
                      <div className="mt-1 text-xs text-slate-500">
                        Qty: {item.quantity} × {formatPrice(unitPrice)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900">
                      {formatPrice(lineTotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details & Summary Grid */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Shipping Address */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              Shipping Address
            </h2>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p className="font-medium text-slate-900">
                {order.shipping.fullName}
              </p>
              <p>{order.shipping.email}</p>
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}</p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              Order Summary
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Subtotal</dt>
                <dd className="font-medium text-slate-900">
                  {formatPrice(order.subtotal)}
                </dd>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <dt>Discount</dt>
                  <dd className="font-medium">-{formatPrice(order.discount)}</dd>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <dt>Shipping</dt>
                <dd className="font-medium text-slate-900">
                  {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}
                </dd>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <dt>Total</dt>
                <dd className="text-indigo-600">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Container>
  );
}
