import { CustomerDetailDialog } from "@/components/customers/customer-detail-dialog";
import { CustomerList } from "@/components/customers/customer-list";
import { CustomerSearchForm } from "@/components/customers/customer-search-form";
import { AppPage } from "@/components/layout/app-page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireCurrentWorkshop } from "@/lib/workshop";
import { getCustomersPageData } from "@/services/customers";

type CustomersPageProps = {
  searchParams?: Promise<{
    q?: string;
    customerId?: string;
    newCustomer?: string;
  }>;
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const tenant = await requireCurrentWorkshop();
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q ?? "";
  const customerId = resolvedSearchParams?.customerId;
  const newCustomer = resolvedSearchParams?.newCustomer === "1";

  const data = await getCustomersPageData({
    workshopId: tenant.workshopId,
    query,
    customerId,
  });

  return (
    <AppPage>
      <section className="space-y-6">
        <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[var(--surface-border)] bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <CustomerSearchForm defaultValue={data.query} />
          </div>
          <Button asChild type="button">
            <Link href={query ? `/customers?q=${encodeURIComponent(query)}&newCustomer=1` : "/customers?newCustomer=1"}>
              New customer
            </Link>
          </Button>
        </div>

        <CustomerList
          customers={data.customers}
          selectedCustomerId={data.selectedCustomer?.id}
          query={data.query}
        />
      </section>

      <CustomerDetailDialog customer={data.selectedCustomer} createMode={newCustomer} />
    </AppPage>
  );
}
