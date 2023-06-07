import Image from "next/image";

export function Feature(props: {
  src;
  imageAlt: string;
  imagePosition: "left" | "right";
  children;
}) {
  return (
    <div className="my-16 md:my-32 md:grid md:grid-cols-5 md:gap-10 xl:gap-20 md:items-center">
      {props.imagePosition === "right" ? (
        <div className="mb-8 md:mb-0 md:col-span-2 md:text-center [&>h2]:mt-0">
          {props.children}
        </div>
      ) : (
        <div className="mb-8 md:hidden">{props.children}</div>
      )}

      <Image
        alt={props.imageAlt}
        src={props.src}
        style={{ objectFit: "contain" }}
        className="col-span-3 max-h-96"
      />

      {props.imagePosition === "left" ? (
        <div className="hidden mb-8 md:mb-0 md:block md:col-span-2 md:text-center [&>h2]:mt-0">
          {props.children}
        </div>
      ) : null}
    </div>
  );
}
