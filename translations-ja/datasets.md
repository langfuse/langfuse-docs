---
title: データセット
description: Langfuse のデータセットを使って、LLM アプリケーションをテスト・ベンチマークするための構造化されたエクスペリメントを作成します。
sidebarTitle: データセット
---

# データセット

データセットは、入力と期待される出力のコレクションであり、アプリケーションをテストするために使用されます。[UI ベース](/docs/evaluation/experiments/experiments-via-ui) と [SDK ベース](/docs/evaluation/experiments/experiments-via-sdk) のどちらのエクスペリメントも Langfuse データセットをサポートしています。

_Langfuse データセットビュー_

<Frame fullWidth>![データセット](/images/docs/datasets-overview.png)</Frame>

## なぜデータセットを使うのか?

- 実際の本番トレースを使ってアプリケーションのテストケースを作成する
- チームと共同でデータセットアイテムを作成・収集する
- テストデータの単一の信頼できる情報源を持つ

## はじめに

<Steps>

### データセットの作成

データセットには、プロジェクト内で一意の名前があります。

import CreateDataset from "@/components-mdx/datasets-create-dataset.mdx";

<CreateDataset />

### データセットアイテムのアップロードまたは新規作成

入力とオプションで期待される出力を提供することで、データセットにデータセットアイテムを追加できます。お好みであれば、Langfuse UI の CSV アップローダーを使ってデータセットアイテムをインポートすることもできます。

import CreateDatasetItem from "@/components-mdx/datasets-create-dataset-item.mdx";

<CreateDatasetItem />
</Steps>

## データセットフォルダ

データセットは、似たようなユースケースのデータセットをグループ化するために、仮想フォルダに整理できます。
フォルダを作成するには、データセット名にスラッシュ (`/`) を追加します。UI は、`/` で終わるすべてのセグメントを自動的にフォルダとして表示します。

### フォルダ内のデータセットの作成と取得

Langfuse UI または SDK を使用して、データセット名にスラッシュ (`/`) を追加することで、フォルダ内のデータセットを作成および取得できます。

<LangTabs items={["Python SDK", "JS/TS SDK", "Langfuse UI"]}>
<Tab>

```python
dataset_name = "evaluation/qa-dataset"

# When creating a dataset, use the full dataset name
langfuse.create_dataset(
    name=dataset_name,
)

# When fetching a dataset in a folder, use the full dataset name
langfuse.get_dataset(
    name=dataset_name
)

```

これにより、`evaluation` という名前のフォルダ内に `qa-dataset` という名前のデータセットが作成・取得されます。完全なデータセット名は `evaluation/qa-dataset` のままです。

</Tab>
<Tab>

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

const datasetName = "evaluation/qa-dataset";
const encodedName = encodeURIComponent(datasetName); // "evaluation%2Fqa-dataset"

// When creating a dataset, use the full dataset name
await langfuse.dataset.create(datasetName);

// When fetching a dataset in a folder, use the encoded name
await langfuse.dataset.get(encodedName);
```

これにより、`evaluation` という名前のフォルダ内に `qa-dataset` という名前のデータセットが作成・取得されます。完全なデータセット名は `evaluation/qa-dataset` のままです。

</Tab>
<Tab>

UI では、データセットを作成し、name フィールドにスラッシュ (`/`) を使用してフォルダに整理します。フォルダに移動し、フォルダ名をクリックし、リスト内のデータセット名をクリックすることで取得します。

</Tab>
</LangTabs>

<Callout type="info">
  **URL エンコーディング**: API や JS/TS SDK のパスパラメータとしてスラッシュ付きのデータセット名を使用する場合は、URL エンコーディングを使用してください。例: TypeScript では `encodeURIComponent(name)`。
</Callout>

## バージョニング

Langfuse UI でデータセットバージョンにアクセスするには、**Datasets** > **特定のデータセットに移動** > **Items タブを選択** に移動してください。このページでは、バージョンビューをトグルできます。

データセットアイテムの `add`、`update`、`delete`、または `archive` のたびに、新しいデータセットバージョンが生成されます。バージョンはタイムスタンプを使用して時間経過に伴う変更を追跡します。

`GET` API はデフォルトで、クエリ時の最新バージョンを返します。`version` パラメータを使用して、特定のバージョンタイムスタンプでデータセットを取得できます。

バージョニングはデータセットアイテムにのみ適用され、データセットスキーマには適用されません。データセットスキーマの変更は新しいバージョンを作成しません。

### 特定のバージョンのデータセットを取得する

バージョンタイムスタンプを指定することで、特定の時点におけるデータセットの状態を取得できます。これは、そのタイムスタンプ時点で存在していたアイテムのみを返します。

<LangTabs items={["Python SDK", "JS/TS SDK", "Langfuse UI"]}>
<Tab>

```python
from langfuse import get_client
from datetime import datetime, timedelta

