"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { KPICard } from "@/components/kpi-card";
import { ChartCard } from "@/components/chart-card";
import { ShieldCheck, ScanSearch, AlertTriangle, Clock, Camera } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const complianceData = [
    { day: "Mon", rate: 92.4 },
    { day: "Tue", rate: 93.1 },
    { day: "Wed", rate: 91.8 },
    { day: "Thu", rate: 94.2 },
    { day: "Fri", rate: 95.5 },
    { day: "Sat", rate: 96.0 },
    { day: "Sun", rate: 94.7 },
];

const zoneData = [
    { zone: "Assembly", violations: 45 },
    { zone: "Warehouse", violations: 32 },
    { zone: "Loading", violations: 28 },
    { zone: "Maintenance", violations: 15 },
    { zone: "Packaging", violations: 12 },
];

export default function DashboardPage() {
    return (
        <MainLayout title="Dashboard" description="Workplace Safety Overview">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* KPI Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <KPICard
                        label="Compliance Rate"
                        value={94.7}
                        format="percent"
                        icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
                    />
                    <KPICard
                        label="Total Detections"
                        value={14285}
                        format="number"
                        icon={<ScanSearch className="w-5 h-5 text-blue-500" />}
                    />
                    <KPICard
                        label="Violations Today"
                        value={12}
                        format="number"
                        icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
                    />
                    <KPICard
                        label="Avg Response"
                        value={3.2}
                        suffix="min"
                        icon={<Clock className="w-5 h-5 text-amber-500" />}
                    />
                    <KPICard
                        label="Active Zones"
                        value={8}
                        format="number"
                        icon={<Camera className="w-5 h-5 text-slate-500" />}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
                    <ChartCard
                        title="7-Day Compliance Trend"
                        description="Overall PPE compliance rate across all zones"
                        className="md:col-span-7"
                    >
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={complianceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3DB9EB" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3DB9EB" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                                    <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} tickFormatter={(val) => `${val}%`} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(value: any) => [`${value}%`, 'Compliance']}
                                    />
                                    <Area type="monotone" dataKey="rate" stroke="#3DB9EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    <ChartCard
                        title="Violations by Zone"
                        description="Distribution of safety violations"
                        className="md:col-span-5"
                    >
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={zoneData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                    <YAxis dataKey="zone" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1E293B' }} width={80} />
                                    <RechartsTooltip
                                        cursor={{ fill: '#F1F5F9' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="violations" radius={[0, 4, 4, 0]} barSize={24}>
                                        {zoneData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? "#EF4444" : index === 1 ? "#F59E0B" : "#3DB9EB"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>
            </div>
        </MainLayout>
    );
}
