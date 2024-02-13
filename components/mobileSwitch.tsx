import React, { useState, useEffect, useRef, ReactNode } from "react";

// Define the breakpoint
const MOBILE_BREAKPOINT = 650;

interface MobileSwitchProps {
  mobile: ReactNode;
  desktop: ReactNode;
}

export default function MobileSwitch(props: MobileSwitchProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const objectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(objectRef.current!.offsetWidth <= MOBILE_BREAKPOINT);
    };
    handleResize();

    // Attach event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={objectRef}>
      {isMobile !== null ? (isMobile ? props.mobile : props.desktop) : null}
    </div>
  );
}