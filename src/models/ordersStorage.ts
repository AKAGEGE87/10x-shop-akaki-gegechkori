import { StorageService, STORAGE_KEYS } from "./StorageService";
import type { Order } from "../types/order";

export const ordersStorage = new StorageService<Order[]>(STORAGE_KEYS.orders);
