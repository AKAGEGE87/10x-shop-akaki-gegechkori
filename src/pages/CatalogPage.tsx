import { Container } from "../components/ui/Container";

export function CatalogPage() {
  return (
    <Container>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Catalog
        </h1>
        <p className="text-slate-600">Explore our collection of products.</p>
      </div>
    </Container>
  );
}
