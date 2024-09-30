import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { tokenize } from "./tokenizer.ts";

const tests = [
  {
    test: "数字のみ",
    input: "1",
    expected: [1],
  },
  {
    test: "2桁以上の数字",
    input: "12",
    expected: [12],
  },
  {
    test: "加算",
    input: "1 + 2",
    expected: [1, "+", 2],
  },
  {
    test: "乗算",
    input: "1 * 2",
    expected: [1, "*", 2],
  },
  {
    test: "減算",
    input: "1 - 2",
    expected: [1, "-", 2],
  },
  {
    test: "除算",
    input: "1 / 2",
    expected: [1, "/", 2],
  },
  {
    test: "加算と乗算",
    input: "1 + 2 * 3",
    expected: [1, "+", 2, "*", 3],
  },
  {
    test: "括弧",
    input: "(1 + 2) * 3",
    expected: ["(", 1, "+", 2, ")", "*", 3],
  }
];

tests.forEach(test => {
  Deno.test(`#tokenize: ${test.test}`, () => {
    const actual = tokenize(test.input);
    assertEquals(actual, test.expected);
  });
});
