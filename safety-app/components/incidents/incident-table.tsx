"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Maximize2 } from "lucide-react";

export interface IncidentRecord {
    id: string;
    timestamp: string;
    location: string;
    type: string;
    confidence: number;
    status: "verified" | "pending" | "false_positive";
    imageUrl: string;
}

interface IncidentTableProps {
    data: IncidentRecord[];
    onViewImage: (incident: IncidentRecord) => void;
}

export function IncidentTable({ data, onViewImage }: IncidentTableProps) {
    return (
        <div className="w-full overflow-hidden bg-white border rounded-lg shadow-enterprise-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#F8F9FA] text-slate-500 font-semibold border-b">
                        <tr>
                            <th className="px-4 py-3 whitespace-nowrap">Time</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Violation</th>
                            <th className="px-4 py-3">Confidence</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 text-slate-900 whitespace-nowrap" suppressHydrationWarning>
                                    {new Date(row.timestamp).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-slate-700">{row.location}</td>
                                <td className="px-4 py-3">
                                    <Badge variant="destructive" className="bg-rose-100 text-rose-700">
                                        {row.type}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-slate-700">
                                    {Math.round(row.confidence * 100)}%
                                </td>
                                <td className="px-4 py-3">
                                    <Badge
                                        variant="outline"
                                        className={
                                            row.status === "verified" ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
                                                row.status === "false_positive" ? "border-slate-200 text-slate-500 bg-slate-50" :
                                                    "border-amber-200 text-amber-700 bg-amber-50"
                                        }
                                    >
                                        {row.status.replace("_", " ")}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => onViewImage(row)}
                                        className="p-1.5 text-slate-400 hover:text-[#3DB9EB] hover:bg-[#E8F6FD] rounded transition-colors"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
