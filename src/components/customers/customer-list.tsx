import Link from "next/link";

import { cn } from "@/lib/utils";

type CustomerListProps = {
  customers: Array<{
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    _count: {
      vehicles: number;
      jobs: number;
    };
  }>;
  selectedCustomerId?: string;
  query: string;
};

export function CustomerList({
  customers,
  selectedCustomerId,
  query,
}: CustomerListProps) {
  const searchSuffix = query ? `&q=${encodeURIComponent(query)}` : "";

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-white">
      <div className="grid grid-cols-[1.45fr_1.15fr_120px_100px] border-b border-[var(--surface-border)] bg-[var(--surface-muted)]/70 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        <div>Customer</div>
        <div>Contact</div>
        <div>Vehicles</div>
        <div>Jobs</div>
      </div>

      {customers.length === 0 ? (
        <div className="px-5 py-10 text-sm text-[var(--muted-foreground)]">
          No customers match this search.
        </div>
      ) : (
        <div className="divide-y divide-[var(--surface-border)]">
          {customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/customers?customerId=${customer.id}${searchSuffix}`}
              className={cn(
                "grid grid-cols-[1.45fr_1.15fr_120px_100px] items-center px-5 py-4 text-sm transition-colors hover:bg-[var(--surface-muted)]/50",
                selectedCustomerId === customer.id ? "bg-[var(--surface-muted)]/70" : "",
              )}
            >
              <div>
                <div className="font-semibold text-[var(--foreground)]">{customer.name}</div>
                {customer.email ? (
                  <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {customer.email}
                  </div>
                ) : null}
              </div>
              <div className="text-[var(--muted-foreground)]">
                {customer.phone || customer.email || "No contact"}
              </div>
              <div className="text-[var(--foreground)]">{customer._count.vehicles}</div>
              <div className="text-[var(--foreground)]">{customer._count.jobs}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
