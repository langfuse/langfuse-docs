---
title: UI 経由のエクスペリメント
description: データセットに対して異なるプロンプトバージョンとモデルでエクスペリメントを行い、Langfuse UI から直接、結果を横並びで比較します。
---

# UI 経由のエクスペリメント (プロンプトエクスペリメント)

Langfuse UI で UI 経由のエクスペリメント (プロンプトエクスペリメントとも呼ばれます) を実行することで、[プロンプト管理](/docs/prompt-management) の異なるプロンプトバージョンや言語モデルをテストし、結果を横並びで比較できます。

オプションで、[LLM-as-a-Judge エバリュエーター](/docs/evaluation/evaluation-methods/llm-as-a-judge) を使用して、期待される出力に基づいてレスポンスを自動的にスコアリングし、結果を集約レベルでさらに分析できます。

<Video
  src="https://static.langfuse.com/docs-videos/prompt-experiments.mp4"
  aspectRatio={16 / 9}
  title="UI 経由のエクスペリメント (プロンプトエクスペリメント) の概要"
/>

## なぜプロンプトエクスペリメントを使うのか?

- 異なるプロンプトバージョンやモデルを素早くテストする
- データセットを使用して異なるプロンプトバージョンやモデルをテストすることで、プロンプトテストを構造化する
- プロンプトエクスペリメントを通じてプロンプトを素早く反復する
- オプションで LLM-as-a-Judge エバリュエーターを使用して、データセットからの期待される出力に基づいてレスポンスをスコアリングする
- プロンプト変更時にテストを実行して、リグレッションを防ぐ

エクスペリメントは常にエクスペリメント実行時の最新のデータセットバージョンに対して実行されます。特定のデータセットバージョンに対してエクスペリメントを実行するサポートは、近日中に追加されます。

## 前提条件

<Steps>

### 使用可能なプロンプトを作成する

テストおよび評価したいプロンプトを作成します。[プロンプトの作成方法?](/docs/prompt-management/get-started)

<Callout type="info">
  **プロンプトが使用可能な状態とは:** エクスペリメントで使用されるデータセットの
  データセットアイテムキーと一致する変数がプロンプトに存在することです。以下の例を参照してください。
</Callout>

<Details>
<Summary>例: プロンプト変数とデータセットアイテムキーのマッピング</Summary>
<div className="grid md:grid-cols-1 gap-4">
<div>

<br />
**プロンプト:**

```bash You are a Langfuse expert. Answer based on:
{{ documentation }}

Question: {{question}}

```

</div>
<div>

<br />
**データセットアイテム:**

```json
{
  "documentation": "Langfuse is an LLM Engineering Platform",
  "question": "What is Langfuse?"
}
```

</div>
</div>

この例では:

- プロンプト変数 `{{documentation}}` は JSON キー `"documentation"` にマップされます
- プロンプト変数 `{{question}}` は JSON キー `"question"` にマップされます
- エクスペリメントが正常に実行されるためには、両方のキーがデータセットアイテムの入力 JSON に存在する必要があります

</Details>

<Details>
<Summary>例: チャットメッセージプレースホルダーのマッピング</Summary>

変数に加えて、チャットメッセージプロンプトのプレースホルダーをデータセットアイテムキーにマップすることもできます。
これは、例えばデータセットアイテムにチャットメッセージ履歴が含まれている場合に便利です。
チャットプロンプトには、名前付きのプレースホルダーを含める必要があります。プレースホルダー内の変数は解決されません。

**チャットプロンプト:**
プレースホルダー名: `message_history`

**データセットアイテム:**

```json
{
  "message_history": [
    {
      "role": "user",
      "content": "What is Langfuse?"
    },
    {
      "role": "assistant",
      "content": "Langfuse is a tool for tracking and analyzing the performance of language models."
    }
  ],
  "question": "What is Langfuse?"
}
```

この例では:

- チャットプロンプトのプレースホルダー `message_history` は JSON キー `"message_history"` にマップされます。
- プロンプト変数 `{{question}}` は、プレースホルダーメッセージ内ではない変数として JSON キー `"question"` にマップされます。
- エクスペリメントが正常に実行されるためには、両方のキーがデータセットアイテムの入力 JSON に存在する必要があります

</Details>

### 使用可能なデータセットを作成する

プロンプトエクスペリメントに使用したい入力と期待される出力を含むデータセットを作成します。[データセットの作成方法?](/docs/evaluation/dataset-runs/datasets)

<Callout type="info">
  **データセットが使用可能な状態とは:** [1] データセットアイテムが入力として JSON オブジェクトを持ち、
  [2] それらのオブジェクトのキーが使用するプロンプトのプロンプト変数と一致することです。以下の例を参照してください。
</Callout>

 <Details>
<Summary>例: プロンプト変数とデータセットアイテムキーのマッピング</Summary>
<div className="grid md:grid-cols-1 gap-4">
<div>

<br />
**プロンプト:**

```bash You are a Langfuse expert. Answer based on:
{{ documentation }}

Question: {{question}}

```

