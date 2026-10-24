import {
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
} from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../api/products.api";
import {
  Product,
  ProductsResponse,
  Category,
  SortOption,
} from "../types/product";
import { ProductGrid } from "../components/product/ProductGrid";
import { ProductGridSkeleton } from "../components/product/ProductCardSkeleton";
import { Pagination } from "../components/ui/Pagination";
import { Container } from "../components/ui/Container";
import { useDebounce } from "../hooks/useDebounce";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { discountedPrice } from "../utils/format";

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = (searchParams.get("sort") as SortOption) || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        // category fetch failure is non-blocking
      });
  }, []);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    if (debouncedSearch.trim() !== q) {
      const nextParams = new URLSearchParams(searchParams);
      if (debouncedSearch.trim()) {
        nextParams.set("q", debouncedSearch.trim());
        nextParams.delete("category");
        nextParams.set("page", "1");
      } else {
        nextParams.delete("q");
        nextParams.set("page", "1");
      }
      setSearchParams(nextParams);
    }
  }, [debouncedSearch, q, searchParams, setSearchParams]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchProducts(
      { q, category, sort, page, limit: 12 },
      controller.signal
    )
      .then((res) => {
        let products = res.products;

        if (sort) {
          products = [...products].sort((a, b) => {
            const priceA = discountedPrice(a.price, a.discountPercentage);
            const priceB = discountedPrice(b.price, b.discountPercentage);
            switch (sort) {
              case "price-asc":
                return priceA - priceB;
              case "price-desc":
                return priceB - priceA;
              case "rating-desc":
                return b.rating - a.rating;
              case "title-asc":
                return a.title.localeCompare(b.title);
              default:
                return 0;
            }
          });
        }

        setData({ ...res, products });
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [q, category, sort, page, retryCount]);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextCat = e.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (nextCat) {
      nextParams.set("category", nextCat);
      nextParams.delete("q");
      nextParams.set("page", "1");
      setSearchInput("");
    } else {
      nextParams.delete("category");
      nextParams.set("page", "1");
    }
    setSearchParams(nextParams);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextSort = e.target.value as SortOption;
    const nextParams = new URLSearchParams(searchParams);
    if (nextSort) {
      nextParams.set("sort", nextSort);
    } else {
      nextParams.delete("sort");
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(newPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = useCallback(
    (product: Product) => {
      const result = addItem(product, 1);
      if (!result.success) {
        showToast("Maximum stock reached in cart", "error");
        return;
      }
      showToast("Added to cart ✓", "success");
    },
    [addItem, showToast]
  );

  const total = data?.total ?? 0;
  const limit = 12;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);
  const totalPages = Math.ceil(total / limit);

  return (
    <Container className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Catalog
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading products..."
              : total > 0
              ? `Showing ${startItem}–${endItem} of ${total}`
              : "0 products found"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-5">
          <label htmlFor="search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <input
              id="search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by product name..."
              className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="sm:col-span-1 lg:col-span-4">
          <label htmlFor="category" className="sr-only">
            Filter by category
          </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="cursor-pointer w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1 lg:col-span-3">
          <label htmlFor="sort" className="sr-only">
            Sort products
          </label>
          <select
            id="sort"
            value={sort}
            onChange={handleSortChange}
            className="cursor-pointer w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating-desc">Rating: high to low</option>
            <option value="title-asc">Name A→Z</option>
          </select>
        </div>
      </div>

      {loading && <ProductGridSkeleton count={12} />}

      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Error loading catalog
          </p>
          <p className="mt-2 text-base text-red-900">{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((c) => c + 1)}
            className="cursor-pointer mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data && data.products.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <p className="text-base font-medium text-slate-700">
            No products found.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search query or filters.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleClearFilters}
              className="cursor-pointer inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {!loading && !error && data && data.products.length > 0 && (
        <div className="space-y-8">
          <ProductGrid products={data.products} onAdd={handleAddToCart} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </Container>
  );
}
