import { StorageService, STORAGE_KEYS } from "./StorageService";
import type { AuthUser } from "../types/user";

export const userStorage = new StorageService<AuthUser>(STORAGE_KEYS.user);
