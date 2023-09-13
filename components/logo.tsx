import Image from "next/image";

export function Logo() {
  return (
    <div className="flex gap-2 items-center">
      <Image src="/icon256.png" alt="Langfuse" width={20} height={20} />
      <span className="nx-font-mono">Langfuse</span>
    </div>
  );
}
