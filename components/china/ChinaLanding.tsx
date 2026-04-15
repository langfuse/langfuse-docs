"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductUpdateSignup } from "@/components/productUpdateSignup";
import { Background } from "@/components/Background";
import { getGitHubStars } from "@/lib/github-stars";
import { DOCKER_PULLS, SDK_INSTALLS_PER_MONTH } from "@/components/home/Usage";
import {
  BookOpen,
  CalendarDays,
  CloudCog,
  Globe,
  Handshake,
  Rocket,
  Users,
} from "lucide-react";

const valueProps = [
  {
    icon: BookOpen,
    enTitle: "Open Source by Default",
    zhTitle: "开源基因",
    enDescription:
      "Fully open source and transparent. Easy to inspect, extend, and integrate with your existing AI stack.",
    zhDescription:
      "Langfuse 走的是 OSS 路线，代码透明、可二开，接入现有 AI 技术栈成本低。",
  },
  {
    icon: CloudCog,
    enTitle: "Self-Hosted Ready",
    zhTitle: "私有化部署友好",
    enDescription:
      "Deploy on your own infrastructure for stronger data control, enterprise security, and local compliance.",
    zhDescription:
      "支持私有化/自托管部署，数据可控，安全与合规更容易落地。",
  },
  {
    icon: Users,
    enTitle: "Strong China Momentum",
    zhTitle: "国内落地规模持续增长",
    enDescription:
      "Already widely used by Chinese teams and enterprises running production AI applications.",
    zhDescription:
      "在国内，越来越多团队把 Langfuse 用在生产环境，覆盖评测、调试、观测等关键链路。",
  },
  {
    icon: Handshake,
    enTitle: "ClickHouse Ecosystem",
    zhTitle: "与 ClickHouse 深度协同",
    enDescription:
      "Langfuse is part of ClickHouse. ClickHouse has a local business in China, collaborates with Alibaba, and is increasing market investment.",
    zhDescription:
      "Langfuse 已纳入 ClickHouse 体系。ClickHouse 在中国有本地团队，并与阿里云生态合作，市场投入持续加码。",
  },
];

const stats = [
  {
    getValue: () => (getGitHubStars() / 1000).toFixed(0) + "K+",
    en: "GitHub Stars",
    zh: "GitHub 星标",
  },
  {
    getValue: () => (SDK_INSTALLS_PER_MONTH / 1_000_000).toFixed(0) + "M+",
    en: "SDK Installs / Month",
    zh: "每月 SDK 安装量",
  },
  {
    getValue: () => (DOCKER_PULLS / 1_000_000).toFixed(0) + "M+",
    en: "Docker Pulls",
    zh: "Docker Pull",
  },
];

const marketItems = [
  {
    icon: CalendarDays,
    enTitle: "Upcoming China-Focused Events",
    zhTitle: "中国市场活动与线下交流",
    enDescription:
      "Upcoming: May 17 Shanghai Meetup, June 9 joint workshop with MongoDB and AWS, June 17 AWS Summit Hong Kong, and June 23-24 AWS Shanghai Summit.",
    zhDescription:
      "近期我们会在多场活动中分享 Langfuse + ClickHouse 的 Agent Observability 实践：5 月 17 日上海 Meetup、6 月 9 日与 MongoDB/AWS 联合工作坊、6 月 17 日香港 AWS Summit、6 月 23-24 日上海 AWS Summit。",
  },
  {
    icon: Globe,
    enTitle: "Localization & User Connection",
    zhTitle: "本地化内容与开发者连接",
    enDescription:
      "We are investing in Chinese-language content, local channels, and direct feedback loops with users in China.",
    zhDescription:
      "我们会持续做中文内容、线上社群和线下交流，直接听一线开发者与企业用户的反馈。",
  },
  {
    icon: Rocket,
    enTitle: "Future Offerings",
    zhTitle: "后续产品与合作机会",
    enDescription:
      "Subscribers hear first about meetups, local partnerships, and potential future offerings in China.",
    zhDescription:
      "订阅邮件列表后，你会优先收到活动邀请、本地合作进展，以及面向中国市场的后续产品/商业化信息。",
  },
];

function SectionHeading({
  enTitle,
  zhTitle,
  enSubtitle,
  zhSubtitle,
}: {
  enTitle: string;
  zhTitle: string;
  enSubtitle: string;
  zhSubtitle: string;
}) {
  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-foreground">
        {zhTitle}
      </h2>
      <p className="mt-3 text-lg text-muted-foreground">{enTitle}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-3xl mx-auto">
        {zhSubtitle}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground/70 max-w-3xl mx-auto">
        {enSubtitle}
      </p>
    </div>
  );
}

