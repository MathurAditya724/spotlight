import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "~/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-800 text-neutral-50",
        destructive: "border-transparent bg-red-500 text-neutral-50",
        outline: "text-neutral-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
