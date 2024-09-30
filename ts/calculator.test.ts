import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { calculate } from "./calculator.ts";

const tests = [
  {
    input: "1",
    expected: 1,
  },
  {
    input: "20",
    expected: 20
  },
  {
    input: "1 + 1",
    expected: 2,
  },
  {
    input: "1 * 1",
    expected: 1,
  },
  {
    input: "5 + 2 * 3",
    expected: 11,
  },
  {
    input: "(1 + 1) * (3 - 1)",
    expected: 4,
  },
  {
    input: "(1 + (2 * (3 + 4)))",
    expected: 15,
  }
];

tests.forEach(test => {
  Deno.test(test.input, () => {
    const actual = calculate(test.input);
    assertEquals(actual, test.expected);
  });
});
