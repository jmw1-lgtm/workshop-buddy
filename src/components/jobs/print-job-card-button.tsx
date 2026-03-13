"use client";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";

export function PrintJobCardButton() {
  return (
    <Button onClick={() => window.print()} className="print:hidden">
      <MaterialIcon name="print" className="text-[18px]" />
      Print Job Card
    </Button>
  );
}
