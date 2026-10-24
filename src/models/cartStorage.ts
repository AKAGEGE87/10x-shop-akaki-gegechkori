import { StorageService, STORAGE_KEYS } from "./StorageService";
import type { CartState } from "../types/cart";

export const cartStorage = new StorageService<CartState>(STORAGE_KEYS.cart);
