import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-brand/25 bg-background text-foreground shadow-sm hover:border-brand/40 hover:bg-brand/10 hover:text-brand-dark focus-visible:ring-brand",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "text-foreground/80 hover:bg-brand/10 hover:text-brand-dark focus-visible:ring-brand",
        link: "text-brand underline-offset-4 hover:text-brand-dark hover:underline focus-visible:ring-brand",
        cta:
          "border border-transparent bg-cta text-white font-display font-semibold uppercase tracking-wide shadow-sm hover:bg-cta-light hover:shadow-md focus-visible:ring-cta",
        ctaOutline:
          "border border-brand/30 bg-transparent text-charcoal font-display font-semibold uppercase tracking-wide hover:border-brand hover:bg-brand/10 hover:text-brand-dark focus-visible:ring-brand",
        ctaInverse:
          "border border-white/30 bg-transparent text-white font-display font-semibold uppercase tracking-wide hover:border-brand/60 hover:bg-brand/10 hover:text-white focus-visible:ring-brand",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        marketing: "h-12 rounded-xl px-8 text-sm",
        hero: "h-14 rounded-xl px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
