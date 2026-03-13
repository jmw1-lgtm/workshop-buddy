"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeRegistration } from "@/lib/vehicle";

type VehicleLookupFieldsProps = {
  initialVehicle?: {
    registration?: string | null;
    make?: string | null;
    model?: string | null;
    fuel?: string | null;
    year?: number | null;
    engineSizeCc?: number | null;
  };
};

type VehicleFormState = {
  registration: string;
  make: string;
  model: string;
  fuel: string;
  year: string;
  engineSizeCc: string;
};

function toFormState(
  initialVehicle?: VehicleLookupFieldsProps["initialVehicle"],
): VehicleFormState {
  return {
    registration: initialVehicle?.registration ?? "",
    make: initialVehicle?.make ?? "",
    model: initialVehicle?.model ?? "",
    fuel: initialVehicle?.fuel ?? "",
    year: initialVehicle?.year ? `${initialVehicle.year}` : "",
    engineSizeCc: initialVehicle?.engineSizeCc ? `${initialVehicle.engineSizeCc}` : "",
  };
}

export function VehicleLookupFields({ initialVehicle }: VehicleLookupFieldsProps) {
  const [vehicle, setVehicle] = useState<VehicleFormState>(() => toFormState(initialVehicle));
  const [status, setStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: string | null;
  }>({
    loading: false,
    error: null,
    success: null,
  });

  async function runLookup() {
    const registration = normalizeRegistration(vehicle.registration);

    setVehicle((current) => ({
      ...current,
      registration,
    }));
    setStatus({
      loading: true,
      error: null,
      success: null,
    });

    try {
      const response = await fetch("/api/dvla/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registration }),
      });

      const body = (await response.json()) as
        | {
            vehicle?: {
              registration: string;
              make: string;
              model: string;
              fuel: string;
              year: number | null;
              engineSizeCc: number | null;
            };
            error?: string;
          }
        | undefined;

      if (!response.ok || !body?.vehicle) {
        throw new Error(body?.error ?? "Unable to complete DVLA lookup.");
      }

      setVehicle({
        registration: body.vehicle.registration,
        make: body.vehicle.make,
        model: body.vehicle.model || vehicle.model,
        fuel: body.vehicle.fuel,
        year: body.vehicle.year ? `${body.vehicle.year}` : "",
        engineSizeCc: body.vehicle.engineSizeCc
          ? `${body.vehicle.engineSizeCc}`
          : "",
      });
      setStatus({
        loading: false,
        error: null,
        success: "DVLA vehicle details loaded.",
      });
    } catch (error) {
      setStatus({
        loading: false,
        error: error instanceof Error ? error.message : "Unable to complete DVLA lookup.",
        success: null,
      });
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="registration">Registration</Label>
        <div className="flex gap-2">
          <Input
            id="registration"
            name="registration"
            placeholder="AB12 CDE"
            value={vehicle.registration}
            onChange={(event) => {
              setVehicle((current) => ({
                ...current,
                registration: event.target.value.toUpperCase(),
              }));
              setStatus((current) => ({
                ...current,
                error: null,
                success: null,
              }));
            }}
            required
          />
          <Button
            type="button"
            variant="outline"
            onClick={runLookup}
            disabled={status.loading}
          >
            <MaterialIcon name="search" className="text-[18px]" />
            {status.loading ? "Looking up..." : "DVLA Lookup"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOnlyField
          id="make"
          name="make"
          label="Make"
          value={vehicle.make}
          placeholder="Lookup to populate"
        />
        <ReadOnlyField
          id="model"
          name="model"
          label="Model"
          value={vehicle.model}
          placeholder="Not returned by DVLA"
        />
        <ReadOnlyField
          id="fuel"
          name="fuel"
          label="Fuel type"
          value={vehicle.fuel}
          placeholder="Lookup to populate"
        />
        <ReadOnlyField
          id="year"
          name="year"
          label="Year"
          value={vehicle.year}
          placeholder="Lookup to populate"
        />
        <ReadOnlyField
          id="engineSizeCc"
          name="engineSizeCc"
          label="Engine size (cc)"
          value={vehicle.engineSizeCc}
          placeholder="Lookup to populate"
        />
      </div>

      {status.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {status.error}
        </p>
      ) : null}

      {status.success ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {status.success}
        </p>
      ) : null}
    </div>
  );
}

function ReadOnlyField({
  id,
  name,
  label,
  value,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        value={value}
        readOnly
        placeholder={placeholder}
        className="bg-[var(--surface-muted)]"
      />
    </div>
  );
}
