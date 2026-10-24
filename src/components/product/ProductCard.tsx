import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/product";
import { formatPrice, discountedPrice } from "../../utils/format";

interface ProductCardProps {
  product: Product;
  onAdd?: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (product.stock > 0) {
      onAdd?.(product);
    }
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage >= 1;

  return (
    <article
      onClick={handleCardClick}
      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-brand-500"
    >
      <div>
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          <img
            src={product.thumbnail}
            alt={product.title}
            width={300}
            height={300}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            {isOutOfStock ? (
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                Out of stock
              </span>
            ) : isLowStock ? (
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                Only {product.stock} left!
              </span>
            ) : (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                In stock
              </span>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {product.category}
            {product.brand ? ` · ${product.brand}` : ""}
          </p>

          <h3 className="line-clamp-2 text-base font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
            {product.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500">
            <span>★</span>
            <span className="text-slate-700">{product.rating.toFixed(1)}</span>
          </div>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-slate-900">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-bold text-emerald-700">
                  -{Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="cursor-pointer flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
