import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Review how GlobalTech collects, uses, and safeguards website and service request data for support, projects, and MSP services.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy",
    description:
      "GlobalTech privacy commitments for support, project, and managed IT service requests.",
    url: "/privacy-policy",
    type: "article",
    siteName: "GlobalTech",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
