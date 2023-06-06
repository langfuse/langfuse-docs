export function TwoCards({ children }) {
  return <div className="grid grid-cols-2 gap-3 my-24">{children}</div>;
}

export function StartCard({ children, isDark }) {
  return <div className="rounded-md ring-1 ring-gray-500 px-5">{children}</div>;
}
