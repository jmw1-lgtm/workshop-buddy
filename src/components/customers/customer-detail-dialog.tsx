"use client";

import Link from "next/link";
import { useActionState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  createCustomer,
  removeCustomerVehicle,
  type CustomerActionState,
  updateCustomerDetails,
} from "@/app/(app)/customers/actions";
import { formatDisplayDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const initialState: CustomerActionState = {
  error: null,
};

type CustomerDetailDialogProps = {
  customer: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    vehicles: Array<{
      id: string;
      registration: string;
      make: string | null;
      model: string | null;
      fuel: string | null;
      engineSizeCc: number | null;
      year: number | null;
      _count: {
        jobs: number;
      };
    }>;
    jobs: Array<{
      id: string;
      scheduledStart: Date;
      durationMins: number;
      status:
        | "BOOKED"
        | "ARRIVED"
        | "IN_PROGRESS"
        | "WAITING_PARTS"
        | "WAITING_COLLECTION"
        | "COMPLETED"
        | "CANCELLED";
      vehicle: {
        registration: string;
      };
      jobType: {
        name: string;
        color: string;
      };
    }>;
  } | null;
  createMode?: boolean;
};

export function CustomerDetailDialog({
  customer,
  createMode = false,
}: CustomerDetailDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [createState, createAction] = useActionState(createCustomer, initialState);
  const [updateState, updateAction] = useActionState(updateCustomerDetails, initialState);
  const [removeState, removeAction] = useActionState(removeCustomerVehicle, initialState);
  const isCreating = createMode && !customer;

  const params = new URLSearchParams(searchParams.toString());
  const returnTo = params.toString() ? `${pathname}?${params.toString()}` : pathname;

  const closeDialog = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("customerId");
    nextParams.delete("newCustomer");

    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <Dialog open={Boolean(customer) || isCreating} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="max-w-4xl">
        {customer || isCreating ? (
          <>
            <DialogHeader>
              <DialogTitle>{customer ? customer.name : "New customer"}</DialogTitle>
              <DialogDescription>
                {customer
                  ? "Update customer details, manage linked vehicles, and review recent jobs."
                  : "Create a customer record, then add vehicles and jobs from the same workspace."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <form
                action={customer ? updateAction : createAction}
                className="grid gap-4 rounded-3xl border border-[var(--surface-border)] bg-white p-5"
              >
                {customer ? <input type="hidden" name="customerId" value={customer.id} /> : null}
                {customer ? <input type="hidden" name="returnTo" value={returnTo} /> : null}

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">Customer details</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {customer
                        ? "Keep contact details up to date for bookings and job cards."
                        : "Start with the customer record. Vehicles can be added after saving."}
                    </p>
                  </div>
                  <Button type="submit">{customer ? "Save customer" : "Create customer"}</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FieldGroup>
                    <Label htmlFor="customerName">Customer name</Label>
                    <Input id="customerName" name="name" defaultValue={customer?.name ?? ""} required />
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="customerPhone">Phone</Label>
                    <Input id="customerPhone" name="phone" defaultValue={customer?.phone ?? ""} />
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      name="email"
                      type="email"
                      defaultValue={customer?.email ?? ""}
                      placeholder="customer@example.com"
                    />
                  </FieldGroup>
                </div>

                {(customer ? updateState.error : createState.error) ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {customer ? updateState.error : createState.error}
                  </p>
                ) : null}
              </form>

              {customer ? (
                <section className="grid gap-4 rounded-3xl border border-[var(--surface-border)] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">Vehicles</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Open a vehicle to edit details or add a new one for this customer.
                    </p>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/vehicles/new?customerId=${customer.id}&returnTo=${encodeURIComponent(returnTo)}`}>
                      Add vehicle
                    </Link>
                  </Button>
                </div>

                {customer.vehicles.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-muted)]/18 px-4 py-5 text-sm text-[var(--muted-foreground)]">
                    No vehicles recorded yet.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {customer.vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/18 px-4 py-3"
                      >
                        <Link
                          href={`/vehicles/${vehicle.id}?returnTo=${encodeURIComponent(returnTo)}`}
                          className="min-w-0 flex-1 rounded-xl transition-colors hover:text-[var(--primary)]"
                        >
                          <p className="font-semibold text-[var(--foreground)]">
                            {vehicle.registration}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            {[vehicle.make, vehicle.model, vehicle.year].filter(Boolean).join(" ") ||
                              "Vehicle details not yet captured"}
                          </p>
                        </Link>

                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                            {vehicle._count.jobs} {vehicle._count.jobs === 1 ? "job" : "jobs"}
                          </span>
                          <form action={removeAction}>
                            <input type="hidden" name="customerId" value={customer.id} />
                            <input type="hidden" name="vehicleId" value={vehicle.id} />
                            <input type="hidden" name="returnTo" value={returnTo} />
                            <Button type="submit" variant="outline" size="sm">
                              Remove
                            </Button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {removeState.error ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {removeState.error}
                  </p>
                ) : null}
              </section>
              ) : null}

              {customer ? (
                <section className="grid gap-4 rounded-3xl border border-[var(--surface-border)] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">Recent jobs</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Open any recent job card for operational detail.
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/diary">Create job</Link>
                  </Button>
                </div>

                {customer.jobs.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No jobs recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {customer.jobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--surface-border)] bg-white px-4 py-3 transition-colors hover:bg-[var(--surface-muted)]/30"
                      >
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">
                            {formatDisplayDate(job.scheduledStart)}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            {job.vehicle.registration}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{
                            backgroundColor: `${job.jobType.color}18`,
                            color: job.jobType.color,
                          }}
                        >
                          {job.jobType.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
              ) : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function FieldGroup({ children }: React.PropsWithChildren) {
  return <div className="grid gap-2">{children}</div>;
}
