import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem, CartState } from "../types/cart";
import type { Product } from "../types/product";
import { Cart } from "../models/Cart";
import { cartStorage } from "../models/cartStorage";
import { cartReducer } from "./cart.reducer";

interface AddItemResult {
  success: boolean;
  reachedLimit: boolean;
}

interface CartContextType {
  items: CartItem[];
  promoCode: string | null;
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  addItem: (product: Product, qty?: number) => AddItemResult;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = { items: [], promoCode: null };

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "number" &&
    typeof item.title === "string" &&
    typeof item.thumbnail === "string" &&
    typeof item.price === "number" &&
    typeof item.discountPercentage === "number" &&
    typeof item.stock === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
}

function initCartState(fallback: CartState): CartState {
  const stored: unknown = cartStorage.get();
  if (typeof stored !== "object" || stored === null) {
    return fallback;
  }

  const { items, promoCode } = stored as Record<string, unknown>;
  if (!Array.isArray(items)) {
    return fallback;
  }

  return {
    items: items.filter(isCartItem),
    promoCode: typeof promoCode === "string" ? promoCode : null,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, initCartState);

  useEffect(() => {
    cartStorage.set(state);
  }, [state]);

  const cart = useMemo(
    () => new Cart(state.items, state.promoCode),
    [state.items, state.promoCode]
  );

  const addItem = useCallback(
    (product: Product, qty = 1): AddItemResult => {
      const existing = state.items.find((i) => i.productId === product.id);
      const currentQty = existing ? existing.quantity : 0;

      if (product.stock <= 0 || qty <= 0 || currentQty >= product.stock) {
        return { success: false, reachedLimit: true };
      }

      dispatch({ type: "ADD_ITEM", product, qty });
      return { success: true, reachedLimit: currentQty + qty >= product.stock };
    },
    [state.items]
  );

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: "REMOVE_ITEM", productId });
  }, []);

  const updateQuantity = useCallback((productId: number, qty: number) => {
    dispatch({ type: "SET_QTY", productId, qty });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const applyPromo = useCallback((code: string): boolean => {
    if (code.trim().toUpperCase() !== Cart.VALID_PROMO) {
      return false;
    }
    dispatch({ type: "APPLY_PROMO", code });
    return true;
  }, []);

  const removePromo = useCallback(() => {
    dispatch({ type: "REMOVE_PROMO" });
  }, []);

  const value = useMemo<CartContextType>(
    () => ({
      items: state.items,
      promoCode: state.promoCode,
      itemCount: cart.itemCount,
      subtotal: cart.subtotal(),
      discount: cart.discount(),
      shippingCost: cart.shipping(),
      total: cart.total(),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyPromo,
      removePromo,
    }),
    [
      state,
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyPromo,
      removePromo,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
