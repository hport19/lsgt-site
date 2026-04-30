import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import RevealOnScroll from "@/src/components/site/reveal-on-scroll";
import { AnalyticsProvider } from "@/src/components/analytics/analytics-provider";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  metadataBase: new URL("https://lonestarglobaltech.com"),
  title: {
    default: "GlobalTech | Friendly Managed IT Support",
    template: "%s | GlobalTech",
  },
  description:
    "Friendly managed IT support, security-aware service, networks, phones, cameras, and infrastructure for small and medium businesses.",
  keywords: [
    "Managed IT services",
    "MSP",
    "cybersecurity",
    "network infrastructure",
    "business phone systems",
    "VoIP",
    "security cameras",
    "low-voltage cabling",
    "Texas IT support",
  ],
  openGraph: {
    title: "GlobalTech | Friendly Managed IT Support",
    description:
      "Approachable managed IT support and security-aware technology services for growing teams.",
    url: "https://lonestarglobaltech.com",
    siteName: "Lone Star GlobalTech",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image?v=3",
        width: 1200,
        height: 630,
        alt: "GlobalTech | Friendly Managed IT Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalTech | Friendly Managed IT Support",
    description:
      "Friendly managed IT, business phone systems, cybersecurity, and infrastructure support for small and medium businesses.",
    images: ["/opengraph-image?v=3"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} ui-bg antialiased text-neutral-100`}>
        <RevealOnScroll />
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
