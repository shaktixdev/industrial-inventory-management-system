"use client";
import { Warehouse as WhIcon } from "lucide-react";
import { useApi } from "@/lib/use-fetch";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loading, Empty } from "@/components/ui/empty";

export default function WarehousesPage() {
  const { data, loading } = useApi<any>("/api/warehouses");
  return (
    <>
      <PageHeader title="Warehouses" subtitle="Physical storage sites, zones and bins" />
      {loading ? <Loading /> : !data?.data?.length ? <Empty message="No warehouses yet." /> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((w: any) => (
            <Card key={w._id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-brand-50 p-2 text-brand-600 dark:bg-brand-900/30"><WhIcon className="h-5 w-5" /></div>
                    <div>
                      <p className="font-semibold">{w.name}</p>
                      <p className="font-mono text-xs text-gray-400">{w.code}</p>
                    </div>
                  </div>
                  <Badge tone={w.isActive ? "green" : "red"}>{w.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  {[w.address?.city, w.address?.country].filter(Boolean).join(", ") || "No address"}
                </p>
                <p className="mt-1 text-xs text-gray-400">{(w.zones?.length || 0)} zones</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
