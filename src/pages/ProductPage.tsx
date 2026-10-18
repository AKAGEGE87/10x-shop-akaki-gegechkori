import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../api/products.api";
import { Product } from "../types/product";
import { Container } from "../components/ui/Container";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { NotFoundPage } from "./NotFoundPage";
import { formatPrice, discountedPrice } from "../utils/format";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const numericId = Number(id);
  const isValidId = Boolean(id && Number.isInteger(numericId) && numericId > 0);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(isValidId);
  const [error, setError] = useState<string | null>(null);
  const [is404, setIs404] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  const handleAddToCart = () => {
    if (isOutOfStock || quantity < 1) {
      return;
    }
    setFeedback(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart ✓`);
    window.setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  return (
    <Container className="space-y-8 py-4">
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <span>&larr;</span>
          <span>Back to catalog</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
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
                    onClick={() => setSelectedImage(img)}
                    className={`cursor-pointer h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white p-1.5 transition ${
                      isSelected
                        ? "border-indigo-600 ring-2 ring-indigo-600"
                        : "border-slate-200 hover:border-slate-400"
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
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {product.category}
                {product.brand ? ` · ${product.brand}` : ""}
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {product.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                <span>★</span>
                <span className="text-slate-900">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <div>
                {isOutOfStock ? (
                  <span className="rounded-md bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                    Out of stock
                  </span>
                ) : isLowStock ? (
                  <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    Only {product.stock} left!
                  </span>
                ) : (
                  <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    In stock
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {formatPrice(finalPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-bold text-emerald-700">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                </>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h2 className="text-sm font-medium text-slate-900">Description</h2>
              <p className="mt-2 text-base leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-6">
            {feedback && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800 shadow-xs">
                {feedback}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                <button
                  type="button"
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={handleDecrease}
                  className="cursor-pointer px-3.5 py-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  &minus;
                </button>
                <span className="w-12 text-center text-sm font-semibold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={isOutOfStock || quantity >= product.stock}
                  onClick={handleIncrease}
                  className="cursor-pointer px-3.5 py-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  &#43;
                </button>
              </div>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="cursor-pointer flex flex-1 items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {isOutOfStock ? "Out of stock" : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
