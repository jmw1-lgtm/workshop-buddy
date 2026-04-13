"use client";

import { JobLineItemType, JobStatus } from "@prisma/client";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  type JobCardActionState,
  updateJobCard,
} from "@/app/(app)/jobs/[jobId]/actions";
import { MaterialIcon } from "@/components/layout/material-icon";
import { PrintJobCardButton } from "@/components/jobs/print-job-card-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { VehicleLookupFields } from "@/components/vehicles/vehicle-lookup-fields";
import { jobStatusLabels } from "@/lib/job-status";
import { cn } from "@/lib/utils";
import type { JobCardData } from "@/services/jobs";

const initialState: JobCardActionState = {
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

const LINE_ITEM_TYPE_OPTIONS: Array<{
  value: JobLineItemType;
  label: string;
}> = [
  { value: "LABOUR", label: "Labour" },
  { value: "PART", label: "Part" },
  { value: "MISC", label: "Misc" },
];

type JobCardEditorProps = {
  job: JobCardData;
  jobTypes: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

type EditableLineItem = {
  id: string;
  description: string;
  itemType: JobLineItemType;
  quantity: string;
  unitPrice: string;
};

type VehicleSummaryState = {
  registration: string;
  make: string;
  model: string;
  fuel: string;
  year: string;
  engineSizeCc: string;
};

function SaveButton({ form }: { form?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" form={form} disabled={pending}>
      <MaterialIcon name={pending ? "hourglass_top" : "save"} className="text-[18px]" />
      {pending ? "Saving..." : "Save Job Card"}
    </Button>
  );
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toTimeInputValue(date: Date) {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${hours}:${minutes}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatEditableNumber(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(2);
}

function toVehicleSummaryState(job: JobCardData): VehicleSummaryState {
  return {
    registration: job.vehicle.registration,
    make: job.vehicle.make ?? "",
    model: job.vehicle.model ?? "",
    fuel: job.vehicle.fuel ?? "",
    year: job.vehicle.year ? `${job.vehicle.year}` : "",
    engineSizeCc: job.vehicle.engineSizeCc ? `${job.vehicle.engineSizeCc}` : "",
  };
}

function toEditableLineItems(job: JobCardData): EditableLineItem[] {
  return job.lineItems.map((lineItem) => ({
    id: lineItem.id,
    description: lineItem.description,
    itemType: lineItem.itemType,
    quantity: formatEditableNumber(lineItem.quantity),
    unitPrice: formatEditableNumber(lineItem.unitPrice),
  }));
}

function createBlankLineItem(): EditableLineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    itemType: "LABOUR",
    quantity: "1",
    unitPrice: "0.00",
  };
}

function parseDisplayNumber(value: string) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getLineTotal(lineItem: EditableLineItem) {
  return parseDisplayNumber(lineItem.quantity) * parseDisplayNumber(lineItem.unitPrice);
}

function getStatusBadgeVariant(status: JobStatus) {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "WAITING_PARTS":
    case "WAITING_COLLECTION":
      return "warning";
    case "CANCELLED":
      return "danger";
    case "IN_PROGRESS":
    case "ARRIVED":
      return "info";
    default:
      return "default";
  }
}

export function JobCardEditor({ job, jobTypes }: JobCardEditorProps) {
  const [state, formAction] = useActionState(updateJobCard, initialState);
  const [vehicleSummary, setVehicleSummary] = useState<VehicleSummaryState>(() =>
    toVehicleSummaryState(job),
  );
  const [lineItems, setLineItems] = useState<EditableLineItem[]>(() => toEditableLineItems(job));
  const formId = "job-card-form";

  useEffect(() => {
    setVehicleSummary(toVehicleSummaryState(job));
    setLineItems(toEditableLineItems(job));
  }, [job]);

  const subtotal = useMemo(
    () => lineItems.reduce((sum, lineItem) => sum + getLineTotal(lineItem), 0),
    [lineItems],
  );
  const vatAmount = 0;
  const total = subtotal + vatAmount;
  const vehicleHeadline = [vehicleSummary.make, vehicleSummary.model].filter(Boolean).join(" ");
  const vehicleSpec = [vehicleSummary.year, vehicleSummary.fuel, formatEngineSize(vehicleSummary)]
    .filter(Boolean)
    .join(" • ");
  const jobReference = `${job.jobNumber}`;

  return (
    <form id={formId} action={formAction} className="grid gap-6 print:gap-4">
      <input type="hidden" name="jobId" value={job.id} />

      <Card className="overflow-hidden bg-white print:rounded-none print:border-0 print:shadow-none">
        <CardContent className="px-0 pb-0">
          <div className="border-b border-[var(--surface-border)] bg-[linear-gradient(135deg,rgba(163,206,241,0.22),rgba(255,255,255,0.98))] px-6 py-5 print:bg-white print:px-0 print:py-4">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="tracking-[0.12em] uppercase">Job Card</Badge>
                  <Badge variant={getStatusBadgeVariant(job.status)}>
                    {jobStatusLabels[job.status]}
                  </Badge>
                  <Badge variant="default">{job.jobType.name}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-end gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
                      Work Order #{jobReference}
                    </h1>
                    <p className="pb-1 text-sm font-medium uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {job.workshop.name}
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm text-[var(--muted-foreground)] sm:grid-cols-3">
                    <HeaderMeta label="Scheduled" value={formatLongDate(job.scheduledStart)} />
                    <HeaderMeta label="Time" value={formatTime(job.scheduledStart)} />
                    <HeaderMeta
                      label="Estimated duration"
                      value={`${job.durationMins} mins`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 print:hidden">
                <SaveButton form={formId} />
                <PrintJobCardButton />
              </div>
            </div>
          </div>

          <div className="px-6 py-6 print:px-0 print:py-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <DocumentCard
                title="Customer details"
                description="Primary contact for this job."
                className="print:border print:shadow-none"
              >
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FieldGroup>
                      <Label htmlFor="customerName">Name</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        defaultValue={job.customer.name}
                        required
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={job.customer.phone ?? ""}
                        placeholder="Required"
                        required
                      />
                    </FieldGroup>
                  </div>
                  <FieldGroup>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      defaultValue={job.customer.email ?? ""}
                      placeholder="Optional"
                    />
                  </FieldGroup>
                  <div className="grid gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/25 p-4">
                    <SummaryRow label="Customer" value={job.customer.name} />
                    <SummaryRow label="Phone" value={job.customer.phone ?? "Not recorded"} />
                    <SummaryRow label="Email" value={job.customer.email ?? "Not recorded"} />
                  </div>
                </div>
              </DocumentCard>

              <DocumentCard
                title="Vehicle details"
                description="Vehicle details remain editable and DVLA lookup stays available."
                className="print:border print:shadow-none"
              >
                <div className="grid gap-4">
                  <div className="rounded-[24px] border border-[var(--surface-border)] bg-[linear-gradient(135deg,rgba(39,76,119,0.92),rgba(96,150,186,0.86))] p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/72">
                      Registration
                    </p>
                    <div className="mt-3 inline-flex rounded-2xl border border-white/20 bg-[#f2c94c] px-4 py-2 text-3xl font-bold tracking-[0.28em] text-slate-900 shadow-sm">
                      {(vehicleSummary.registration || "NO REG").padEnd(6, " ")}
                    </div>
                    <p className="mt-4 text-lg font-semibold text-white">
                      {vehicleHeadline || "Vehicle details pending"}
                    </p>
                    <p className="mt-1 text-sm text-white/78">
                      {vehicleSpec || "Make, model, fuel and engine details can be updated below."}
                    </p>
                  </div>

                  <VehicleLookupFields
                    initialVehicle={job.vehicle}
                    onVehicleChange={(vehicle) => setVehicleSummary(vehicle)}
                  />
                </div>
              </DocumentCard>
            </div>

            <div className="mt-4">
              <DocumentCard
                title="Job details"
                description="Operational details for the booking and workshop scheduling."
                className="print:border print:shadow-none"
              >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <FieldGroup>
                    <Label htmlFor="jobTypeId">Job type</Label>
                    <Select id="jobTypeId" name="jobTypeId" defaultValue={job.jobType.id} required>
                      {jobTypes.map((jobType) => (
                        <option key={jobType.id} value={jobType.id}>
                          {jobType.name}
                        </option>
                      ))}
                    </Select>
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="status">Status</Label>
                    <Select id="status" name="status" defaultValue={job.status} required>
                      {JOB_STATUS_OPTIONS.map((statusOption) => (
                        <option key={statusOption.value} value={statusOption.value}>
                          {statusOption.label}
                        </option>
                      ))}
                    </Select>
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="scheduledDate">Scheduled date</Label>
                    <Input
                      id="scheduledDate"
                      name="scheduledDate"
                      type="date"
                      defaultValue={toDateInputValue(job.scheduledStart)}
                      required
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="scheduledTime">Scheduled time</Label>
                    <Input
                      id="scheduledTime"
                      name="scheduledTime"
                      type="time"
                      defaultValue={toTimeInputValue(job.scheduledStart)}
                      required
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="durationMins">Duration (mins)</Label>
                    <Input
                      id="durationMins"
                      name="durationMins"
                      type="number"
                      min={15}
                      step={15}
                      defaultValue={job.durationMins}
                      required
                    />
                  </FieldGroup>
                </div>
              </DocumentCard>
            </div>

            <div className="mt-4">
              <DocumentCard
                title="Work requested"
                description="Capture the customer's complaint or requested work in a clear workshop-ready format."
                className="print:border print:shadow-none"
              >
                <FieldGroup>
                  <Label htmlFor="notes">Customer concern / work description</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    defaultValue={job.notes ?? ""}
                    rows={6}
                    placeholder="Describe the concern, symptoms, or work requested."
                  />
                </FieldGroup>
              </DocumentCard>
            </div>

            <div className="mt-4">
              <DocumentCard
                title="Line items"
                description="Build up labour, parts, and misc charges while keeping the job card printable."
                className="print:border print:shadow-none"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {lineItems.length === 0
                        ? "No line items added yet."
                        : `${lineItems.length} ${lineItems.length === 1 ? "line item" : "line items"}`}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="print:hidden"
                      onClick={() => setLineItems((current) => [...current, createBlankLineItem()])}
                    >
                      <MaterialIcon name="add" className="text-[18px]" />
                      Add line item
                    </Button>
                  </div>

                  {lineItems.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-[var(--surface-border)] bg-[var(--surface-muted)]/18 px-5 py-8 text-center">
                      <p className="text-base font-semibold text-[var(--foreground)]">
                        Start building the work order
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                        Add labour, parts, or misc charges to turn this job card into a workshop-ready work order.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-[24px] border border-[var(--surface-border)]">
                      <table className="min-w-full border-separate border-spacing-0 bg-white text-sm">
                        <thead className="bg-[var(--surface-muted)]/36 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                          <tr>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Qty</th>
                            <th className="px-4 py-3">Unit price</th>
                            <th className="px-4 py-3">Line total</th>
                            <th className="px-4 py-3 print:hidden" />
                          </tr>
                        </thead>
                        <tbody>
                          {lineItems.map((lineItem, index) => (
                            <tr key={lineItem.id} className="align-top">
                              <td className="border-t border-[var(--surface-border)] px-4 py-3">
                                <Input
                                  name="lineItemDescription"
                                  value={lineItem.description}
                                  onChange={(event) =>
                                    updateLineItem(setLineItems, index, {
                                      description: event.target.value,
                                    })
                                  }
                                  placeholder="Oil and filter service"
                                />
                              </td>
                              <td className="border-t border-[var(--surface-border)] px-4 py-3">
                                <Select
                                  name="lineItemType"
                                  value={lineItem.itemType}
                                  onChange={(event) =>
                                    updateLineItem(setLineItems, index, {
                                      itemType: event.target.value as JobLineItemType,
                                    })
                                  }
                                >
                                  {LINE_ITEM_TYPE_OPTIONS.map((itemType) => (
                                    <option key={itemType.value} value={itemType.value}>
                                      {itemType.label}
                                    </option>
                                  ))}
                                </Select>
                              </td>
                              <td className="border-t border-[var(--surface-border)] px-4 py-3">
                                <Input
                                  name="lineItemQuantity"
                                  type="number"
                                  inputMode="decimal"
                                  min="0.01"
                                  step="0.25"
                                  value={lineItem.quantity}
                                  onChange={(event) =>
                                    updateLineItem(setLineItems, index, {
                                      quantity: event.target.value,
                                    })
                                  }
                                />
                              </td>
                              <td className="border-t border-[var(--surface-border)] px-4 py-3">
                                <Input
                                  name="lineItemUnitPrice"
                                  type="number"
                                  inputMode="decimal"
                                  min="0"
                                  step="0.01"
                                  value={lineItem.unitPrice}
                                  onChange={(event) =>
                                    updateLineItem(setLineItems, index, {
                                      unitPrice: event.target.value,
                                    })
                                  }
                                />
                              </td>
                              <td className="border-t border-[var(--surface-border)] px-4 py-3">
                                <div className="flex h-11 items-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/16 px-3 font-semibold text-[var(--foreground)]">
                                  {formatCurrency(getLineTotal(lineItem))}
                                </div>
                              </td>
                              <td className="border-t border-[var(--surface-border)] px-4 py-3 print:hidden">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Remove line item ${index + 1}`}
                                  onClick={() =>
                                    setLineItems((current) =>
                                      current.filter((_, itemIndex) => itemIndex !== index),
                                    )
                                  }
                                >
                                  <MaterialIcon name="delete" className="text-[18px]" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                    <div className="rounded-[24px] border border-dashed border-[var(--surface-border)] bg-[var(--surface-muted)]/18 p-4 text-sm text-[var(--muted-foreground)] print:hidden">
                      Line totals update as quantity and unit price change. VAT is laid out here for future use, but not currently applied.
                    </div>
                    <div className="rounded-[24px] border border-[var(--surface-border)] bg-[var(--surface-muted)]/18 p-4">
                      <TotalsRow label="Subtotal" value={formatCurrency(subtotal)} />
                      <Separator className="my-3" />
                      <TotalsRow
                        label="VAT"
                        value="Not applied"
                        muted
                      />
                      <Separator className="my-3" />
                      <TotalsRow
                        label="Total"
                        value={formatCurrency(total)}
                        valueClassName="text-lg"
                      />
                    </div>
                  </div>
                </div>
              </DocumentCard>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <DocumentCard
                title="Workshop notes"
                description="Internal notes for reception or workshop use."
                className="print:border print:shadow-none"
              >
                <FieldGroup>
                  <Label htmlFor="internalNotes">Workshop / internal notes</Label>
                  <Textarea
                    id="internalNotes"
                    name="internalNotes"
                    defaultValue={job.internalNotes ?? ""}
                    rows={6}
                    placeholder="Internal notes, parts updates, or reminders."
                  />
                </FieldGroup>
              </DocumentCard>

              <DocumentCard
                title="Technician notes"
                description="Keep technician observations separate from the customer request."
                className="print:border print:shadow-none"
              >
                <div className="grid gap-4">
                  <FieldGroup>
                    <Label htmlFor="technicianNotes">Technician notes</Label>
                    <Textarea
                      id="technicianNotes"
                      name="technicianNotes"
                      defaultValue={job.technicianNotes ?? ""}
                      rows={6}
                      placeholder="Findings, checks carried out, or follow-up notes."
                    />
                  </FieldGroup>
                  <div className="rounded-[24px] border border-[var(--surface-border)] bg-white/70 p-4 print:bg-white">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Sign-off</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <SignOffField label="Technician signature" />
                      <SignOffField label="Customer approval" />
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <SignOffField label="Date" compact />
                      <SignOffField label="Time" compact />
                    </div>
                  </div>
                </div>
              </DocumentCard>
            </div>

            {state.error ? (
              <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {state.error}
              </p>
            ) : null}

            <div className="mt-4 flex justify-end print:hidden">
              <SaveButton form={formId} />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function updateLineItem(
  setLineItems: React.Dispatch<React.SetStateAction<EditableLineItem[]>>,
  index: number,
  partial: Partial<EditableLineItem>,
) {
  setLineItems((current) =>
    current.map((lineItem, itemIndex) =>
      itemIndex === index ? { ...lineItem, ...partial } : lineItem,
    ),
  );
}

function DocumentCard({
  title,
  description,
  className,
  children,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
}>) {
  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="border-b border-[var(--surface-border)] pb-4">
        <CardTitle className="text-base uppercase tracking-[0.08em]">{title}</CardTitle>
        {description ? (
          <p className="text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}

function HeaderMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-white/70 px-4 py-3 print:bg-white">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-1 font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function FieldGroup({ children }: React.PropsWithChildren) {
  return <div className="grid gap-2">{children}</div>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="font-semibold text-[var(--foreground)]">{label}</span>
      <span className="text-right text-[var(--muted-foreground)]">{value}</span>
    </div>
  );
}

function TotalsRow({
  label,
  value,
  muted = false,
  valueClassName,
}: {
  label: string;
  value: string;
  muted?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={cn(
          "text-sm font-semibold uppercase tracking-[0.1em]",
          muted ? "text-[var(--muted-foreground)]" : "text-[var(--foreground)]",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-base font-semibold",
          muted ? "text-[var(--muted-foreground)]" : "text-[var(--foreground)]",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

function SignOffField({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <div
        className={cn(
          "mt-3 border-b border-dashed border-[var(--surface-border)]",
          compact ? "h-8" : "h-12",
        )}
      />
    </div>
  );
}

function formatEngineSize(vehicle: Pick<VehicleSummaryState, "engineSizeCc">) {
  return vehicle.engineSizeCc ? `${vehicle.engineSizeCc}cc` : "";
}
