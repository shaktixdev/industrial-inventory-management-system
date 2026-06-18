"use client";
import { useApi } from "@/lib/use-fetch";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { DataTable, THead, TH, TR, TD } from "@/components/ui/table";
import { Loading, Empty } from "@/components/ui/empty";
import { formatDateTime, formatNumber } from "@/lib/utils";

const tone: Record<string, any> = { IN: "green", OUT: "red", TRANSFER: "blue", ADJUSTMENT: "amber" };

export default function StockMovementsPage() {
  const { data, loading } = useApi<any>("/api/stock-movements?limit=100");
  return (
    <>
      <PageHeader title="Stock Movements" subtitle="Immutable ledger of every stock change" />
      {loading ? <Loading /> : !data?.data?.length ? <Empty message="No movements recorded yet." /> : (
        <DataTable>
          <THead><TR><TH>Date</TH><TH>Type</TH><TH>Product</TH><TH className="text-right">Qty</TH><TH>From</TH><TH>To</TH><TH>Reference</TH><TH>By</TH></TR></THead>
          <tbody>
            {data.data.map((m: any) => (
              <TR key={m._id}>
                <TD className="whitespace-nowrap text-xs text-gray-500">{formatDateTime(m.createdAt)}</TD>
                <TD><Badge tone={tone[m.type]}>{m.type}</Badge></TD>
                <TD className="font-medium">{m.product?.name} <span className="font-mono text-xs text-gray-400">{m.product?.sku}</span></TD>
                <TD className="text-right">{formatNumber(m.quantity)}</TD>
                <TD>{m.fromWarehouse?.code || "-"}</TD>
                <TD>{m.toWarehouse?.code || "-"}</TD>
                <TD className="text-xs">{m.reference || "-"}</TD>
                <TD className="text-xs text-gray-500">{m.performedBy?.name || "-"}</TD>
              </TR>
            ))}
          </tbody>
        </DataTable>
      )}
    </>
  );
}
