import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function CustomersPage() {
  return (
    <PlaceholderPage
      eyebrow="Customers"
      title="Customer and vehicle search"
      description="This page is reserved for fast receptionist search across customer name, phone, and registration with linked vehicle/job history."
      primaryMetric="0 customers loaded"
      metricLabel="Add tenant-scoped search services before introducing richer record views."
      checklist={[
        "Search by name",
        "Search by phone",
        "Search by registration",
        "Vehicle history view",
      ]}
    />
  );
}
