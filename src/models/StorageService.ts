export const STORAGE_KEYS = {
  cart: "shop_cart",
  orders: "shop_orders",
  reviews: "shop_reviews",
  theme: "shop_theme",
  user: "shop_user",
} as const;

export class StorageService<T> {
  constructor(private readonly key: string) {}

  get(): T | null {
    try {
      const item = localStorage.getItem(this.key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  set(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch {
      // storage unavailable
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      // storage unavailable
    }
  }
}
