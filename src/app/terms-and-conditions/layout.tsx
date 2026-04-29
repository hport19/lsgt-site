import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the GlobalTech terms and conditions for using our website, communications, and managed IT services.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions",
    description:
      "Legal terms governing website use, communications, and GlobalTech managed IT services.",
    url: "/terms-and-conditions",
    type: "article",
    siteName: "GlobalTech",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
