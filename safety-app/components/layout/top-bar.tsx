"use client";

import { Search, Settings, Moon, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TopBarProps {
    title?: string;
    description?: string;
}

export function TopBar({ title, description }: TopBarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center">
            <div className="w-full px-6 flex items-center justify-between gap-6">
                {/* ── Left: Title & Description (stacked) ── */}
                {title ? (
                    <div className="shrink-0 flex flex-col justify-center">
                        <h2 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">{title}</h2>
                        {description && (
                            <p className="text-[13px] text-slate-400 mt-0.5 leading-snug">{description}</p>
                        )}
                    </div>
                ) : (
                    <div className="shrink-0 flex" />
                )}

                {/* ── Right: Search + Icons + User ── */}
                <div className="flex items-center gap-2 relative">
                    {/* Search Bar */}
                    <div className="relative hidden lg:flex items-center">
                        <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 w-[200px] h-9 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder:text-slate-400 focus-visible:outline-none focus:ring-2 focus:ring-[#3DB9EB]/30 focus:border-[#3DB9EB] transition-all"
                        />
                    </div>

                    {/* Icon Buttons */}
                    <div className="hidden md:flex items-center gap-0.5 ml-1">
                        <button
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Settings"
                        >
                            <Settings className="w-[18px] h-[18px]" />
                        </button>
                        <button
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Dark Mode"
                        >
                            <Moon className="w-[18px] h-[18px]" />
                        </button>
                        <button
                            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Notifications"
                        >
                            <Bell className="w-[18px] h-[18px]" />
                            {/* Notification dot */}
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-8 bg-slate-200 mx-1" />

                    {/* User Profile */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#3DB9EB] text-white flex flex-col items-center justify-center text-xs font-bold shrink-0">
                                AU
                            </div>
                            <div className="hidden md:flex flex-col items-start">
                                <span className="text-sm font-semibold text-slate-700 leading-tight">Admin User</span>
                            </div>
                            <ChevronDown className="hidden md:block w-4 h-4 text-slate-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Profile
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Settings className="w-4 h-4" /> Settings
                                </button>
                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <LogOut className="w-4 h-4" /> Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
