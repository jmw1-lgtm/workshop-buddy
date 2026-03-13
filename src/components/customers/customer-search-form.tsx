import { Input } from "@/components/ui/input";

type CustomerSearchFormProps = {
  defaultValue: string;
};

export function CustomerSearchForm({ defaultValue }: CustomerSearchFormProps) {
  return (
    <form className="w-full" method="get">
      <Input
        name="q"
        defaultValue={defaultValue}
        placeholder="Search by name, phone, or registration"
        className="w-full bg-[var(--surface-muted)]"
      />
    </form>
  );
}
