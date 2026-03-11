import { cn } from "@/lib/utils";

type MaterialIconProps = {
  name: string;
  className?: string;
};

export function MaterialIcon({ name, className }: MaterialIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-rounded text-[20px] leading-none", className)}
    >
      {name}
    </span>
  );
}
