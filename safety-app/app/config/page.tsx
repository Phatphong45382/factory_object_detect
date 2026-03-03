"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HardHat, ShieldUser, LocateFixed, Eye, EyeOff, Save, ShieldAlert, Cpu } from "lucide-react";

export default function ConfigPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [config, setConfig] = useState({
        detectHelmet: true,
        detectVest: true,
        detectMask: false,
        detectGoggles: false,
        confidenceThreshold: 85,
    });

    const toggleConfig = (key: keyof typeof config) => (checked: boolean) => {
        setConfig(prev => ({ ...prev, [key]: checked }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 1500);
    };

    return (
        <MainLayout
            title="AI Configuration"
            description="Fine-tune model intelligence and detection policies"
        >
            <div className="max-w-4xl mx-auto space-y-8 relative">

                {/* Page Level Action */}
                <div className="absolute right-0 top-0 mt-1 md:mt-2">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#1B7FB5] text-white hover:bg-[#2A9AD4] gap-2 shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Configuration"}
                    </Button>
                </div>

                {/* Detection Classes Config */}
                <section className="pt-2">
                    <div className="flex items-center gap-2 mb-4">
                        <Cpu className="w-5 h-5 text-slate-700" />
                        <h2 className="text-xl font-bold text-slate-800">Target Classes</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-6 font-medium">Select which objects the AI model should attempt to detect.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="hover:border-slate-300 transition-colors">
                            <CardContent className="p-5 flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`p-2 rounded-lg ${config.detectHelmet ? 'bg-[#E8F6FD] text-[#3DB9EB]' : 'bg-slate-100 text-slate-400'}`}>
                                        <HardHat className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <Label className="text-base font-semibold text-slate-800 mb-1 block">Safety Helmet</Label>
                                        <p className="text-xs text-slate-500">Detect hard hats across all color codes</p>
                                    </div>
                                </div>
                                <Switch checked={config.detectHelmet} onCheckedChange={toggleConfig('detectHelmet')} />
                            </CardContent>
                        </Card>

                        <Card className="hover:border-slate-300 transition-colors">
                            <CardContent className="p-5 flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`p-2 rounded-lg ${config.detectVest ? 'bg-[#E8F6FD] text-[#3DB9EB]' : 'bg-slate-100 text-slate-400'}`}>
                                        <ShieldAlert className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <Label className="text-base font-semibold text-slate-800 mb-1 block">High-Vis Vest</Label>
                                        <p className="text-xs text-slate-500">Detect reflective safety vests</p>
                                    </div>
                                </div>
                                <Switch checked={config.detectVest} onCheckedChange={toggleConfig('detectVest')} />
                            </CardContent>
                        </Card>

                        <Card className="hover:border-slate-300 transition-colors">
                            <CardContent className="p-5 flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`p-2 rounded-lg ${config.detectMask ? 'bg-[#E8F6FD] text-[#3DB9EB]' : 'bg-slate-100 text-slate-400'}`}>
                                        <ShieldUser className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <Label className="text-base font-semibold text-slate-800 mb-1 block">Face Mask</Label>
                                        <p className="text-xs text-slate-500">Detect surgical and N95 masks</p>
                                    </div>
                                </div>
                                <Switch checked={config.detectMask} onCheckedChange={toggleConfig('detectMask')} />
                            </CardContent>
                        </Card>

                        <Card className="hover:border-slate-300 transition-colors">
                            <CardContent className="p-5 flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`p-2 rounded-lg ${config.detectGoggles ? 'bg-[#E8F6FD] text-[#3DB9EB]' : 'bg-slate-100 text-slate-400'}`}>
                                        <Eye className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <Label className="text-base font-semibold text-slate-800 mb-1 block">Safety Goggles</Label>
                                        <p className="text-xs text-slate-500">Detect protective eye wear</p>
                                    </div>
                                </div>
                                <Switch checked={config.detectGoggles} onCheckedChange={toggleConfig('detectGoggles')} />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Confidence Threshold */}
                <section>
                    <div className="flex items-center gap-2 mb-4 mt-8">
                        <LocateFixed className="w-5 h-5 text-slate-700" />
                        <h2 className="text-xl font-bold text-slate-800">Model Precision</h2>
                    </div>

                    <Card className="shadow-enterprise-sm border-slate-200">
                        <CardHeader className="bg-slate-50 border-b pb-4 rounded-t-xl">
                            <CardTitle className="text-base font-semibold">Confidence Threshold</CardTitle>
                            <CardDescription>Minimum confidence score required to flag a violation</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <span className="text-4xl font-bold font-mono text-[#1a1a2e]">{config.confidenceThreshold}</span>
                                    <span className="text-slate-500 font-medium ml-1">%</span>
                                </div>
                                <Badge variant="outline" className={config.confidenceThreshold < 60 ? "border-amber-500 text-amber-600 bg-amber-50" : "border-emerald-500 text-emerald-600 bg-emerald-50"}>
                                    {config.confidenceThreshold < 60 ? "High Recall (More False Positives)" :
                                        config.confidenceThreshold > 90 ? "High Precision (Fewer Detections)" : "Balanced"}
                                </Badge>
                            </div>

                            <Slider
                                value={[config.confidenceThreshold]}
                                onValueChange={(val) => setConfig(prev => ({ ...prev, confidenceThreshold: val[0] }))}
                                max={100}
                                min={20}
                                step={5}
                                className="my-6"
                            />

                            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Catch Everything</span>
                                <span className="flex items-center gap-1 text-right">High Certainty <EyeOff className="w-3 h-3" /></span>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </MainLayout>
    );
}
