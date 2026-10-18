import { useParams, Link } from "react-router-dom";
import { Container } from "../components/ui/Container";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Container className="space-y-4">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        &larr; Back to catalog
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Product #{id}
      </h1>
      <p className="text-slate-600">Product details placeholder.</p>
    </Container>
  );
}
