import { Badge } from "@/components/ui/badge";

type AdminStatusBadgeProps = {
  tone: "info" | "success" | "warning" | "danger" | "default";
  label: string;
};

export function AdminStatusBadge({ tone, label }: AdminStatusBadgeProps) {
  return (
    <Badge
      variant={tone}
      className="rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] shadow-sm"
    >
      {label}
    </Badge>
  );
}
