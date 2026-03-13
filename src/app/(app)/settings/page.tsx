import { SettingsSections } from "@/components/settings/settings-sections";
import { minutesToTimeInput } from "@/lib/time";
import { requireCurrentWorkshop } from "@/lib/workshop";
import { getWorkshopSettingsData } from "@/services/settings";

export default async function SettingsPage() {
  const tenant = await requireCurrentWorkshop();
  const workshop = await getWorkshopSettingsData(tenant.workshopId);

  return (
    <SettingsSections
      workshop={workshop}
      workingDayStart={minutesToTimeInput(workshop.workingDayStartMins)}
      workingDayEnd={minutesToTimeInput(workshop.workingDayEndMins)}
    />
  );
}
