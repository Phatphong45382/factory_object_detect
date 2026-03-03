"use client";

import { SidebarProvider } from "@/lib/sidebar-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            {children}
        </SidebarProvider>
    );
}
