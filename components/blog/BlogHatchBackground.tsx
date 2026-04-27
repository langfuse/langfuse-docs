const hatchStyle = {
  "--stripe-base": "transparent",
  "--stripe-line": "rgba(108, 103, 96, 0.06)",
} as React.CSSProperties;

export function BlogHatchBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[320px] overflow-hidden z-0"
    >
      <div
        className="bg-stripe-pattern absolute -top-4 -left-8 w-[55%] h-[200px]"
        style={{
          ...hatchStyle,
          clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
        }}
      />
      <div
        className="bg-stripe-pattern absolute -top-4 right-0 w-[35%] h-[160px]"
        style={{
          ...hatchStyle,
          clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />
      <div
        className="bg-stripe-pattern absolute top-[180px] -left-4 w-[30%] h-[120px]"
        style={{
          ...hatchStyle,
          clipPath: "polygon(0 0, 100% 40%, 60% 100%, 0 100%)",
        }}
      />
      <div
        className="bg-stripe-pattern absolute top-[150px] right-[5%] w-[20%] h-[100px]"
        style={{
          ...hatchStyle,
          clipPath: "polygon(15% 0, 100% 0, 100% 80%, 0 100%)",
        }}
      />
    </div>
  );
}
