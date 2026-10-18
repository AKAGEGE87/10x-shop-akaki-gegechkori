export function LoadingSpinner({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
