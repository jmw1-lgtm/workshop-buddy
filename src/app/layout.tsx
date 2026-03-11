import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { validateServerEnv } from "@/lib/env";

import "./globals.css";

validateServerEnv();

export const metadata: Metadata = {
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
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
