"use client";

import { useEffect, useMemo, useState } from "react";

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
  allowManualEntry?: boolean;
  onVehicleChange?: (vehicle: VehicleFormState) => void;
  withFormNames?: boolean;
  idPrefix?: string;
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

export function VehicleLookupFields({
  initialVehicle,
  allowManualEntry = true,
  onVehicleChange,
  withFormNames = true,
  idPrefix = "",
}: VehicleLookupFieldsProps) {
  const initialRegistration = initialVehicle?.registration ?? null;
  const initialMake = initialVehicle?.make ?? null;
  const initialModel = initialVehicle?.model ?? null;
  const initialFuel = initialVehicle?.fuel ?? null;
  const initialYear = initialVehicle?.year ?? null;
  const initialEngineSizeCc = initialVehicle?.engineSizeCc ?? null;

  const normalizedInitialVehicle = useMemo(
    () =>
      toFormState({
        registration: initialRegistration,
        make: initialMake,
        model: initialModel,
        fuel: initialFuel,
        year: initialYear,
        engineSizeCc: initialEngineSizeCc,
      }),
    [
      initialRegistration,
      initialMake,
      initialModel,
      initialFuel,
      initialYear,
      initialEngineSizeCc,
    ],
  );
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

  useEffect(() => {
    setVehicle((current) =>
      areVehicleStatesEqual(current, normalizedInitialVehicle)
        ? current
        : normalizedInitialVehicle,
    );
    setStatus({
      loading: false,
      error: null,
      success: null,
    });
  }, [
    initialMake,
    initialModel,
    initialFuel,
    initialYear,
    initialEngineSizeCc,
    normalizedInitialVehicle,
  ]);

  useEffect(() => {
    onVehicleChange?.(vehicle);
  }, [onVehicleChange, vehicle]);

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
        <Label htmlFor={buildFieldId(idPrefix, "registration")}>Registration</Label>
        <div className="flex gap-2">
          <Input
            id={buildFieldId(idPrefix, "registration")}
            name={withFormNames ? "registration" : undefined}
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

      {allowManualEntry ? (
        <div className="grid gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/35 p-4 sm:grid-cols-2">
          <EditableField
            id={buildFieldId(idPrefix, "make")}
            name={withFormNames ? "make" : undefined}
            label="Make"
            value={vehicle.make}
            placeholder="Ford"
            onChange={(value) =>
              setVehicle((current) => ({
                ...current,
                make: value,
              }))
            }
          />
          <EditableField
            id={buildFieldId(idPrefix, "model")}
            name={withFormNames ? "model" : undefined}
            label="Model"
            value={vehicle.model}
            placeholder="Transit Custom"
            onChange={(value) =>
              setVehicle((current) => ({
                ...current,
                model: value,
              }))
            }
          />
          <EditableField
            id={buildFieldId(idPrefix, "fuel")}
            name={withFormNames ? "fuel" : undefined}
            label="Fuel type"
            value={vehicle.fuel}
            placeholder="Diesel"
            onChange={(value) =>
              setVehicle((current) => ({
                ...current,
                fuel: value,
              }))
            }
          />
          <EditableField
            id={buildFieldId(idPrefix, "year")}
            name={withFormNames ? "year" : undefined}
            label="Year"
            value={vehicle.year}
            placeholder="2021"
            inputMode="numeric"
            onChange={(value) =>
              setVehicle((current) => ({
                ...current,
                year: value,
              }))
            }
          />
          <EditableField
            id={buildFieldId(idPrefix, "engineSizeCc")}
            name={withFormNames ? "engineSizeCc" : undefined}
            label="Engine size (cc)"
            value={vehicle.engineSizeCc}
            placeholder="1996"
            inputMode="numeric"
            onChange={(value) =>
              setVehicle((current) => ({
                ...current,
                engineSizeCc: value,
              }))
            }
          />
        </div>
      ) : (
        <>
          <input type="hidden" name="make" value={vehicle.make} />
          <input type="hidden" name="model" value={vehicle.model} />
          <input type="hidden" name="fuel" value={vehicle.fuel} />
          <input type="hidden" name="year" value={vehicle.year} />
          <input type="hidden" name="engineSizeCc" value={vehicle.engineSizeCc} />
        </>
      )}

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

function buildFieldId(prefix: string, id: string) {
  return prefix ? `${prefix}-${id}` : id;
}

function areVehicleStatesEqual(left: VehicleFormState, right: VehicleFormState) {
  return (
    left.registration === right.registration &&
    left.make === right.make &&
    left.model === right.model &&
    left.fuel === right.fuel &&
    left.year === right.year &&
    left.engineSizeCc === right.engineSizeCc
  );
}

function EditableField({
  id,
  name,
  label,
  value,
  placeholder,
  onChange,
  inputMode,
}: {
  id: string;
  name?: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  inputMode?: React.ComponentProps<"input">["inputMode"];
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="bg-white"
      />
    </div>
  );
}
