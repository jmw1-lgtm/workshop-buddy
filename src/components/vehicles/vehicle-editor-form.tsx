"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  saveVehicleDetails,
  type VehicleActionState,
} from "@/app/(app)/vehicles/[vehicleId]/actions";
import { Button } from "@/components/ui/button";
import { VehicleLookupFields } from "@/components/vehicles/vehicle-lookup-fields";

const initialState: VehicleActionState = {
  error: null,
};

type VehicleEditorFormProps = {
  data:
    | {
        mode: "create";
        customer: {
          id: string;
          name: string;
          phone: string | null;
          email: string | null;
        };
        vehicle: null;
      }
    | {
        mode: "edit";
        customer: {
          id: string;
          name: string;
          phone: string | null;
          email: string | null;
        };
        vehicle: {
          id: string;
          registration: string;
          make: string | null;
          model: string | null;
          fuel: string | null;
          year: number | null;
          engineSizeCc: number | null;
          jobCount: number;
        };
      };
  returnTo: string;
};

export function VehicleEditorForm({ data, returnTo }: VehicleEditorFormProps) {
  const [state, formAction] = useActionState(saveVehicleDetails, initialState);

  return (
    <section className="space-y-6 rounded-[30px] border border-[var(--surface-border)] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Vehicle
          </p>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            {data.mode === "create" ? "Add vehicle" : data.vehicle.registration}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {data.customer.name}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={returnTo}>Back</Link>
        </Button>
      </div>

      <form action={formAction} className="grid gap-5">
        <input type="hidden" name="vehicleId" value={data.mode === "edit" ? data.vehicle.id : "new"} />
        <input type="hidden" name="customerId" value={data.customer.id} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/18 p-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">Customer</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {[data.customer.phone, data.customer.email].filter(Boolean).join(" · ") || "No contact details saved"}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--surface-border)] bg-white p-4">
          <VehicleLookupFields
            initialVehicle={
              data.mode === "edit"
                ? {
                    registration: data.vehicle.registration,
                    make: data.vehicle.make,
                    model: data.vehicle.model,
                    fuel: data.vehicle.fuel,
                    year: data.vehicle.year,
                    engineSizeCc: data.vehicle.engineSizeCc,
                  }
                : undefined
            }
          />
        </div>

        {state.error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3 border-t border-[var(--surface-border)] pt-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            {data.mode === "edit"
              ? `${data.vehicle.jobCount} linked ${data.vehicle.jobCount === 1 ? "job" : "jobs"}`
              : "Create a new vehicle for this customer."}
          </p>
          <Button type="submit">
            {data.mode === "edit" ? "Save vehicle" : "Add vehicle"}
          </Button>
        </div>
      </form>
    </section>
  );
}
