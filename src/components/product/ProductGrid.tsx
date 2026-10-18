import { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAdd?: (product: Product) => void;
}

export function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
