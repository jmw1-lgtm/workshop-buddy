"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  manageAdminAccount,
  type AdminAccountActionState,
} from "@/app/admin/actions";
import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";

const initialState: AdminAccountActionState = {
  error: null,
  success: null,
};

function SubmitButton({
  label,
  intent,
  variant = "outline",
}: {
  label: string;
  intent: "activate" | "trial-reset" | "cancel" | "delete";
  variant?: "default" | "outline" | "secondary";
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" name="intent" value={intent} variant={variant} size="sm" disabled={pending}>
      {pending ? "Working..." : label}
    </Button>
  );
}

export function AdminAccountActions({
  workshopId,
  workshopName,
  subscriptionStatus,
  hasStripeCustomer,
  isOpen,
  onToggle,
}: {
  workshopId: string;
  workshopName: string;
  subscriptionStatus: string;
  hasStripeCustomer: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [state, formAction] = useActionState(manageAdminAccount, initialState);

  return (
    <form
      action={formAction}
      className="relative min-w-[148px]"
      onSubmit={(event) => {
        const submitter = event.nativeEvent instanceof SubmitEvent ? event.nativeEvent.submitter : null;
        const intent =
          submitter instanceof HTMLButtonElement ? submitter.value : null;

        if (intent === "delete") {
          const confirmed = window.confirm(
            `Delete ${workshopName}? This removes the workshop, memberships, customers, vehicles, jobs, and subscription records.`,
          );

          if (!confirmed) {
            event.preventDefault();
          }
        }
      }}
    >
      <input type="hidden" name="workshopId" value={workshopId} />
      <input type="hidden" name="workshopName" value={workshopName} />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--surface-border)] bg-white px-2.5 py-2 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
      >
        <span className="inline-flex items-center gap-2">
          <MaterialIcon name="manage_accounts" className="text-[18px]" />
          Manage
        </span>
        <MaterialIcon
          name="expand_more"
          className={`text-[18px] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[280px] rounded-2xl border border-[var(--surface-border)] bg-white/100 p-3 opacity-100 shadow-[0_24px_60px_rgba(15,23,42,0.22)] ring-1 ring-black/5">
          <div className="mb-3 flex flex-col gap-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">{workshopName}</p>
            <p className="text-[11px] leading-5 text-[var(--muted-foreground)]">
              {hasStripeCustomer
                ? "Stripe customer linked. Manual changes can later be overwritten by Stripe sync."
                : "No Stripe customer linked. Manual activation works for internal test accounts."}
            </p>
          </div>
          <div className="grid gap-2">
            <SubmitButton
              label={subscriptionStatus === "Active" ? "Set active again" : "Set account active"}
              intent="activate"
              variant="default"
            />
            <SubmitButton label="Reset 14-day trial" intent="trial-reset" />
            <SubmitButton label="Mark inactive" intent="cancel" variant="secondary" />
            <SubmitButton label="Delete account" intent="delete" variant="secondary" />
          </div>
          {state.error ? (
            <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {state.error}
            </p>
          ) : null}
          {state.success ? (
            <p className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {state.success}
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
