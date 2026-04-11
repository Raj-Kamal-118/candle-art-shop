"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brown-800 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-2.5 text-sm border rounded-lg transition-colors",
            "bg-white text-brown-900 placeholder:text-brown-400",
            "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-brown-300 hover:border-brown-400",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-brown-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
