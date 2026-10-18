import { Link } from "react-router-dom";
import { Container } from "../components/ui/Container";

export function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-base text-slate-600">
        The page you are looking for does not exist.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Go to catalog
        </Link>
      </div>
    </Container>
  );
}
