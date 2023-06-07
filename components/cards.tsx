import cn from "clsx";

export function TwoCards({ children, className }) {
  return (
    <div className={cn("grid md:grid-cols-2 gap-7", className)}>{children}</div>
  );
}

export function StartCard({ children, isDark, isOutline }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md ring-1 ring-gray-200 dark:ring-gray-800 px-5 pb-5 bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))]",
        isOutline
          ? "bg-transparent from-transparent via-transparent to-transparent ring-2"
          : "from-slate-100 via-slate-400 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800"
      )}
    >
      {children}
    </div>
  );
}
