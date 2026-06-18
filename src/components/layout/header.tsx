"use client";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();
  const user = session?.user as any;
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="md:hidden font-semibold">IIMS</div>
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm font-medium">{user?.name ?? "User"}</span>
          <span className="text-xs text-gray-400">{user?.role ?? ""}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </header>
  );
}
