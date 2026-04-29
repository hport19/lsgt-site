import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Received",
  description:
    "Confirmation page for submitted support, project, and MSP requests with next-step guidance.",
  alternates: {
    canonical: "/thank-you",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
