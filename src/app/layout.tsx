import type { Metadata } from "next";
import { Teko, Titillium_Web } from "next/font/google";
import Link from "next/link";
import { Swords } from "lucide-react";
import "./globals.css";

import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { Sidebar } from "~/components/sidebar";

const teko = Teko({ subsets: ["latin"], variable: "--font-teko" });
const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-titillium",
});

export const metadata: Metadata = {
  title: "Elsword Account Organizer",
  description: "Gestionnaire de comptes Elsword",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${teko.variable} ${titillium.variable} antialiased`}
        style={{
          fontFamily: "var(--font-titillium), sans-serif",
          background: "#0a0a0a",
          color: "#e5e5e5",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(220,38,38,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.04) 0%, transparent 50%)",
            }}
          />
          <div
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 40px,
                rgba(220,38,38,0.3) 40px,
                rgba(220,38,38,0.3) 41px
              )`,
            }}
          />

          <div className="relative z-10 grid min-h-screen lg:grid-cols-[280px_1fr]">
            <Sidebar />

            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-red-900/30 bg-black/80 backdrop-blur-md px-4 py-3">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-red-500" />
                  <span className="text-lg tracking-wider uppercase font-bold font-teko text-el-red">
                    EL TRACKER
                  </span>
                </Link>
              </div>
            </header>

            <main className="p-6 md:p-10 lg:p-12 pt-20 lg:pt-12 max-w-6xl w-full mx-auto">
              {children}
            </main>
          </div>

          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