langfuse = get_client()

# Capture dataset state as of 2025-12-15 at 06:30:00 UTC
version_timestamp = datetime(2025, 12, 15, 6, 30, 0, tzinfo=timezone.utc)

# Fetch dataset at version timestamp
dataset_at_version = langfuse.get_dataset(
    name="my-dataset",
    version=version_timestamp
)

# Fetch latest version
dataset_latest = langfuse.get_dataset(name="my-dataset")
```

</Tab>
<Tab>

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

// Capture the timestamp (use item's createdAt)
const versionTimestamp = new Date("2025-12-15T06:30:00").toISOString();

// Fetch dataset at version timestamp
const datasetAtVersion = await langfuse.dataset.get("my-dataset", {
  version: versionTimestamp
});

// Fetch latest version
const datasetLatest = await langfuse.dataset.get("my-dataset");
```

</Tab>
<Tab>

すべてのデータセットバージョンを表示するには、**Datasets** → **データセットを選択** → **Items タブ** → **Version ビュー** をトグルしてください。

<Frame fullWidth>![データセットバージョンビュー](/images/docs/dataset-versioned-items.png)</Frame>

</Tab>
</LangTabs>

### バージョン付きデータセットでエクスペリメントを実行する

バージョン付きデータセットで直接エクスペリメントを実行できます。これは、異なるデータセットバージョンに対してモデルがどのようにパフォーマンスを発揮するかを比較したり、特定の時点のデータセット状態でエクスペリメント結果を再現したりするのに便利です。

<LangTabs items={["Python SDK", "JS/TS SDK", "Langfuse UI"]}>
<Tab>

```python
from datetime import timedelta
import time
from langfuse import Langfuse

langfuse = Langfuse()

version_timestamp = datetime(2025, 12, 15, 6, 30, 0, tzinfo=timezone.utc)

# Fetch versioned dataset
versioned_dataset = langfuse.get_dataset("qa-dataset", version=version_timestamp)

# Run experiment on the versioned dataset
def my_llm_application(*, item, **kwargs):
    # Your LLM application logic here
    # For this example, we'll just return the expected output
    return item.expected_output

result = versioned_dataset.run_experiment(
    name="Baseline Experiment v1",
    description="Running on dataset v1",
    task=my_llm_application
)
```

</Tab>
<Tab>

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

// Capture the version timestamp
const versionTimestamp = new Date("2025-12-15T06:30:00").toISOString();

