"use client";

import { JobStatus } from "@prisma/client";
import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  createDiaryJob,
  deleteDiaryJob,
  type JobActionState,
  updateDiaryJob,
} from "@/app/(app)/diary/actions";
import { MaterialIcon } from "@/components/layout/material-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VehicleLookupFields } from "@/components/vehicles/vehicle-lookup-fields";
import { formatVehicleField, isValidUkRegistration, normalizeRegistration } from "@/lib/vehicle";
import { cn } from "@/lib/utils";

type JobTypeOption = {
  id: string;
  name: string;
  color: string;
};

type DiaryDialogJob = {
  id: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  vehicleRegistration: string;
  jobTypeId: string;
  jobTypeName: string;
  status: JobStatus;
  durationMins: number;
  notes: string | null;
};

type CreateJobDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduledStart: string | null;
  slotLabel: string | null;
  selectedDate: string;
  selectedView?: "day" | "week";
  jobTypes: JobTypeOption[];
  slotLength: 30 | 60;
  job: DiaryDialogJob | null;
};

type IntakeVehicleResult = {
  vehicleId: string;
  registration: string;
  make: string | null;
  model: string | null;
  fuel: string | null;
  year: number | null;
  engineSizeCc: number | null;
};

type CustomerSearchSummary = {
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
};

type IntakeSearchResult =
  | ({
      kind: "vehicle";
      customerId: string;
      customerName: string;
      customerPhone: string | null;
      customerEmail: string | null;
      vehicle: IntakeVehicleResult;
    })
  | ({
      kind: "customer";
    } & CustomerSearchSummary & {
        vehicles: IntakeVehicleResult[];
      });

type CreateJobDraft = {
  registration: string;
  customerName: string;
  phone: string;
  customerEmail: string;
  make: string;
  model: string;
  fuel: string;
  year: string;
  engineSizeCc: string;
  jobTypeId: string;
  durationMins: string;
  notes: string;
};

const initialState: JobActionState = {
  error: null,
};

const JOB_STATUS_OPTIONS: Array<{
  value: JobStatus;
  label: string;
}> = [
  { value: "BOOKED", label: "Booked" },
  { value: "ARRIVED", label: "Arrived" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "WAITING_PARTS", label: "Waiting Parts" },
  { value: "WAITING_COLLECTION", label: "Waiting Collection" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function buildEmptyDraft(jobTypes: JobTypeOption[], slotLength: 30 | 60): CreateJobDraft {
  return {
    registration: "",
    customerName: "",
    phone: "",
    customerEmail: "",
    make: "",
    model: "",
    fuel: "",
    year: "",
    engineSizeCc: "",
    jobTypeId: jobTypes[0]?.id ?? "",
    durationMins: `${slotLength}`,
    notes: "",
  };
}

function buildDraftFromSearchResult(
  result: IntakeVehicleResult & CustomerSearchSummary,
  jobTypes: JobTypeOption[],
  slotLength: 30 | 60,
): CreateJobDraft {
  return {
    registration: result.registration,
    customerName: result.customerName,
    phone: result.customerPhone ?? "",
    customerEmail: result.customerEmail ?? "",
    make: result.make ?? "",
    model: result.model ?? "",
    fuel: result.fuel ?? "",
    year: result.year ? `${result.year}` : "",
    engineSizeCc: result.engineSizeCc ? `${result.engineSizeCc}` : "",
    jobTypeId: jobTypes[0]?.id ?? "",
    durationMins: `${slotLength}`,
    notes: "",
  };
}

function buildDraftFromCustomerSummary(
  customer: CustomerSearchSummary,
  jobTypes: JobTypeOption[],
  slotLength: 30 | 60,
): CreateJobDraft {
  return {
    ...buildEmptyDraft(jobTypes, slotLength),
    customerName: customer.customerName,
    phone: customer.customerPhone ?? "",
    customerEmail: customer.customerEmail ?? "",
  };
}

function buildDraftFromQuery(
  query: string,
  jobTypes: JobTypeOption[],
  slotLength: 30 | 60,
): CreateJobDraft {
  const trimmed = query.trim();
  const normalizedRegistration = normalizeRegistration(trimmed);
  const emptyDraft = buildEmptyDraft(jobTypes, slotLength);

  if (isValidUkRegistration(normalizedRegistration)) {
    return {
      ...emptyDraft,
      registration: normalizedRegistration,
    };
  }

  if (/^[\d\s+()-]{6,}$/.test(trimmed)) {
    return {
      ...emptyDraft,
      phone: trimmed,
    };
  }

  return {
    ...emptyDraft,
    customerName: trimmed,
  };
}

function SaveButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-strong)] disabled:opacity-50"
    >
      {pending
        ? isEditing
          ? "Saving..."
          : "Creating..."
        : isEditing
          ? "Save changes"
          : "Create job"}
    </button>
  );
}

