"use client";

export function NotFoundAnimation() {
  return (
    <div
      className="mx-auto flex items-center justify-center"
      style={{ width: "100%", height: "50vh", minHeight: "400px", maxHeight: "600px" }}
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="absolute rounded-full border-2 border-primary/20"
          style={{
            width: 280,
            height: 280,
            animation: "spin 12s linear infinite",
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute rounded-full border-2 border-primary/40"
          style={{
            width: 200,
            height: 200,
            animation: "spin 8s linear infinite reverse",
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute rounded-full border-2 border-primary/60"
          style={{
            width: 130,
            height: 130,
            animation: "spin 5s linear infinite",
          }}
        />
        {/* Center text */}
        <span className="relative text-7xl font-bold text-primary select-none">
          404
        </span>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
