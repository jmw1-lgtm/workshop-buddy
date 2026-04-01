import type { Metadata } from "next";

const siteUrl = "https://workshopbuddy.co.uk";

type MarketingMetadataInput = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
};

export function createMarketingMetadata({
  path,
  title,
  description,
  keywords,
}: MarketingMetadataInput): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Workshop Buddy`,
      description,
      url,
      siteName: "Workshop Buddy",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${title} | Workshop Buddy`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Workshop Buddy`,
      description,
      images: [
        {
          url: "/og-image.png",
          alt: `${title} | Workshop Buddy`,
        },
      ],
    },
  };
}