function DeleteButton(props: React.ComponentProps<"button">) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formNoValidate
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50"
      {...props}
    >
      {pending ? "Deleting..." : "Delete job"}
    </button>
  );
}

export function CreateJobDialog({
  open,
  onOpenChange,
  scheduledStart,
  slotLabel,
  selectedDate,
  selectedView = "day",
  jobTypes,
  slotLength,
  job,
}: CreateJobDialogProps) {
  const [createState, createAction] = useActionState(createDiaryJob, initialState);
  const [updateState, updateAction] = useActionState(updateDiaryJob, initialState);
  const [deleteState, deleteAction] = useActionState(deleteDiaryJob, initialState);
  const isEditing = Boolean(job);
  const state = isEditing ? updateState : createState;

  const [createStep, setCreateStep] = React.useState<"lookup" | "vehicle" | "details">("lookup");
  const [lookupQuery, setLookupQuery] = React.useState("");
  const [lookupResults, setLookupResults] = React.useState<IntakeSearchResult[]>([]);
  const [lookupLoading, setLookupLoading] = React.useState(false);
  const [lookupMessage, setLookupMessage] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<CreateJobDraft>(() =>
    buildEmptyDraft(jobTypes, slotLength),
  );
  const [selectedMatch, setSelectedMatch] = React.useState<
    (IntakeVehicleResult & CustomerSearchSummary) | null
  >(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState<
    (CustomerSearchSummary & { vehicles: IntakeVehicleResult[] }) | null
  >(null);

  React.useEffect(() => {
    if (!open || isEditing) {
      return;
    }

    setCreateStep("lookup");
    setLookupQuery("");
    setLookupResults([]);
    setLookupLoading(false);
    setLookupMessage(null);
    setSelectedMatch(null);
    setSelectedCustomer(null);
    setDraft(buildEmptyDraft(jobTypes, slotLength));
  }, [open, isEditing, jobTypes, slotLength]);

  React.useEffect(() => {
    if (!open || isEditing || createStep !== "lookup") {
      return;
    }

    const trimmedQuery = lookupQuery.trim();

    if (trimmedQuery.length < 2) {
      setLookupResults([]);
      setLookupLoading(false);
      setLookupMessage(trimmedQuery ? "Keep typing to search existing records." : null);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLookupLoading(true);
      setLookupMessage(null);

      try {
        const response = await fetch(
          `/api/job-intake/search?q=${encodeURIComponent(trimmedQuery)}`,
          {
            signal: controller.signal,
          },
        );

        const body = (await response.json()) as
          | {
              results?: IntakeSearchResult[];
              error?: string;
            }
          | undefined;

        if (!response.ok) {
          throw new Error(body?.error ?? "Unable to search existing records.");
        }

        const results = body?.results ?? [];
        setLookupResults(results);
        setLookupMessage(results.length ? null : "No existing customers or vehicles matched.");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLookupResults([]);
        setLookupMessage(
          error instanceof Error ? error.message : "Unable to search existing records.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLookupLoading(false);
        }
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [createStep, isEditing, lookupQuery, open]);

  const dialogWidthClass = isEditing
    ? "max-w-xl"
    : createStep === "lookup" || createStep === "vehicle"
      ? "max-w-2xl"
      : "max-w-3xl";

  function openDetailsWithVehicle(
    customer: CustomerSearchSummary,
    vehicle: IntakeVehicleResult,
  ) {
    const match = { ...customer, ...vehicle };

    setSelectedCustomer(null);
    setSelectedMatch(match);
    setDraft(buildDraftFromSearchResult(match, jobTypes, slotLength));
    setCreateStep("details");
  }

function openDetailsWithCustomer(
  customer: CustomerSearchSummary & { vehicles?: IntakeVehicleResult[] },
) {
    setSelectedMatch(null);
    setSelectedCustomer({
      customerId: customer.customerId,
      customerName: customer.customerName,
      customerPhone: customer.customerPhone,
      customerEmail: customer.customerEmail,
      vehicles: customer.vehicles ?? [],
    });
    setDraft(buildDraftFromCustomerSummary(customer, jobTypes, slotLength));
    setCreateStep("details");
  }

  function handleLookupResultSelect(result: IntakeSearchResult) {
    if (result.kind === "vehicle") {
      openDetailsWithVehicle(
        {
          customerId: result.customerId,
          customerName: result.customerName,
          customerPhone: result.customerPhone,
          customerEmail: result.customerEmail,
        },
        result.vehicle,
      );
      return;
    }

    setSelectedMatch(null);
    setSelectedCustomer(result);
    setCreateStep("vehicle");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogWidthClass}>
        {isEditing ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit job</DialogTitle>
              <DialogDescription>
                Update the job details, status, or delete the job. All changes remain scoped
                to the current workshop.
              </DialogDescription>
            </DialogHeader>

            <EditJobForm
              job={job}
              updateAction={updateAction}
              deleteAction={deleteAction}
              updateState={state}
              deleteState={deleteState}
              jobTypes={jobTypes}
              selectedDate={selectedDate}
              selectedView={selectedView}
            />
          </>
        ) : createStep === "lookup" ? (
          <>
            <DialogHeader>
              <DialogTitle>Find customer or vehicle</DialogTitle>
              <DialogDescription>
                Start with the registration, customer name, or phone number. Choose an
                existing record to pre-fill the job, or continue with a new customer and
                vehicle.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5">
              <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/35 p-4">
                <Label htmlFor="jobLookup" className="text-sm font-semibold">
                  Vehicle registration or customer lookup
                </Label>
                <div className="relative mt-3">
                  <MaterialIcon
                    name="search"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--muted-foreground)]"
                  />
                  <Input
                    id="jobLookup"
                    placeholder="AB12 CDE, Jamie Smith, or 07123 456789"
                    value={lookupQuery}
                    onChange={(event) => setLookupQuery(event.target.value)}
                    className="h-12 pl-10"
                    autoFocus
                  />
                </div>
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                  We search existing customers and vehicles in this workshop as you type.
                </p>
              </div>

              <div className="grid gap-3">
                {lookupLoading ? (
                  <LookupStateCard
                    icon="progress_activity"
                    title="Searching existing records"
                    description="Looking for matching customers and registrations in this workshop."
                  />
                ) : lookupResults.length ? (
                  lookupResults.map((result) => {
                    const vehicleCount = result.kind === "vehicle" ? 1 : result.vehicles.length;
                    const vehicleCountLabel =
                      vehicleCount === 0
                        ? "No vehicles"
                        : `${vehicleCount} ${vehicleCount === 1 ? "vehicle" : "vehicles"}`;

                    return (
                      <div
                        key={
                          result.kind === "vehicle"
                            ? `vehicle-${result.vehicle.vehicleId}`
                            : `customer-${result.customerId}`
                        }
                        className="rounded-3xl border border-[var(--surface-border)] bg-white px-4 py-3.5 shadow-[0_1px_0_rgba(15,23,42,0.03)] transition-colors hover:border-[var(--primary-pale)] hover:bg-[var(--surface-muted)]/10"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                              {result.customerName}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              {result.customerPhone ? (
                                <p className="truncate text-[13px] text-[var(--muted-foreground)]">
                                  {result.customerPhone}
                                </p>
                              ) : null}
                              <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted-foreground)]">
                                {vehicleCountLabel}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleLookupResultSelect(result)}
                            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-white px-3.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--primary-pale)] hover:bg-[var(--surface-muted)]"
                          >
                            Continue
                            <MaterialIcon name="arrow_forward" className="text-[18px]" />
                          </button>
                        </div>

                        {result.kind === "vehicle" ? (
                          <div className="mt-2.5 flex items-center gap-2 rounded-2xl bg-[var(--surface-muted)]/22 px-3 py-2">
                            <span className="shrink-0 rounded-full border border-[var(--surface-border)] bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-[var(--foreground)] shadow-sm">
                              {result.vehicle.registration}
                            </span>
                            <p className="truncate text-[13px] text-[var(--muted-foreground)]">
                              {[
                                formatVehicleField(result.vehicle.make),
                                formatVehicleField(result.vehicle.model),
                              ]
                                .filter(Boolean)
                                .join(" ") || "Vehicle details not stored yet"}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                ) : lookupMessage ? (
                  <LookupStateCard
                    icon="person_search"
                    title="Create a new customer and vehicle"
                    description={lookupMessage}
                  />
                ) : (
                  <LookupStateCard
                    icon="person_search"
                    title="Start typing to search"
                    description="Search by registration, customer name, or phone number to reuse an existing record."
                  />
                )}
              </div>

              <div className="flex justify-end border-t border-[var(--surface-border)] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMatch(null);
                    setDraft(buildDraftFromQuery(lookupQuery, jobTypes, slotLength));
                    setCreateStep("details");
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
                >
                  Create new customer / vehicle
                </button>
              </div>
            </div>
          </>
        ) : createStep === "vehicle" && selectedCustomer ? (
          <>
            <DialogHeader>
              <DialogTitle>Select vehicle</DialogTitle>
              <DialogDescription>
                Choose an existing vehicle for {selectedCustomer.customerName}, or continue
                with a new vehicle.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5">
              <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/35 p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {selectedCustomer.customerName}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {[selectedCustomer.customerPhone, selectedCustomer.customerEmail]
                    .filter(Boolean)
                    .join(" · ") || "No contact details saved"}
                </p>
              </div>

              <div className="grid gap-3">
                {selectedCustomer.vehicles.length ? (
                  selectedCustomer.vehicles.map((vehicle) => (
                    <button
                      key={vehicle.vehicleId}
                      type="button"
                      onClick={() => openDetailsWithVehicle(selectedCustomer, vehicle)}
                      className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--surface-border)] bg-white px-4 py-4 text-left shadow-sm transition-colors hover:border-[var(--primary-pale)] hover:bg-[var(--surface-muted)]/18"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {vehicle.registration}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {[formatVehicleField(vehicle.make), formatVehicleField(vehicle.model)]
                            .filter(Boolean)
                            .join(" ") || "Vehicle details not stored yet"}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {[vehicle.year ? `${vehicle.year}` : null, formatVehicleField(vehicle.fuel)]
                            .filter(Boolean)
                            .join(" · ") || "No extra vehicle details"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                        Select
                        <MaterialIcon name="arrow_forward" className="text-[18px]" />
                      </div>
                    </button>
                  ))
                ) : (
                  <LookupStateCard
                    icon="directions_car"
                    title="No linked vehicles yet"
                    description="Continue by adding a new vehicle for this customer."
                  />
                )}

                <button
                  type="button"
                  onClick={() => openDetailsWithCustomer(selectedCustomer)}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-muted)]/18 px-4 py-4 text-left transition-colors hover:border-[var(--primary-pale)] hover:bg-[var(--surface-muted)]/28"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-[var(--primary)] shadow-sm">
                      <MaterialIcon name="add" className="text-[20px]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        Add new vehicle
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Continue to the job form with manual vehicle entry and DVLA lookup.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                    Continue
                    <MaterialIcon name="arrow_forward" className="text-[18px]" />
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--surface-border)] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomer(null);
                    setCreateStep("lookup");
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
                >
                  Back to lookup
                </button>
                <div className="text-sm text-[var(--muted-foreground)]">
                  Select a saved vehicle or add a new one.
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create job</DialogTitle>
              <DialogDescription>
                {selectedMatch
                  ? `Using the selected customer and vehicle from ${selectedMatch.customerName}. You can still edit the details before saving.`
                  : selectedCustomer
                    ? `Creating a job for ${selectedCustomer.customerName}. Add the vehicle details below.`
                  : slotLabel
                    ? `Create a job starting at ${slotLabel}. Add the vehicle, customer, and job details below.`
                    : "Create a new job for the selected slot."}
              </DialogDescription>
            </DialogHeader>

            <CreateJobForm
              scheduledStart={scheduledStart}
              selectedDate={selectedDate}
              selectedView={selectedView}
              slotLength={slotLength}
              slotLabel={slotLabel}
              jobTypes={jobTypes}
              draft={draft}
              onDraftChange={setDraft}
              createAction={createAction}
              state={state}
              onBack={() => {
                setCreateStep(selectedCustomer ? "vehicle" : "lookup");
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LookupStateCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-muted)]/24 px-4 py-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-[var(--primary)] shadow-sm">
          <MaterialIcon name={icon} className="text-[20px]" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
          <p className="text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
        </div>
      </div>
    </div>
  );
}