// Fetch versioned dataset
const versionedDataset = await langfuse.dataset.get("qa-dataset", {
  version: versionTimestamp
});
// Run experiment on the versioned dataset
const result = await versionedDataset.runExperiment({
  name: "Baseline Experiment v1",
  description: "Running on dataset v1",
  task: async ({ item }) => {
    // Your LLM application logic here
    // For this example, we'll just return the expected output
    return item.expectedOutput;
  }
});
```

</Tab>
<Tab>

UI では、エクスペリメントを実行する際に特定のデータセットバージョンを選択できます:

1. **Experiments** → **Run Experiment** に移動
2. **Dataset Selection** ステップでデータセットを選択
3. **Dataset Version** ドロップダウンからバージョンを選択
4. ドロップダウンには利用可能なバージョンタイムスタンプが表示されます
5. エクスペリメントは、その特定の時点のデータセット状態に対して実行されます
6. バージョンを選択しなかった場合、エクスペリメントは最新バージョンに対して実行されます

<Frame fullWidth>![データセットバージョン選択](/images/docs/dataset-versioned-items.png)</Frame>

</Tab>
</LangTabs>

このアプローチにより、以下のことが可能になり再現性が保証されます:

- アイテムが更新または削除された後でも、過去のデータセットバージョンに対してエクスペリメントを再実行する
- データセット変更前後のモデルパフォーマンスを比較する
- エクスペリメントの一貫性を維持し、以前のランから正確な結果を再現する
- 同じベースラインのデータセットバージョンに対して改善をテストする

## スキーマ強制 (Schema Enforcement)

オプションで、データセットに JSON スキーマ検証を追加することで、すべてのデータセットアイテムが定義された構造に準拠することを保証できます。これにより、データ品質を維持し、エラーを早期に検出し、チーム間の一貫性を確保するのに役立ちます。

データセットを作成または更新するときに、`input` および/または `expectedOutput` フィールドの JSON スキーマを定義できます。一度設定すると、すべてのデータセットアイテムが自動的にこれらのスキーマに対して検証されます。有効なアイテムは受理され、無効なアイテムは検証の問題を示す詳細なエラーメッセージとともに拒否されます。

<LangTabs items={["Python SDK", "JS/TS SDK", "Langfuse UI"]}>
<Tab>

```python
langfuse.create_dataset(
    name="qa-conversations",
    input_schema={
        "type": "object",
        "properties": {
            "messages": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "role": {"type": "string", "enum": ["user", "assistant", "system"]},
                        "content": {"type": "string"}
                    },
                    "required": ["role", "content"]
                }
            }
        },
        "required": ["messages"]
    },
    expected_output_schema={
        "type": "object",
        "properties": {"response": {"type": "string"}},
        "required": ["response"]
    }
)
```

</Tab>
<Tab>

```typescript
await langfuse.createDataset({
  name: "qa-conversations",
  inputSchema: {
    type: "object",
    properties: {
      messages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            role: { type: "string", enum: ["user", "assistant", "system"] },
            content: { type: "string" }
          },
          required: ["role", "content"]
        }
      }
    },
    required: ["messages"]
  },
  expectedOutputSchema: {
    type: "object",
    properties: { response: { type: "string" } },
    required: ["response"]
  }
});
```

</Tab>
<Tab>

**Datasets** → **New Dataset** に移動するか、既存のデータセットを編集 → **Schema Validation** セクションを展開 → JSON スキーマを追加 → **Save** をクリックします。

</Tab>
</LangTabs>

## 合成データセットを作成する

データセットをブートストラップするためにアプリケーションをテストする合成例を作成したい場合がよくあります。LLM は、一般的な質問やタスクのプロンプトに対してこれらを生成するのに非常に優れています。

合成データセットの生成例については、このクックブックを参照してください:

import { FileCode } from "lucide-react";

<Cards num={1}>
  <Card
    title="Notebook: 合成データセット"
    href="/docs/evaluation/features/synthetic-datasets"
    icon={<FileCode />}
  />
</Cards>

## 本番データからアイテムを作成する

一般的なワークフローは、アプリケーションが期待通りに動作しなかった本番のトレースを選択することです。次に、エキスパートが期待される出力を追加し、新しいバージョンのアプリケーションを同じデータでテストできるようにします。

<LangTabs items={["Python SDK", "JS/TS SDK", "Langfuse UI"]}>
<Tab>

```python
langfuse.create_dataset_item(
    dataset_name="<dataset_name>",
    input={ "text": "hello world" },
    expected_output={ "text": "hello world" },
    # link to a trace
    source_trace_id="<trace_id>",
    # optional: link to a specific span, event, or generation
    source_observation_id="<observation_id>"
)
```

</Tab>
<Tab>

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

await langfuse.api.datasetItems.create({
  datasetName: "<dataset_name>",
  input: { text: "hello world" },
  expectedOutput: { text: "hello world" },
  // link to a trace
  sourceTraceId: "<trace_id>",
  // optional: link to a specific span, event, or generation
  sourceObservationId: "<observation_id>",
});
```

