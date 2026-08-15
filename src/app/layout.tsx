import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Space_Grotesk,
  Lobster_Two,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { RecipientProvider } from "@/components/layout/recipient-context";
import { IdentificationModal } from "@/components/layout/identification-modal";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { DemoBanner } from "@/components/layout/demo-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
const lobster = Lobster_Two({
  subsets: ["latin"],
  variable: "--font-lobster",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "WaveCom",
  description: "WaveCom Notification Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${lobster.variable}`}
    >
      <body>
        <Providers>
          <RecipientProvider>
            <IdentificationModal />

            <SidebarProvider>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                  <Navbar />

                  <main className="flex-1 overflow-y-auto">{children}</main>
                  <DemoBanner />
                </div>
              </div>
            </SidebarProvider>
          </RecipientProvider>
        </Providers>
      </body>
    </html>
  );
}
