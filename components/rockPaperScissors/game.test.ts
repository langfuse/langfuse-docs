import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fallbackMove, parsePlayMove } from "./game";

describe("parsePlayMove", () => {
  it("reads a complete play_move payload", () => {
    assert.deepEqual(
      parsePlayMove({ move: "rock", predicted_user_move: "scissors" }),
      { move: "rock", predictedUserMove: "scissors" },
    );
  });

  it("keeps the move when the prediction is missing", () => {
    assert.deepEqual(parsePlayMove({ move: "paper" }), {
      move: "paper",
      predictedUserMove: null,
    });
  });

  it("rejects payloads without a valid move", () => {
    assert.equal(parsePlayMove({ predicted_user_move: "rock" }), null);
    assert.equal(parsePlayMove({ move: "laser" }), null);
    assert.equal(parsePlayMove(null), null);
    assert.equal(parsePlayMove("paper"), null);
  });
});

describe("fallbackMove", () => {
  it("rotates so a timed-out round 1 is not always the same throw", () => {
    assert.equal(fallbackMove(1), "scissors");
    assert.equal(fallbackMove(2), "paper");
    assert.equal(fallbackMove(3), "rock");
  });
});
