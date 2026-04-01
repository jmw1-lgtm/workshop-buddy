import type { MetadataRoute } from "next";

import { marketingLandingPages } from "@/lib/marketing-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://workshopbuddy.co.uk/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...marketingLandingPages.map((page) => ({
      url: `https://workshopbuddy.co.uk${page.href}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
