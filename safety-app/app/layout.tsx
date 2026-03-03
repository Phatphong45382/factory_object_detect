import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";

const manrope = Manrope({
    variable: "--font-manrope-var",
    subsets: ["latin"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Workplace Safety AI",
    description: "AI-powered workplace safety and PPE detection platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${manrope.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background`}>
                <AppProviders>
                    {children}
                </AppProviders>
            </body>
        </html>
    );
}
