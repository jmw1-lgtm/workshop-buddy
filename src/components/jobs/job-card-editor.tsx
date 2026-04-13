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
import { useJobStatusUpdate } from "@/components/jobs/use-job-status-update";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { VehicleLookupFields } from "@/components/vehicles/vehicle-lookup-fields";
import {
  buildPrimaryJobLineItem,
  ensurePrimaryJobLineItems,
  getDefaultUnitPriceForLineItemType,
} from "@/lib/job-line-items";
import { jobStatusLabels, quickJobStatusOptions } from "@/lib/job-status";
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

type CustomerFields = {
  name: string;
  phone: string;
  email: string;
};

type VehicleFields = {
  registration: string;
  make: string;
  model: string;
  fuel: string;
  year: string;
  engineSizeCc: string;
};

type JobFields = {
  jobTypeId: string;
  status: JobStatus;
  scheduledDate: string;
  scheduledTime: string;
  durationMins: string;
};

type EditorModal = "customer" | "vehicle" | "job" | null;

function SaveButton({ form }: { form?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" form={form} disabled={pending}>
      <MaterialIcon name={pending ? "hourglass_top" : "save"} className="text-[18px]" />
      {pending ? "Saving..." : "Save"}
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

function toCustomerFields(job: JobCardData): CustomerFields {
  return {
    name: job.customer.name,
    phone: job.customer.phone ?? "",
    email: job.customer.email ?? "",
  };
}

function toVehicleFields(job: JobCardData): VehicleFields {
  return {
    registration: job.vehicle.registration,
    make: job.vehicle.make ?? "",
    model: job.vehicle.model ?? "",
    fuel: job.vehicle.fuel ?? "",
    year: job.vehicle.year ? `${job.vehicle.year}` : "",
    engineSizeCc: job.vehicle.engineSizeCc ? `${job.vehicle.engineSizeCc}` : "",
  };
}

function toJobFields(job: JobCardData): JobFields {
  return {
    jobTypeId: job.jobType.id,
    status: job.status,
    scheduledDate: toDateInputValue(job.scheduledStart),
    scheduledTime: toTimeInputValue(job.scheduledStart),
    durationMins: `${job.durationMins}`,
  };
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

function formatCurrencyInputValue(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return "0.00";
  }

  return parsed.toFixed(2);
}

function parseDisplayNumber(value: string) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getLineTotal(lineItem: EditableLineItem) {
  return parseDisplayNumber(lineItem.quantity) * parseDisplayNumber(lineItem.unitPrice);
}

function createBlankLineItem(defaultHourlyLabourRate: number | null): EditableLineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    itemType: "LABOUR",
    quantity: "1",
    unitPrice: formatEditableNumber(
      getDefaultUnitPriceForLineItemType({
        itemType: "LABOUR",
        defaultHourlyLabourRate,
      }),
    ),
  };
}

function toEditableLineItems(job: JobCardData): EditableLineItem[] {
  const seededLineItems = ensurePrimaryJobLineItems(
    job.lineItems.map((lineItem) => ({
      id: lineItem.id,
      description: lineItem.description,
      itemType: lineItem.itemType,
      quantity: formatEditableNumber(lineItem.quantity),
      unitPrice: formatEditableNumber(lineItem.unitPrice),
    })),
    {
      id: "seeded-primary-line-item",
      ...buildPrimaryJobLineItem({
        jobTypeName: job.jobType.name,
        notes: job.notes,
        defaultHourlyLabourRate: job.workshop.defaultHourlyLabourRate,
      }),
      quantity: "1",
      unitPrice: formatEditableNumber(
        getDefaultUnitPriceForLineItemType({
          itemType: "LABOUR",
          defaultHourlyLabourRate: job.workshop.defaultHourlyLabourRate,
        }),
      ),
    },
  );

  return seededLineItems;
}

