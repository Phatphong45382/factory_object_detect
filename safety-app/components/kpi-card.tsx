"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
    label: string;
    value: number | string;
    format?: "number" | "percent" | "days" | "range";
    suffix?: string;
    icon?: React.ReactNode;
    lastUpdated?: string;
    subtitle?: string;
}

export function KPICard({ label, value, format = "number", suffix, icon, lastUpdated, subtitle }: KPICardProps) {
    const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
    const isAnimatable = !isNaN(numericValue) && format !== "range";

    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });

    const displayValue = useTransform(spring, (current) => {
        let formatted: string;
        switch (format) {
            case "percent":
                formatted = `${current.toFixed(1)}%`;
                break;
            case "days":
                formatted = `${Math.round(current)}d`;
                break;
            default: {
                const hasDecimals = typeof value === "number" && value % 1 !== 0;
                formatted = hasDecimals
                    ? new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(current)
                    : new Intl.NumberFormat("en-US").format(Math.round(current));
                break;
            }
        }
        return suffix && format !== "days" ? `${formatted} ${suffix}` : formatted;
    });

    useEffect(() => {
        if (isAnimatable) {
            spring.set(numericValue);
        }
    }, [numericValue, spring, isAnimatable]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
        >
            <Card className="bg-white shadow-enterprise-sm hover:shadow-enterprise-md transition-all duration-300 hover:-translate-y-0.5 h-full">
                <CardContent className="p-5 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide leading-tight">{label}</p>
                        {icon && <span className="text-slate-300 shrink-0">{icon}</span>}
                    </div>
                    <div className="mt-3">
                        {isAnimatable ? (
                            <motion.p className="text-2xl font-bold tabular-nums text-slate-900 whitespace-nowrap">
                                {displayValue}
                            </motion.p>
                        ) : (
                            <p className="text-2xl font-bold tabular-nums text-slate-900 whitespace-nowrap">
                                {String(value)}{suffix ? ` ${suffix}` : ""}
                            </p>
                        )}
                        {lastUpdated && (
                            <p className="text-[11px] text-slate-400 mt-1">
                                {new Date(lastUpdated).toLocaleString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                            </p>
                        )}
                        {subtitle && !lastUpdated && (
                            <p className="text-[11.5px] font-medium text-slate-500/80 mt-1.5 leading-snug">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
