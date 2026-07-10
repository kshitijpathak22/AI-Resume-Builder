import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_16px_rgba(91,63,217,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_24px_rgba(91,63,217,0.5)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
        outline:
          "border border-white/30 dark:border-white/15 bg-white/20 dark:bg-white/5 backdrop-blur-md hover:bg-white/40 dark:hover:bg-white/10 hover:text-accent-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
        ghost: "hover:bg-accent/60 hover:backdrop-blur-md hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
