import { DotPattern } from "./magicui/dot-pattern";

export const Background = () => (
  <div className="absolute top-0 bottom-0 left-0 right-0 -z-50">
    <DotPattern
      width={15}
      height={15}
      cx={1}
      cy={1}
      cr={1}
      className="[mask-image:linear-gradient(to_bottom,white,transparent,transparent)] dark:opacity-40"
    />
    {/* <LinearGradient
      to="rgba(120,119,198,0.15)"
      from="rgba(0,0,0,0.0)"
      direction="top"
      transitionPoint="60%"
      className="hidden dark:block max-h-56"
    />
    <LinearGradient
      to="rgba(120,119,198,0.3)"
      from="rgba(0,0,0,0.0)"
      direction="top"
      transitionPoint="60%"
      className="dark:hidden max-h-56"
    /> */}
  </div>
);
