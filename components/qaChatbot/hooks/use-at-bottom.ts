import * as React from "react";

export function useAtBottom(
  outerDivRef: React.RefObject<HTMLElement>,
  offset = 0
) {
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  React.useEffect(() => {
    if (outerDivRef && outerDivRef.current) {
      const el = outerDivRef.current;

      const handleScroll = () => {
        const { scrollHeight, scrollTop, clientHeight } = el;
        setIsAtBottom(scrollHeight - scrollTop <= clientHeight + offset);
      };
      el.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      return () => {
        el.removeEventListener("scroll", handleScroll);
      };
    }
  }, [outerDivRef, offset]);

  return isAtBottom;
}
