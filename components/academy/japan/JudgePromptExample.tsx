const SEGMENTS: { name: string; text: string }[] = [
  {
    name: "コンテキスト",
    text: `あなたは賃貸物件アシスタントの返答を評価します。このアシスタントは、コンテキストとして渡された物件情報をもとに回答します。空室状況のカレンダーは持たず、内見の予約を自分で入れることもできません。`,
  },
  {
    name: "基準は1つだけ",
    text: `基準: 返答は、渡されたコンテキストにある事実だけを述べること。具体的な情報 (時刻、価格、空室状況) を作り出している返答は、たとえ親切に見えても不合格とする。文体や書式は評価しない。`,
  },
  {
    name: "ラベル付きの例",
    text: `例 (不合格):
ユーザー: 「7月1日から入居できる2ベッドルームはありますか?」
返答: 「はい、2ベッドルームをご用意できます。内見は14時でいかがでしょうか。」
理由: コンテキストに内見の時刻は含まれていない。「14時」は作り出された情報。
判定: fail

例 (合格):
ユーザー: 「ペットの規約はどうなっていますか?」
返答: 「40 lbs 以下の犬猫は、デポジット $300 でご入居いただけます。」
理由: 述べられている事実 (犬猫、40 lbs、$300) はすべてコンテキストにある。
判定: pass`,
  },
  {
    name: "理由が先、判定が後",
    text: `以下の返答を評価してください。まず理由を書き、最後に次のいずれか 1 つだけを出力してください:`,
  },
  {
    name: "逃げ道を用意",
    text: `pass、fail、unknown。`,
  },
];

export function JudgePromptExample() {
  return (
    <figure
      className="judge-prompt not-prose"
      aria-label="判定用プロンプトの例と、その各部分の注釈"
    >
      <div className="judge-prompt__frame">
        {SEGMENTS.map((segment) => (
          <div className="judge-prompt__row" key={segment.name}>
            <div className="judge-prompt__gutter">
              <span className="judge-prompt__name">{segment.name}</span>
            </div>
            <div className="judge-prompt__text">{segment.text}</div>
          </div>
        ))}
      </div>

      <style>{`
        .judge-prompt {
          margin: 16px 0;
          width: 100%;
        }

        .judge-prompt__frame {
          border: 1px solid var(--line-structure);
          background: var(--surface-bg);
          border-radius: 2px;
        }

        .judge-prompt__row {
          display: grid;
          grid-template-columns: 92px 1fr;
        }

        @media (min-width: 641px) {
          .judge-prompt__row {
            grid-template-columns: 148px 1fr;
          }
        }

        .judge-prompt__row + .judge-prompt__row {
          border-top: 1px dashed var(--line-divider-dash);
        }

        .judge-prompt__gutter {
          border-right: 1px dashed var(--line-divider-dash);
          padding: 10px 10px 11px 14px;
        }

        .judge-prompt__name {
          display: block;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          line-height: 1.5;
          color: var(--text-tertiary);
        }

        .judge-prompt__text {
          padding: 10px 14px 11px;
          font-family: var(--font-mono);
          font-size: 12px;
          line-height: 1.7;
          color: var(--text-secondary);
          white-space: pre-line;
          max-width: 620px;
        }
      `}</style>
    </figure>
  );
}
