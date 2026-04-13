"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  completeOnboarding,
  type OnboardingActionState,
} from "@/app/onboarding/actions";
import { CancelSignOutButton } from "@/components/auth/cancel-sign-out-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: OnboardingActionState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? "Setting up your workshop..." : "Start using Workshop Buddy"}
    </Button>
  );
}

type OnboardingFormProps = {
  defaultEmail: string;
};

export function OnboardingForm({ defaultEmail }: OnboardingFormProps) {
  const [state, formAction] = useActionState(completeOnboarding, initialState);
  const emailFromAccount = defaultEmail.length > 0;

  return (
    <Card className="border-white/60 bg-white/95">
      <CardHeader className="space-y-3">
        <Badge variant="default" className="w-fit">
          Workshop setup
        </Badge>
        <CardTitle className="text-3xl">Set up your workshop</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="name">Workshop name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Maydew Motor Services"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="1 High Street, Bristol BS1 1AA"
              required
              rows={4}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0117 123 4567"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={defaultEmail}
                placeholder="hello@workshop.co.uk"
                required
                readOnly={emailFromAccount}
                aria-readonly={emailFromAccount}
                className={emailFromAccount ? "bg-[var(--surface-muted)] text-[var(--muted-foreground)]" : ""}
              />
              {emailFromAccount ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Taken from your signed-in account.
                </p>
              ) : null}
            </div>
          </div>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-semibold text-[var(--foreground)]">
              Diary slot length
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[30, 60].map((value) => (
                <label
                  key={value}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)] p-4"
                >
                  <input
                    type="radio"
                    name="slotLength"
                    value={value}
                    defaultChecked={value === 60}
                    className="mt-1 size-4 accent-[var(--primary)]"
                  />
                  <span>
                    <span className="block font-semibold text-[var(--foreground)]">
                      {value} minute diary slots
                    </span>
                    <span className="mt-1 block text-sm text-[var(--muted-foreground)]">
                      {value === 30
                        ? "Best for tighter booking slots."
                        : "Best for a simpler day diary."}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-2">
            <Label htmlFor="defaultHourlyLabourRate">Default hourly labour rate (£/hr)</Label>
            <Input
              id="defaultHourlyLabourRate"
              name="defaultHourlyLabourRate"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="85.00"
            />
            <p className="text-sm text-[var(--muted-foreground)]">
              Used to prefill new labour line items. You can change it later in Settings.
            </p>
          </div>

          {state.error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-[var(--surface-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--muted-foreground)]">
              You can update these details later in Settings.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <CancelSignOutButton />
              <SubmitButton />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
