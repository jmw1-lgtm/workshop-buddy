import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { CookieConsentBanner } from "@/components/compliance/cookie-consent-banner";
import { validateServerEnv } from "@/lib/env";

import "./globals.css";

validateServerEnv();

export const metadata: Metadata = {
  metadataBase: new URL("https://workshopbuddy.co.uk"),
  title: {
    default: "Workshop Buddy",
    template: "%s | Workshop Buddy",
  },
  description: "Reception-first workshop operations software for independent garages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider>
          {children}
          <CookieConsentBanner />
          <Analytics />
          <SpeedInsights />
        </ClerkProvider>
      </body>
    </html>
  );
}
