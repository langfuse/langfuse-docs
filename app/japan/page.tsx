import type { Metadata } from "next";
import { JapanLanding } from "@/components/japan/JapanLanding";
import { buildLocalizedAlternates } from "@/lib/localization";

export const metadata: Metadata = {
  title: "Langfuse Cloud Japan — 東京でホストされるLLMオブザーバビリティ",
  description:
    "Langfuse Cloud Japan — LLMのトレース、プロンプト管理、評価、メトリクスを、AWS ap-northeast-1（東京）とClickHouseで運用。",
  alternates: {
    canonical: "https://langfuse.com/japan",
    languages: buildLocalizedAlternates({
      defaultLocale: "ja-JP",
      routes: { "ja-JP": "/japan" },
    }),
  },
};

export default function JapanPage() {
  return <JapanLanding />;
}
