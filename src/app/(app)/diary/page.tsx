import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function DiaryPage() {
  return (
    <PlaceholderPage
      eyebrow="Diary"
      title="Slot-based diary"
      description="This route is protected and ready for the day-view diary. Keep implementation focused on slot scheduling, drag/move jobs, and quick creation."
      primaryMetric="0 scheduled jobs"
      metricLabel="Diary data should be scoped by workshopId from the first query."
      checklist={[
        "Day view timeline",
        "Slot configuration awareness",
        "Quick create job flow",
        "Job card entry point",
      ]}
    />
  );
}