function CreateJobForm({
  scheduledStart,
  selectedDate,
  selectedView,
  slotLength,
  slotLabel,
  jobTypes,
  draft,
  onDraftChange,
  createAction,
  state,
  onBack,
}: {
  scheduledStart: string | null;
  selectedDate: string;
  selectedView: "day" | "week";
  slotLength: 30 | 60;
  slotLabel: string | null;
  jobTypes: JobTypeOption[];
  draft: CreateJobDraft;
  onDraftChange: React.Dispatch<React.SetStateAction<CreateJobDraft>>;
  createAction: (
    payload: FormData,
  ) => void;
  state: JobActionState;
  onBack: () => void;
}) {
  const initialVehicle = React.useMemo(
    () => ({
      registration: draft.registration,
      make: draft.make,
      model: draft.model,
      fuel: draft.fuel,
      year: draft.year ? Number(draft.year) : null,
      engineSizeCc: draft.engineSizeCc ? Number(draft.engineSizeCc) : null,
    }),
    [
      draft.registration,
      draft.make,
      draft.model,
      draft.fuel,
      draft.year,
      draft.engineSizeCc,
    ],
  );

  const handleVehicleChange = React.useCallback(
    (vehicle: {
      registration: string;
      make: string;
      model: string;
      fuel: string;
      year: string;
      engineSizeCc: string;
    }) => {
      onDraftChange((current) => {
        if (
          current.registration === vehicle.registration &&
          current.make === vehicle.make &&
          current.model === vehicle.model &&
          current.fuel === vehicle.fuel &&
          current.year === vehicle.year &&
          current.engineSizeCc === vehicle.engineSizeCc
        ) {
          return current;
        }

        return {
          ...current,
          registration: vehicle.registration,
          make: vehicle.make,
          model: vehicle.model,
          fuel: vehicle.fuel,
          year: vehicle.year,
          engineSizeCc: vehicle.engineSizeCc,
        };
      });
    },
    [onDraftChange],
  );

  return (
    <form action={createAction} className="grid gap-5">
      <input type="hidden" name="scheduledStart" value={scheduledStart ?? ""} />
      <input type="hidden" name="selectedDate" value={selectedDate} />
      <input type="hidden" name="selectedView" value={selectedView} />

      <div className="grid gap-4 md:grid-cols-[1.02fr_0.98fr]">
        <SectionCard
          title="Vehicle"
          description="Use DVLA lookup or enter details manually if needed."
          className="content-start gap-3"
        >
          <VehicleLookupFields
            initialVehicle={initialVehicle}
            onVehicleChange={handleVehicleChange}
          />
        </SectionCard>

        <div className="grid gap-4">
          <SectionCard
            title="Job details"
            description={slotLabel ? `Booking starts at ${slotLabel}.` : "Set the type and duration."}
            className="border-[var(--primary-pale)] bg-[linear-gradient(180deg,rgba(231,236,239,0.62),rgba(255,255,255,1))]"
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="jobTypeId">Job type</Label>
                <Select
                  id="jobTypeId"
                  name="jobTypeId"
                  required
                  value={draft.jobTypeId}
                  onChange={(event) =>
                    onDraftChange((current) => ({
                      ...current,
                      jobTypeId: event.target.value,
                    }))
                  }
                >
                  {jobTypes.map((jobType) => (
                    <option key={jobType.id} value={jobType.id}>
                      {jobType.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="durationMins">Estimated duration</Label>
                <Select
                  id="durationMins"
                  name="durationMins"
                  required
                  value={draft.durationMins}
                  onChange={(event) =>
                    onDraftChange((current) => ({
                      ...current,
                      durationMins: event.target.value,
                    }))
                  }
                >
                  {[slotLength, slotLength * 2, slotLength * 3, slotLength * 4].map((value) => (
                    <option key={value} value={value}>
                      {value} minutes
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Customer waiting. MOT and service if possible."
                  rows={5}
                  value={draft.notes}
                  onChange={(event) =>
                    onDraftChange((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Customer" description="Confirm who is bringing the vehicle in.">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="customerName">Customer name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  placeholder="Jamie Smith"
                  value={draft.customerName}
                  onChange={(event) =>
                    onDraftChange((current) => ({
                      ...current,
                      customerName: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="07123 456789"
                  type="tel"
                  value={draft.phone}
                  onChange={(event) =>
                    onDraftChange((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  placeholder="customer@example.com"
                  type="email"
                  value={draft.customerEmail}
                  onChange={(event) =>
                    onDraftChange((current) => ({
                      ...current,
                      customerEmail: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center justify-between border-t border-[var(--surface-border)] pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
        >
          Back to lookup
        </button>

        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <MaterialIcon name="schedule" className="text-[18px]" />
          Slot length {slotLength} minutes
        </div>

        <SaveButton isEditing={false} />
      </div>
    </form>
  );
}

function SectionCard({
  title,
  description,
  className,
  children,
}: React.PropsWithChildren<{
  title: string;
  description: string;
  className?: string;
}>) {
  return (
    <section
      className={cn(
        "grid gap-4 rounded-3xl border border-[var(--surface-border)] bg-white p-5",
        className,
      )}
    >
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function EditJobForm({
  job,
  updateAction,
  deleteAction,
  updateState,
  deleteState,
  jobTypes,
  selectedDate,
  selectedView,
}: {
  job: DiaryDialogJob | null;
  updateAction: (
    payload: FormData,
  ) => void;
  deleteAction: (
    payload: FormData,
  ) => void;
  updateState: JobActionState;
  deleteState: JobActionState;
  jobTypes: JobTypeOption[];
  selectedDate: string;
  selectedView: "day" | "week";
}) {
  return (
    <form
      action={updateAction}
      className="grid gap-4"
      key={job?.id ?? "edit"}
    >
      <input type="hidden" name="jobId" value={job?.id ?? ""} />
      <input type="hidden" name="selectedDate" value={selectedDate} />
      <input type="hidden" name="selectedView" value={selectedView} />

      <VehicleLookupFields
        initialVehicle={
          job
            ? {
                registration: job.vehicleRegistration,
              }
            : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="customerName">Customer name</Label>
          <Input
            id="customerName"
            name="customerName"
            placeholder="Jamie Smith"
            defaultValue={job?.customerName ?? ""}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="07123 456789"
            type="tel"
            defaultValue={job?.customerPhone ?? ""}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="customerEmail">Email</Label>
          <Input
            id="customerEmail"
            name="customerEmail"
            placeholder="customer@example.com"
            type="email"
            defaultValue={job?.customerEmail ?? ""}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="jobTypeId">Job type</Label>
          <Select
            id="jobTypeId"
            name="jobTypeId"
            required
            defaultValue={job?.jobTypeId ?? jobTypes[0]?.id}
          >
            {jobTypes.map((jobType) => (
              <option key={jobType.id} value={jobType.id}>
                {jobType.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="durationMins">Estimated duration</Label>
          <Select
            id="durationMins"
            name="durationMins"
            required
            defaultValue={`${job?.durationMins ?? 60}`}
          >
            {[30, 60, 90, 120, 180, 240].map((value) => (
              <option key={value} value={value}>
                {value} minutes
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" required defaultValue={job?.status ?? "BOOKED"}>
            {JOB_STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Customer waiting. MOT and service if possible."
          defaultValue={job?.notes ?? ""}
          rows={4}
        />
      </div>

      {updateState.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {updateState.error}
        </p>
      ) : null}

      {deleteState.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {deleteState.error}
        </p>
      ) : null}

      <div className="flex items-center justify-between border-t border-[var(--surface-border)] pt-4">
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <MaterialIcon name="schedule" className="text-[18px]" />
          Update job details
        </div>
        <div className="flex items-center gap-3">
          <DeleteButton formAction={deleteAction} />
          <SaveButton isEditing />
        </div>
      </div>
    </form>
  );
}
