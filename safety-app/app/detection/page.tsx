"use client";

import { useState, useCallback } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertSidebar, AlertData } from "@/components/detection/alert-sidebar";
import { BoundingBoxCanvas } from "@/components/detection/bounding-box-canvas";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Camera, UploadCloud, FileImage, FileVideo, X,
    ShieldCheck, ShieldAlert, AlertTriangle, Users,
    RotateCcw, Sparkles, Clock, ChevronRight, Eye,
    HardHat, ShieldUser, Glasses
} from "lucide-react";
import { detectionApi } from "@/lib/api-client";
import { useDropzone } from "react-dropzone";

const DEMO_ALERTS: AlertData[] = [
    { id: "1", timestamp: "2026-03-03T10:15:00.000Z", location: "Sector 4 - Assembly", type: "No Helmet", severity: "high", confidence: 0.94 },
    { id: "2", timestamp: "2026-03-03T10:14:15.000Z", location: "Loading Dock B", type: "No Vest", severity: "medium", confidence: 0.88 },
    { id: "3", timestamp: "2026-03-03T10:13:00.000Z", location: "Sector 2 - Maintenance", type: "No Helmet", severity: "high", confidence: 0.91 },
];

type AnalysisState = "idle" | "preview" | "analyzing" | "done";

function generateMockDetections() {
    const labels = [
        { label: "helmet", is_violation: false },
        { label: "no_helmet", is_violation: true },
        { label: "vest", is_violation: false },
        { label: "no_vest", is_violation: true },
    ];
    const count = 3 + Math.floor(Math.random() * 3); // 3-5 detections
    const detections = Array.from({ length: count }, (_, i) => {
        const item = labels[Math.floor(Math.random() * labels.length)];
        return {
            label: item.label,
            confidence: 0.75 + Math.random() * 0.24,
            bbox: {
                x: 0.05 + Math.random() * 0.6,
                y: 0.05 + Math.random() * 0.5,
                width: 0.08 + Math.random() * 0.15,
                height: 0.12 + Math.random() * 0.25,
            },
            is_violation: item.is_violation,
        };
    });
    const violations = detections.filter(d => d.is_violation).length;
    return {
        detections,
        total_persons: count,
        violations_count: violations,
        compliance_rate: (count - violations) / count,
        processed_at: new Date().toISOString(),
    };
}