export function ChinaLanding() {
  return (
    <>
      <main className="relative overflow-hidden w-full">
        <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-5 sm:px-7 xl:px-10">
          <motion.div
            className="hidden md:flex absolute top-[12%] left-[6%] w-20 h-20 bg-card rounded-2xl items-center justify-center text-4xl shadow-lg border"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          >
            🇨🇳
          </motion.div>
          <motion.div
            className="hidden md:flex absolute top-[12%] right-[6%] w-20 h-20 bg-card rounded-2xl items-center justify-center text-4xl shadow-lg border"
            initial={{ opacity: 0, scale: 0, rotate: 180 }}
            animate={{ opacity: 1, scale: 1, rotate: 8 }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
          >
            🧧
          </motion.div>
          <motion.div
            className="hidden md:flex absolute bottom-[12%] left-[8%] w-20 h-20 bg-card rounded-2xl items-center justify-center text-4xl shadow-lg border"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
          >
            🐉
          </motion.div>
          <motion.div
            className="hidden md:flex absolute bottom-[12%] right-[8%] w-20 h-20 bg-card rounded-2xl items-center justify-center text-4xl shadow-lg border"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, type: "spring" }}
          >
            🚀
          </motion.div>

          <div className="relative z-10 text-center max-w-5xl mx-auto">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-primary text-primary-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              开源可观测性在中国 / Langfuse in China
            </motion.span>

            <motion.h1
              className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-bold font-mono tracking-tight text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Langfuse 在中国
            </motion.h1>

            <motion.p
              className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold font-mono text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              Langfuse in China
            </motion.p>

            <motion.p
              className="mt-6 text-base sm:text-lg lg:text-xl font-medium text-muted-foreground max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Langfuse 在中国已经有不少真实落地案例。我们正在持续加大本地投入，做更好的中文内容、活动和用户连接。
            </motion.p>
            <motion.p
              className="mt-2 text-sm sm:text-base text-muted-foreground/80 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Langfuse is already widely used in China. We are investing more in localization, local engagement, and market presence together with ClickHouse.
            </motion.p>

            <motion.div
              className="mt-10 flex gap-4 flex-wrap items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <Button variant="cta" size="xl" asChild>
                <a href="#mailing-list">
                  加入中国邮件列表 / Join the China Mailing List
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 lg:py-28 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <SectionHeading
              enTitle="Why Langfuse in China"
              zhTitle="为什么中国团队在用 Langfuse"
              enSubtitle="Open-source roots, strong adoption, and increasing local investment with ClickHouse make Langfuse a long-term platform choice for teams in China."
              zhSubtitle="开源、可私有化、能落地，是中国团队做 AI 工程化的长期解法；Langfuse 正沿这条路径持续投入。"
            />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-5">
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.enTitle}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-l-2 border-l-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6 pt-6 flex h-full flex-col">
                    <prop.icon className="w-8 h-8 mb-4 text-primary" strokeWidth={1.5} />
                    <h3 className="text-lg font-semibold text-foreground">
                      {prop.zhTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {prop.enTitle}
                    </p>
                    <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
                      {prop.zhDescription}
                    </p>
                    <p className="mt-4 pt-4 text-[13px] leading-6 text-muted-foreground/65 border-t border-border/60">
                      {prop.enDescription}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-16 lg:py-24 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-foreground">
              广泛采用，持续增长
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              全球开源社区验证，国内采用持续增长
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.en}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono text-foreground">
                  {stat.getValue()}
                </div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">
                  {stat.zh}
                </div>
                <div className="text-xs text-muted-foreground/60">{stat.en}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-16 lg:py-24 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <SectionHeading
              enTitle="Local Investment with ClickHouse"
              zhTitle="和 ClickHouse 一起加速中国投入"
              enSubtitle="We are building long-term local market presence through events, partnerships, and direct engagement with users and buyers in China."
              zhSubtitle="通过活动、合作伙伴与用户共建，我们会持续把 Langfuse 在中国做深做实。"
            />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {marketItems.map((item, index) => (
              <motion.div
                key={item.enTitle}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-l-2 border-l-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6 pt-6 flex h-full flex-col">
                    <item.icon className="w-8 h-8 mb-4 text-primary" strokeWidth={1.5} />
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.zhTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.enTitle}
                    </p>
                    <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
                      {item.zhDescription}
                    </p>
                    <p className="mt-4 pt-4 text-[13px] leading-6 text-muted-foreground/65 border-t border-border/60">
                      {item.enDescription}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="mailing-list"
          className="py-24 lg:py-32 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10 text-center relative overflow-hidden"
        >
          <motion.div
            className="hidden md:flex absolute top-8 right-[8%] w-20 h-20 bg-card rounded-2xl items-center justify-center text-4xl shadow-lg border"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            📬
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono tracking-tight">
              订阅中国动态，第一时间了解 Langfuse 在中国
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Be the first to hear updates in China
            </p>
            <p className="mt-6 text-base text-muted-foreground max-w-2xl mx-auto">
              订阅后可获取活动信息、中文内容更新、用户案例，以及后续产品与合作进展。
            </p>
            <p className="mt-2 text-sm text-muted-foreground/70 max-w-2xl mx-auto">
              Get notified about events, localization progress, user meetups, and potential future offerings from Langfuse + ClickHouse in China.
            </p>
            <div className="mt-8 flex justify-center">
              <ProductUpdateSignup source="China landing page" />
            </div>
            <p className="mt-6 text-xs text-muted-foreground/50">
              您可随时取消订阅。 / You can unsubscribe at any time.
            </p>
          </motion.div>
        </section>
      </main>
      <Background />
    </>
  );
}
