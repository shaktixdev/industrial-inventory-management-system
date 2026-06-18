"use client";
import { useApi } from "@/lib/use-fetch";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { DataTable, THead, TH, TR, TD } from "@/components/ui/table";
import { Loading, Empty } from "@/components/ui/empty";

export default function SuppliersPage() {
  const { data, loading } = useApi<any>("/api/suppliers");
  return (
    <>
      <PageHeader title="Suppliers" subtitle="Vendor master data" />
      {loading ? <Loading /> : !data?.data?.length ? <Empty message="No suppliers yet." /> : (
        <DataTable>
          <THead><TR><TH>Code</TH><TH>Name</TH><TH>Email</TH><TH className="text-right">Lead Time</TH><TH className="text-right">Rating</TH><TH>Status</TH></TR></THead>
          <tbody>
            {data.data.map((s: any) => (
              <TR key={s._id}>
                <TD className="font-mono text-xs">{s.code}</TD>
                <TD className="font-medium">{s.name}</TD>
                <TD>{s.email || "-"}</TD>
                <TD className="text-right">{s.leadTimeDays}d</TD>
                <TD className="text-right">{s.rating}/5</TD>
                <TD><Badge tone={s.isActive ? "green" : "red"}>{s.isActive ? "Active" : "Inactive"}</Badge></TD>
              </TR>
            ))}
          </tbody>
        </DataTable>
      )}
    </>
  );
}
