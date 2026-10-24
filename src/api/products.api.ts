import { apiClient } from "./ApiClient";
import {
  Product,
  ProductsResponse,
  Category,
  CatalogParams,
} from "../types/product";
import { buildProductsUrl } from "../utils/url";

export async function fetchProducts(
  paramsOrLimit: CatalogParams | number = 12,
  skipOrSignal?: number | AbortSignal,
  maybeSignal?: AbortSignal
): Promise<ProductsResponse> {
  if (typeof paramsOrLimit === "number") {
    const limit = paramsOrLimit;
    const skip = typeof skipOrSignal === "number" ? skipOrSignal : 0;
    const page = Math.floor(skip / limit) + 1;
    const signal =
      skipOrSignal instanceof AbortSignal ? skipOrSignal : maybeSignal;
    const url = buildProductsUrl({ limit, page });
    return apiClient.get<ProductsResponse>(url, signal);
  }

  const signal =
    skipOrSignal instanceof AbortSignal ? skipOrSignal : maybeSignal;
  const url = buildProductsUrl(paramsOrLimit);
  return apiClient.get<ProductsResponse>(url, signal);
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal
): Promise<Product> {
  return apiClient.get<Product>(`/products/${id}`, signal);
}

export async function fetchCategories(
  signal?: AbortSignal
): Promise<Category[]> {
  return apiClient.get<Category[]>("/products/categories", signal);
}

export async function fetchRelatedProducts(
  category: string,
  currentProductId: number,
  signal?: AbortSignal
): Promise<Product[]> {
  const res = await apiClient.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}?limit=5`,
    signal
  );
  return res.products.filter((p) => p.id !== currentProductId).slice(0, 4);
}
