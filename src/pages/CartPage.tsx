import { Link } from "react-router-dom";
import { Container } from "../components/ui/Container";

export function CartPage() {
  return (
    <Container className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Shopping Cart
      </h1>
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-base text-slate-600">Your cart is empty.</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Browse products
        </Link>
      </div>
    </Container>
  );
}
