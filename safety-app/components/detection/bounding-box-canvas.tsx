"use client";

import { ShieldCheck } from "lucide-react";

interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Detection {
    label: string;
    confidence: number;
    bbox: BoundingBox;
    is_violation: boolean;
}

interface BoundingBoxCanvasProps {
    imageUrl: string | null;
    detections: Detection[];
    isAnalyzing: boolean;
}

export function BoundingBoxCanvas({ imageUrl, detections, isAnalyzing }: BoundingBoxCanvasProps) {
    if (!imageUrl && !isAnalyzing) {
        return (
            <div className="flex-1 bg-slate-100 rounded-lg aspect-video flex items-center justify-center border border-slate-200 text-slate-400">
                <div className="flex flex-col items-center">
                    <ShieldCheck className="w-12 h-12 text-slate-300 mb-2" />
                    <p>No image uploaded</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-slate-100 rounded-lg aspect-video flex items-center justify-center border border-slate-200 overflow-hidden relative">
            {isAnalyzing && !imageUrl ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-[#3DB9EB] rounded-full animate-spin"></div>
                    <p className="text-slate-500 animate-pulse">Running model inference...</p>
                </div>
            ) : imageUrl ? (
                <div className="relative inline-block max-w-full max-h-full">
                    <img
                        src={imageUrl}
                        alt="Analyzed Image"
                        className={`max-w-full max-h-[500px] object-contain block transition-opacity duration-300 ${isAnalyzing ? 'opacity-40 grayscale' : 'opacity-100'}`}
                    />

                    {/* Bounding Boxes */}
                    {!isAnalyzing && detections.map((d, i) => (
                        <div
                            key={i}
                            className="absolute border-2 rounded-sm pointer-events-none transition-all duration-500 ease-out animate-in zoom-in-95"
                            style={{
                                left: `${d.bbox.x * 100}%`,
                                top: `${d.bbox.y * 100}%`,
                                width: `${d.bbox.width * 100}%`,
                                height: `${d.bbox.height * 100}%`,
                                borderColor: d.is_violation ? '#ef4444' : '#10b981',
                                backgroundColor: d.is_violation ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                animationDelay: `${i * 100}ms`,
                                animationFillMode: 'both'
                            }}
                        >
                            <div
                                className="absolute -top-6 left-[-2px] text-white text-[10px] px-1.5 py-0.5 font-bold rounded-sm whitespace-nowrap shadow-sm"
                                style={{ backgroundColor: d.is_violation ? '#ef4444' : '#10b981' }}
                            >
                                {d.label.replace('_', ' ').toUpperCase()} {Math.round(d.confidence * 100)}%
                            </div>
                        </div>
                    ))}

                    {/* Loading Overlay */}
                    {isAnalyzing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-10 h-10 border-4 border-slate-200/50 border-t-[#3DB9EB] rounded-full animate-spin mb-3"></div>
                            <p className="bg-slate-900/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">Analyzing visual data...</p>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
