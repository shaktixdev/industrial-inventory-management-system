"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useApi } from "@/lib/use-fetch";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/layout/stat-card";
import { Loading } from "@/components/ui/empty";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function ReportsPage() {
  const { data, loading } = useApi<any>("/api/dashboard/stats");
  if (loading) return <Loading />;
  const s = data || {};
  return (
    <>
      <PageHeader title="Reports" subtitle="Valuation & inventory analytics" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Stock Value" value={formatCurrency(s.totalStockValue)} tone="green" />
        <StatCard label="Active Products" value={formatNumber(s.totalProducts)} tone="blue" />
        <StatCard label="Low-Stock Items" value={formatNumber(s.lowStockCount)} tone="amber" />
      </div>
      <Card>
        <CardHeader><CardTitle>Stock Value by Top Products</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.topProductsByValue || []} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                <Bar dataKey="value" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
