"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Bell,
    Shield,
    Globe,
    Mail,
    Smartphone,
    Monitor,
    Camera,
    Clock,
    Database,
    Wifi,
} from "lucide-react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsAlerts: false,
        criticalOnly: false,
        autoArchive: true,
        darkMode: false,
        language: "en",
        timezone: "Asia/Bangkok",
        dataRetention: 90,
        cameraAutoReconnect: true,
        twoFactorAuth: false,
    });

    const toggle = (key: keyof typeof settings) => (checked: boolean) => {
        setSettings(prev => ({ ...prev, [key]: checked }));
    };


    return (
        <MainLayout title="Settings" description="Manage your account, notifications, and system preferences">
            <div className="max-w-4xl mx-auto space-y-8 relative">

                {/* Profile Section */}
                <section className="pt-2">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-slate-700" />
                        <h2 className="text-xl font-bold text-slate-800">Profile</h2>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                                    style={{ background: "#1B7FB5" }}>
                                    AU
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-slate-900">Admin User</h3>
                                    <p className="text-sm text-slate-500">admin@factory.com</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200">
                                            Super Admin
                                        </Badge>
                                        <Badge variant="outline" className="text-slate-500">
                                            Since Jan 2025
                                        </Badge>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="shrink-0">
                                    Edit Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Notifications */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-slate-700" />
                        <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-6 font-medium">
                        Configure how and when you receive safety alerts.
                    </p>

                    <Card>
                        <CardContent className="p-0 divide-y divide-slate-100">
                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${settings.emailNotifications ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-400'}`}>
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-slate-800 block">Email Notifications</Label>
                                        <p className="text-xs text-slate-500 mt-0.5">Receive violation alerts and daily summaries via email</p>
                                    </div>
                                </div>
                                <Switch checked={settings.emailNotifications} onCheckedChange={toggle('emailNotifications')} />
                            </div>

                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${settings.pushNotifications ? 'bg-violet-50 text-violet-500' : 'bg-slate-100 text-slate-400'}`}>
                                        <Monitor className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-slate-800 block">Push Notifications</Label>
                                        <p className="text-xs text-slate-500 mt-0.5">Browser push notifications for real-time alerts</p>
                                    </div>
                                </div>
                                <Switch checked={settings.pushNotifications} onCheckedChange={toggle('pushNotifications')} />
                            </div>

                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${settings.smsAlerts ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-slate-800 block">SMS Alerts</Label>
                                        <p className="text-xs text-slate-500 mt-0.5">Text message alerts for critical violations only</p>
                                    </div>
                                </div>
                                <Switch checked={settings.smsAlerts} onCheckedChange={toggle('smsAlerts')} />
                            </div>

                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${settings.criticalOnly ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400'}`}>
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-slate-800 block">Critical Alerts Only</Label>
                                        <p className="text-xs text-slate-500 mt-0.5">Only notify for high-severity violations</p>
                                    </div>
                                </div>
                                <Switch checked={settings.criticalOnly} onCheckedChange={toggle('criticalOnly')} />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* System Preferences */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-5 h-5 text-slate-700" />
                        <h2 className="text-xl font-bold text-slate-800">System Preferences</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    <CardTitle className="text-sm font-semibold">Timezone</CardTitle>
                                </div>
                                <CardDescription className="text-xs">Used for timestamps and scheduling</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700">
                                    Asia/Bangkok (UTC+7)
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-slate-500" />
                                    <CardTitle className="text-sm font-semibold">Data Retention</CardTitle>
                                </div>
                                <CardDescription className="text-xs">How long incident data is stored</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700">
                                    {settings.dataRetention} Days
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-slate-300 transition-colors">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${settings.autoArchive ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-slate-800 block">Auto-Archive</Label>
                                        <p className="text-xs text-slate-500 mt-0.5">Archive resolved incidents automatically</p>
                                    </div>
                                </div>
                                <Switch checked={settings.autoArchive} onCheckedChange={toggle('autoArchive')} />
                            </CardContent>
                        </Card>

                        <Card className="hover:border-slate-300 transition-colors">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${settings.cameraAutoReconnect ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-400'}`}>
                                        <Wifi className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-slate-800 block">Camera Auto-Reconnect</Label>
                                        <p className="text-xs text-slate-500 mt-0.5">Reconnect dropped feeds automatically</p>
                                    </div>
                                </div>
                                <Switch checked={settings.cameraAutoReconnect} onCheckedChange={toggle('cameraAutoReconnect')} />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Security */}
                <section className="pb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-slate-700" />
                        <h2 className="text-xl font-bold text-slate-800">Security</h2>
                    </div>

                    <Card>
                        <CardContent className="p-0 divide-y divide-slate-100">
                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${settings.twoFactorAuth ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-slate-800 block">Two-Factor Authentication</Label>
                                        <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account</p>
                                    </div>
                                </div>
                                <Switch checked={settings.twoFactorAuth} onCheckedChange={toggle('twoFactorAuth')} />
                            </div>

                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-slate-100 text-slate-400">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-slate-800 block">Active Sessions</Label>
                                        <p className="text-xs text-slate-500 mt-0.5">You are currently logged in on 1 device</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Manage
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </MainLayout>
    );
}
