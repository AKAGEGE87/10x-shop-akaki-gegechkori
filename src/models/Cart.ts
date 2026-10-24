import type { CartItem } from "../types/cart";
import { discountedPrice } from "../utils/format";

export interface ICart {
  subtotal(): number;
  promoDiscount(): number;
  discount(): number;
  shipping(): number;
  total(): number;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

export class Cart implements ICart {
  static readonly FREE_SHIPPING_FROM = 100;
  static readonly SHIPPING_COST = 10;
  static readonly VALID_PROMO = "10X10";
  static readonly PROMO_RATE = 0.1;

  constructor(
    private readonly items: CartItem[],
    private readonly promoCode: string | null = null
  ) {}

  get itemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  subtotal(): number {
    return round2(
      this.items.reduce(
        (sum, item) =>
          sum +
          discountedPrice(item.price, item.discountPercentage) * item.quantity,
        0
      )
    );
  }

  promoDiscount(): number {
    if (this.promoCode?.toUpperCase() !== Cart.VALID_PROMO) {
      return 0;
    }
    return round2(this.subtotal() * Cart.PROMO_RATE);
  }

  discount(): number {
    return this.promoDiscount();
  }

  shipping(): number {
    if (
      this.items.length === 0 ||
      this.subtotal() - this.discount() >= Cart.FREE_SHIPPING_FROM
    ) {
      return 0;
    }
    return Cart.SHIPPING_COST;
  }

  total(): number {
    return round2(
      Math.max(0, this.subtotal() - this.discount()) + this.shipping()
    );
  }
}
