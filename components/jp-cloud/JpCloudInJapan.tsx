"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Handshake, MapPin, MessageCircle } from "lucide-react";

const JAPAN_RED = "#BC002D";

const items = [
  {
    icon: Handshake,
    enTitle: "ClickHouse & Japan Cloud",
    jpTitle: "ClickHouse & Japan Cloudパートナーシップ",
    enDescription:
      "Langfuse is a ClickHouse company. ClickHouse operates a joint venture with Japan Cloud, bringing local enterprise expertise and dedicated support to the Japanese market.",
    jpDescription:
      "LangfuseはClickHouseファミリーの一員です。ClickHouseはJapan Cloudとの合弁事業を通じて、日本市場に特化したエンタープライズ知見とサポート体制を構築しています。",
  },
  {
    icon: MapPin,
    enTitle: "Local Presence",
    jpTitle: "日本市場での展開",
    enDescription: (
      <>
        Through our Japan Cloud partnership, Langfuse has a direct presence in
        the Japanese market with dedicated local teams.{" "}
        <a
          href="https://gao-ai.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          GAO, Inc.
        </a>{" "}
        drives the local Langfuse community (
        <a
          href="https://x.com/LangfuseJP"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          @LangfuseJP
        </a>
        ).
      </>
    ),
    jpDescription: (
      <>
        Japan Cloudとのパートナーシップにより、専任の現地チームとともに日本市場で直接サービスを展開しています。
        <a
          href="https://gao-ai.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          ガオ株式会社
        </a>
        が日本のLangfuseコミュニティ（
        <a
          href="https://x.com/LangfuseJP"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          @LangfuseJP
        </a>
        ）を運営しています。
      </>
    ),
  },
  {
    icon: MessageCircle,
    enTitle: "Japanese-Language Support",
    jpTitle: "日本語サポート",
    enDescription: (
      <>
        We have a team in Tokyo and are happy to meet in person. Reach out for
        Japanese-language sales inquiries and Slack-based support at{" "}
        <a
          href="mailto:support@langfuse.com"
          className="underline hover:text-foreground transition-colors"
        >
          support@langfuse.com
        </a>
      </>
    ),
    jpDescription: (
      <>
        東京にチームを構えており、対面でのお打ち合わせも可能です。日本語での営業やSlackサポートは{" "}
        <a
          href="mailto:support@langfuse.com"
          className="underline hover:text-foreground transition-colors"
        >
          support@langfuse.com
        </a>{" "}
        までお気軽にどうぞ。
      </>
    ),
  },
];

export function JpCloudInJapan() {
  return (
    <section className="py-16 lg:py-24 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-foreground">
          Langfuse in Japan
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          日本におけるLangfuse
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.enTitle}
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
                <item.icon
                  className="w-8 h-8 mb-4"
                  style={{ color: JAPAN_RED }}
                  strokeWidth={1.5}
                />
                <h3 className="text-lg font-semibold text-foreground">
                  {item.enTitle}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {item.jpTitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.enDescription}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground/70">
                  {item.jpDescription}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
