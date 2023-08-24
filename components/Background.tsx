import { DotPattern } from "./magicui/dot-pattern";
import { LinearGradient } from "./magicui/linear-gradient";
import { cn } from "@/lib/utils";

export const Background = () => (
  <div className="absolute top-0 bottom-0 left-0 right-0 -z-50">
    <DotPattern
      width={15}
      height={15}
      cx={1}
      cy={1}
      cr={1}
      className={cn(
        "[mask-image:linear-gradient(to_bottom,white,transparent,transparent)]",
        "dark:opacity-70"
      )}
    />
    <LinearGradient
      to="rgba(120,119,198,0.25)"
      from="rgba(0,0,0,0.0)"
      direction="top"
      transitionPoint="50%"
      className="hidden dark:block"
    />
    <LinearGradient
      to="rgba(120,119,198,0.3)"
      from="rgba(0,0,0,0.0)"
      direction="top"
      transitionPoint="50%"
      className="dark:hidden"
    />
  </div>
);
