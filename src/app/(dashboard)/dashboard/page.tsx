"use client";
import { Package, DollarSign, AlertTriangle, ClipboardList } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import { useApi } from "@/lib/use-fetch";
import { StatCard } from "@/components/layout/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/empty";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const { data, loading } = useApi<any>("/api/dashboard/stats");

  if (loading) return <Loading />;
  const s = data || {};

  // Pivot movementsByDay into { day, IN, OUT, ... }
  const byDay: Record<string, any> = {};
  (s.movementsByDay || []).forEach((m: any) => {
    const day = m._id.day;
    byDay[day] = byDay[day] || { day };
    byDay[day][m._id.type] = m.count;
  });
  const trend = Object.values(byDay);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Operational overview of inventory and procurement" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Products" value={formatNumber(s.totalProducts)} icon={<Package className="h-5 w-5" />} tone="blue" />
        <StatCard label="Stock Value" value={formatCurrency(s.totalStockValue)} icon={<DollarSign className="h-5 w-5" />} tone="green" />
        <StatCard label="Low-Stock Items" value={formatNumber(s.lowStockCount)} icon={<AlertTriangle className="h-5 w-5" />} tone="amber" hint="At or below reorder point" />
        <StatCard label="Open Purchase Orders" value={formatNumber(s.openPOCount)} icon={<ClipboardList className="h-5 w-5" />} tone="red" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Stock Movements (30 days)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="IN" stroke="#16a34a" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="OUT" stroke="#dc2626" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="TRANSFER" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Stock by Warehouse</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={s.stockByWarehouse || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="warehouse" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Top Products by Stock Value</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(s.topProductsByValue || []).map((p: any) => (
              <li key={p.name} className="flex items-center justify-between text-sm">
                <span>{p.name}</span>
                <span className="font-medium">{formatCurrency(p.value)}</span>
              </li>
            ))}
            {(!s.topProductsByValue || s.topProductsByValue.length === 0) && (
              <li className="text-sm text-gray-400">No data yet — seed the database.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
