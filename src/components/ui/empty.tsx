export function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500 dark:border-gray-700">
      {message}
    </div>
  );
}

export function Loading() {
  return <div className="py-12 text-center text-sm text-gray-400">Loading…</div>;
}
