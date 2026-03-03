"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, FileBarChart, Download, FileText } from "lucide-react";

export default function ReportsPage() {
    const [reportType, setReportType] = useState("weekly");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <MainLayout title="Export & Reports" description="Generate and download safety compliance summaries">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Controls */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="shadow-enterprise-sm">
                            <CardHeader className="bg-slate-50 border-b rounded-t-xl pb-4">
                                <CardTitle className="text-base font-semibold">Report Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-5">

                                <div>
                                    <label className="text-sm font-semibold text-slate-700 block mb-2">Time Period</label>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setReportType("daily")}
                                            className={`w-full text-left p-3 rounded-md border text-sm transition-all flex items-center justify-between ${reportType === "daily" ? "border-primary bg-primary/5 text-primary font-medium" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                        >
                                            Daily Summary
                                            {reportType === "daily" && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </button>
                                        <button
                                            onClick={() => setReportType("weekly")}
                                            className={`w-full text-left p-3 rounded-md border text-sm transition-all flex items-center justify-between ${reportType === "weekly" ? "border-primary bg-primary/5 text-primary font-medium" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                        >
                                            Weekly Review
                                            {reportType === "weekly" && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </button>
                                        <button
                                            onClick={() => setReportType("monthly")}
                                            className={`w-full text-left p-3 rounded-md border text-sm transition-all flex items-center justify-between ${reportType === "monthly" ? "border-primary bg-primary/5 text-primary font-medium" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                        >
                                            Monthly Audit
                                            {reportType === "monthly" && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="w-full bg-[#1B7FB5] text-white hover:bg-[#2A9AD4]"
                                    >
                                        {isGenerating ? "Processing..." : "Generate Preview"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview Panel */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="shadow-enterprise-md border-slate-300 h-full flex flex-col">
                            <CardHeader className="bg-white border-b pb-4 pt-6 px-8 flex flex-row items-center justify-between sticky top-0">
                                <div className="flex items-center gap-3">
                                    <FileBarChart className="w-6 h-6 text-[#1B7FB5]" />
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-900">Compliance Report</CardTitle>
                                        <p className="text-xs text-slate-500 font-medium" suppressHydrationWarning>Generated for {reportType} period ending {new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="gap-2 text-slate-600 hover:text-[#1a1a2e]">
                                        <FileText className="w-4 h-4" /> PDF
                                    </Button>
                                    <Button size="sm" className="bg-[#FFC223] text-[#1a1a2e] hover:bg-[#E5AB00] gap-2 font-semibold">
                                        <Download className="w-4 h-4" /> Excel
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 flex-1 bg-slate-50 flex items-center justify-center">
                                {isGenerating ? (
                                    <div className="text-center space-y-4">
                                        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#3DB9EB] rounded-full animate-spin mx-auto"></div>
                                        <p className="text-slate-500 text-sm font-medium animate-pulse">Compiling data across all zones...</p>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm p-6 space-y-6 rounded">
                                        {/* Mock Document Preview */}
                                        <div className="border-b pb-4 text-center">
                                            <h3 className="font-bold text-lg">SSCI Safety Audit</h3>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Confidential</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm border-b pb-2 border-dashed">
                                                <span className="text-slate-600">Total Scans</span>
                                                <span className="font-bold">14,285</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm border-b pb-2 border-dashed">
                                                <span className="text-slate-600">Compliance Rate</span>
                                                <span className="font-bold text-emerald-600">94.7%</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm border-b pb-2 border-dashed">
                                                <span className="text-slate-600">Critical Violations</span>
                                                <span className="font-bold text-rose-600">12</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm pb-2 border-dashed">
                                                <span className="text-slate-600">Worst Zone</span>
                                                <span className="font-bold">Assembly Line 1</span>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-4 border-t border-slate-200 text-center">
                                            <p className="text-[10px] text-slate-400">Signature required by safety officer</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