</div>
<div>

<br />
**データセットアイテム:**

```json
{
  "documentation": "Langfuse is an LLM Engineering Platform",
  "question": "What is Langfuse?"
}
```

</div>
</div>

この例では:

- プロンプト変数 `{{documentation}}` は JSON キー `"documentation"` にマップされます
- プロンプト変数 `{{question}}` は JSON キー `"question"` にマップされます
- エクスペリメントが正常に実行されるためには、両方のキーがデータセットアイテムの入力 JSON に存在する必要があります

</Details>

### LLM 接続の設定

プロンプトは各データセットアイテムに対して実行されるため、プロジェクト設定で LLM 接続を構成する必要があります。[LLM 接続の構成方法?](/docs/administration/llm-connection)

### オプション: LLM-as-a-judge のセットアップ

LLM-as-a-judge エバリュエーターを設定して、期待される出力に基づいてレスポンスをスコアリングできます。LLM-as-a-Judge のターゲットを "Experiment runs" に設定し、使用したいデータセットでフィルタリングするようにしてください。[LLM-as-a-judge のセットアップ方法?](/docs/evaluation/evaluation-methods/llm-as-a-judge)

</Steps>

## UI 経由のエクスペリメント (プロンプトエクスペリメント) をトリガーする

<Steps>
### データセットに移動する
エクスペリメントは現在、データセットの詳細ページから開始されます。

- **移動先:** `あなたのプロジェクト` > `Datasets`
- **クリック:** エクスペリメントを開始したいデータセット

<Frame fullWidth>
  ![新規エクスペリメントボタン](/images/docs/navigate-to-dataset.png)
</Frame>

### セットアップページを開く

セットアップページを開くために `Start Experiment` を **クリック** します

<Frame fullWidth>
  ![新規エクスペリメントボタン](/images/docs/trigger-process.png)
</Frame>

`prompt Experiment` の下の `Create` を **クリック** します

<Frame>![新規エクスペリメントボタン](/images/docs/trigger-process-2.png)</Frame>

### エクスペリメントの設定

1. エクスペリメント名を **設定** する
2. 使用したいプロンプトを **選択** する
   - 動的なコンテンツが 1 つだけの場合、静的なシステムプロンプトと動的なユーザーメッセージ (例: ユーザーメッセージ全体を変数として) を持つチャットプロンプトをお勧めします。これにより、動的なコンテンツをユーザーメッセージとしてマップできます。
   - 動的なコンテンツが複数ある場合、動的なコンテンツのそれぞれに対してプロンプト内に変数を作成することをお勧めします。これにより、動的なコンテンツを対応する変数にマップできます。
3. 使用したい LLM 接続を **設定または選択** する
4. 使用したいデータセットを **選択** する
5. **オプションで構造化出力を設定** - JSON スキーマレスポンス形式を強制するためにトグルオン
   - プロジェクトから既存のスキーマを選択するか、新規作成する
   - スキーマは [Playground](/docs/playground) で作成・保存され、ここで再利用できます
   - スキーマセレクターの横の目のアイコンを使用してスキーマを表示/編集する
6. **オプションで** 使用したいエバリュエーターを **選択** する
7. エクスペリメントをトリガーするために `Create` を **クリック** する

<Frame>![新規エクスペリメントボタン](/images/docs/configure_dataset_run.png)</Frame>

<Callout type="info">
  **構造化出力** は、LLM のレスポンスが特定の JSON スキーマに準拠することを保証します。
  これは、評価や下流の処理のために一貫性のある、解析可能な出力が必要な場合に便利です。
  Playground で定義した同じスキーマがエクスペリメントで使用できます。
</Callout>

これによりエクスペリメントがトリガーされ、エクスペリメントページにリダイレクトされます。プロンプトの複雑さとデータセットのサイズによって、ランが完了するまでに数秒から数分かかる場合があります。

### ランを比較する

各エクスペリメントランの後、エクスペリメントテーブルで集計スコアを確認し、結果を横並びで比較できます。リグレッション分析とマルチキャンディデート比較の詳細については、[AI エージェントの体系的な評価](/blog/2025-11-06-experiment-interpretation) のガイドを参照してください。

<Video
  src="https://static.langfuse.com/docs-videos/datasets-compare.mp4"
  aspectRatio={16 / 9}
  gifStyle
/>

</Steps>

## 関連リソース

- プロンプトのみのランではなく、完全なアプリケーションまたはエージェントロジック (カスタムランタイム構成を含む) を評価する必要がある場合は、[SDK 経由のエクスペリメント](/docs/evaluation/experiments/experiments-via-sdk) を使用してください。[Webhook](/docs/evaluation/experiments/experiments-via-sdk#configure-webhook) を使用して、UI から SDK ベースの評価ランをトリガーすることもできます。

## GitHub ディスカッション

import { Details, Summary } from "@/components/Details";
import { GhDiscussionsPreview } from "@/components/gh-discussions/GhDiscussionsPreview";

<GhDiscussionsPreview labels={["feat-prompt-experiments"]} />
