import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { locales } from "@/src/lib/i18n";
import { ThemeProvider } from "next-themes";
import { DefaultLayout } from "@/src/components/DefaultLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sol - Solution for Mental Health",
  keywords: [
    "mental health",
    "wellness",
    "mood tracking",
    "mental wellness",
    "self-care",
    "therapy",
    "mental health app",
    "mood journal",
    "mental health tracking",
    "emotional well-being",
    "mental health support",
    "mental health solutions",
    "mental health awareness",
    "mental health resources",
    "mental health community",
    "mental health improvement",
    "mental health management",
    "mental health tools",
    "mental health insights",
    "mental health journey",
  ],
  description:
    "Sol is a mental health app designed to help you track your mood, manage stress, and improve your overall well-being. With features like mood journaling, self-care tips, and community support, Sol is your companion for a healthier mind.",
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DefaultLayout>{children}</DefaultLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
