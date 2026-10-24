import type { CartItem } from "../types/cart";
import type { Order, OrderStatus, ShippingInfo } from "../types/order";

export class OrderModel {
  static create(params: {
    items: CartItem[];
    shipping: ShippingInfo;
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
    existingOrdersCount: number;
  }): Order {
    return {
      id: Date.now(),
      number: "10X-" + String(params.existingOrdersCount + 1).padStart(5, "0"),
      items: params.items,
      shipping: params.shipping,
      subtotal: params.subtotal,
      discount: params.discount,
      shippingCost: params.shippingCost,
      total: params.total,
      placedAt: new Date().toISOString(),
    };
  }

  static getStatus(placedAt: string, now: number = Date.now()): OrderStatus {
    const elapsed = now - new Date(placedAt).getTime();
    if (elapsed < 60_000) {
      return "Processing";
    }
    if (elapsed < 180_000) {
      return "Shipped";
    }
    return "Delivered";
  }
}
