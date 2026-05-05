import type { Metadata } from "next";
import HomePageClient from "./_components/home-page-client";

export const metadata: Metadata = {
  title: "Friendly Managed IT Support for Small Businesses",
  description:
    "Lone Star GlobalTech provides approachable managed IT support, security-aware services, networks, phones, and infrastructure for small and medium businesses.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GlobalTech | Friendly Managed IT Support",
    description:
      "Managed IT support, security-aware services, and infrastructure help from a local team that feels easy to work with.",
    url: "/",
    type: "website",
    siteName: "GlobalTech",
    images: [
      {
        url: "/opengraph-image?v=3",
        width: 1200,
        height: 630,
        alt: "GlobalTech | Managed IT, Security, and Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalTech | Friendly Managed IT Support",
    description:
      "Friendly managed IT, security-aware support, VoIP, and infrastructure services for small and medium businesses.",
    images: ["/opengraph-image?v=3"],
  },
};

export default function Page() {
  return <HomePageClient />;
}
