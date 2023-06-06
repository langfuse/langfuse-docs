import { Screenshot } from "./screenshot";

export function Feature(props: {
  src;
  imageAlt: string;
  imagePosition: "left" | "right";
  children;
}) {
  return (
    <div className="md:grid md:grid-cols-5 md:gap-7 mb-12">
      {props.imagePosition === "right" ? (
        <div className="md:col-span-3">{props.children}</div>
      ) : (
        <div className="md:hidden">{props.children}</div>
      )}

      <Screenshot
        alt={props.imageAlt}
        src={props.src}
        full={false}
        className="col-span-2"
      />

      {props.imagePosition === "left" ? (
        <div className="hidden md:block md:col-span-3">{props.children}</div>
      ) : null}
    </div>
  );
}
