import { Link } from "react-router-dom";
import { CartItem } from "../../types/cart";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice, discountedPrice } from "../../utils/format";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();

  const handleRemove = () => {
    removeItem(item.productId);
    showToast("Removed from cart", "info");
  };

  const unitDiscountedPrice = discountedPrice(
    item.price,
    item.discountPercentage
  );
  const lineTotal = unitDiscountedPrice * item.quantity;
  const isMin = item.quantity <= 1;
  const isMax = item.quantity >= item.stock;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <Link
          to={`/products/${item.productId}`}
          className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50 p-2 dark:bg-slate-800"
          aria-label={`View details of ${item.title}`}
        >
          <img
            src={item.thumbnail}
            alt={item.title}
            width={80}
            height={80}
            className="h-full w-full object-contain"
          />
        </Link>

        <div className="space-y-1">
          <Link
            to={`/products/${item.productId}`}
            className="line-clamp-1 font-semibold text-slate-900 transition hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
          >
            {item.title}
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Unit: {formatPrice(unitDiscountedPrice)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 sm:justify-end">
        <div className="flex items-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            disabled={isMin}
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            aria-label={`Decrease quantity of ${item.title}`}
            className="cursor-pointer px-2.5 py-1 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 dark:text-slate-300 dark:hover:bg-slate-700 dark:disabled:text-slate-600"
          >
            &minus;
          </button>
          <span className="w-10 text-center text-sm font-semibold text-slate-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            type="button"
            disabled={isMax}
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            aria-label={`Increase quantity of ${item.title}`}
            className="cursor-pointer px-2.5 py-1 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 dark:text-slate-300 dark:hover:bg-slate-700 dark:disabled:text-slate-600"
          >
            &#43;
          </button>
        </div>

        <div className="min-w-24 text-right">
          <p className="font-bold text-slate-900 dark:text-white">
            {formatPrice(lineTotal)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${item.title} from cart`}
          className="cursor-pointer text-sm font-medium text-rose-600 transition hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
