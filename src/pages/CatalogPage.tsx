import { useState, useEffect, useCallback } from "react";
import { fetchProducts } from "../api/products.api";
import { Product, ProductsResponse } from "../types/product";
import { ProductGrid } from "../components/product/ProductGrid";
import { Container } from "../components/ui/Container";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function CatalogPage() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchProducts(12, 0);
      setData(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddToCart = (product: Product) => {
    setFeedback(`Added "${product.title}" to cart`);
    window.setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  return (
    <Container className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Catalog
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {data ? `Showing ${data.products.length} of ${data.total} products` : "Browse our products"}
          </p>
        </div>

        {feedback && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-800 shadow-xs">
            {feedback}
          </div>
        )}
      </div>

      {loading && <LoadingSpinner message="Loading products..." />}

      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Error loading catalog
          </p>
          <p className="mt-2 text-base text-red-900">{error}</p>
          <button
            type="button"
            onClick={loadProducts}
            className="cursor-pointer mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data && data.products.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-base text-slate-600">No products found.</p>
        </div>
      )}

      {!loading && !error && data && data.products.length > 0 && (
        <ProductGrid products={data.products} onAdd={handleAddToCart} />
      )}
    </Container>
  );
}
