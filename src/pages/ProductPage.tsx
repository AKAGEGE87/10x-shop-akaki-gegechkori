import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchProductById, fetchRelatedProducts } from "../api/products.api";
import { Product, Review } from "../types/product";
import { Container } from "../components/ui/Container";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ProductGrid } from "../components/product/ProductGrid";
import { ProductReviews } from "../components/product/ProductReviews";
import { NotFoundPage } from "./NotFoundPage";
import { formatPrice, discountedPrice } from "../utils/format";
import { reviewsStorage } from "../models/reviewsStorage";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

type ProductTab = "description" | "reviews";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const numericId = Number(id);
  const isValidId = Boolean(id && Number.isInteger(numericId) && numericId > 0);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(isValidId);
  const [error, setError] = useState<string | null>(null);
  const [is404, setIs404] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<ProductTab>("description");
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const loadProduct = useCallback(async () => {
    if (!isValidId) {
      return;
    }

    setLoading(true);
    setError(null);
    setIs404(false);

    try {
      const data = await fetchProductById(numericId);
      setProduct(data);
      setSelectedImage(data.images?.[0] || data.thumbnail);
      setQuantity(data.stock > 0 ? 1 : 0);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load product.";
      if (message.includes("404")) {
        setIs404(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [isValidId, numericId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    setActiveTab("description");
    setRelatedProducts([]);
    setLocalReviews(reviewsStorage.get()?.[numericId] ?? []);
  }, [numericId]);

  const productId = product?.id;
  const productCategory = product?.category;

  useEffect(() => {
    if (productId === undefined || !productCategory) {
      return;
    }

    const controller = new AbortController();
    fetchRelatedProducts(productCategory, productId, controller.signal)
      .then(setRelatedProducts)
      .catch(() => {
        setRelatedProducts([]);
      });

    return () => {
      controller.abort();
    };
  }, [productId, productCategory]);

  const allReviews = useMemo(
    () => [...localReviews, ...(product?.reviews ?? [])],
    [localReviews, product]
  );

  const totalReviewsCount = allReviews.length;

  const averageRating = useMemo(() => {
    if (allReviews.length === 0) {
      return product?.rating ?? 0;
    }
    return allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  }, [allReviews, product]);

  const handleAddToCart = useCallback(() => {
    if (!product || product.stock === 0 || quantity < 1) {
      return;
    }
    const result = addItem(product, quantity);
    if (!result.success) {
      showToast("Maximum stock reached in cart", "error");
      return;
    }
    showToast("Added to cart ✓", "success");
  }, [product, quantity, addItem, showToast]);

  const handleAddRelated = useCallback(
    (related: Product) => {
      const result = addItem(related, 1);
      if (!result.success) {
        showToast("Maximum stock reached in cart", "error");
        return;
      }
      showToast("Added to cart ✓", "success");
    },
    [addItem, showToast]
  );

  if (!isValidId || is404) {
    return <NotFoundPage />;
  }

  if (loading) {
    return (
      <Container className="py-12">
        <LoadingSpinner message="Loading product details..." />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Error loading product
          </p>
          <p className="mt-2 text-base text-red-900">
            {error || "Product not found."}
          </p>
          <button
            type="button"
            onClick={loadProduct}
            className="cursor-pointer mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage >= 1;
  const images = Array.from(
    new Set([product.thumbnail, ...(product.images || [])])
  );

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  return (
    <Container className="space-y-8 py-4">
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <span>&larr;</span>
          <span>Back to catalog</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              width={500}
              height={500}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => {
                const isSelected = (selectedImage || product.thumbnail) === img;
                return (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Select product image ${index + 1}`}
                    onClick={() => setSelectedImage(img)}
                    className={`cursor-pointer h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white p-1.5 transition dark:bg-slate-800 ${
                      isSelected
                        ? "border-brand-600 ring-2 ring-brand-600 dark:border-brand-400 dark:ring-brand-400"
                        : "border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} view ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Link
                  to={`/?category=${encodeURIComponent(product.category)}`}
                  className="transition hover:text-brand-600 hover:underline dark:hover:text-brand-400"
                >
                  {product.category}
                </Link>
                {product.brand ? ` · ${product.brand}` : ""}
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {product.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                <span>★</span>
                <span className="text-slate-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </span>
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  · {totalReviewsCount} {totalReviewsCount === 1 ? "review" : "reviews"}
                </span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <div>
                {isOutOfStock ? (
                  <span className="rounded-md bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-950/60 dark:text-red-300">
                    Out of stock
                  </span>
                ) : isLowStock ? (
                  <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    Only {product.stock} left!
                  </span>
                ) : (
                  <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    In stock
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {formatPrice(finalPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-slate-400 line-through dark:text-slate-500">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-6 dark:border-slate-800">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <button
                  type="button"
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                  className="cursor-pointer px-3.5 py-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 dark:text-slate-300 dark:hover:bg-slate-700 dark:disabled:text-slate-600"
                >
                  &minus;
                </button>
                <span className="w-12 text-center text-sm font-semibold text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={isOutOfStock || quantity >= product.stock}
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                  className="cursor-pointer px-3.5 py-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 dark:text-slate-300 dark:hover:bg-slate-700 dark:disabled:text-slate-600"
                >
                  &#43;
                </button>
              </div>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="cursor-pointer flex flex-1 items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
              >
                {isOutOfStock ? "Out of stock" : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div
          role="tablist"
          aria-label="Product information"
          className="flex gap-6 border-b border-slate-200 dark:border-slate-800"
        >
          {(
            [
              { key: "description", label: "Description" },
              { key: "reviews", label: `Reviews (${totalReviewsCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer -mb-px border-b-2 pb-3 text-sm font-semibold transition focus:outline-none ${
                activeTab === tab.key
                  ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "description" ? (
          <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {product.description}
          </p>
        ) : (
          <ProductReviews
            productId={product.id}
            apiReviews={product.reviews ?? []}
            onChange={setLocalReviews}
          />
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Related products
          </h2>
          <ProductGrid products={relatedProducts} onAdd={handleAddRelated} />
        </section>
      )}
    </Container>
  );
}
