"use client";

import { useClerk } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

type CancelSignOutButtonProps = {
  className?: string;
};

export function CancelSignOutButton({
  className,
}: CancelSignOutButtonProps) {
  const { signOut } = useClerk();

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={() => signOut({ redirectUrl: "/sign-in" })}
    >
      Cancel and sign out
    </Button>
  );
}
