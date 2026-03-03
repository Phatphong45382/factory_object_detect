"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, MapPin, XOctagon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AlertData {
    id: string;
    timestamp: string;
    location: string;
    type: string;
    severity: "high" | "medium" | "low";
    thumbnailUrl?: string;
    confidence: number;
}

interface AlertSidebarProps {
    alerts: AlertData[];
}

export function AlertSidebar({ alerts }: AlertSidebarProps) {
    return (
        <div className="w-full h-full flex flex-col bg-white border-l">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 text-rose-600 font-semibold">
                    <AlertTriangle className="w-5 h-5" />
                    <h2>Real-time Alerts</h2>
                </div>
                <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-100">
                    {alerts.length} Active
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence initial={false}>
                    {alerts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                            <ShieldCheckIcon className="w-12 h-12 text-slate-200" />
                            <p>No active violations</p>
                        </div>
                    ) : (
                        alerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: 20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: "auto" }}
                                exit={{ opacity: 0, x: -20, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="border border-rose-200 bg-rose-50/50 rounded-lg p-3 shadow-sm hover:shadow-md hover:bg-rose-50 transition-all cursor-pointer">
                                    <div className="flex gap-3">
                                        <div className="w-16 h-16 rounded bg-slate-200 shrink-0 overflow-hidden relative border border-rose-100">
                                            {alert.thumbnailUrl ? (
                                                <img src={alert.thumbnailUrl} alt="Violation thumbnail" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-rose-100 text-rose-400">
                                                    <XOctagon className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 leading-tight">
                                                    {alert.type}
                                                </Badge>
                                                <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap ml-2">
                                                    {Math.round(alert.confidence * 100)}% conf
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="truncate">{alert.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    <span suppressHydrationWarning>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ShieldCheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
