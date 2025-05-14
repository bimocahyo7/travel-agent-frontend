import React from "react";
import { cn } from "@/lib/utils";

export const Button = React.forwardRef(
  ({ type = "submit", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
