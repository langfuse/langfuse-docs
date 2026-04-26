import type { Metadata } from "next";
import { JapanLanding } from "@/components/japan/JapanLanding";

export const metadata: Metadata = {
  title: "Langfuse Cloud Japan — 東京リージョンでホストされるLLMオブザーバビリティ",
  description:
    "Langfuse Cloud Japan — LLMのトレース、プロンプト管理、評価、メトリクスを、AWS ap-northeast-1（東京）とClickHouseで運用。",
  alternates: {
    canonical: "https://langfuse.com/japan",
    languages: {
      en: "https://langfuse.com/japan",
      ja: "https://langfuse.com/japan",
    },
  },
};

export default function JapanPage() {
  return <JapanLanding />;
}
