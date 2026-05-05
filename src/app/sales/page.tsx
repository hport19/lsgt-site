import type { Metadata } from "next";
import SalesPageClient from "./sales-page-client";

export const metadata: Metadata = {
  title: "Get a Quick IT Plan",
  description:
    "Paid-traffic MSP lead page for Lone Star GlobalTech. Get a quick IT plan, talk to a real technician, and request managed IT support.",
  alternates: {
    canonical: "/sales",
  },
  openGraph: {
    title: "Get a Quick IT Plan | GlobalTech",
    description:
      "Friendly, security-aware managed IT support for small and medium businesses. Get a quick IT plan and talk to a real technician.",
    url: "/sales",
    type: "website",
    siteName: "GlobalTech",
    images: [
      {
        url: "/msp/opengraph-image?v=3",
        width: 1200,
        height: 630,
        alt: "Get a Quick IT Plan | GlobalTech",
      },
    ],
  },
};

export default function SalesPage() {
  return <SalesPageClient />;
}
