import { CatalogParams } from "../types/product";

export function buildProductsUrl(params: CatalogParams): string {
  let endpoint = "/products";

  if (params.q && params.q.trim()) {
    endpoint = `/products/search?q=${encodeURIComponent(params.q.trim())}`;
  } else if (params.category && params.category.trim()) {
    endpoint = `/products/category/${encodeURIComponent(params.category.trim())}`;
  }

  const queryParts: string[] = [];
  const limit = params.limit ?? 12;
  const page = params.page && params.page > 0 ? params.page : 1;
  const skip = (page - 1) * limit;

  queryParts.push(`limit=${limit}`);
  queryParts.push(`skip=${skip}`);

  if (params.sort) {
    const parts = params.sort.split("-");
    if (parts.length === 2) {
      const [field, order] = parts;
      queryParts.push(`sortBy=${field}`);
      queryParts.push(`order=${order}`);
    }
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}${queryParts.join("&")}`;
}
