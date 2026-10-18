import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { CartItem } from "../types/cart";
import { Product } from "../types/product";
import { discountedPrice } from "../utils/format";

interface AddItemResult {
  success: boolean;
  reachedLimit: boolean;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  totalDiscount: number;
  total: number;
  addItem: (product: Product, qty?: number) => AddItemResult;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("shop_cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : parsed?.items;
    if (Array.isArray(list)) {
      return list.filter(
        (i): i is CartItem =>
          typeof i?.productId === "number" &&
          typeof i?.title === "string" &&
          typeof i?.price === "number" &&
          typeof i?.quantity === "number" &&
          i.quantity > 0
      );
    }
  } catch {
    return [];
  }
  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);

  useEffect(() => {
    try {
      localStorage.setItem("shop_cart", JSON.stringify({ items }));
    } catch {
      // storage quota exceeded or unavailable
    }
  }, [items]);

  const addItem = (product: Product, qty = 1): AddItemResult => {
    if (product.stock <= 0 || qty <= 0) {
      return { success: false, reachedLimit: true };
    }

    const existing = items.find((i) => i.productId === product.id);
    const currentQty = existing ? existing.quantity : 0;

    if (currentQty >= product.stock) {
      return { success: false, reachedLimit: true };
    }

    const nextQty = Math.min(currentQty + qty, product.stock);
    const reachedLimit = nextQty >= product.stock;

    if (existing) {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: nextQty } : i
        )
      );
    } else {
      const newItem: CartItem = {
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        quantity: nextQty,
      };
      setItems((prev) => [...prev, newItem]);
    }

    return { success: true, reachedLimit };
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: number, qty: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const clamped = Math.max(1, Math.min(qty, item.stock));
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = items.reduce(
    (sum, item) =>
      sum + discountedPrice(item.price, item.discountPercentage) * item.quantity,
    0
  );

  const totalDiscount = Math.max(0, subtotal - total);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        totalDiscount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
