"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileImage, FileVideo, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
    onAnalyze: (file: File) => void;
    isLoading?: boolean;
}

export function UploadZone({ onAnalyze, isLoading }: UploadZoneProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
            "video/*": [".mp4", ".mov", ".avi"],
        },
        maxFiles: 1,
    });

    const clearFile = () => {
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {!selectedFile ? (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className={`w-12 h-12 mb-4 ${isDragActive ? 'text-primary' : 'text-slate-400'}`} />
                    <p className="text-lg font-medium text-slate-700">
                        {isDragActive ? "Drop file here" : "Drag & drop an image or video"}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">or click to browse from your computer</p>
                    <p className="text-xs text-slate-400 mt-4">Supports JPG, PNG, MP4, MOV up to 50MB</p>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col gap-4">
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3 overflow-hidden">
                            {selectedFile.type.startsWith("video/") ? (
                                <FileVideo className="w-8 h-8 text-blue-500 shrink-0" />
                            ) : (
                                <FileImage className="w-8 h-8 text-emerald-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</p>
                                <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                        {selectedFile.type.startsWith("video/") ? (
                            <video src={previewUrl!} className="w-full h-full object-contain" controls />
                        ) : (
                            <img src={previewUrl!} alt="Preview" className="w-full h-full object-contain" />
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-2">
                <Button
                    disabled={!selectedFile || isLoading}
                    onClick={() => selectedFile && onAnalyze(selectedFile)}
                    className="bg-[#FFC223] text-[#1a1a2e] hover:bg-[#E5AB00] font-bold px-8"
                >
                    {isLoading ? "Analyzing..." : "Analyze Media"}
                </Button>
            </div>
        </div>
    );
}
