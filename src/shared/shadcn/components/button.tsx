'use client';

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { forwardRef } from "react";
import useRipple from "use-ripple-hook";

const buttonVariants = cva(
    "inline-flex text-white active:scale-[97%] transition-all items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-blue-500 text-primary-foreground shadow hover:bg-blue-500/90 text-white",
                destructive:
                    "bg-red-500 text-white shadow-sm hover:bg-red-500/90",
                outline:
                    "border border-input bg-background shadow-sm dark:border-[#353535] dark:text-white dark:bg-[#171717] dark:hover:bg-[#141414] hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-violet-700 hover:bg-violet-700/90 text-secondary-foreground shadow-sm",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-white underline-offset-4 hover:underline",
            },
            size: {
                default: "text-[14px] sm:text-base px-4 sm:px-5 h-9 sm:h-10 md:px-4 py-2 rounded-full",
                sm: "h-8 rounded-full px-3 text-xs",
                lg: "h-10 rounded-full px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        const [ripple, event] = useRipple({
            color: variant === 'outline' ? 'rgba(255, 255, 255,0.1)' : "rgba(255, 255, 255, .14)"
        });

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                style={{ position: "relative", overflow: "hidden" }}
                {...props} // Передаём все свойства, кроме isLoading
                ref={ripple || ref}
                onMouseDown={event}
                disabled={isLoading || props.disabled}
            >
                {isLoading ? (
                    <>
                        {props.children} <Loader2 className="text-white h-4 ml-2 w-4 animate-spin" />
                    </>
                ) : (
                    props.children
                )}
            </Comp>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
