import { cn } from "@/lib/utils";

type Tone = "gray" | "green" | "amber" | "red" | "blue";
const tones: Record<Tone, string> = {
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  green: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
};

export function Badge({ tone = "gray", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

// Map common statuses to a tone.
export function statusTone(status?: string): Tone {
  switch (status) {
    case "ACTIVE":
    case "RECEIVED":
    case "APPROVED":
      return "green";
    case "PARTIAL":
    case "SUBMITTED":
    case "DRAFT":
      return "amber";
    case "INACTIVE":
    case "DISCONTINUED":
    case "CANCELLED":
      return "red";
    default:
      return "gray";
  }
}
