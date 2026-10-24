import { StorageService, STORAGE_KEYS } from "./StorageService";

export type Theme = "light" | "dark";

export const themeStorage = new StorageService<Theme>(STORAGE_KEYS.theme);
