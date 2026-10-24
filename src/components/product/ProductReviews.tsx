import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Review } from "../../types/product";
import { reviewsStorage } from "../../models/reviewsStorage";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/format";

interface ProductReviewsProps {
  productId: number;
  apiReviews: Review[];
  onChange?: (reviews: Review[]) => void;
}

interface ReviewErrors {
  rating?: string;
  comment?: string;
}

function Stars({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <span aria-label={`${value} out of 5`} className="text-amber-500">
      {"★".repeat(filled)}
      <span className="text-slate-300">{"★".repeat(5 - filled)}</span>
    </span>
  );
}

function readLocalReviews(productId: number): Review[] {
  return reviewsStorage.get()?.[productId] ?? [];
}

export function ProductReviews({
  productId,
  apiReviews,
  onChange,
}: ProductReviewsProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [localReviews, setLocalReviews] = useState<Review[]>(() =>
    readLocalReviews(productId)
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<ReviewErrors>({});

  useEffect(() => {
    setLocalReviews(readLocalReviews(productId));
    setRating(0);
    setComment("");
    setErrors({});
  }, [productId]);

  const allReviews = useMemo(
    () => [...localReviews, ...apiReviews],
    [localReviews, apiReviews]
  );

  const averageRating = useMemo(() => {
    if (allReviews.length === 0) {
      return 0;
    }
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / allReviews.length;
  }, [allReviews]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors: ReviewErrors = {};
    if (rating < 1) {
      nextErrors.rating = "Please select a rating";
    }
    if (comment.trim().length < 10) {
      nextErrors.comment = "Comment must be at least 10 characters";
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const review: Review = {
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      reviewerName: user?.username || "Guest",
    };

    const nextLocal = [review, ...localReviews];
    reviewsStorage.set({
      ...(reviewsStorage.get() ?? {}),
      [productId]: nextLocal,
    });

    setLocalReviews(nextLocal);
    setRating(0);
    setComment("");
    onChange?.([...nextLocal, ...apiReviews]);
    showToast("Review added ✓", "success");
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900">Customer reviews</h2>
          {allReviews.length > 0 && (
            <span className="flex items-center gap-2 text-sm text-slate-600">
              <Stars value={averageRating} />
              <span className="font-semibold text-slate-900">
                {averageRating.toFixed(1)}
              </span>
              <span>({allReviews.length})</span>
            </span>
          )}
        </div>

        {allReviews.length === 0 ? (
          <p className="text-sm text-slate-500">
            No reviews yet. Be the first to write one.
          </p>
        ) : (
          <ul className="space-y-4">
            {allReviews.map((review, index) => (
              <li
                key={`${review.date}-${review.reviewerName}-${index}`}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {review.reviewerName}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDate(review.date)}
                  </span>
                </div>
                <div className="mt-1 text-sm">
                  <Stars value={review.rating} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {review.comment}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2 lg:self-start"
      >
        <h3 className="text-base font-bold text-slate-900">Write a review</h3>

        <div>
          <span className="block text-sm font-medium text-slate-700">
            Rating
          </span>
          <div className="mt-1.5 flex gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                onClick={() => {
                  setRating(value);
                  if (errors.rating) {
                    setErrors((prev) => ({ ...prev, rating: undefined }));
                  }
                }}
                className={`cursor-pointer text-2xl transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  value <= rating ? "text-amber-500" : "text-slate-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="mt-1 text-xs text-red-600">{errors.rating}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="review-comment"
            className="block text-sm font-medium text-slate-700"
          >
            Comment
          </label>
          <textarea
            id="review-comment"
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (errors.comment) {
                setErrors((prev) => ({ ...prev, comment: undefined }));
              }
            }}
            className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-xs transition focus:outline-none focus:ring-2 ${
              errors.comment
                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-200"
            }`}
            placeholder="Share your experience with this product"
          />
          {errors.comment && (
            <p className="mt-1 text-xs text-red-600">{errors.comment}</p>
          )}
        </div>

        <button
          type="submit"
          className="cursor-pointer flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit review
        </button>
      </form>
    </div>
  );
}
