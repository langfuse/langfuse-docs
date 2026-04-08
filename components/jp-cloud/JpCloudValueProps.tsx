"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, LayoutDashboard, Lock } from "lucide-react";

const JAPAN_RED = "#BC002D";

const valueProps = [
  {
    icon: Shield,
    enTitle: "Data Residency",
    jpTitle: "データレジデンシー",
    enDescription:
      "All traces, evaluations, and prompts stay in Japan. ClickHouse and AWS infrastructure hosted in ap-northeast-1 (Tokyo).",
    jpDescription:
      "トレース、評価、プロンプトのすべてのデータが日本国内に保存されます。ClickHouseおよびAWSインフラは東京リージョン（ap-northeast-1）で運用されます。",
  },
  {
    icon: Lock,
    enTitle: "Enterprise Security",
    jpTitle: "エンタープライズセキュリティ",
    enDescription:
      "SOC 2 Type II and ISO 27001 certified. GDPR compliant with equivalence for Japanese data protection requirements.",
    jpDescription:
      "SOC 2 Type IIおよびISO 27001認証取得済み。GDPRに準拠し、日本のデータ保護要件にも対応しています。",
  },
  {
    icon: Zap,
    enTitle: "Low Latency",
    jpTitle: "低レイテンシ",
    enDescription:
      "Purpose-built infrastructure in Japan for fast, responsive access across Japan and the APAC region.",
    jpDescription:
      "日本国内の専用インフラにより、日本およびAPAC地域全体で高速かつ快適なアクセスを実現します。",
  },
  {
    icon: LayoutDashboard,
    enTitle: "Full Platform",
    jpTitle: "全機能を日本リージョンで",
    enDescription:
      "LLM observability, AI app debugging, prompt management, evaluation, and metrics — all available in the Japan region.",
    jpDescription:
      "LLM オブザーバビリティ、AIアプリデバッグ、プロンプト管理、評価、メトリクスなど、Langfuseのすべての機能をご利用いただけます。",
  },
];

export function JpCloudValueProps() {
  return (
    <section className="py-20 lg:py-28 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-foreground">
          Why Japan Region?
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          なぜ日本リージョン？
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {valueProps.map((prop, index) => (
          <motion.div
            key={prop.enTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              className="h-full border-l-2 hover:shadow-md transition-shadow"
              style={{ borderLeftColor: JAPAN_RED + "50" }}
            >
              <CardContent className="p-6 pt-6">
                <prop.icon
                  className="w-8 h-8 mb-4"
                  style={{ color: JAPAN_RED }}
                  strokeWidth={1.5}
                />
                <h3 className="text-lg font-semibold text-foreground">
                  {prop.enTitle}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {prop.jpTitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {prop.enDescription}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground/70">
                  {prop.jpDescription}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
