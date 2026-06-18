"use client";
import { useApi } from "@/lib/use-fetch";
import { PageHeader } from "@/components/layout/page-header";
import { Badge, statusTone } from "@/components/ui/badge";
import { DataTable, THead, TH, TR, TD } from "@/components/ui/table";
import { Loading, Empty } from "@/components/ui/empty";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PurchaseOrdersPage() {
  const { data, loading } = useApi<any>("/api/purchase-orders?limit=50");
  return (
    <>
      <PageHeader title="Purchase Orders" subtitle="Procurement & goods receipt" />
      {loading ? <Loading /> : !data?.data?.length ? <Empty message="No purchase orders yet." /> : (
        <DataTable>
          <THead><TR><TH>PO #</TH><TH>Supplier</TH><TH>Warehouse</TH><TH className="text-right">Lines</TH><TH className="text-right">Total</TH><TH>Expected</TH><TH>Status</TH></TR></THead>
          <tbody>
            {data.data.map((po: any) => (
              <TR key={po._id}>
                <TD className="font-mono text-xs">{po.poNumber}</TD>
                <TD className="font-medium">{po.supplier?.name}</TD>
                <TD>{po.warehouse?.code}</TD>
                <TD className="text-right">{po.lines?.length || 0}</TD>
                <TD className="text-right">{formatCurrency(po.total)}</TD>
                <TD>{formatDate(po.expectedDate)}</TD>
                <TD><Badge tone={statusTone(po.status)}>{po.status}</Badge></TD>
              </TR>
            ))}
          </tbody>
        </DataTable>
      )}
    </>
  );
}
