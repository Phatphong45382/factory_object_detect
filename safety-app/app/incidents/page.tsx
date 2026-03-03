"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { IncidentTable, IncidentRecord } from "@/components/incidents/incident-table";
import { Button } from "@/components/ui/button";
import { Download, Filter, LayoutGrid, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Added this import for Badge component

const MOCK_INCIDENTS: IncidentRecord[] = [
    { id: "INC-1204", timestamp: "2026-03-03T10:15:00.000Z", location: "Assembly Line 1", type: "No Helmet", confidence: 0.94, status: "pending", imageUrl: "" },
    { id: "INC-1203", timestamp: "2026-03-03T09:45:00.000Z", location: "Warehouse Dock A", type: "No Vest", confidence: 0.88, status: "verified", imageUrl: "" },
    { id: "INC-1202", timestamp: "2026-03-03T08:00:00.000Z", location: "Maintenance Zone", type: "Multiple Violations", confidence: 0.91, status: "verified", imageUrl: "" },
    { id: "INC-1201", timestamp: "2026-03-03T05:00:00.000Z", location: "Storage Sector B", type: "No Helmet", confidence: 0.72, status: "false_positive", imageUrl: "" },
    { id: "INC-1200", timestamp: "2026-03-02T10:00:00.000Z", location: "Assembly Line 2", type: "No Mask", confidence: 0.86, status: "verified", imageUrl: "" },
];

export default function IncidentsPage() {
    const [viewMode, setViewMode] = useState<"table" | "gallery">("table");
    const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);

    const TopAction = (
        <div className="flex gap-2 relative z-50">
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button size="sm" className="bg-[#1B7FB5] text-white hover:bg-[#2A9AD4] gap-2">
                <Download className="w-4 h-4" /> Export CSV
            </Button>
        </div>
    );

    return (
        <MainLayout title="Incident Log" description="Audit trail of all detected safety violations">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Page Header Actions */}
                <div className="flex justify-between items-center bg-white p-2 border rounded-lg shadow-sm">
                    <div className="text-sm text-slate-500 font-medium px-4">
                        Showing {MOCK_INCIDENTS.length} recent incidents
                    </div>
                    <div className="flex items-center gap-4 pr-2">
                        {TopAction}
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                            <button
                                onClick={() => setViewMode("table")}
                                className={`p-1.5 rounded flex items-center justify-center transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-[#1B7FB5]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("gallery")}
                                className={`p-1.5 rounded flex items-center justify-center transition-all ${viewMode === 'gallery' ? 'bg-white shadow-sm text-[#1B7FB5]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content View */}
                {viewMode === "table" ? (
                    <IncidentTable data={MOCK_INCIDENTS} onViewImage={setSelectedIncident} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {MOCK_INCIDENTS.map(incident => (
                            <Card key={incident.id} className="overflow-hidden hover:border-[#3DB9EB] cursor-pointer transition-colors" onClick={() => setSelectedIncident(incident)}>
                                <div className="aspect-video bg-slate-200 relative flex items-center justify-center overflow-hidden">
                                    <div className="text-slate-400 font-medium text-xs">Snapshot Missing</div>
                                </div>
                                <CardContent className="p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold text-rose-600">{incident.type}</span>
                                        <span className="text-[10px] text-slate-500" suppressHydrationWarning>{new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-xs text-slate-700 truncate">{incident.location}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Selected Incident Dialog Simulation (Can be replaced with standard Dialog later) */}
                {selectedIncident && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-2/3 bg-slate-900 aspect-video md:aspect-auto flex items-center justify-center">
                                <div className="text-slate-600">No Image Available</div>
                            </div>
                            <div className="md:w-1/3 p-6 flex flex-col border-l">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{selectedIncident.id}</h3>
                                        <p className="text-sm text-slate-500" suppressHydrationWarning>{new Date(selectedIncident.timestamp).toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-slate-900">
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                                        <p className="text-sm text-slate-900">{selectedIncident.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Violation Type</p>
                                        <Badge variant="destructive" className="bg-rose-100 text-rose-700">{selectedIncident.type}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">AI Confidence</p>
                                        <p className="text-sm text-slate-900 font-medium">{Math.round(selectedIncident.confidence * 100)}%</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t flex gap-2">
                                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">Verify</Button>
                                    <Button variant="outline" className="flex-1">Dismiss</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
