import type { Metadata } from "next";
import HomePageClient from "./_components/home-page-client";

export const metadata: Metadata = {
  title: "Managed IT, Security, and Infrastructure",
  description:
    "GlobalTech delivers managed IT, business phone systems, network infrastructure, cybersecurity, and low-voltage deployments with enterprise execution and clear accountability.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GlobalTech | Managed IT, Security, and Infrastructure",
    description:
      "Enterprise-grade managed IT and infrastructure delivery for small and mid-sized teams.",
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
    title: "GlobalTech | Managed IT, Security, and Infrastructure",
    description:
      "Managed IT, VoIP, security, and infrastructure delivery with enterprise execution and clear accountability.",
    images: ["/opengraph-image?v=3"],
  },
};

export default function Page() {
  return <HomePageClient />;
}
