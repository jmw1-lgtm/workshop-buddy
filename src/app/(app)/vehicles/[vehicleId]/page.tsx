import { notFound } from "next/navigation";

import { VehicleEditorForm } from "@/components/vehicles/vehicle-editor-form";
import { AppPage } from "@/components/layout/app-page";
import { requireCurrentWorkshop } from "@/lib/workshop";
import { getVehicleEditorData } from "@/services/vehicles";

type VehiclePageProps = {
  params: Promise<{
    vehicleId: string;
  }>;
  searchParams?: Promise<{
    customerId?: string;
    returnTo?: string;
  }>;
};

export default async function VehiclePage({
  params,
  searchParams,
}: VehiclePageProps) {
  const tenant = await requireCurrentWorkshop();
  const { vehicleId } = await params;
  const resolvedSearchParams = await searchParams;
  const customerId = resolvedSearchParams?.customerId;
  const returnTo = resolvedSearchParams?.returnTo || (customerId ? `/customers?customerId=${customerId}` : "/customers");

  if (!vehicleId) {
    notFound();
  }

  const data = await getVehicleEditorData({
    workshopId: tenant.workshopId,
    vehicleId,
    customerId,
  });

  return (
    <AppPage className="max-w-[980px]">
      <VehicleEditorForm data={data} returnTo={returnTo} />
    </AppPage>
  );
}
