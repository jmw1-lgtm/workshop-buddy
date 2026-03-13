import { MaterialIcon } from "@/components/layout/material-icon";
import { Input } from "@/components/ui/input";

type CustomerSearchFormProps = {
  defaultValue: string;
};

export function CustomerSearchForm({ defaultValue }: CustomerSearchFormProps) {
  return (
    <form className="w-full" method="get">
      <div className="relative">
        <MaterialIcon
          name="search"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[var(--muted-foreground)]"
        />
        <Input
          name="q"
          defaultValue={defaultValue}
          placeholder="Search customers, phone or registration"
          className="h-10 w-full bg-[var(--surface-muted)] pl-11"
        />
      </div>
    </form>
  );
}
