import * as React from "react";
import { cn } from "cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, id, "aria-describedby": ariaDescribedBy, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          id={id}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-destructive focus-visible:ring-destructive/50 aria-invalid:border-destructive",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            ariaDescribedBy ?? (error && id ? `${id}-error` : undefined)
          }
          ref={ref}
          {...props}
        />
        {error && (
          <p id={id ? `${id}-error` : undefined} className="mt-1.5 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
