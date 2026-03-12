"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, LayoutDashboard } from "lucide-react";

const JAPAN_RED = "#BC002D";

const valueProps = [
  {
    icon: Shield,
    enTitle: "Data Residency",
    jpTitle: "データレジデンシー",
    enDescription:
      "Your traces, evaluations, and prompts stay in Japan. Meet local data sovereignty and compliance requirements with confidence.",
    jpDescription:
      "トレース、評価、プロンプトのすべてのデータが日本国内に保存されます。データ主権とコンプライアンス要件を安心して満たすことができます。",
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
    jpTitle: "フルプラットフォーム",
    enDescription:
      "All Langfuse features — observability, evaluations, prompt management, and metrics — available in the Japan region.",
    jpDescription:
      "トレーシング、評価、プロンプト管理、メトリクスなど、Langfuseのすべての機能を日本リージョンでご利用いただけます。",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {valueProps.map((prop, index) => (
          <motion.div
            key={prop.enTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border-l-2 hover:shadow-md transition-shadow" style={{ borderLeftColor: JAPAN_RED + "50" }}>
              <CardContent className="p-6 pt-6">
                <prop.icon
                  className="w-8 h-8 mb-4"
                  style={{ color: JAPAN_RED }}
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold text-foreground">
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
