import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-300 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:bg-surface-muted";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(inputBase, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(inputBase, "min-h-[96px] resize-y", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(inputBase, "cursor-pointer appearance-none bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9", className)}
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2331415f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    }}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export function SearchField({ className, wrapperClassName, ...props }: SearchFieldProps) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
      <input
        type="search"
        className={cn(inputBase, "pl-9", className)}
        {...props}
      />
    </div>
  );
}

interface LabelledFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function LabelledField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: LabelledFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-navy-800">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-navy-400">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export function Checkbox({
  className,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm text-navy-700">
      <input
        type="checkbox"
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0 rounded border-navy-300 text-teal-600 focus:ring-teal-500",
          className,
        )}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
