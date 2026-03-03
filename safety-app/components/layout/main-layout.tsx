"use client";

import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { useSidebar } from "@/lib/sidebar-context";

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    hideTopBar?: boolean;
}

export function MainLayout({ children, title, description, hideTopBar }: MainLayoutProps) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />

            <div className={`flex-1 flex flex-col min-w-0 transition-[margin-left] duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {!hideTopBar && <TopBar title={title} description={description} />}

                <main className="flex-1 p-4 md:px-6 md:pb-6 md:pt-5">
                    {children}
                </main>
            </div>
        </div>
    );
}
