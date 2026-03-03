"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ShieldCheck,
    ScanSearch,
    FileText,
    SlidersHorizontal,
    Download,
    ArrowRight,
    Activity,
    CheckCircle2,
    AlertTriangle,
    Clock,
    TrendingUp,
    Zap,
    Eye,
    Bell,
} from "lucide-react";

const quickActions = [
    {
        title: "Detection Center",
        description: "Upload images or run live detection for PPE compliance",
        href: "/detection",
        icon: ScanSearch,
        color: "#3DB9EB",
        bgGradient: "from-sky-50 to-blue-50",
    },
    {
        title: "Incident Log",
        description: "Review and manage detected safety violations",
        href: "/incidents",
        icon: FileText,
        color: "#F59E0B",
        bgGradient: "from-amber-50 to-yellow-50",
    },
    {
        title: "AI Configuration",
        description: "Configure detection models and sensitivity thresholds",
        href: "/config",
        icon: SlidersHorizontal,
        color: "#8B5CF6",
        bgGradient: "from-violet-50 to-purple-50",
    },
    {
        title: "Export & Reports",
        description: "Generate compliance reports and export data",
        href: "/reports",
        icon: Download,
        color: "#10B981",
        bgGradient: "from-emerald-50 to-green-50",
    },
];

const recentActivities = [
    {
        id: 1,
        type: "violation",
        message: "Hard hat violation detected in Assembly Zone A",
        time: "2 min ago",
        icon: AlertTriangle,
        iconColor: "text-rose-500",
        iconBg: "bg-rose-50",
    },
    {
        id: 2,
        type: "resolved",
        message: "Incident #1042 verified and resolved by Admin",
        time: "15 min ago",
        icon: CheckCircle2,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-50",
    },
    {
        id: 3,
        type: "system",
        message: "AI model updated to v2.4.1 — improved vest detection",
        time: "1 hr ago",
        icon: Zap,
        iconColor: "text-violet-500",
        iconBg: "bg-violet-50",
    },
    {
        id: 4,
        type: "alert",
        message: "Warehouse Zone B camera feed restored",
        time: "2 hrs ago",
        icon: Eye,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50",
    },
    {
        id: 5,
        type: "notification",
        message: "Weekly compliance report ready for download",
        time: "3 hrs ago",
        icon: Bell,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50",
    },
];

const systemStats = [
    { label: "System Uptime", value: "99.8%", icon: Activity, color: "text-emerald-500" },
    { label: "AI Accuracy", value: "97.2%", icon: TrendingUp, color: "text-blue-500" },
    { label: "Active Cameras", value: "8 / 10", icon: Eye, color: "text-violet-500" },
    { label: "Pending Review", value: "3", icon: Clock, color: "text-amber-500" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomePage() {
    const currentHour = new Date().getHours();
    const greeting =
        currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

    return (
        <MainLayout title="Home" description="Welcome back to your safety command center">
            <motion.div
                className="max-w-7xl mx-auto space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Hero Welcome Section */}
                <motion.div variants={itemVariants}>
                    <div
                        className="relative overflow-hidden rounded-2xl p-8 md:p-10"
                        style={{
                            background: "linear-gradient(135deg, #1B7FB5 0%, #145f88 50%, #0e4a6b 100%)",
                        }}
                    >
                        <div className="absolute inset-0 opacity-10">
                            <div
                                className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
                                style={{ background: "radial-gradient(circle, #FFC223 0%, transparent 70%)" }}
                            />
                            <div
                                className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full"
                                style={{ background: "radial-gradient(circle, #3DB9EB 0%, transparent 70%)" }}
                            />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                        style={{ background: "#FFC223", boxShadow: "0 8px 24px rgba(255,194,35,0.3)" }}
                                    >
                                        <ShieldCheck className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                                            {greeting}, Admin
                                        </h2>
                                        <p className="text-white/60 text-sm mt-0.5">
                                            SSCI Workplace Safety AI Platform
                                        </p>
                                    </div>
                                </div>
                                <p className="text-white/80 text-sm md:text-base max-w-lg leading-relaxed">
                                    All systems are running smoothly. Your factory has maintained a{" "}
                                    <span className="text-[#FFC223] font-semibold">94.7% compliance rate</span>{" "}
                                    this week with 8 active monitoring zones.
                                </p>
                            </div>

                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 shrink-0"
                                style={{
                                    background: "#FFC223",
                                    color: "#1B7FB5",
                                    boxShadow: "0 4px 16px rgba(255,194,35,0.3)",
                                }}
                            >
                                View Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* System Status Bar */}
                <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {systemStats.map((stat) => (
                            <Card key={stat.label} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide truncate">
                                            {stat.label}
                                        </p>
                                        <p className="text-lg font-bold text-slate-900 tabular-nums">
                                            {stat.value}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions + Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Quick Actions */}
                    <motion.div variants={itemVariants} className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-slate-900">Quick Actions</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {quickActions.map((action) => (
                                <Link key={action.title} href={action.href}>
                                    <Card className={`group bg-gradient-to-br ${action.bgGradient} border-transparent hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full`}>
                                        <CardContent className="p-5">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
                                                    style={{ background: action.color }}
                                                >
                                                    <action.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h4 className="text-sm font-semibold text-slate-900">
                                                            {action.title}
                                                        </h4>
                                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                        {action.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div variants={itemVariants} className="lg:col-span-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
                            <Link
                                href="/incidents"
                                className="text-xs font-medium hover:underline"
                                style={{ color: "#1B7FB5" }}
                            >
                                View All
                            </Link>
                        </div>
                        <Card className="bg-white shadow-sm">
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {recentActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors"
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-lg ${activity.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
                                            >
                                                <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-slate-700 leading-snug">
                                                    {activity.message}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </MainLayout>
    );
}
