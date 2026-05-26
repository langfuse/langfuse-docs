---
title: CI/CD でのエクスペリメント
description: CI で Langfuse エクスペリメントを実行し、本番投入前に変更をゲートします。
---

# CI/CD でのエクスペリメント

CI/CD パイプラインで Langfuse エクスペリメントを使用して、品質のリグレッションを出荷前に検出します。

ワークフローは以下のとおりです:

1. テストケースを含む [Langfuse データセット](/docs/evaluation/experiments/datasets) を作成します。
2. データセットに対してアプリケーションをテストするエクスペリメントを [Python または JS/TS SDK](/docs/evaluation/experiments/experiments-via-sdk) で記述します。
3. タスクの出力をスコアリングする [エバリュエーター](/docs/evaluation/experiments/experiments-via-sdk#evaluators) を追加します。
4. スコアがしきい値に違反した場合に `RegressionError` を発生させます。
5. [langfuse/experiment-action](https://github.com/langfuse/experiment-action) でスクリプトを実行する GitHub Actions ワークフローを作成します。

## GitHub Actions ワークフロー

必要な [トリガー](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow) でワークフローを作成します。例えば `pull_request` や `release` などです。
アクションは [`langfuse/experiment-action` のリリース](https://github.com/langfuse/experiment-action/releases) のリリースにピン留めしてください。

アクションはデフォルトで最新の SDK バージョンをインストールします。特定の SDK バージョンを使いたい場合のみ、`python_sdk_version` または `js_sdk_version` を設定してください。

<Callout type="info">
  GitHub Action には Langfuse Python SDK v4.6.0+ または JS SDK v5.3.0+ が必要です。
</Callout>

```yaml title=".github/workflows/langfuse-experiment.yml"
name: Langfuse experiment gate

on:
  # Run the gate for every pull request. Change this to `push`, `release`, or another
  # trigger if you want to run experiments at a different point in your workflow.
  pull_request:

permissions:
  # Required to check out the repository.
  contents: read
  # Required to post or update the experiment result comment on pull requests.
  pull-requests: write
  # Optional: lets the result link to this specific job's logs.
  # Without this permission, the action falls back to the workflow-run URL.
  actions: read

jobs:
  experiment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      # Add this only if your experiments use the Python SDK
      - uses: actions/setup-python@v6
        with:
          python-version: "3.14"

      # Add this only if your experiments use the JS/TS SDK
      - uses: actions/setup-node@v6
        with:
          node-version: "24"

      - uses: langfuse/experiment-action@<release tag>
        with:
          # the credentials for Langfuse
          langfuse_public_key: ${{ secrets.LANGFUSE_PUBLIC_KEY }}
          langfuse_secret_key: ${{ secrets.LANGFUSE_SECRET_KEY }}
          langfuse_base_url: https://cloud.langfuse.com

          # the location of your experiment scripts
          experiment_path: experiments/support-agent-gate

          # the dataset to run the experiment against
          dataset_name: support-agent-regression-set

          # GitHub token so that the action can comment on PRs
          github_token: ${{ github.token }}
```

### エクスペリメント定義

アクションは、ワークフローで設定された `experiment_path` からエクスペリメントコードを実行します。

各スクリプトは、`context` パラメータを受け取る `experiment(context)` 関数を定義する必要があります。

このコンテキストは GitHub Action によって作成され、CI 固有のセットアップを処理してくれます:

- アクションの入力から Langfuse SDK クライアントを初期化する
- `dataset_name` からデータセットアイテムをロードし、`dataset_version` を適用する
- `langfuse.*` の下に、コミット SHA、ブランチ、ジョブ URL、アクターなどのデフォルトメタデータを追加する。これらの値は Langfuse UI で表示できます。

これらのデフォルトでエクスペリメントを実行するには、`context.runExperiment` (JS/TS) または `context.run_experiment` (Python) を使用します。

<LangTabs items={["Python SDK", "JS/TS SDK"]}>
<Tab>
{/* Python SDK */}

```python title="experiments/support-agent-gate.py"
from langfuse import RunnerContext
from langfuse.api import DatasetItem


# Define a task that calls your agent with each dataset item.
def my_task(item: DatasetItem, **kwargs):
    ...


def experiment(context: RunnerContext):
    return context.run_experiment(
        name="PR gate",
        task=my_task,
    )
```

</Tab>
<Tab>
{/* JS/TS SDK */}

```ts title="experiments/support-agent-gate.ts"
import type { ExperimentTaskParams, RunnerContext } from "@langfuse/client";

// Define a task that calls your agent with each dataset item.
async function myTask(item: ExperimentTaskParams) {
  // ...
}

export async function experiment(context: RunnerContext) {
  return await context.runExperiment({
    name: "PR gate",
    task: myTask,
  });
}
```

</Tab>
</LangTabs>

アクションが提供するデフォルト (`data` や `metadata` など) を上書きしたい場合は、`context.runExperiment` / `context.run_experiment` に明示的な値を渡してください。

### アクションの入力と出力

| 入力                          | 必須 | 説明                                                                                                                                                                                                                                                          |
| ------------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `langfuse_public_key`          | はい | SDK クライアントが使用する Langfuse パブリックキー。[GitHub Secret](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) として保存してください。                                                                          |
| `langfuse_secret_key`          | はい | SDK クライアントが使用する Langfuse シークレットキー。[GitHub Secret](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) として保存してください。                                                                          |
| `langfuse_base_url`            | いいえ | Langfuse ホスト。デフォルトは `https://cloud.langfuse.com`。他の Langfuse インスタンスを使用する場合は、[リージョンとセルフホストの URL](/docs/api-and-data-platform/features/public-api#public-api) を参照してください。                                                       |
| `experiment_path`              | はい | エクスペリメントスクリプトファイル、エクスペリメントスクリプトを含むディレクトリ、または glob パターンへのパス。Python、TypeScript、JavaScript をサポートします。                                                                                                       |
| `dataset_name`                 | いいえ | アクションによってロードされ、`RunnerContext` 経由で SDK に提供される Langfuse データセット。省略された場合、スクリプトは自身でデータを提供する必要があります。                                                                                                                |
| `dataset_version`              | いいえ | 再現可能な CI ランのためにデータセットバージョンを固定するためのオプションのタイムスタンプ。デフォルトは最新のデータセットバージョン。                                                                                                                                  |
| `experiment_metadata`          | いいえ | デフォルトの GitHub メタデータと一緒にエクスペリメントに追加される `key=value` メタデータ。このメタデータは Langfuse UI で表示できます。                                                                                                                                |
| `should_fail_on_regression`    | いいえ | エクスペリメントが `RegressionError` を発生させた場合に CI ジョブを失敗させます。デフォルトは `true`。                                                                                                                                                                  |
| `should_fail_on_script_error`  | いいえ | エクスペリメントスクリプトがクラッシュしたり、リグレッション以外のエラーを発生させたりした場合に CI ジョブを失敗させます。デフォルトは `true`。                                                                                                                          |
| `should_comment_on_pr`         | いいえ | エクスペリメントレポートを Pull Request コメントとして投稿または更新します。デフォルトは `true`。                                                                                                                                                                       |
| `python_sdk_version`           | いいえ | `.py` エクスペリメントのためにアクションがインストールする Langfuse Python SDK のバージョン。デフォルトは `latest`。v4.6.0 以上を使用してください。                                                                                                                       |
| `js_sdk_version`               | いいえ | TypeScript または JavaScript エクスペリメントのためにアクションがインストールする `@langfuse/client` のバージョン。デフォルトは `latest`。v5.3.0 以上を使用してください。                                                                                                |
| `should_skip_sdk_installation` | いいえ | このアクションの前に Python または Node 環境を自分で管理する場合、SDK のインストールをスキップします。TypeScript エクスペリメントの場合、`@langfuse/client`、`@langfuse/tracing`、`@langfuse/otel`、`@opentelemetry/sdk-node`、`tsx` を自分で提供してください。デフォルトは `false`。 |
| `github_token`                 | いいえ | PR コメントを投稿し、現在のジョブ URL を解決するために使用される GitHub トークン。両方をスキップするには空白にしてください。                                                                                                                                              |

入力の完全なリファレンスは、[`langfuse/experiment-action` README](https://github.com/langfuse/experiment-action/blob/main/README.md#inputs) を参照してください。

| 出力          | 説明                                                                                |
| ------------- | ----------------------------------------------------------------------------------- |
| `result_json` | 下流のワークフローステップ用に正規化された JSON 結果。                              |
| `failed`      | いずれかのエクスペリメントスクリプトがエラーになるか、リグレッションを発生させた場合は `true`。それ以外は `false`。 |

### リグレッション時に失敗させる

結果がワークフローをブロックすべき場合は、`RegressionError` を発生させてください。以下の例では、平均完全一致精度がしきい値を下回った場合に失敗します。

<LangTabs items={["Python SDK", "JS/TS SDK"]}>
<Tab>
{/* Python SDK */}

```python title="experiments/support-agent-gate.py"
from langfuse import Evaluation, RegressionError, RunnerContext


THRESHOLD = 0.95


def experiment(context: RunnerContext):
    result = context.run_experiment(
        name="PR gate: support agent",
        task=answer_support_question,
        evaluators=[exact_match],
        run_evaluators=[avg_accuracy],
    )

    accuracy = next(
        (
            evaluation.value
            for evaluation in result.run_evaluations
            if evaluation.name == "avg_accuracy"
        ),
        None,
    )

    if not isinstance(accuracy, (int, float)) or accuracy < THRESHOLD:
        raise RegressionError(
            # Attach the result so the action can include scores in the PR comment and `result_json` output.
            result=result,
            metric="avg_accuracy",
            value=float(accuracy) if isinstance(accuracy, (int, float)) else 0.0,
            threshold=THRESHOLD,
        )

    return result


def answer_support_question(item, **kwargs):
    # Replace this stub with your application logic.
    return item.input["question"]


def exact_match(*, output, expected_output, **kwargs):
    passed = output.strip() == (expected_output or "").strip()
    return Evaluation(
        name="exact_match",
        value=1.0 if passed else 0.0,
        comment="match" if passed else "mismatch",
    )


def avg_accuracy(*, item_results, **kwargs):
    scores = [
        evaluation.value
        for item in item_results
        for evaluation in item.evaluations
        if evaluation.name == "exact_match" and isinstance(evaluation.value, (int, float))
    ]
    return Evaluation(name="avg_accuracy", value=sum(scores) / len(scores) if scores else 0.0)
```

</Tab>
<Tab>
{/* JS/TS SDK */}

```ts title="experiments/support-agent-gate.ts"
import {
  RegressionError,
  type Evaluation,
  type ExperimentTaskParams,
  type RunnerContext,
} from "@langfuse/client";

const THRESHOLD = 0.95;

export async function experiment(context: RunnerContext) {
  const result = await context.runExperiment({
    name: "PR gate: support agent",
    task: answerSupportQuestion,
    evaluators: [exactMatch],
    runEvaluators: [avgAccuracy],
  });

  const accuracy = result.runEvaluations.find(
    (evaluation) => evaluation.name === "avg_accuracy",
  )?.value;

  if (typeof accuracy !== "number" || accuracy < THRESHOLD) {
    throw new RegressionError({
      // Attach the result so the action can include scores in the PR comment and `result_json` output.
      result,
      metric: "avg_accuracy",
      value: typeof accuracy === "number" ? accuracy : 0,
      threshold: THRESHOLD,
    });
  }

  return result;
}

async function answerSupportQuestion(item: ExperimentTaskParams) {
  const { question } = item.input as { question: string };

  // Replace this with your application logic, for example calling your agent.
  return await supportAgent(question);
}

async function supportAgent(question: string) {
  return question;
}

async function exactMatch({
  output,
  expectedOutput,
}: {
  output: string;
  expectedOutput?: string;
}): Promise<Evaluation> {
  const passed = output.trim() === expectedOutput?.trim();
  return { name: "exact_match", value: passed ? 1 : 0 };
}

async function avgAccuracy({
  itemResults,
}: {
  itemResults: Array<{ evaluations: Evaluation[] }>;
}): Promise<Evaluation> {
  const scores = itemResults
    .flatMap((item) => item.evaluations)
    .filter((evaluation) => evaluation.name === "exact_match")
    .map((evaluation) => Number(evaluation.value))
    .filter((score) => Number.isFinite(score));

  return {
    name: "avg_accuracy",
    value: scores.length
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0,
  };
}
```

</Tab>
</LangTabs>

### アクションの出力

`github_token` が提供され、ワークフローに `pull-requests: write` が設定されている場合、アクションは以下を含む Pull Request コメントを投稿または更新します:

- エクスペリメントスクリプトごとの合格・リグレッション・スクリプトエラーステータス
- `avg_accuracy` などのラン単位のスコア
- GitHub Action ランへのリンク
- データセットベースのランの場合、Langfuse のエクスペリメント比較ビューへのリンク
- アイテムの出力とアイテム単位のスコアのコンパクトなテーブル

同じ正規化されたデータが `result_json` アクション出力として利用可能です。後続のワークフローステップが結果をアーティファクトとしてアップロードしたり、Slack 通知を送信したり、別のレポートシステムにフィードしたりする必要がある場合にこれを使用してください。出力スキーマは [`langfuse/experiment-action` リポジトリ](https://github.com/langfuse/experiment-action/blob/main/schemas/result-json.v1.schema.json) で利用できます。

```yaml title=".github/workflows/langfuse-experiment.yml"
- uses: langfuse/experiment-action@<release tag>
  id: experiment
  with:
    # ...

- name: Store experiment result
  if: always()
  env:
    RESULT_JSON: ${{ steps.experiment.outputs.result_json }}
  run: printf '%s' "$RESULT_JSON" > experiment-result.json
```

### 追加のシークレット

エクスペリメントにプロバイダーキーやその他のシークレットが必要な場合は、それらをアクションステップの環境変数として設定してください。エクスペリメントのサブプロセスはステップの環境を継承します。

```yaml title=".github/workflows/langfuse-experiment.yml"
- uses: langfuse/experiment-action@<release tag>
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  with:
    langfuse_public_key: ${{ secrets.LANGFUSE_PUBLIC_KEY }}
    langfuse_secret_key: ${{ secrets.LANGFUSE_SECRET_KEY }}
    experiment_path: experiments/support-agent-gate
    dataset_name: support-agent-regression-set
```

エクスペリメントは、Python では `os.environ[...]`、TypeScript および JavaScript では `process.env...` からこれらの値を読み取ることができます。詳細は [`langfuse/experiment-action` README](https://github.com/langfuse/experiment-action/blob/main/README.md#how-do-i-pass-extra-secrets-openai-keys-etc-to-my-experiment) を参照してください。

## その他の CI/CD システム [#other-cicd-systems]

Pytest や Vitest などのテストフレームワークとエクスペリメントランナーを統合して、CI パイプラインで自動評価を実行します。エバリュエーターを使用して、エクスペリメント結果に基づいてテストを失敗させるアサーションを作成します。

<LangTabs items={["Python SDK", "JS/TS SDK"]}>
<Tab>
{/* PYTHON SDK */}

```python title="test_geography_experiment.py"
import pytest
from langfuse import get_client, Evaluation
from langfuse.openai import OpenAI

# Test data for European capitals
test_data = [
    {"input": "What is the capital of France?", "expected_output": "Paris"},
    {"input": "What is the capital of Germany?", "expected_output": "Berlin"},
    {"input": "What is the capital of Spain?", "expected_output": "Madrid"},
]

def geography_task(*, item, **kwargs):
    """Task function that answers geography questions"""
    question = item["input"]
    response = OpenAI().chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": question}]
    )
    return response.choices[0].message.content

def accuracy_evaluator(*, input, output, expected_output, **kwargs):
    """Evaluator that checks if the expected answer is in the output"""
    if expected_output and expected_output.lower() in output.lower():
        return Evaluation(name="accuracy", value=1.0)

    return Evaluation(name="accuracy", value=0.0)

def average_accuracy_evaluator(*, item_results, **kwargs):
    """Run evaluator that calculates average accuracy across all items"""
    accuracies = [
        evaluation.value for result in item_results
        for evaluation in result.evaluations if evaluation.name == "accuracy"
    ]

    if not accuracies:
        return Evaluation(name="avg_accuracy", value=None)

    avg = sum(accuracies) / len(accuracies)

    return Evaluation(name="avg_accuracy", value=avg, comment=f"Average accuracy: {avg:.2%}")

@pytest.fixture
def langfuse_client():
    """Initialize Langfuse client for testing"""
    return get_client()

def test_geography_accuracy_passes(langfuse_client):
    """Test that passes when accuracy is above threshold"""
    result = langfuse_client.run_experiment(
        name="Geography Test - Should Pass",
        data=test_data,
        task=geography_task,
        evaluators=[accuracy_evaluator],
        run_evaluators=[average_accuracy_evaluator]
    )

    # Access the run evaluator result directly
    avg_accuracy = next(
        (
            evaluation.value
            for evaluation in result.run_evaluations
            if evaluation.name == "avg_accuracy"
        ),
        None,
    )

    # Assert minimum accuracy threshold
    assert isinstance(avg_accuracy, (int, float)) and avg_accuracy >= 0.8, (
        f"Average accuracy {avg_accuracy} below threshold 0.8"
    )

def test_geography_accuracy_fails(langfuse_client):
    """Example test that demonstrates failure conditions"""
    # Use a weaker model or harder questions to demonstrate test failure
    def failing_task(*, item, **kwargs):
        # Simulate a task that gives wrong answers
        return "I don't know"

    result = langfuse_client.run_experiment(
        name="Geography Test - Should Fail",
        data=test_data,
        task=failing_task,
        evaluators=[accuracy_evaluator],
        run_evaluators=[average_accuracy_evaluator]
    )

    # Access the run evaluator result directly
    avg_accuracy = next(
        (
            evaluation.value
            for evaluation in result.run_evaluations
            if evaluation.name == "avg_accuracy"
        ),
        None,
    )

    # This test will fail because the task gives wrong answers
    with pytest.raises(AssertionError):
        assert isinstance(avg_accuracy, (int, float)) and avg_accuracy >= 0.8, (
            f"Expected test to fail with low accuracy: {avg_accuracy}"
        )
```

</Tab>
<Tab>
{/* JS/TS SDK */}

```typescript title="test/geography-experiment.test.ts"
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { OpenAI } from "openai";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseClient, ExperimentItem } from "@langfuse/client";
import { observeOpenAI } from "@langfuse/openai";
import { LangfuseSpanProcessor } from "@langfuse/otel";

// Test data for European capitals
const testData: ExperimentItem[] = [
  { input: "What is the capital of France?", expectedOutput: "Paris" },
  { input: "What is the capital of Germany?", expectedOutput: "Berlin" },
  { input: "What is the capital of Spain?", expectedOutput: "Madrid" },
];

let otelSdk: NodeSDK;
let langfuse: LangfuseClient;

beforeAll(async () => {
  // Initialize OpenTelemetry
  otelSdk = new NodeSDK({ spanProcessors: [new LangfuseSpanProcessor()] });
  otelSdk.start();

  // Initialize Langfuse client
  langfuse = new LangfuseClient();
});

afterAll(async () => {
  // Clean shutdown
  await otelSdk.shutdown();
});

const geographyTask = async (item: ExperimentItem) => {
  const question = item.input;
  const response = await observeOpenAI(new OpenAI()).chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: question }],
  });

  return response.choices[0].message.content;
};

const accuracyEvaluator = async ({ input, output, expectedOutput }) => {
  if (
    expectedOutput &&
    output.toLowerCase().includes(expectedOutput.toLowerCase())
  ) {
    return { name: "accuracy", value: 1 };
  }
  return { name: "accuracy", value: 0 };
};

const averageAccuracyEvaluator = async ({ itemResults }) => {
  // Calculate average accuracy across all items
  const accuracies = itemResults
    .flatMap((result) => result.evaluations)
    .filter((evaluation) => evaluation.name === "accuracy")
    .map((evaluation) => evaluation.value as number);

  if (accuracies.length === 0) {
    return { name: "avg_accuracy", value: null };
  }

  const avg = accuracies.reduce((sum, val) => sum + val, 0) / accuracies.length;
  return {
    name: "avg_accuracy",
    value: avg,
    comment: `Average accuracy: ${(avg * 100).toFixed(1)}%`,
  };
};

describe("Geography Experiment Tests", () => {
  it("should pass when accuracy is above threshold", async () => {
    const result = await langfuse.experiment.run({
      name: "Geography Test - Should Pass",
      data: testData,
      task: geographyTask,
      evaluators: [accuracyEvaluator],
      runEvaluators: [averageAccuracyEvaluator],
    });

    // Access the run evaluator result directly
    const avgAccuracy = result.runEvaluations.find(
      (evaluation) => evaluation.name === "avg_accuracy",
    )?.value as number;

    // Assert minimum accuracy threshold
    expect(avgAccuracy).toBeGreaterThanOrEqual(0.8);
  }, 30_000); // 30 second timeout for API calls

  it("should fail when accuracy is below threshold", async () => {
    // Task that gives wrong answers to demonstrate test failure
    const failingTask = async (item: ExperimentItem) => {
      return "I don't know";
    };

    const result = await langfuse.experiment.run({
      name: "Geography Test - Should Fail",
      data: testData,
      task: failingTask,
      evaluators: [accuracyEvaluator],
      runEvaluators: [averageAccuracyEvaluator],
    });

    // Access the run evaluator result directly
    const avgAccuracy = result.runEvaluations.find(
      (evaluation) => evaluation.name === "avg_accuracy",
    )?.value as number;

    // This test will fail because the task gives wrong answers
    expect(() => {
      expect(avgAccuracy).toBeGreaterThanOrEqual(0.8);
    }).toThrow();
  }, 30_000);
});
```

</Tab>
</LangTabs>

これらの例は、エクスペリメントランナーの評価結果を使用して、CI パイプラインで意味のあるテストアサーションを作成する方法を示しています。精度が許容可能なしきい値を下回ったときにテストを失敗させることで、モデルの品質基準を自動的に維持できます。