</Tab>
<Tab>
UI では、本番トレースの任意のオブザベーション (span、event、generation) で `+ Add to dataset` を使用します。

<Video
  src="https://static.langfuse.com/docs-videos/datasets-add-from-trace.mp4"
  aspectRatio={16 / 9}
  gifStyle
/>

</Tab>
</LangTabs>

## オブザベーションをデータセットに一括追加する

オブザベーションテーブルから直接、複数のオブザベーションをデータセットに一括追加できます。これは、本番データから素早くテストデータセットを構築するのに便利です。

フィールドマッピングシステムにより、オブザベーションデータがデータセットアイテムにどのように変換されるかを制御できます。フィールド全体をそのまま使用したり (例: オブザベーションの入力全体をデータセットアイテムの入力にマップする)、JSON パス式を使用して特定の値を抽出したり、複数のフィールドからカスタムオブジェクトを構築したりできます。

1. **Observations** テーブルに移動
2. フィルターを使って関連するオブザベーションを見つける
3. チェックボックスを使用してオブザベーションを選択
4. **Actions** → **Add to dataset** をクリック
5. 新しいデータセットを作成するか、既存のものを選択
6. オブザベーションデータがデータセットアイテムフィールドにどのようにマップされるかを制御するフィールドマッピングを設定
7. マッピングをプレビューして確認

バッチ操作は、部分的な成功をサポートしてバックグラウンドで実行されます。一部のオブザベーションがデータセットスキーマの検証に失敗した場合でも、有効なアイテムは追加され、エラーはレビューのためにログに記録されます。**Settings** → **Batch Actions** で進捗を監視できます。

## データセットアイテムの編集/アーカイブ

データセットアイテムを編集またはアーカイブできます。アイテムをアーカイブすると、将来のエクスペリメントランから除外されます。

<LangTabs items={["Python SDK", "JS/TS SDK", "Langfuse UI"]}>

<Tab>

更新したいアイテムの `id` を指定することで、アイテムを upsert できます。

```python
langfuse.create_dataset_item(
    id="<item_id>",
    # example: update status to "ARCHIVED"
    status="ARCHIVED"
)
```

</Tab>
<Tab>

更新したいアイテムの `id` を指定することで、アイテムを upsert できます。

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

await langfuse.api.datasetItems.create({
  id: "<item_id>",
  // example: update status to "ARCHIVED"
  status: "ARCHIVED",
});
```

</Tab>
<Tab>
UI では、アイテム ID をクリックしてアイテムを編集できます。アイテムをアーカイブまたは削除するには、アイテムの横のドットをクリックして `Archive` または `Delete` を選択します。

<Frame fullWidth>![アイテムの削除](/images/docs/dataset-delete-items.png)</Frame>

</Tab>
</LangTabs>

## データセットラン

データセットを作成したら、それに基づいてアプリケーションをテストおよび評価できます。

import { Table, WandSparkles, CodeXml, Database } from "lucide-react";

<Cards num={1}>

  <Card
    icon={<WandSparkles size="24" />}
    title="SDK 経由のエクスペリメント"
    href="/docs/evaluation/experiments/experiments-via-sdk"
    arrow
  />
  <Card
    icon={<CodeXml size="24" />}
    title="UI 経由のエクスペリメント"
    href="/docs/evaluation/experiments/experiments-via-ui"
    arrow
  />
</Cards>

[エクスペリメントのデータモデル](/docs/evaluation/experiments/data-model) について詳しく学べます。
