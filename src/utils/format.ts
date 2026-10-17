export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function discountedPrice(price: number, discountPercentage: number): number {
  if (!discountPercentage || discountPercentage <= 0) {
    return price;
  }
  const result = price * (1 - discountPercentage / 100);
  return Math.round(result * 100) / 100;
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
