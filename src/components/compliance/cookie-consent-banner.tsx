"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cookieConsentConfig } from "@/lib/site-config";

const CONSENT_STORAGE_KEY = "workshop-buddy-cookie-consent";

export function CookieConsentBanner() {
  const isEnabled =
    cookieConsentConfig.bannerEnabled && cookieConsentConfig.hasNonEssentialCookies;

  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return !window.localStorage.getItem(CONSENT_STORAGE_KEY);
  });

  if (!isEnabled) {
    return null;
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 rounded-3xl border border-[var(--surface-border)] bg-white p-4 shadow-[0_18px_50px_rgba(39,76,119,0.18)] sm:left-auto sm:right-6 sm:max-w-md">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Cookie preferences
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
            Workshop Buddy may use analytics or other non-essential cookies in future.
            This banner is in place so consent controls can be enabled when needed.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              window.localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
              setVisible(false);
            }}
          >
            Accept
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              window.localStorage.setItem(CONSENT_STORAGE_KEY, "declined");
              setVisible(false);
            }}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
