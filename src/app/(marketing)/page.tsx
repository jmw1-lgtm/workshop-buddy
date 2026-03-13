import { MarketingHomePage as MarketingLandingPage } from "@/components/marketing/marketing-home-page";
import { SiteHeader } from "@/components/marketing/site-header";

export default function MarketingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <MarketingLandingPage />
    </div>
  );
}
