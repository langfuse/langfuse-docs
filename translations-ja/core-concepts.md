---
title: コンセプト
description: Langfuse における LLM 評価の基本コンセプト — スコア、評価手法、データセット、エクスペリメント — を学びます。
---

# コアコンセプト

このページでは、評価に関するさまざまなコンセプトと、Langfuse で利用できる機能について詳しく説明します。

始める準備はできていますか?

- [データセットを作成](/docs/evaluation/experiments/datasets) して、LLM アプリケーションのパフォーマンスを一貫して測定する
- [エクスペリメントを実行](/docs/evaluation/core-concepts#experiments) して、アプリケーションの現状を概観する
- [LLM-as-a-Judge をセットアップ](/docs/evaluation/evaluation-methods/llm-as-a-judge) して、ライブトレースを評価する

## 評価ループ

LLM アプリケーションでは、テストと監視のループが継続的に行われることが多いです。

**オフライン評価**では、デプロイ前に固定のデータセットに対してアプリケーションをテストできます。新しいプロンプトやモデルをテストケースに対して実行し、[スコア](#scores) を確認し、結果が良好になるまで反復改善し、その変更をデプロイします。Langfuse では、[エクスペリメント](/docs/evaluation/core-concepts#experiments) を実行することでこれを実現できます。

**オンライン評価**では、実トラフィックでの問題を検出するために、ライブトレースをスコアリングします。データセットでカバーされていなかったエッジケースを見つけたら、それらをデータセットに追加して、将来のエクスペリメントで検出できるようにします。

<Frame fullWidth>
  ![継続的な評価/反復ループ](/images/docs/evaluation/continuous-evaluation-loop.png)
</Frame>

> **カスタマーサポートチャットボットを構築する例のワークフロー**
>
> 1. レスポンスをよりカジュアルにするために、プロンプトを更新します。
> 2. デプロイの前に、**エクスペリメント**を実行します: 新しいプロンプトをカスタマー質問のデータセットに対してテストします **(オフライン評価)**。
> 3. スコアと出力をレビューします。トーンは改善しましたが、レスポンスが長くなり、一部の重要なリンクが欠落しています。
> 4. プロンプトを改良し、エクスペリメントを再実行します。
> 5. 結果が良くなりました。新しいプロンプトを本番にデプロイします。
> 6. **オンライン評価**で監視を行い、新しいエッジケースを検出します。
> 7. カスタマーがフランス語で質問したのに、ボットが英語で回答していたことに気づきます。
> 8. このフランス語のクエリをデータセットに追加し、将来のエクスペリメントでこの問題が検出されるようにします。
> 9. プロンプトを更新してフランス語のレスポンスをサポートし、別のエクスペリメントを実行します。
>
> 時間が経つにつれて、データセットは数件の例から、多様で代表的な実世界のテストケースのセットに成長していきます。

## スコア [#scores]

[スコア](/docs/evaluation/scores/overview) は、評価結果を保存するための Langfuse の汎用データオブジェクトです。LLM の出力に品質判定を割り当てたい場合 — 人によるアノテーション、LLM ジャッジ、プログラム的なチェック、エンドユーザーのフィードバックのいずれであっても — 結果はスコアとして保存されます。

スコアは、トレース、オブザベーション、セッション、データセットラン に紐付けることができます。すべてのスコアには **名前 (name)**、**値 (value)**、**データ型 (data type)** (`NUMERIC`、`CATEGORICAL`、`BOOLEAN`、`TEXT`) があります。[スコアの種類](/docs/evaluation/scores/overview#score-types)、[スコアの作成方法](/docs/evaluation/scores/overview#how-to-create-scores)、[スコア分析](/docs/evaluation/scores/score-analytics) について、専用の [スコア](/docs/evaluation/scores/overview) ページで詳しく学べます。

## 評価手法 [#evaluation-methods]

評価手法は、トレース、オブザベーション、セッション、データセットラン にスコアを付ける関数です。さまざまな評価手法を使用して [スコア](#scores) を追加できます。

| 手法                                                                       | 内容                                                                  | 使うべきとき                                                                 |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [LLM-as-a-Judge](/docs/evaluation/evaluation-methods/llm-as-a-judge)       | LLM を使ってカスタム基準に基づき出力を評価する                        | 大規模な主観的評価 (トーン、正確性、有用性)                                 |
| [UI 経由のスコア](/docs/evaluation/evaluation-methods/scores-via-ui)       | Langfuse UI で直接トレースにスコアを手動追加する                     | 簡単な品質スポットチェック、個々のトレースのレビュー                       |
| [アノテーションキュー](/docs/evaluation/evaluation-methods/annotation-queues) | カスタマイズ可能なキューを使った構造化された人によるレビューワークフロー | グラウンドトゥルース構築、体系的なラベリング、チームコラボレーション         |
| [API/SDK 経由のスコア](/docs/evaluation/evaluation-methods/scores-via-sdk) | Langfuse API/SDK を使ってプログラム的にスコアを追加する              | カスタム評価パイプライン、決定的なチェック、自動化ワークフロー               |

新しい評価手法をセットアップする際は、[スコア分析](/docs/evaluation/scores/score-analytics) を使って生成されるスコアを分析したり、妥当性チェックを行うことができます。

## エクスペリメント [#experiments]

エクスペリメントは、データセットに対してアプリケーションを実行し、出力を評価します。これが、本番にデプロイする前に変更をテストする方法です。

### 用語の定義

エクスペリメントに入る前に、Langfuse の構成要素である データセット、データセットアイテム、タスク、スコア、エクスペリメント を理解しておくと役立ちます。

| オブジェクト          | 定義                                                                                                                                                                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **データセット**       | テストケース (データセットアイテム) のコレクション。データセットに対してエクスペリメントを実行できます。                                                                                                                                                |
| **データセットアイテム** | データセット内の 1 つのアイテム。各データセットアイテムには、入力 (テストするシナリオ) と、オプションで期待される出力が含まれます。                                                                                                                            |
| **タスク**           | エクスペリメントでテストしたいアプリケーションコード。これは各データセットアイテムに対して実行され、出力をスコアリングします。                                                                                                                              |
| **評価手法**          | エクスペリメント結果をスコアリングする関数。Langfuse エクスペリメントの文脈では、[決定的チェック](/docs/evaluation/evaluation-methods/custom-scores) または [LLM-as-a-Judge](/docs/evaluation/evaluation-methods/llm-as-a-judge) が使用できます。 |
| **スコア**           | 評価の出力。利用可能なデータ型と詳細については [スコア](#scores) を参照してください。                                                                                                                                                                  |
| **エクスペリメントラン** | データセット内のすべてのアイテムに対するタスクの 1 回の実行で、出力 (とスコア) を生成します。                                                                                                                                                            |

これらのオブジェクトのデータモデルは [こちら](/docs/evaluation/experiments/data-model) を参照してください。

### これらがどのように連携するか

概念的には次のようなことが起こります:

特定の **データセット** に対してエクスペリメントを実行すると、各 **データセットアイテム** が定義した **タスク関数** に渡されます。タスク関数は通常、アプリケーション内で発生するテストしたい LLM 呼び出しです。タスク関数は各データセットアイテムに対して出力を生成します。このプロセスを **エクスペリメントラン** と呼びます。データセットアイテムに紐付いた出力のコレクションが **エクスペリメント結果** です。

多くの場合、これらのエクスペリメント結果をスコアリングしたくなるでしょう。さまざまな [評価手法](#evaluation-methods) を使用して、データセットアイテムとタスク関数によって生成された出力を受け取り、定義した基準に基づいてスコアを生成できます。これらのスコアに基づいて、すべてのテストケースでアプリケーションがどのようにパフォーマンスを発揮しているかについての完全な概要を得ることができます。

<Frame fullWidth>
  ![エクスペリメントのフロー](/images/docs/evaluation/experiments-flow.jpg)
</Frame>

エクスペリメントランを比較することで、新しいプロンプトバージョンがスコアを改善するかどうかを確認したり、アプリケーションが苦戦している特定の入力を特定したりできます。これらのエクスペリメント結果に基づいて、変更を本番にデプロイする準備ができたかどうかを判断できます。

これらのオブジェクトが内部的にどのように連携しているかについて、[データモデルページ](/docs/evaluation/experiments/data-model) でさらに詳しい情報を見つけることができます。

### エクスペリメントの 2 つの実行方法

**Langfuse SDK を使ってプログラム的にエクスペリメントを実行**できます。これにより、タスク、評価ロジックなどを完全に制御できます。[SDK 経由のエクスペリメントの実行についてさらに学ぶ](/docs/evaluation/experiments/experiments-via-sdk)。

もう 1 つの方法は、データセットとプロンプトバージョンを選択して、**Langfuse インターフェースから直接エクスペリメントを実行**することです。これは、コードを書かずにプロンプトを素早く反復するのに便利です。[UI 経由のエクスペリメントの実行についてさらに学ぶ](/docs/evaluation/experiments/experiments-via-ui)。

<div className="my-6">
  <div className="grid grid-cols-3 gap-2">
    {/* Header row */}
    <div></div>
    <div className="text-center font-medium p-3 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700">
      **Langfuse での実行**
    </div>
    <div className="text-center font-medium p-3 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700">
      **ローカル/CI での実行**
    </div>

    {/* Langfuse Data row */}
    <div className="font-medium p-3 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700 text-center">
      **Langfuse データセット**
    </div>
    <div className="p-3 border dark:border-gray-700 rounded text-center bg-green-50 dark:bg-green-900/30">
      [UI 経由のエクスペリメント](/docs/evaluation/experiments/experiments-via-ui)
    </div>
    <div className="p-3 border dark:border-gray-700 rounded text-center bg-blue-50 dark:bg-blue-900/30">
      [SDK 経由のエクスペリメント](/docs/evaluation/experiments/experiments-via-sdk)
    </div>

    {/* Local Data row */}
    <div className="font-medium p-3 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-700 text-center">
      **ローカルデータセット**
    </div>
    <div className="p-3 border dark:border-gray-700 rounded text-center bg-red-50 dark:bg-red-900/30">
      サポートされていません
    </div>
    <div className="p-3 border dark:border-gray-700 rounded text-center bg-blue-50 dark:bg-blue-900/30">
      [SDK 経由のエクスペリメント](/docs/evaluation/experiments/experiments-via-sdk)
    </div>

  </div>
</div>

_オプションですが、基盤となる [データセット](/docs/evaluation/experiments/datasets) を Langfuse で管理することをお勧めします。これにより、[1] 同じデータ上で実行された異なるエクスペリメントを UI で比較するテーブル、[2] 本番/ステージングのトレースに基づいてデータセットを反復的に改善する、ことが可能になります。_

## オンライン評価 [#online-evaluation]

オンライン評価では、本番のトレースを自動的にスコアリングするように評価手法を構成できます。これにより、問題を即座に検出できます。

Langfuse は現在、オンライン評価のために LLM-as-a-Judge と人によるアノテーションチェックをサポートしています。[決定的チェックはロードマップ上](https://github.com/orgs/langfuse/discussions/6087) です。

### ダッシュボードによる監視

Langfuse には、アプリケーションのパフォーマンスをリアルタイムで監視するためのダッシュボードがあります。スコアもダッシュボードで監視できます。ダッシュボードの使い方の詳細は [こちら](/docs/metrics/features/custom-dashboards) を参照してください。
