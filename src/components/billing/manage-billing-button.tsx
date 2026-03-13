"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type ManageBillingButtonProps = {
  disabled?: boolean;
};

export function ManageBillingButton({
  disabled = false,
}: ManageBillingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" disabled={disabled || pending}>
      {pending ? "Redirecting to Stripe..." : "Manage billing"}
    </Button>
  );
}
