import Image from "next/image";

export function Logo() {
  return (
    <div className="flex gap-2 items-center">
      <Image
        src="/logo_light_512.png"
        alt="Langfuse Logo"
        width={120}
        height={20}
        className="hidden dark:block"
      />
      <Image
        src="/logo_dark_512.png"
        alt="Langfuse Logo"
        width={120}
        height={20}
        className="block dark:hidden"
      />
    </div>
  );
}