export function JobCardEditor({ job, jobTypes }: JobCardEditorProps) {
  const [state, formAction] = useActionState(updateJobCard, initialState);
  const [activeEditor, setActiveEditor] = useState<EditorModal>(null);
  const [customer, setCustomer] = useState<CustomerFields>(() => toCustomerFields(job));
  const [vehicle, setVehicle] = useState<VehicleFields>(() => toVehicleFields(job));
  const [jobFields, setJobFields] = useState<JobFields>(() => toJobFields(job));
  const [notes, setNotes] = useState(job.notes ?? "");
  const [lineItems, setLineItems] = useState<EditableLineItem[]>(() => toEditableLineItems(job));
  const statusUpdate = useJobStatusUpdate(job.status);
  const formId = "job-card-form";

  useEffect(() => {
    setCustomer(toCustomerFields(job));
    setVehicle(toVehicleFields(job));
    setJobFields(toJobFields(job));
    setNotes(job.notes ?? "");
    setLineItems(toEditableLineItems(job));
  }, [job]);

  useEffect(() => {
    statusUpdate.setStatus(job.status);
  }, [job.status]);

  const subtotal = useMemo(
    () => lineItems.reduce((sum, lineItem) => sum + getLineTotal(lineItem), 0),
    [lineItems],
  );
  const vatAmount = 0;
  const total = subtotal + vatAmount;
  const selectedJobType =
    jobTypes.find((jobType) => jobType.id === jobFields.jobTypeId) ?? job.jobType;
  const defaultHourlyLabourRate = job.workshop.defaultHourlyLabourRate;
  const vehicleHeadline = [vehicle.make, vehicle.model].filter(Boolean).join(" ");
  const vehicleSpec = [vehicle.year, vehicle.fuel, vehicle.engineSizeCc ? `${vehicle.engineSizeCc}cc` : ""]
    .filter(Boolean)
    .join(" • ");

  return (
    <form id={formId} action={formAction} className="grid gap-4 print:gap-3">
      <input type="hidden" name="jobId" value={job.id} />
      <input type="hidden" name="customerName" value={customer.name} />
      <input type="hidden" name="phone" value={customer.phone} />
      <input type="hidden" name="customerEmail" value={customer.email} />
      <input type="hidden" name="registration" value={vehicle.registration} />
      <input type="hidden" name="make" value={vehicle.make} />
      <input type="hidden" name="model" value={vehicle.model} />
      <input type="hidden" name="fuel" value={vehicle.fuel} />
      <input type="hidden" name="year" value={vehicle.year} />
      <input type="hidden" name="engineSizeCc" value={vehicle.engineSizeCc} />
      <input type="hidden" name="jobTypeId" value={jobFields.jobTypeId} />
      <input type="hidden" name="status" value={jobFields.status} />
      <input type="hidden" name="scheduledDate" value={jobFields.scheduledDate} />
      <input type="hidden" name="scheduledTime" value={jobFields.scheduledTime} />
      <input type="hidden" name="durationMins" value={jobFields.durationMins} />
      <input type="hidden" name="notes" value={notes} />

      <Card className="overflow-hidden bg-white print:rounded-none print:border-0 print:shadow-none">
        <CardContent className="px-0 pb-0">
          <section className="border-b border-[var(--surface-border)] bg-[linear-gradient(135deg,rgba(163,206,241,0.16),rgba(255,255,255,0.98))] px-5 py-4 print:bg-white print:px-0 print:py-3">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="tracking-[0.12em] uppercase">Work Order</Badge>
                  <Badge variant="default">{selectedJobType.name}</Badge>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                    Work Order #{job.jobNumber}
                  </h1>
                  <HeaderStatusSelect
                    value={statusUpdate.status}
                    pending={statusUpdate.pending}
                    onChange={async (nextStatus) => {
                      const previousStatus = jobFields.status;
                      setJobFields((current) => ({
                        ...current,
                        status: nextStatus,
                      }));

                      const ok = await statusUpdate.updateStatus({
                        jobId: job.id,
                        status: nextStatus,
                      });

                      if (!ok) {
                        setJobFields((current) => ({
                          ...current,
                          status: previousStatus,
                        }));
                      }
                    }}
                  />
                  <p className="pb-0.5 text-sm font-medium uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    {job.workshop.name}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <HeaderPill label="Scheduled" value={formatLongDate(job.scheduledStart)} />
                  <HeaderPill label="Time" value={formatTime(job.scheduledStart)} />
                  <HeaderPill label="Duration" value={`${jobFields.durationMins} mins`} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 print:hidden">
                <SaveButton form={formId} />
                <PrintJobCardButton />
              </div>
            </div>
            {statusUpdate.error ? (
              <p className="mt-3 text-sm text-rose-700 print:hidden">{statusUpdate.error}</p>
            ) : null}
          </section>

          <div className="px-5 py-4 print:px-0 print:py-3">
            <section className="grid gap-3 lg:grid-cols-3">
              <SummaryCard
                title="Customer"
                icon="person"
                onEdit={() => setActiveEditor("customer")}
                lines={[
                  customer.name || "No customer name",
                  customer.phone || "Phone not recorded",
                  customer.email || "Email not recorded",
                ]}
              />
              <SummaryCard
                title="Vehicle"
                icon="directions_car"
                onEdit={() => setActiveEditor("vehicle")}
                registration={vehicle.registration}
                lines={[
                  vehicleHeadline || "Vehicle details pending",
                  vehicleSpec || "Fuel, year and engine can be added in the editor",
                ]}
              />
              <SummaryCard
                title="Job"
                icon="event_note"
                onEdit={() => setActiveEditor("job")}
                lines={[
                  selectedJobType.name,
                  jobStatusLabels[jobFields.status],
                  `${jobFields.scheduledDate} • ${jobFields.scheduledTime} • ${jobFields.durationMins} mins`,
                ]}
              />
            </section>

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
              <div className="space-y-4 xl:col-span-2">
                <CompactBookingNotesStrip
                  notes={notes}
                  onEdit={() => setActiveEditor("job")}
                />

                <DocumentCard
                  title="Line items"
                  description="This is the main work-order surface for labour, parts, and misc charges."
                  bodyClassName="pt-4"
                >
                  <LineItemsEditor
                    defaultHourlyLabourRate={defaultHourlyLabourRate}
                    lineItems={lineItems}
                    onAdd={() =>
                      setLineItems((current) => [
                        ...current,
                        createBlankLineItem(defaultHourlyLabourRate),
                      ])
                    }
                    onRemove={(index) =>
                      setLineItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }
                    onUpdate={(index, partial) =>
                      setLineItems((current) =>
                        current.map((lineItem, itemIndex) =>
                          itemIndex === index ? { ...lineItem, ...partial } : lineItem,
                        ),
                      )
                    }
                  />

                  <div className="mt-4 flex justify-end">
                    <div className="w-full max-w-[320px] rounded-[24px] border border-[var(--surface-border)] bg-[var(--surface-muted)]/18 p-4">
                      <TotalsRow label="Subtotal" value={formatCurrency(subtotal)} />
                      <Separator className="my-3" />
                      <TotalsRow label="VAT" value="Not applied" muted />
                      <Separator className="my-3" />
                      <TotalsRow
                        label="Total"
                        value={formatCurrency(total)}
                        valueClassName="text-lg"
                      />
                    </div>
                  </div>
                </DocumentCard>
              </div>
            </div>

            <input type="hidden" name="internalNotes" value={job.internalNotes ?? ""} />
            <input type="hidden" name="technicianNotes" value={job.technicianNotes ?? ""} />

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

      <CustomerEditModal
        open={activeEditor === "customer"}
        customer={customer}
        onOpenChange={(open) => setActiveEditor(open ? "customer" : null)}
        onCustomerChange={setCustomer}
      />
      <VehicleEditModal
        open={activeEditor === "vehicle"}
        vehicle={vehicle}
        onOpenChange={(open) => setActiveEditor(open ? "vehicle" : null)}
        onVehicleChange={setVehicle}
      />
      <JobEditModal
        open={activeEditor === "job"}
        jobFields={jobFields}
        notes={notes}
        jobTypes={jobTypes}
        onOpenChange={(open) => setActiveEditor(open ? "job" : null)}
        onJobFieldsChange={setJobFields}
        onNotesChange={setNotes}
      />
    </form>
  );
}

function HeaderPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-[var(--surface-border)] bg-white/76 px-3 py-1.5 print:bg-white">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
        {label}
      </span>
      <span className="ml-2 text-sm font-semibold text-[var(--foreground)]">{value}</span>
    </div>
  );
}

function HeaderStatusSelect({
  value,
  pending,
  onChange,
}: {
  value: JobStatus;
  pending: boolean;
  onChange: (status: JobStatus) => Promise<void>;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border px-3 py-1.5",
        getStatusSelectClasses(value),
        pending ? "opacity-70" : "",
      )}
    >
      <select
        aria-label="Update job status"
        value={value}
        disabled={pending}
        onChange={(event) => void onChange(event.target.value as JobStatus)}
        className="appearance-none bg-transparent pr-7 text-sm font-semibold outline-none"
      >
        {quickJobStatusOptions.map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {jobStatusLabels[statusOption]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        <MaterialIcon name="arrow_drop_down" className="text-[18px]" />
      </span>
    </div>
  );
}

function SummaryCard({
  title,
  icon,
  lines,
  registration,
  onEdit,
}: {
  title: string;
  icon: string;
  lines: string[];
  registration?: string;
  onEdit: () => void;
}) {
  return (
    <Card className="bg-white">
      <CardContent className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-[var(--surface-muted)]/35 p-2 text-[var(--foreground)]">
              <MaterialIcon name={icon} className="text-[18px]" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                {title}
              </p>
              {registration ? (
                <p className="mt-1 inline-flex rounded-xl bg-[#f2c94c] px-2.5 py-1 text-sm font-bold tracking-[0.22em] text-slate-900">
                  {registration}
                </p>
              ) : null}
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" className="print:hidden" onClick={onEdit}>
            <MaterialIcon name="edit" className="text-[16px]" />
            Edit
          </Button>
        </div>
        <div className="mt-3 space-y-1.5 text-sm text-[var(--foreground)]">
          {lines.map((line) => (
            <p key={line} className="truncate">
              {line}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentCard({
  title,
  description,
  bodyClassName,
  children,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  bodyClassName?: string;
}>) {
  return (
    <Card className="bg-white print:border print:shadow-none">
      <CardHeader className="border-b border-[var(--surface-border)] px-4 py-4">
        <CardTitle className="text-sm uppercase tracking-[0.1em]">{title}</CardTitle>
        {description ? (
          <p className="text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className={cn("px-4 pb-4 pt-4", bodyClassName)}>{children}</CardContent>
    </Card>
  );
}

function CompactBookingNotesStrip({
  notes,
  onEdit,
}: {
  notes: string;
  onEdit: () => void;
}) {
  const trimmedNotes = notes.trim();
  const preview =
    trimmedNotes.length > 220 ? `${trimmedNotes.slice(0, 217).trimEnd()}...` : trimmedNotes;

  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-white px-4 py-3 print:border print:px-3 print:py-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm leading-5 text-[var(--foreground)] print:line-clamp-none">
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Booking Notes
            </span>
            {preview || "No booking notes recorded yet."}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-0.5 shrink-0 print:hidden"
          onClick={onEdit}
        >
          <MaterialIcon name="edit" className="text-[16px]" />
          Edit
        </Button>
      </div>
    </div>
  );
}

function LineItemsEditor({
  defaultHourlyLabourRate,
  lineItems,
  onAdd,
  onRemove,
  onUpdate,
}: {
  defaultHourlyLabourRate: number | null;
  lineItems: EditableLineItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, partial: Partial<EditableLineItem>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted-foreground)]">
          The first row represents the booked work. Add parts, labour, and misc items underneath as needed.
        </p>
        <Button type="button" variant="outline" className="print:hidden" onClick={onAdd}>
          <MaterialIcon name="add" className="text-[18px]" />
          Add item
        </Button>
      </div>

      <div className="overflow-x-auto rounded-[24px] border border-[var(--surface-border)]">
        <table className="min-w-full border-separate border-spacing-0 bg-white text-sm">
          <thead className="bg-[var(--surface-muted)]/28 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
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
                      onUpdate(index, {
                        description: event.target.value,
                      })
                    }
                    placeholder={index === 0 ? "Primary booked work" : "Additional work item"}
                  />
                </td>
                <td className="border-t border-[var(--surface-border)] px-4 py-3">
                  <Select
                    name="lineItemType"
                    value={lineItem.itemType}
                    onChange={(event) =>
                      {
                        const nextItemType = event.target.value as JobLineItemType;
                        const nextUnitPrice =
                          nextItemType === "LABOUR" &&
                          (lineItem.unitPrice === "" || parseDisplayNumber(lineItem.unitPrice) === 0)
                            ? formatEditableNumber(
                                getDefaultUnitPriceForLineItemType({
                                  itemType: nextItemType,
                                  defaultHourlyLabourRate,
                                }),
                              )
                            : lineItem.unitPrice;

                        onUpdate(index, {
                          itemType: nextItemType,
                          unitPrice: nextUnitPrice,
                        });
                      }
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
                    step="any"
                    value={lineItem.quantity}
                    onChange={(event) =>
                      onUpdate(index, {
                        quantity: event.target.value,
                      })
                    }
                  />
                </td>
                <td className="border-t border-[var(--surface-border)] px-4 py-3">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--muted-foreground)]">
                      £
                    </span>
                    <Input
                      name="lineItemUnitPrice"
                      type="text"
                      inputMode="decimal"
                      pattern="^\d*([.]\d{0,2})?$"
                      value={lineItem.unitPrice}
                      onChange={(event) =>
                        onUpdate(index, {
                          unitPrice: event.target.value.replace(/[^\d.]/g, ""),
                        })
                      }
                      onBlur={() =>
                        onUpdate(index, {
                          unitPrice: formatCurrencyInputValue(lineItem.unitPrice),
                        })
                      }
                      className="pl-8"
                    />
                  </div>
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
                    disabled={lineItems.length === 1}
                    aria-label={`Remove line item ${index + 1}`}
                    onClick={() => onRemove(index)}
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomerEditModal({
  open,
  customer,
  onOpenChange,
  onCustomerChange,
}: {
  open: boolean;
  customer: CustomerFields;
  onOpenChange: (open: boolean) => void;
  onCustomerChange: React.Dispatch<React.SetStateAction<CustomerFields>>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit customer</DialogTitle>
          <DialogDescription>
            Keep the top of the job card clean while still letting reception update contact details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <FieldGroup>
            <Label htmlFor="customer-editor-name">Customer name</Label>
            <Input
              id="customer-editor-name"
              value={customer.name}
              onChange={(event) =>
                onCustomerChange((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="customer-editor-phone">Phone</Label>
            <Input
              id="customer-editor-phone"
              type="tel"
              value={customer.phone}
              onChange={(event) =>
                onCustomerChange((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="customer-editor-email">Email</Label>
            <Input
              id="customer-editor-email"
              type="email"
              value={customer.email}
              onChange={(event) =>
                onCustomerChange((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
          </FieldGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VehicleEditModal({
  open,
  vehicle,
  onOpenChange,
  onVehicleChange,
}: {
  open: boolean;
  vehicle: VehicleFields;
  onOpenChange: (open: boolean) => void;
  onVehicleChange: React.Dispatch<React.SetStateAction<VehicleFields>>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit vehicle</DialogTitle>
          <DialogDescription>
            DVLA lookup is still available here, while the main job card stays focused on the work order.
          </DialogDescription>
        </DialogHeader>
        <VehicleLookupFields
          initialVehicle={{
            registration: vehicle.registration,
            make: vehicle.make,
            model: vehicle.model,
            fuel: vehicle.fuel,
            year: vehicle.year ? Number(vehicle.year) : null,
            engineSizeCc: vehicle.engineSizeCc ? Number(vehicle.engineSizeCc) : null,
          }}
          onVehicleChange={onVehicleChange}
          withFormNames={false}
          idPrefix="vehicle-editor"
        />
      </DialogContent>
    </Dialog>
  );
}

function JobEditModal({
  open,
  jobFields,
  notes,
  jobTypes,
  onOpenChange,
  onJobFieldsChange,
  onNotesChange,
}: {
  open: boolean;
  jobFields: JobFields;
  notes: string;
  jobTypes: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  onOpenChange: (open: boolean) => void;
  onJobFieldsChange: React.Dispatch<React.SetStateAction<JobFields>>;
  onNotesChange: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit job details</DialogTitle>
          <DialogDescription>
            Keep scheduling and status changes available without turning the whole page into a booking form.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="job-editor-type">Job type</Label>
              <Select
                id="job-editor-type"
                value={jobFields.jobTypeId}
                onChange={(event) =>
                  onJobFieldsChange((current) => ({
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
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="job-editor-status">Status</Label>
              <Select
                id="job-editor-status"
                value={jobFields.status}
                onChange={(event) =>
                  onJobFieldsChange((current) => ({
                    ...current,
                    status: event.target.value as JobStatus,
                  }))
                }
              >
                {JOB_STATUS_OPTIONS.map((statusOption) => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </option>
                ))}
              </Select>
            </FieldGroup>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="job-editor-date">Scheduled date</Label>
              <Input
                id="job-editor-date"
                type="date"
                value={jobFields.scheduledDate}
                onChange={(event) =>
                  onJobFieldsChange((current) => ({
                    ...current,
                    scheduledDate: event.target.value,
                  }))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="job-editor-time">Scheduled time</Label>
              <Input
                id="job-editor-time"
                type="time"
                value={jobFields.scheduledTime}
                onChange={(event) =>
                  onJobFieldsChange((current) => ({
                    ...current,
                    scheduledTime: event.target.value,
                  }))
                }
              />
            </FieldGroup>
          </div>
          <FieldGroup>
            <Label htmlFor="job-editor-duration">Duration (mins)</Label>
            <Input
              id="job-editor-duration"
              type="number"
              min={15}
              step={15}
              value={jobFields.durationMins}
              onChange={(event) =>
                onJobFieldsChange((current) => ({
                  ...current,
                  durationMins: event.target.value,
                }))
              }
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="job-editor-notes">Booking notes</Label>
            <Textarea
              id="job-editor-notes"
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              rows={5}
              placeholder="Describe the reason for the booking."
            />
          </FieldGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FieldGroup({ children }: React.PropsWithChildren) {
  return <div className="grid gap-2">{children}</div>;
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

function getStatusSelectClasses(status: JobStatus) {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-100 text-emerald-700";
    case "WAITING_PARTS":
    case "WAITING_COLLECTION":
      return "border-amber-200 bg-amber-100 text-amber-700";
    case "CANCELLED":
      return "border-rose-200 bg-rose-100 text-rose-700";
    case "IN_PROGRESS":
    case "ARRIVED":
      return "border-sky-200 bg-sky-100 text-sky-700";
    case "BOOKED":
    default:
      return "border-[var(--surface-border)] bg-[var(--surface-muted)] text-[var(--foreground)]";
  }
}
