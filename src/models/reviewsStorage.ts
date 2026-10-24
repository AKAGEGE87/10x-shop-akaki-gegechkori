import { StorageService, STORAGE_KEYS } from "./StorageService";
import type { Review } from "../types/product";

export const reviewsStorage = new StorageService<Record<number, Review[]>>(
  STORAGE_KEYS.reviews
);
