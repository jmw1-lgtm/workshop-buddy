import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppPageProps = {
  children: ReactNode;
  className?: string;
};

export function AppPage({ children, className }: AppPageProps) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-6", className)}>
      {children}
    </div>
  );
}
