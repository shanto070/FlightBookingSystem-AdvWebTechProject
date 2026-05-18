export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{message}</p>;
}
