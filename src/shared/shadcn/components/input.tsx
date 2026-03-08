'use client';

import * as React from "react";
import { cn } from "../lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, ...props }, ref) => {
        const [focused, setFocused] = React.useState(false);

        // Учитываем изначальное наличие значения в input
        const initialHasValue = !!(props.value || props.defaultValue);
        const [hasValue, setHasValue] = React.useState(initialHasValue);

        const handleFocus = () => setFocused(true);
        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            setFocused(false);
            setHasValue(event.target.value.length > 0);
        };

        return (
            <div className="relative w-full">
                {label && (
                    <label
                        className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 transform text-zinc-500 transition-all text-[0.9rem] duration-200 peer-placeholder-shown:translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-zinc-500 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-zinc-950 dark:text-zinc-400 dark:peer-placeholder-shown:text-zinc-400 dark:peer-focus:text-zinc-300",
                            {
                                "-translate-y-[23px] -translate-x-0.5 text-[12px] text-zinc-950 dark:text-zinc-300":
                                    focused || hasValue,
                            }
                        )}
                    >
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        `peer flex dark:bg-zinc-800 dark:text-white h-12 w-full rounded-xl bg-transparent px-3 pl-4 py-2 text-base shadow-sm transition-colors placeholder-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:focus-visible:ring-0 dark:hover:bg-zinc-900 dark:focus:bg-zinc-800 ${
                            label ? "pt-6" : ""
                        }`,
                        className
                    )}
                    ref={ref}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
