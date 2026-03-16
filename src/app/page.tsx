import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://workshopbuddy.co.uk"),
  title: "Workshop Buddy | Garage Management Software for Independent Workshops",
  description:
    "Workshop Buddy helps independent garages replace the paper diary with simple workshop management software. Schedule jobs, manage customers and vehicles, and run the day clearly.",
  keywords: [
    "garage management software",
    "workshop management software",
    "garage diary software",
    "workshop scheduling software",
    "garage booking system",
    "independent garage software",
  ],
  alternates: {
    canonical: "https://workshopbuddy.co.uk",
  },
  openGraph: {
    title: "Workshop Buddy – Garage Management Software",
    description:
      "Replace the paper diary. Schedule jobs, manage customers and vehicles, and run a busy workshop with a clear digital diary.",
    url: "https://workshopbuddy.co.uk",
    siteName: "Workshop Buddy",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Workshop Buddy garage management software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workshop Buddy – Garage Management Software",
    description: "Simple workshop management software designed for independent garages.",
    images: [
      {
        url: "/og-image.png",
        alt: "Workshop Buddy garage management software",
      },
    ],
  },
};

export { default } from "@/app/(marketing)/page";
