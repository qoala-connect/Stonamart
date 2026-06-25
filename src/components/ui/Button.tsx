import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        luxury:
          "bg-amber-gold text-white hover:bg-[#A6754A] shadow-luxury hover:shadow-luxury-lg",
        outline:
          "border border-stone-dark/20 text-stone-dark bg-white hover:bg-stone-dark/5 hover:border-stone-dark/30",
        ghost: "text-stone-dark hover:bg-stone-dark/5",
        secondary:
          "bg-bronze-accent text-white hover:bg-bronze-accent/90",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "luxury",
      size: "md",
    },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