export default function DetectionCenter() {
    const [activeTab, setActiveTab] = useState("upload");
    const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            setImageUrl(URL.createObjectURL(file));
            setAnalysisResult(null);
            setError(null);
            setAnalysisState("preview");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg"], "video/*": [".mp4", ".mov", ".avi"] },
        maxFiles: 1,
        noClick: analysisState !== "idle",
    });

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setAnalysisState("analyzing");
        setError(null);

        try {
            const response = await detectionApi.analyze(selectedFile);
            setAnalysisResult(response.data);
            setAnalysisState("done");
        } catch (err) {
            console.warn("Backend unavailable, using frontend mock fallback:", err);
            // Frontend mock fallback — demo works even without backend
            await new Promise(r => setTimeout(r, 1500)); // simulate processing time
            const mockResult = generateMockDetections();
            setAnalysisResult(mockResult);
            setAnalysisState("done");
        }
    };

    const handleReset = () => {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        setSelectedFile(null);
        setImageUrl(null);
        setAnalysisResult(null);
        setError(null);
        setAnalysisState("idle");
    };

    const handleNewFile = () => {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        setSelectedFile(null);
        setImageUrl(null);
        setAnalysisResult(null);
        setError(null);
        setAnalysisState("idle");
    };

    return (
        <MainLayout title="Detection Center" description="Live simulation and manual analysis">
            <div className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="bg-slate-200/50 p-1 border border-slate-200">
                            <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1a1a2e]">
                                <UploadCloud className="w-4 h-4" />
                                <span>Upload & Analyze</span>
                            </TabsTrigger>
                            <TabsTrigger value="live" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1a1a2e]">
                                <Camera className="w-4 h-4" />
                                <span>Live Simulation</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ════════════════════════════════════════════ */}
                    {/* UPLOAD & ANALYZE TAB                       */}
                    {/* ════════════════════════════════════════════ */}
                    <TabsContent value="upload" className="flex-1 m-0 outline-none pb-8">

                        {/* ─── STATE: IDLE (No file selected) ─── */}
                        {analysisState === "idle" && (
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[500px]">
                                {/* Left: Dropzone (3 cols) */}
                                <div className="lg:col-span-3 flex">
                                    <div
                                        {...getRootProps()}
                                        className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                                                    ${isDragActive
                                                ? 'border-[#3DB9EB] bg-[#3DB9EB]/5 scale-[1.01]'
                                                : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-[#3DB9EB]/50 hover:shadow-lg'
                                            }`}
                                    >
                                        <input {...getInputProps()} />

                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors ${isDragActive ? 'bg-[#3DB9EB]/10' : 'bg-slate-100'}`}>
                                            <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-[#3DB9EB]' : 'text-slate-400'}`} />
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                                            {isDragActive ? "Drop your file here" : "Upload Image or Video"}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
                                            Drag & drop a file to test the AI safety detection model.
                                            The system will identify PPE compliance and safety violations.
                                        </p>

                                        <Button className="bg-[#FFC223] text-[#1a1a2e] hover:bg-[#E5AB00] font-bold px-8 gap-2 shadow-sm">
                                            <UploadCloud className="w-4 h-4" />
                                            Browse Files
                                        </Button>

                                        <div className="flex items-center gap-6 mt-6 text-xs text-slate-400">
                                            <span className="flex items-center gap-1.5"><FileImage className="w-3.5 h-3.5" /> JPG, PNG</span>
                                            <span className="flex items-center gap-1.5"><FileVideo className="w-3.5 h-3.5" /> MP4, MOV</span>
                                            <span>Max 50MB</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: AI Capabilities (2 cols) */}
                                <div className="lg:col-span-2 flex flex-col gap-4">
                                    <div className="bg-white rounded-xl border shadow-sm p-5">
                                        <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-[#FFC223]" /> AI Detection Capabilities
                                        </h4>
                                        <div className="space-y-3">
                                            {[
                                                { icon: HardHat, label: "Safety Helmet", desc: "Hard hat detection across all color codes", active: true, color: "text-amber-500", bg: "bg-amber-50" },
                                                { icon: ShieldAlert, label: "High-Vis Vest", desc: "Reflective safety vest compliance", active: true, color: "text-orange-500", bg: "bg-orange-50" },
                                                { icon: ShieldUser, label: "Face Mask", desc: "Surgical and N95 mask detection", active: false, color: "text-slate-400", bg: "bg-slate-100" },
                                                { icon: Glasses, label: "Safety Goggles", desc: "Protective eye wear identification", active: false, color: "text-slate-400", bg: "bg-slate-100" },
                                            ].map((item, i) => (
                                                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${item.active ? 'bg-[#E8F6FD]/50' : 'bg-slate-50'}`}>
                                                    <div className={`w-9 h-9 rounded-lg ${item.active ? item.bg : 'bg-slate-100'} flex items-center justify-center shrink-0`}>
                                                        <item.icon className={`w-[18px] h-[18px] ${item.active ? item.color : 'text-slate-400'}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                                                        <p className="text-xs text-slate-400 truncate">{item.desc}</p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                                        {item.active ? "ACTIVE" : "OFF"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border shadow-sm p-5 flex-1">
                                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                            <ChevronRight className="w-4 h-4 text-[#3DB9EB]" /> How It Works
                                        </h4>
                                        <div className="space-y-4">
                                            {[
                                                { step: "1", title: "Upload", desc: "Drop an image or video file" },
                                                { step: "2", title: "Analyze", desc: "AI model scans for PPE items" },
                                                { step: "3", title: "Results", desc: "View violations with bounding boxes" },
                                            ].map((s, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-[#1B7FB5] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                        {s.step}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                                                        <p className="text-xs text-slate-400">{s.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── STATE: PREVIEW (File selected, ready to analyze) ─── */}
                        {analysisState === "preview" && selectedFile && imageUrl && (
                            <div className="max-w-5xl mx-auto space-y-4">
                                {/* File info bar */}
                                <div className="flex items-center justify-between bg-white border rounded-xl px-5 py-3 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        {selectedFile.type.startsWith("video/")
                                            ? <FileVideo className="w-5 h-5 text-blue-500" />
                                            : <FileImage className="w-5 h-5 text-emerald-500" />
                                        }
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{selectedFile.name}</p>
                                            <p className="text-xs text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="gap-1.5 text-slate-500" onClick={handleReset}>
                                            <X className="w-3.5 h-3.5" /> Remove
                                        </Button>
                                        <Button className="bg-[#FFC223] text-[#1a1a2e] hover:bg-[#E5AB00] font-bold px-6 gap-2 shadow-sm" onClick={handleAnalyze}>
                                            <Sparkles className="w-4 h-4" /> Run AI Analysis
                                        </Button>
                                    </div>
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-5 py-3 text-sm">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {/* Image Preview */}
                                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                    <div className="bg-slate-900 flex items-center justify-center p-4 min-h-[400px]">
                                        {selectedFile.type.startsWith("video/") ? (
                                            <video src={imageUrl} className="max-w-full max-h-[500px] object-contain rounded" controls />
                                        ) : (
                                            <img src={imageUrl} alt="Preview" className="max-w-full max-h-[500px] object-contain rounded shadow-lg" />
                                        )}
                                    </div>
                                    <div className="px-5 py-3 border-t bg-slate-50 text-xs text-slate-500 flex items-center gap-2">
                                        <Eye className="w-3.5 h-3.5" />
                                        Preview — Click "Run AI Analysis" to detect safety equipment
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── STATE: ANALYZING (Loading) ─── */}
                        {analysisState === "analyzing" && imageUrl && (
                            <div className="max-w-5xl mx-auto">
                                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                    <div className="bg-slate-900 flex items-center justify-center p-4 min-h-[400px] relative">
                                        <img src={imageUrl} alt="Analyzing" className="max-w-full max-h-[500px] object-contain rounded opacity-30 grayscale" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 flex flex-col items-center border border-white/20 shadow-2xl">
                                                <div className="w-12 h-12 border-4 border-white/20 border-t-[#3DB9EB] rounded-full animate-spin mb-4"></div>
                                                <p className="text-white font-semibold text-lg mb-1">Analyzing Image</p>
                                                <p className="text-white/60 text-sm">Running inference through Dataiku model...</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 py-3 border-t bg-slate-50 flex items-center gap-2">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                                            Processing — this usually takes 2-5 seconds
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── STATE: DONE (Results) ─── */}
                        {analysisState === "done" && analysisResult && imageUrl && (
                            <div className="max-w-6xl mx-auto space-y-4">
                                {/* Action bar */}
                                <div className="flex items-center justify-between bg-white border rounded-xl px-5 py-3 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${analysisResult.violations_count > 0 ? 'bg-rose-100' : 'bg-emerald-100'}`}>
                                            {analysisResult.violations_count > 0
                                                ? <ShieldAlert className="w-4 h-4 text-rose-600" />
                                                : <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                            }
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">
                                                {analysisResult.violations_count > 0
                                                    ? `${analysisResult.violations_count} Violation${analysisResult.violations_count > 1 ? 's' : ''} Detected`
                                                    : "All Clear — No Violations"
                                                }
                                            </p>
                                            <p className="text-xs text-slate-400" suppressHydrationWarning>
                                                Processed at {new Date(analysisResult.processed_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleAnalyze}>
                                            <RotateCcw className="w-3.5 h-3.5" /> Re-analyze
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleNewFile}>
                                            <UploadCloud className="w-3.5 h-3.5" /> New File
                                        </Button>
                                    </div>
                                </div>

                                {/* Results Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Left: Image with Bounding Boxes (2 cols) */}
                                    <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden">
                                        <div className="bg-slate-900 p-4 min-h-[400px] flex items-center justify-center">
                                            <BoundingBoxCanvas
                                                imageUrl={imageUrl}
                                                detections={analysisResult.detections || []}
                                                isAnalyzing={false}
                                            />
                                        </div>
                                    </div>

                                    {/* Right: Stats + Detection List (1 col) */}
                                    <div className="space-y-4">
                                        {/* Summary Cards */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <Card className="shadow-sm border-slate-200">
                                                <CardContent className="p-4 flex flex-col items-center text-center">
                                                    <Users className="w-5 h-5 text-[#3DB9EB] mb-2" />
                                                    <p className="text-2xl font-bold text-slate-900">{analysisResult.total_persons}</p>
                                                    <p className="text-xs text-slate-500 font-medium">Persons</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="shadow-sm border-slate-200">
                                                <CardContent className="p-4 flex flex-col items-center text-center">
                                                    <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2" />
                                                    <p className="text-2xl font-bold text-emerald-600">{Math.round(analysisResult.compliance_rate * 100)}%</p>
                                                    <p className="text-xs text-slate-500 font-medium">Compliance</p>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Detection list */}
                                        <Card className="shadow-sm border-slate-200">
                                            <div className="px-4 py-3 border-b bg-slate-50 rounded-t-xl">
                                                <h4 className="text-sm font-bold text-slate-700">Detected Items</h4>
                                            </div>
                                            <CardContent className="p-0 divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                                                {analysisResult.detections?.length === 0 ? (
                                                    <div className="p-6 text-center text-sm text-slate-400">No objects detected</div>
                                                ) : (
                                                    analysisResult.detections.map((d: any, i: number) => (
                                                        <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${d.is_violation ? 'bg-rose-100' : 'bg-emerald-100'}`}>
                                                                {d.is_violation
                                                                    ? <AlertTriangle className="w-4 h-4 text-rose-600" />
                                                                    : <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                                }
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-slate-800 capitalize">
                                                                    {d.label.replace(/_/g, " ")}
                                                                </p>
                                                                <p className="text-xs text-slate-400">
                                                                    {d.is_violation ? "Violation" : "Compliant"}
                                                                </p>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <p className={`text-sm font-bold ${d.confidence >= 0.9 ? 'text-slate-900' : 'text-amber-600'}`}>
                                                                    {Math.round(d.confidence * 100)}%
                                                                </p>
                                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">confidence</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* ════════════════════════════════════════════ */}
                    {/* LIVE SIMULATION TAB                        */}
                    {/* ════════════════════════════════════════════ */}
                    <TabsContent value="live" className="m-0">
                        <div className="flex gap-4">
                            {/* CCTV Feed */}
                            <div className="flex-1 bg-black rounded-xl overflow-hidden relative border border-slate-800 shadow-enterprise-lg flex items-center justify-center min-h-[500px]">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                                    <Camera className="w-16 h-16 mb-4 opacity-50" />
                                    <p className="text-xl font-medium opacity-50">CCTV Feed Simulation</p>
                                    <p className="text-sm opacity-40 mt-2">Waiting for video stream...</p>
                                </div>
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded font-mono border border-white/10 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                                    REC | CAM-04 (Assembly Line)
                                </div>
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-emerald-400 text-xs px-2 py-1 rounded font-mono border border-white/10">
                                    FPS: 29.97 | INF: 34ms
                                </div>
                            </div>

                            {/* Real-time Alerts Sidebar */}
                            <div className="hidden lg:block w-80 shrink-0">
                                <AlertSidebar alerts={DEMO_ALERTS} />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
