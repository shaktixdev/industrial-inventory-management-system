import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, hint, tone = "blue", icon,
}: {
  label: string; value: string; hint?: string;
  tone?: "blue" | "green" | "amber" | "red"; icon?: React.ReactNode;
}) {
  const tones = {
    blue: "text-brand-600 bg-brand-50 dark:bg-brand-900/30",
    green: "text-green-600 bg-green-50 dark:bg-green-900/30",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/30",
    red: "text-red-600 bg-red-50 dark:bg-red-900/30",
  } as const;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
        {icon && <div className={cn("rounded-lg p-2", tones[tone])}>{icon}</div>}
      </div>
    </Card>
  );
}
