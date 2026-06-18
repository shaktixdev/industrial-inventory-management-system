import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

export function formatDate(d: string | Date | undefined | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(d: string | Date | undefined | null) {
  if (!d) return "-";
  return new Date(d).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
