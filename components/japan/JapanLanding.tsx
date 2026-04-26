"use client";

import Link from "next/link";
import { useState } from "react";
import { JapanStyles } from "./styles";

const cornerBoxBase =
  "relative bg-surface-bg border border-line-structure japan-corners";

function CodeBox({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="rounded-[2px] font-mono text-[11px] leading-[1.65] bg-[#222220] border border-[#3a3a35] text-[#e2e2dc] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#3a3a35] bg-[#1b1b18]">
        <span className="font-mono text-[10px] text-[#8a877f] uppercase tracking-[.08em]">
          .env
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="px-1.5 py-0.5 bg-transparent border-0 text-[#8a877f] hover:text-[#e2e2dc] font-mono text-[10px] cursor-pointer"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <div className="p-3 overflow-auto">
        <div style={{ color: "#9ac6ff" }}>LANGFUSE_PUBLIC_KEY</div>
        <div>
          {"  = "}
          <span style={{ color: "#c7e6b0" }}>"pk-lf-..."</span>
        </div>
        <div style={{ color: "#9ac6ff" }}>LANGFUSE_SECRET_KEY</div>
        <div>
          {"  = "}
          <span style={{ color: "#c7e6b0" }}>"sk-lf-..."</span>
        </div>
        <div style={{ color: "#9ac6ff" }}>LANGFUSE_BASE_URL</div>
        <div>
          {"  = "}
          <span style={{ color: "#e2b73b" }}>
            "https://jp.cloud.langfuse.com"
          </span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="japan-section pt-10 pb-5">
      <div
        className={`${cornerBoxBase} no-bl no-br flex flex-wrap items-center justify-center gap-x-[18px] gap-y-2 px-5 py-[10px] text-[13px] text-text-secondary`}
      >
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-text-tertiary whitespace-nowrap">
          新 · NEW REGION
        </span>
        <span className="japan-dot" />
        <span className="whitespace-nowrap">
          データは
          <b className="text-text-primary font-medium">東京（ap-northeast-1）</b>
          に保管
        </span>
        <span className="japan-dot" />
        <span className="whitespace-nowrap">
          トレース · プロンプト · 評価 — すべて日本国内
        </span>
        <span className="japan-dot" />
        <span className="font-mono text-[12px] text-text-primary whitespace-nowrap">
          jp.cloud.langfuse.com
        </span>
      </div>

      <div
        className={`${cornerBoxBase} no-tl no-tr no-bl no-br relative overflow-hidden grid gap-14 items-center px-5 sm:px-8 py-16 md:py-[88px] -mt-px -mb-px md:grid-cols-[1.35fr_1fr]`}
      >
        <div
          aria-hidden
          className="japan-grid-bg absolute inset-0 opacity-90 pointer-events-none"
          style={{
            maskImage:
              "radial-gradient(ellipse 75% 85% at 50% 50%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 85% at 50% 50%, black, transparent)",
          }}
        />

        <div className="relative flex flex-col gap-6">
          <div className="japan-eyebrow">
            Langfuse Cloud · ap-northeast-1 · 東京
          </div>
          <h1 className="japan-h1">
            Langfuse Cloud、
            <br />
            <span className="japan-highlight">日本</span>で動きます。
          </h1>
          <p className="japan-body" style={{ fontSize: 17, maxWidth: "44ch" }}>
            LLMのトレース、プロンプト管理、評価、メトリクス。
            すべてをAWSとClickHouseの
            <b className="text-text-primary font-medium">東京リージョン</b>
            でホスト。
            世界中のチームが使っているのと同じLangfuse Cloudを、データを日本に置いたまま使えます。
          </p>
          <p className="font-analog italic text-[15px] text-text-tertiary m-0 -tracking-[0.005em]">
            Langfuse Cloud Japan — LLM observability, hosted in Tokyo.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="japan-btn-wrap">
              <Link
                className="japan-btn japan-btn-primary"
                href="https://jp.cloud.langfuse.com"
              >
                <span>無料で始める — jp.cloud.langfuse.com</span>
                <span className="japan-kbd">↗</span>
              </Link>
            </span>
            <span className="japan-btn-wrap">
              <Link
                className="japan-btn japan-btn-secondary"
                href="/talk-to-us"
              >
                <span>セールスに相談する</span>
              </Link>
            </span>
          </div>
        </div>

        <HeroArt />
      </div>

      <div
        className={`${cornerBoxBase} no-tl no-tr grid grid-cols-2 md:grid-cols-4 [border-top:none]`}
      >
        {[
          ["機能はグローバル版と同じ", "機能差分なし"],
          ["AWS + ClickHouse", "東京でホスト"],
          ["エンタープライズ対応", "SOC 2 · ISO 27001"],
          ["オープンソース", "MIT · いつでもセルフホスト"],
        ].map(([top, bot], i) => (
          <div
            key={top}
            className="flex flex-col gap-1 px-5 py-[22px]"
            style={{
              borderRight:
                i < 3 ? "1px solid var(--line-structure)" : "none",
              borderTop: "1px solid var(--line-structure)",
            }}
          >
            <span className="text-[13px] font-medium text-text-primary leading-[1.4]">
              {top}
            </span>
            <span className="font-mono text-[12px] text-text-tertiary">
              {bot}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HeroArt() {
  const cards: { emoji: string; label: string; rot: number; x: number; y: number; z: number }[] = [
    { emoji: "🗾", label: "ap-northeast-1", rot: -9, x: 0, y: 32, z: 1 },
    { emoji: "⛩️", label: "Tokyo", rot: 8, x: 150, y: 10, z: 3 },
    { emoji: "🌸", label: "In region", rot: -4, x: 210, y: 170, z: 2 },
    { emoji: "🇯🇵", label: "Data residency", rot: 9, x: 40, y: 200, z: 1 },
  ];
  return (
    <div className="relative h-[380px] w-full hidden md:block">
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 opacity-[.35] pointer-events-none"
      >
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="var(--line-structure)"
          strokeDasharray="2 4"
        />
        <circle
          cx="200"
          cy="200"
          r="140"
          fill="none"
          stroke="var(--line-structure)"
          strokeDasharray="2 4"
        />
        <circle
          cx="200"
          cy="200"
          r="100"
          fill="none"
          stroke="var(--line-structure)"
          strokeDasharray="2 4"
        />
        <text
          x="200"
          y="202"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="9"
          fill="var(--text-tertiary)"
          letterSpacing="1"
        >
          AP-NORTHEAST-1
        </text>
      </svg>
      {cards.map((c, i) => (
        <div
          key={i}
          className="absolute w-[140px] bg-white p-2.5 border border-line-structure japan-card-shadow"
          style={{
            left: c.x,
            top: c.y,
            zIndex: c.z,
            transform: `rotate(${c.rot}deg)`,
          }}
        >
          <div className="aspect-square flex items-center justify-center bg-surface-1 text-[62px] leading-none">
            {c.emoji}
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[.06em] text-text-tertiary text-center">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function WhyJapan() {
  const pillars = [
    {
      kanji: "所在",
      eyebrow: "データ所在地",
      title: "データは日本に置いたまま。",
      body: "トレース、プロンプト、評価はすべてAWS ap-northeast-1（東京）のClickHouseに保管されます。主要なアプリケーションデータがリージョンの外に出ることはありません。",
      visual: "region" as const,
    },
    {
      kanji: "同等",
      eyebrow: "フル機能",
      title: "機能の妥協はありません。",
      body: "グローバル版と同じLangfuse Cloudです。オブザーバビリティ、プロンプト管理、評価、Playground、実験、データセット — すべて日本リージョンで使えます。",
      visual: "parity" as const,
    },
    {
      kanji: "信頼",
      eyebrow: "エンタープライズ対応",
      title: "規制業界にもそのまま持ち込めます。",
      body: "SOC 2 Type II、ISO 27001、GDPR準拠のコントロール。サインアップ時にDPAへ同意、サブプロセッサーも全件公開しています。",
      visual: "compliance" as const,
    },
  ];

  return (
    <section className="japan-section pt-[120px] pb-10">
      <div className="flex flex-col items-start gap-3.5 mb-10">
        <div className="japan-eyebrow">なぜLangfuse Cloud Japan?</div>
        <h2 className="japan-h2 max-w-[26ch]">
          日本でLLMを動かすチームのための
          <br />
          <span className="japan-highlight">プラットフォーム。</span>
        </h2>
        <p className="japan-body max-w-[58ch]">
          Langfuseは、本番のLLMアプリケーションをデバッグ・分析・改善するためのオープンソースLLMエンジニアリングプラットフォームです。
          Langfuse Cloud Japanなら、そのプラットフォームをデータを日本に置いたまま使えます。
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.eyebrow}
            className="japan-chip-card flex flex-col min-h-[460px]"
          >
            <div className="px-5 pt-5 pb-3.5">
              <div className="flex items-baseline justify-between mb-2.5">
                <div className="japan-eyebrow">{p.eyebrow}</div>
                <div className="font-analog text-[34px] text-text-disabled tracking-[.05em] leading-none">
                  {p.kanji}
                </div>
              </div>
              <div className="font-analog text-[20px] leading-[1.35] text-text-primary font-medium mb-2.5 [text-wrap:balance]">
                {p.title}
              </div>
              <div className="text-[13px] text-text-tertiary leading-[1.8] [text-wrap:pretty]">
                {p.body}
              </div>
            </div>
            <div className="flex-1 relative border-t border-line-structure bg-surface-bg min-h-[200px]">
              <PillarVisual kind={p.visual} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PillarVisual({ kind }: { kind: "region" | "parity" | "compliance" }) {
  if (kind === "region") {
    const rows: [string, string, boolean][] = [
      ["ap-northeast-1", "東京", true],
      ["us-west-2", "オレゴン", false],
      ["eu-west-1", "アイルランド", false],
    ];
    return (
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex flex-col gap-1">
          {rows.map(([region, city, active]) => (
            <div
              key={region}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-[2px]"
              style={{
                background: active ? "var(--surface-cta-primary)" : "transparent",
                border: `1px solid ${active ? "var(--text-primary)" : "var(--line-structure)"}`,
                mixBlendMode: active ? "multiply" : "normal",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: active
                    ? "var(--callout-success)"
                    : "var(--text-disabled)",
                }}
              />
              <span className="font-mono text-[11px] text-text-primary flex-1">
                {region}
              </span>
              <span className="text-[11px] text-text-tertiary">{city}</span>
            </div>
          ))}
        </div>
        <div className="font-mono text-[10px] text-text-tertiary uppercase tracking-[.08em] text-right">
          active region ↗
        </div>
      </div>
    );
  }
  if (kind === "parity") {
    const feats = [
      "トレース",
      "セッション",
      "ユーザー",
      "プロンプト管理",
      "バージョン管理",
      "Playground",
      "評価",
      "LLM-as-judge",
      "実験",
      "データセット",
      "メトリクス",
      "アラート",
      "レビュー",
      "APIキー",
      "SSO",
    ];
    return (
      <div className="absolute inset-0 p-5 flex flex-wrap gap-1.5 content-start">
        {feats.map((f) => (
          <span
            key={f}
            className="px-2 py-1 border border-line-structure bg-surface-1 rounded-[2px] font-mono text-[10px] text-text-secondary inline-flex items-center gap-1"
          >
            <span style={{ color: "var(--callout-success)" }}>✓</span>
            {f}
          </span>
        ))}
        <div className="font-mono text-[10px] text-text-tertiary mt-2 w-full">
          + ほかすべて — 機能差分ゼロ
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 px-5 py-6 flex flex-col gap-3">
      {[
        ["SOC 2 Type II", "年次監査"],
        ["ISO 27001", "認証取得済み"],
        ["GDPR準拠", "サインアップ時にDPA"],
        ["サブプロセッサー", "全件公開・監査可能"],
      ].map(([title, sub]) => (
        <div
          key={title}
          className="flex items-center gap-3 px-3 py-2.5 border border-line-structure rounded-[2px] bg-surface-1"
        >
          <Seal />
          <div className="flex-1">
            <div className="text-[12px] text-text-primary font-medium leading-[1.4]">
              {title}
            </div>
            <div className="text-[10.5px] text-text-tertiary font-mono leading-[1.5] mt-0.5">
              {sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Seal() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="var(--line-cta)"
        strokeWidth="1"
        fill="var(--surface-bg)"
      />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="var(--line-cta)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function GetStarted() {
  type Step = {
    n: string;
    title: string;
    body: string;
    action?: [string, string];
    code?: boolean;
  };
  const steps: Step[] = [
    {
      n: "01",
      title: "サインアップ",
      body: "jp.cloud.langfuse.com にアクセスして、組織・プロジェクトを作成、APIキーを発行します。1分もかかりません。",
      action: ["アカウントを作成", "https://jp.cloud.langfuse.com"],
    },
    {
      n: "02",
      title: "アプリを設定",
      body: "SDKのBase URLを日本リージョンに向けます。APIキーはさっき発行したものをそのまま使います。",
      code: true,
    },
    {
      n: "03",
      title: "トレースを追加",
      body: "AIコーディングエージェントとLangfuseスキルを組み合わせれば、スタックに合わせてトレースを自動で入れてくれます。",
      action: ["Langfuse skillsを開く", "https://github.com/langfuse/skills"],
    },
  ];

  return (
    <section
      id="get-started"
      className="japan-section pt-[120px] pb-10 scroll-mt-24"
    >
      <div className="flex flex-col items-start gap-3.5 mb-10">
        <div className="japan-eyebrow">始め方 · GET STARTED</div>
        <h2 className="japan-h2 max-w-[26ch]">
          ゼロから初回トレースまで、
          <br />
          <span className="japan-highlight">3ステップ。</span>
        </h2>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="japan-chip-card p-6 flex flex-col gap-3.5 min-h-[280px]"
          >
            <div className="flex items-center gap-2.5">
              <span className="japan-step-num">{s.n}</span>
            </div>
            <div className="font-analog text-[22px] leading-[1.3] text-text-primary font-medium">
              {s.title}
            </div>
            <p className="m-0 text-[13.5px] text-text-tertiary leading-[1.8]">
              {s.body}
            </p>
            <div className="flex-1" />
            {s.action && (
              <Link
                href={s.action[1]}
                className="font-mono text-[12px] text-text-primary border-b border-text-primary self-start pb-px"
              >
                {s.action[0]} ↗
              </Link>
            )}
            {s.code && (
              <CodeBox
                value={`LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_BASE_URL="https://jp.cloud.langfuse.com"`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-[1fr_1.4fr]">
        <div className="japan-chip-card p-6">
          <div className="japan-eyebrow mb-3">AIエージェントにまかせる</div>
          <div className="font-analog text-[22px] leading-[1.35] text-text-primary font-medium mb-2.5">
            コーディングエージェントに丸投げ。
          </div>
          <p className="japan-body-sm m-0">
            Langfuse skillとllms.txtコンテキストを公開しています。Claude Code、Cursor、Copilotといったエージェントが、一発で正しくトレースを組み込んでくれます。
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            <Link className="japan-code-inline" href="https://github.com/langfuse/skills">
              github.com/langfuse/skills
            </Link>
            <Link className="japan-code-inline" href="/llms.txt">
              langfuse.com/llms.txt
            </Link>
          </div>
        </div>

        <div
          className={`${cornerBoxBase} bg-[#222220] !border-[#3a3a35] p-0 overflow-hidden`}
        >
          <div className="flex border-b border-[#3a3a35] bg-[#1b1b18]">
            <div className="px-3.5 py-2.5 bg-[#222220] font-mono text-[11px] text-[#f6f6f3] border-r border-[#3a3a35]">
              prompt.txt
            </div>
            <div className="flex-1 border-r border-[#3a3a35]" />
            <button className="px-3 bg-transparent border-0 text-[#8a877f] font-mono text-[11px] cursor-pointer">
              copy
            </button>
          </div>
          <pre className="m-0 p-5 font-mono text-[12.5px] leading-[1.75] text-[#f6f6f3] whitespace-pre-wrap">
            <span style={{ color: "#8a877f" }}># そのままエージェントに貼る:</span>
            {"\n"}
            <span style={{ color: "#ffffff", fontWeight: 500 }}>
              Add Langfuse tracing to this app.
            </span>
            {"\n"}
            <span style={{ color: "#ffffff", fontWeight: 500 }}>Use</span>{" "}
            <span style={{ color: "#9ac6ff" }}>LANGFUSE_BASE_URL</span>=
            <span style={{ color: "#e2b73b" }}>
              https://jp.cloud.langfuse.com
            </span>
            {"\n\n"}
            <span style={{ color: "#8a877f" }}># 参照コンテキスト:</span>
            {"\n"}
            <span style={{ color: "#c7a8ff" }}>https://langfuse.com/llms.txt</span>
            {"\n"}
            <span style={{ color: "#c7a8ff" }}>
              https://github.com/langfuse/skills
            </span>
          </pre>
        </div>
      </div>
    </section>
  );
}

function Customers() {
  return (
    <section className="japan-section pt-[120px] pb-10">
      <div className="flex flex-col items-start gap-3.5 mb-8">
        <div className="japan-eyebrow">お客様 · CUSTOMERS</div>
        <h2 className="japan-h2 max-w-[28ch]">
          世界中のチームが本番のLLMアプリで
          <br />
          <span className="japan-highlight">使っています。</span>
        </h2>
      </div>

      <div
        className={`${cornerBoxBase} japan-logo-grid grid grid-cols-3 md:grid-cols-6 mb-4`}
      >
        {(
          [
            { name: "LayerX", logo: "/images/japan-logos/layerx.svg" },
            { name: "freee", logo: "/images/japan-logos/freee.svg" },
            { name: "Canva", logo: "/images/japan-logos/canva.svg" },
            { name: "Khan Academy", logo: "/images/japan-logos/khan.svg" },
            { name: "Intuit", logo: "/images/japan-logos/intuit.svg" },
            { name: "Twilio", logo: "/images/japan-logos/twilio.svg" },
          ] as const
        ).map((c) => (
          <div
            key={c.name}
            className="px-4 py-9 flex items-center justify-center"
          >
            {c.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.logo}
                alt={c.name}
                className="max-h-9 max-w-[80%] w-auto object-contain opacity-80"
              />
            ) : (
              <span className="font-analog text-[18px] text-text-secondary tracking-[.01em] font-medium">
                {c.name}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <div className="japan-chip-card flex flex-col gap-4 p-7 bg-surface-1">
          <div className="japan-eyebrow">導入事例</div>
          <div className="font-analog text-[24px] leading-[1.55] text-text-primary font-medium [text-wrap:balance]">
            「関数単位や処理単位で挙動をトレースする仕組みを導入することで、入力・出力の関係やプロンプトの影響が可視化され、直感的に把握できるようになります。」
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-line-structure">
            <div className="w-9 h-9 rounded-full bg-text-primary text-surface-bg flex items-center justify-center font-analog text-[16px]">
              L
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] text-text-primary font-medium">
                LayerX — バクラク事業部 omori氏
              </div>
              <div className="text-[12px] text-text-tertiary font-mono">
                本番環境でLLMシステムを運用
              </div>
            </div>
            <Link
              className="japan-btn japan-btn-secondary japan-btn-small !shadow-none"
              href="https://tech.layerx.co.jp/entry/stable-ai-agent-dev-with-langfuse"
              target="_blank"
              rel="noopener noreferrer"
            >
              導入事例を読む ↗
            </Link>
          </div>
        </div>

        <Link
          href="https://gao-ai.com"
          target="_blank"
          rel="noopener noreferrer"
          className="japan-chip-card flex flex-col gap-3 p-7 no-underline"
        >
          <div className="japan-eyebrow">パートナー · PARTNER</div>
          <div className="font-analog text-[24px] leading-[1.35] text-text-primary font-medium">
            GAO, Inc. <span className="text-text-tertiary text-[18px]">（ガオ）</span>
          </div>
          <p className="japan-body-sm m-0">
            日本国内の公式リセラー兼導入パートナー。日本円での購買とJPYインボイス、日本語でのオンボーディングとサポートを提供します。
          </p>
          <div className="flex-1" />
          <div className="flex flex-wrap gap-1.5">
            <span className="japan-code-inline">リセラー</span>
            <span className="japan-code-inline">導入支援</span>
            <span className="japan-code-inline">日本語サポート</span>
          </div>
          <div className="font-mono text-[11px] text-text-tertiary mt-1">
            gao-ai.com ↗
          </div>
        </Link>
      </div>
    </section>
  );
}

function Compliance() {
  return (
    <section className="japan-section pt-[120px] pb-10">
      <div className="grid gap-4 md:grid-cols-[1fr_1.6fr] items-stretch">
        <div
          className={`${cornerBoxBase} p-7 relative overflow-hidden flex flex-col gap-5`}
        >
          <div
            aria-hidden
            className="japan-grid-bg absolute inset-0 opacity-60 pointer-events-none"
            style={{
              maskImage:
                "linear-gradient(to bottom, black, transparent 70%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black, transparent 70%)",
            }}
          />
          <div className="relative flex flex-col gap-3.5">
            <div className="japan-eyebrow">コンプライアンス概要</div>
            <h2
              className="japan-h2 max-w-[16ch]"
              style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
            >
              あなたのデータは、日本に。
            </h2>
            <p className="japan-body-sm max-w-[40ch]">
              主要なアプリケーションデータ — トレース、プロンプト、評価 — は、AWSとClickHouseの日本リージョンに保管されます。
            </p>
          </div>
          <div className="relative grid grid-cols-2 gap-2">
            <DataFact label="インフラ" value="AWS" />
            <DataFact label="データベース" value="ClickHouse" />
            <DataFact label="リージョン" value="ap-northeast-1" />
            <DataFact label="都市" value="東京" />
          </div>
          <div className="relative flex flex-wrap gap-2 mt-auto">
            <Link
              className="japan-btn japan-btn-secondary japan-btn-small !shadow-none"
              href="/security/data-regions"
            >
              リージョンのドキュメント ↗
            </Link>
            <Link
              className="japan-btn japan-btn-secondary japan-btn-small !shadow-none"
              href="/security"
            >
              セキュリティ概要 ↗
            </Link>
            <Link
              className="japan-btn japan-btn-secondary japan-btn-small !shadow-none"
              href="/security/dpa"
            >
              DPA ↗
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="japan-chip-card p-0 overflow-hidden">
            <div className="px-4 py-3.5 flex items-baseline justify-between border-b border-line-structure">
              <span className="font-analog text-[18px] text-text-primary font-medium">
                主要サブプロセッサー
              </span>
              <span className="japan-eyebrow">リージョン内 · 日本</span>
            </div>
            <table className="japan-table">
              <thead>
                <tr>
                  <th>サブプロセッサー</th>
                  <th>用途</th>
                  <th>データ所在地</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AWS</td>
                  <td>インフラ</td>
                  <td>
                    <RegionPill where="日本" good />
                  </td>
                </tr>
                <tr>
                  <td>ClickHouse</td>
                  <td>データベース</td>
                  <td>
                    <RegionPill where="日本" good />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </section>
  );
}

function DataFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3.5 bg-surface-1 border border-line-structure rounded-[2px]">
      <div className="japan-eyebrow mb-1.5">{label}</div>
      <div className="font-analog text-[22px] text-text-primary font-medium leading-none">
        {value}
      </div>
    </div>
  );
}

function RegionPill({ where, good }: { where: string; good?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] border border-line-structure font-mono text-[11px] text-text-primary"
      style={{
        background: good ? "var(--surface-cta-primary)" : "var(--surface-1)",
        mixBlendMode: good ? "multiply" : "normal",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: good
            ? "var(--callout-success)"
            : "var(--text-disabled)",
        }}
      />
      {where}
    </span>
  );
}

function Migration() {
  const steps = [
    "日本リージョンでプロジェクトを作成",
    "現在の環境からデータをエクスポート",
    "日本リージョンのプロジェクトへインポート",
    "アプリケーションのbase URLを切り替え",
  ];
  return (
    <section className="japan-section pt-20 pb-10">
      <div
        className={`${cornerBoxBase} grid gap-10 items-center px-8 py-9 md:grid-cols-[1fr_1.3fr]`}
      >
        <div>
          <div className="japan-eyebrow mb-2.5">移行 · MIGRATION</div>
          <h2
            className="japan-h2 max-w-[20ch] mb-3.5"
            style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
          >
            すでにLangfuseを使っている? 4ステップで移行できます。
          </h2>
          <p className="japan-body-sm m-0 max-w-[44ch]">
            別リージョンからでも、セルフホストからでもOK。エクスポート → インポート → base URL切り替え、それだけです。クックブックで手順を最初から最後までカバーしています。
          </p>
          <div className="mt-4">
            <Link
              className="japan-btn japan-btn-primary japan-btn-small"
              href="/guides/cookbook/example_data_migration-jp"
            >
              <span>移行クックブック</span>
              <span className="japan-kbd">↗</span>
            </Link>
          </div>
        </div>

        <ol className="list-none p-0 m-0 grid gap-2 grid-cols-1 sm:grid-cols-2">
          {steps.map((s, i) => (
            <li
              key={i}
              className="px-4 py-4 bg-surface-bg border border-line-structure rounded-[2px] flex gap-3 items-start"
            >
              <span className="font-mono text-[11px] text-text-tertiary w-[22px] flex-shrink-0 pt-0.5">
                0{i + 1}
              </span>
              <span className="text-[14px] text-text-primary leading-[1.7]">
                {s}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FAQ() {
  type Item = { q: string; a: React.ReactNode };
  const items: Item[] = [
    {
      q: "データはどこに保管されますか?",
      a: (
        <p>
          主要なアプリケーションデータ — トレース、プロンプト、評価 — は、日本のAWS{" "}
          <span className="japan-code-inline">ap-northeast-1</span>（東京）のClickHouseに保管されます。
        </p>
      ),
    },
    {
      q: "どのサブプロセッサーを使っていますか?",
      a: (
        <p>
          主要サブプロセッサー（リージョン内）: <b>AWS</b> と <b>ClickHouse</b>。どちらも日本で稼働しています。最新の一覧は{" "}
          <Link className="japan-link" href="/security/subprocessors">
            langfuse.com/security/subprocessors
          </Link>{" "}
          にあります。
        </p>
      ),
    },
    {
      q: "日本リージョンを使っているか、どう確認すればいい?",
      a: (
        <>
          <p>チェックするのは2点です:</p>
          <p>
            1. ブラウザが <span className="japan-code-inline">jp.cloud.langfuse.com</span> を開いている。
          </p>
          <p>
            2. SDKに{" "}
            <span className="japan-code-inline">
              LANGFUSE_BASE_URL="https://jp.cloud.langfuse.com"
            </span>{" "}
            が設定されている。
          </p>
        </>
      ),
    },
    {
      q: "移行はどう進めるの?",
      a: (
        <p>
          日本リージョンにプロジェクトを作る → 元のプロジェクトからデータをエクスポート → インポート → アプリのbase URLを切り替える、の4ステップです。詳しい手順は{" "}
          <Link
            className="japan-link"
            href="/guides/cookbook/example_data_migration-jp"
          >
            移行クックブック
          </Link>{" "}
          にまとめてあります。
        </p>
      ),
    },
    {
      q: "請求まわりは?",
      a: (
        <p>
          通貨は <b>USD</b>、クレジットカード決済です。エンタープライズの請求書払いはセールス経由で対応します。日本円での購買は{" "}
          <Link className="japan-link" href="https://gao-ai.com">
            GAO, Inc.
          </Link>{" "}
          経由でご利用いただけます。
        </p>
      ),
    },
    {
      q: "セルフホストでもいい?",
      a: (
        <p>
          もちろん。LangfuseはMITのオープンソースです。同じバイナリが自社VPCでそのまま動きます。詳しくは{" "}
          <Link className="japan-link" href="/self-hosting">
            セルフホストのドキュメント
          </Link>
          へ。
        </p>
      ),
    },
  ];
  return (
    <section className="japan-section pt-[120px] pb-10">
      <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
        <div className="md:sticky md:top-22 md:self-start">
          <div className="japan-eyebrow mb-2.5">FAQ · よくある質問</div>
          <h2
            className="japan-h2 max-w-[16ch]"
            style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
          >
            聞かれる前に、答えを。
          </h2>
          <p className="japan-body-sm mt-3.5">
            載っていないことがあれば、
            <Link className="japan-link" href="/ask-ai">
              AIに質問
            </Link>
            、
            <Link className="japan-link" href="mailto:support@langfuse.com">
              support@langfuse.com
            </Link>{" "}
            にメール、または{" "}
            <Link className="japan-link" href="/talk-to-us">
              セールスに相談
            </Link>{" "}
            からどうぞ。
          </p>
        </div>
        <div>
          {items.map((it, i) => (
            <details key={i} className="japan-faq-item">
              <summary>{it.q}</summary>
              <div className="japan-faq-body">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className="japan-section pt-20 pb-10">
      <div className="grid gap-2 md:grid-cols-3">
        <CommunityCard
          eyebrow="Twitter · X"
          title="@LangfuseJP"
          body="プロダクトのアップデート、イベント、お知らせを日本語で発信しています。"
          cta={["フォローする", "https://x.com/LangfuseJP"]}
          glyph="𝕏"
        />
        <CommunityCard
          eyebrow="ミートアップ"
          title="Langfuse on connpass"
          body="東京でのオフラインミートアップとオンラインセッション。次回のRSVPはこちらから。"
          cta={["connpassを開く", "https://langfuse.connpass.com/"]}
          glyph="会"
        />
        <CommunityCard
          eyebrow="リソース"
          title="Docs · 日本語対応"
          body="英語が一次情報のドキュメントですが、AI翻訳でも読みやすく構成されています。skillsやllms.txtも公開しています。"
          cta={["Docsを見る", "/docs"]}
          glyph="文"
        />
      </div>
    </section>
  );
}

function CommunityCard({
  eyebrow,
  title,
  body,
  cta,
  glyph,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: [string, string];
  glyph: string;
}) {
  return (
    <div className="japan-chip-card p-6 flex flex-col gap-3 min-h-[220px]">
      <div className="flex items-baseline justify-between">
        <div className="japan-eyebrow">{eyebrow}</div>
        <div className="font-analog text-[32px] text-text-disabled leading-none italic">
          {glyph}
        </div>
      </div>
      <div className="font-analog text-[22px] leading-[1.35] text-text-primary font-medium">
        {title}
      </div>
      <p className="japan-body-sm m-0">{body}</p>
      <div className="flex-1" />
      <Link
        href={cta[1]}
        className="font-mono text-[12px] text-text-primary border-b border-text-primary self-start pb-px"
      >
        {cta[0]} ↗
      </Link>
    </div>
  );
}

function CTABanner() {
  return (
    <section className="japan-section pt-[100px] pb-15">
      <div
        className={`${cornerBoxBase} japan-stripes-bg px-8 py-[72px] text-center flex flex-col items-center gap-[22px]`}
      >
        <div className="japan-eyebrow">
          Langfuse Cloud Japan · 今すぐ始めましょう
        </div>
        <h2 className="japan-h2 max-w-[26ch]">
          LLMアプリを、
          <br />
          <span className="japan-highlight">日本でホスト。</span>
        </h2>
        <p className="japan-body text-center">
          無料枠あり。USDのクレジットカード決済。データは東京に。
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="japan-btn-wrap">
            <Link
              className="japan-btn japan-btn-primary"
              href="https://jp.cloud.langfuse.com"
            >
              <span>無料で始める — jp.cloud.langfuse.com</span>
              <span className="japan-kbd">↗</span>
            </Link>
          </span>
          <span className="japan-btn-wrap">
            <Link className="japan-btn japan-btn-secondary" href="/talk-to-us">
              <span>セールスに相談する</span>
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}

export function JapanLanding() {
  return (
    <div className="japan-page" lang="ja">
      <JapanStyles />
      <div className="max-w-[1440px] mx-auto">
        <Hero />
        <WhyJapan />
        <GetStarted />
        <Customers />
        <Compliance />
        <Migration />
        <FAQ />
        <Community />
        <CTABanner />
      </div>
    </div>
  );
}
