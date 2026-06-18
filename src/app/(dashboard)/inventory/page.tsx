"use client";
import { useState } from "react";
import { useApi } from "@/lib/use-fetch";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, THead, TH, TR, TD } from "@/components/ui/table";
import { Loading, Empty } from "@/components/ui/empty";
import { formatNumber } from "@/lib/utils";

export default function InventoryPage() {
  const [lowOnly, setLowOnly] = useState(false);
  const { data, loading } = useApi<any>(`/api/inventory?limit=100${lowOnly ? "&lowStock=true" : ""}`);

  return (
    <>
      <PageHeader
        title="Inventory"
        subtitle="Stock levels per product per warehouse"
        action={<Button variant={lowOnly ? "primary" : "secondary"} onClick={() => setLowOnly(!lowOnly)}>{lowOnly ? "Showing Low Stock" : "Show Low Stock"}</Button>}
      />
      {loading ? <Loading /> : !data?.data?.length ? <Empty message="No inventory records." /> : (
        <DataTable>
          <THead>
            <TR><TH>Product</TH><TH>SKU</TH><TH>Warehouse</TH><TH>Bin</TH><TH className="text-right">On Hand</TH><TH className="text-right">Reserved</TH><TH className="text-right">Available</TH><TH>Status</TH></TR>
          </THead>
          <tbody>
            {data.data.map((r: any) => (
              <TR key={r._id} className={r.lowStock ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}>
                <TD className="font-medium">{r.product?.name}</TD>
                <TD className="font-mono text-xs">{r.product?.sku}</TD>
                <TD>{r.warehouse?.code}</TD>
                <TD>{r.bin || "-"}</TD>
                <TD className="text-right">{formatNumber(r.quantityOnHand)}</TD>
                <TD className="text-right">{formatNumber(r.reserved)}</TD>
                <TD className="text-right font-medium">{formatNumber(r.available)}</TD>
                <TD>{r.lowStock ? <Badge tone="amber">Low</Badge> : <Badge tone="green">OK</Badge>}</TD>
              </TR>
            ))}
          </tbody>
        </DataTable>
      )}
    </>
  );
}
