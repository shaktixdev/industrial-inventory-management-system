import { cn } from "@/lib/utils";

export function DataTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="table-wrapper overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900 dark:text-gray-400">
      {children}
    </thead>
  );
}

export function TH({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <th className={cn("px-4 py-3 font-medium", className)}>{children}</th>;
}

export function TR({ className, children }: { className?: string; children: React.ReactNode }) {
  return <tr className={cn("border-t border-gray-100 dark:border-gray-800", className)}>{children}</tr>;
}

export function TD({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <td className={cn("px-4 py-3", className)}>{children}</td>;
}
