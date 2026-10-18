import { Product, ProductsResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com";

export async function fetchProducts(
  limit = 12,
  skip = 0
): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ProductsResponse>;
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch product with id ${id}: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<Product>;
}
