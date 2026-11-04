import { AcademyRowVisual } from "@/components/home/academy-loop/AcademyRowVisual";
import type {
  LoopCopy,
  LoopStepId,
} from "@/components/home/academy-loop/steps";

const LOOP_COPY_JA: LoopCopy = {
  lang: "ja",
  phases: {
    production: "本番環境",
    development: "開発",
  },
  steps: {
    trace: {
      title: "トレース",
      meta: ["トレース", "セッション", "エージェント", "プロンプト"],
      href: "/academy/japan/tracing",
    },
    monitor: {
      title: "モニタリング",
      meta: ["ダッシュボード", "LLM-as-a-Judge", "フィードバック"],
      href: "/academy/japan/monitoring",
    },
    dataset: {
      title: "データセット\n構築",
      meta: ["データセット", "features-as-tests"],
      href: "/academy/japan/datasets",
    },
    experiment: {
      title: "実験",
      meta: ["プロンプト", "モデル", "コードのバリアント"],
      href: "/academy/japan/experiments",
    },
    eval: {
      title: "評価",
      meta: ["LLM-as-a-Judge", "カスタム評価", "アノテーション"],
      href: "/academy/japan/evaluate",
    },
  },
  iterate: "反復",
  deploy: "デプロイ",
  ariaLabel: "Langfuse Academy の AI エンジニアリング・ループ",
  caption:
    "本番環境では、アプリケーションをトレースしてモニタリングし、モニタリングで見つかった内容に直接反復します。開発では、データセットを構築し、変更が十分に良くなるまで実験と評価を反復します。変更をデプロイすると、新しいトレースとともにループが再び始まります。",
};

export function LoopDiagram({ highlight }: { highlight?: LoopStepId } = {}) {
  return (
    <AcademyRowVisual
      copy={LOOP_COPY_JA}
      highlight={highlight}
      className="my-8"
    />
  );
}
