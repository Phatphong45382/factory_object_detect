"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChartCardProps {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    footer?: ReactNode;
}

export function ChartCard({
    title,
    description,
    action,
    children,
    className,
    contentClassName,
    footer,
}: ChartCardProps) {
    return (
        <Card className={cn("flex flex-col h-full card-enterprise", className)}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    {description && (
                        <CardDescription className="text-xs">{description}</CardDescription>
                    )}
                </div>
                {action && <div>{action}</div>}
            </CardHeader>
            <CardContent className={cn("flex-1 pb-4", contentClassName)}>
                {children}
            </CardContent>
            {footer && (
                <div className="px-6 pb-4 pt-0 mt-auto">
                    {footer}
                </div>
            )}
        </Card>
    );
}
