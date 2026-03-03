"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isInitialized: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Load state from local storage on mount
        const savedState = localStorage.getItem("sidebarCollapsed");
        if (savedState !== null) {
            setIsCollapsed(JSON.parse(savedState));
        }
        setIsInitialized(true);
    }, []);

    const handleSetCollapsed = (value: boolean) => {
        setIsCollapsed(value);
        localStorage.setItem("sidebarCollapsed", JSON.stringify(value));
    };

    return (
        <SidebarContext.Provider
            value={{
                isCollapsed,
                setIsCollapsed: handleSetCollapsed,
                isInitialized
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
