import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import RevealOnScroll from "@/src/components/site/reveal-on-scroll";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  metadataBase: new URL("https://lonestarglobaltech.com"),
  title: {
    default: "GlobalTech | IT & Security Solutions",
    template: "%s | GlobalTech",
  },
  description:
    "Network infrastructure, business phone systems, cybersecurity, cameras, managed IT, and low-voltage solutions across TX, OK, and NM.",
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
    title: "GlobalTech | IT & Security Solutions",
    description:
      "Network infrastructure, business phone systems, cybersecurity, cameras, managed IT, and low-voltage solutions across TX, OK, and NM.",
    url: "https://lonestarglobaltech.com",
    siteName: "Lone Star GlobalTech",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image?v=3",
        width: 1200,
        height: 630,
        alt: "GlobalTech | IT & Security Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalTech | IT & Security Solutions",
    description:
      "Managed IT, business phone systems, cybersecurity, and infrastructure delivery for business operations that need uptime and accountability.",
    images: ["/opengraph-image?v=3"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} ui-bg antialiased text-neutral-100`}>
        <RevealOnScroll />
        {children}
      </body>
    </html>
  );
}
