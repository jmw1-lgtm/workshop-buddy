import Image from "next/image";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  size?: number;
};

export function Logo({
  className,
  imageClassName,
  textClassName,
  size = 32,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/images/logo.png"
        alt="Workshop Buddy logo"
        width={size}
        height={size}
        className={cn("h-auto shrink-0 object-contain", imageClassName)}
      />
      <span className={cn("font-semibold text-[var(--foreground)]", textClassName)}>
        Workshop Buddy
      </span>
    </div>
  );
}
