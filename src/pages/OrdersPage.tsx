import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/ui/Container";
import { ordersStorage } from "../models/ordersStorage";
import { OrderModel } from "../models/Order";
import { formatDate, formatPrice } from "../utils/format";
import type { Order, OrderStatus } from "../types/order";

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

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(() => ordersStorage.get() || []);
  const [, setTick] = useState(0);

  useEffect(() => {
    setOrders(ordersStorage.get() || []);

    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  if (orders.length === 0) {
    return (
      <Container className="py-16 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            You have no orders yet.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Browse our catalog and start adding items to your cart.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700"
            >
              Browse products
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Orders
          </h1>
          <p className="text-sm text-slate-500">
            Track and manage your order history
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400">
          Auto-updates every 30s
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = OrderModel.getStatus(order.placedAt);
          const totalItems = order.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 sm:text-lg">
                    #{order.number}
                  </span>
                  <span className="text-xs text-slate-500 sm:text-sm">
                    {formatDate(order.placedAt)}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(
                    status
                  )}`}
                >
                  {status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    {order.items.slice(0, 4).map((item) => (
                      <img
                        key={item.productId}
                        src={item.thumbnail}
                        alt={item.title}
                        className="inline-block h-10 w-10 rounded-lg border-2 border-white object-cover bg-slate-100"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-xs text-slate-400">Total</span>
                    <span className="text-base font-bold text-indigo-600 sm:text-lg">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <span className="text-slate-400">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
