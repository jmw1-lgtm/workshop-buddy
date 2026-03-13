"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type CheckoutSubmitButtonProps = {
  cta: string;
  disabled?: boolean;
};

export function CheckoutSubmitButton({
  cta,
  disabled = false,
}: CheckoutSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={disabled || pending}>
      {disabled
        ? "Current subscription active"
        : pending
          ? "Redirecting to Stripe..."
          : cta}
    </Button>
  );
}
