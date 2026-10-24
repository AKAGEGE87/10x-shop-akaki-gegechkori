import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      <Container className="flex flex-col items-center justify-between gap-4 text-center text-sm text-slate-500 sm:flex-row sm:text-left dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} 10X Shop. All rights reserved.</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Powered by DummyJSON API</p>
      </Container>
    </footer>
  );
}
