import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      eyebrow="Settings"
      title="Workshop settings"
      description="Use this area for workshop profile, slot length, user membership, and billing entry points once the onboarding and billing layers are wired."
      primaryMetric="Foundation only"
      metricLabel="Stripe and workshop configuration hooks are scaffolded, not implemented."
      checklist={[
        "Workshop profile",
        "Slot length settings",
        "User membership management",
        "Billing portal entry point",
      ]}
    />
  );
}
