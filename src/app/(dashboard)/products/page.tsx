"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useApi } from "@/lib/use-fetch";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, statusTone } from "@/components/ui/badge";
import { DataTable, THead, TH, TR, TD } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Loading, Empty } from "@/components/ui/empty";
import { formatCurrency } from "@/lib/utils";

const empty = { sku: "", name: "", unitCost: 0, unitPrice: 0, reorderPoint: 0, reorderQuantity: 0, unitOfMeasure: "EA" };

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const { data, loading, refetch } = useApi<any>(`/api/products?search=${encodeURIComponent(query)}&limit=50`);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(empty);
  const [err, setErr] = useState("");

  async function save() {
    setErr("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        unitCost: Number(form.unitCost), unitPrice: Number(form.unitPrice),
        reorderPoint: Number(form.reorderPoint), reorderQuantity: Number(form.reorderQuantity),
      }),
    });
    const json = await res.json();
    if (!res.ok) { setErr(json?.error?.message || "Failed"); return; }
    setOpen(false); setForm(empty); refetch();
  }

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Master catalog of SKUs"
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New Product</Button>}
      />

      <form onSubmit={(e) => { e.preventDefault(); setQuery(search); }} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input className="pl-9" placeholder="Search by name or SKU" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {open && (
        <Card className="p-5">
          <h3 className="mb-3 font-semibold">New Product</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input placeholder="SKU *" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input type="number" placeholder="Unit Cost" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} />
            <Input type="number" placeholder="Unit Price" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} />
            <Input type="number" placeholder="Reorder Point" value={form.reorderPoint} onChange={(e) => setForm({ ...form, reorderPoint: e.target.value })} />
            <Input type="number" placeholder="Reorder Qty" value={form.reorderQuantity} onChange={(e) => setForm({ ...form, reorderQuantity: e.target.value })} />
          </div>
          {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          <div className="mt-4 flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="ghost" onClick={() => { setOpen(false); setErr(""); }}>Cancel</Button>
          </div>
        </Card>
      )}

      {loading ? <Loading /> : !data?.data?.length ? <Empty message="No products yet. Create one or run the seed script." /> : (
        <DataTable>
          <THead>
            <TR><TH>SKU</TH><TH>Name</TH><TH>Category</TH><TH className="text-right">Cost</TH><TH className="text-right">Price</TH><TH className="text-right">Reorder</TH><TH>Status</TH></TR>
          </THead>
          <tbody>
            {data.data.map((p: any) => (
              <TR key={p._id}>
                <TD className="font-mono text-xs">{p.sku}</TD>
                <TD className="font-medium">{p.name}</TD>
                <TD>{p.category?.name || "-"}</TD>
                <TD className="text-right">{formatCurrency(p.unitCost)}</TD>
                <TD className="text-right">{formatCurrency(p.unitPrice)}</TD>
                <TD className="text-right">{p.reorderPoint}</TD>
                <TD><Badge tone={statusTone(p.status)}>{p.status}</Badge></TD>
              </TR>
            ))}
          </tbody>
        </DataTable>
      )}
    </>
  );
}
