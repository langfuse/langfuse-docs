import { cn } from "@/lib/utils";
import { ArrowUpRightFromSquare, Code, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import IconPython from "../icons/python";
import IconTypescript from "../icons/typescript";
import IconOpenai from "../icons/openai";
import LlamaindexIcon from "./img/llamaindex_icon.png";
import LangchainIcon from "./img/langchain_icon.png";
import HaystackIcon from "./img/haystack_icon.png";
import LitellmIcon from "./img/litellm_icon.png";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";

interface IntegrationTileProps {
  title: string;
  href: string;
  icon: ReactNode;
}

const integrations: IntegrationTileProps[] = [
  {
    title: "Python SDK",
    href: "/docs/sdk/python",
    icon: <IconPython className="h-9 w-9" />,
  },
  {
    title: "JS/TS SDK",
    href: "/docs/sdk/typescript/guide",
    icon: <IconTypescript className="h-7 w-7" />,
  },
  {
    title: "API",
    href: "https://api.reference.langfuse.com/",
    icon: <Code className="h-6 w-6" />,
  },
  {
    title: "OpenAI SDK",
    href: "/docs/integrations/openai/get-started",
    icon: <IconOpenai className="h-7 w-7" />,
  },
  {
    title: "LangChain",
    href: "/docs/integrations/langchain/tracing",
    icon: (
      <Image src={LangchainIcon} alt="Langchain Icon" width={40} height={40} />
    ),
  },
  {
    title: "Llama-Index",
    href: "/docs/integrations/llama-index/get-started",
    icon: (
      <Image
        src={LlamaindexIcon}
        alt="Llama-index Icon"
        width={35}
        height={35}
      />
    ),
  },
  {
    title: "LiteLLM",
    href: "/docs/integrations/litellm",
    icon: <Image src={LitellmIcon} alt="LiteLLM Icon" width={40} height={40} />,
  },
  {
    title: "Haystack",
    href: "/docs/integrations/haystack",
    icon: (
      <Image src={HaystackIcon} alt="Haystack Icon" width={28} height={28} />
    ),
  },
  {
    title: "More",
    href: "/docs/integrations/overview",
    icon: <MoreHorizontal className="h-5 w-5" />,
  },
];

function IntegrationTile({ title, href, icon }: IntegrationTileProps) {
  return (
    <Link
      href={href}
      className="group relative aspect-square w-full perspective-1000"
    >
      <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 [backface-visibility:hidden]">
          <div className="size-9 flex items-center justify-center">{icon}</div>
          <span className="text-sm font-medium text-center">{title}</span>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="size-9 flex items-center justify-center">
            <ArrowUpRightFromSquare className="size-6" />
          </div>
          <span className="text-sm font-medium text-center">Learn More</span>
        </div>
      </div>
    </Link>
  );
}

export function IntegrationsGrid() {
  return (
    <HomeSection>
      <Header
        title="Works with any LLM app and model"
        description="SDKs for Python & JS/TS and native integrations for popular libraries. Missing an integration? Let us know!"
        buttons={[
          {
            href: "/docs/integrations/overview",
            text: "Integration docs",
          },
        ]}
      />
      <div className="relative w-full mx-auto max-w-3xl rounded border bg-card">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:radial-gradient(white,transparent_85%)] dark:bg-grid-slate-700/25" />
        <div className="relative grid grid-cols-4 divide-x divide-y divide-dashed">
          {integrations.map((integration) => (
            <div
              key={integration.title}
              className="aspect-square w-full flex items-center justify-center"
            >
              <IntegrationTile {...integration} />
            </div>
          ))}
          {/* Fill remaining grid spaces with empty divs */}
          {[
            ...Array(
              Math.ceil(integrations.length / 4) * 4 - integrations.length
            ),
          ].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square w-full" />
          ))}
        </div>
      </div>
    </HomeSection>
  );
}
