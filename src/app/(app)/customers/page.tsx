import { CustomerDetailDialog } from "@/components/customers/customer-detail-dialog";
import { CustomerList } from "@/components/customers/customer-list";
import { CustomerSearchForm } from "@/components/customers/customer-search-form";
import { AppPage } from "@/components/layout/app-page";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireCurrentWorkshop } from "@/lib/workshop";
import { getCustomersPageData } from "@/services/customers";

type CustomersPageProps = {
  searchParams?: Promise<{
    q?: string;
    customerId?: string;
  }>;
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const tenant = await requireCurrentWorkshop();
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q ?? "";
  const customerId = resolvedSearchParams?.customerId;

  const data = await getCustomersPageData({
    workshopId: tenant.workshopId,
    query,
    customerId,
  });

  return (
    <AppPage>
      <PageHeader
        eyebrow="Customers"
        title="Customer search"
        description="Search customers in the current workshop by name, phone, or vehicle registration."
        actions={<Badge variant="success">{data.customers.length} loaded</Badge>}
      />

      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
            <CardDescription>
              Results are scoped to {tenant.workshopName} only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerSearchForm defaultValue={data.query} />
          </CardContent>
        </Card>

        <CustomerList
          customers={data.customers}
          selectedCustomerId={data.selectedCustomer?.id}
          query={data.query}
        />
      </section>

      <CustomerDetailDialog customer={data.selectedCustomer} />
    </AppPage>
  );
}
