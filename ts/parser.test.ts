import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { parse, expandParentheses, expandHighPriorityOperator } from "./parser.ts";

const expandParenthesesTests: Array<{
  test: string;
  // deno-lint-ignore no-explicit-any
  input: any[];
  // deno-lint-ignore no-explicit-any
  expected: any;
}> = [
  {
    test: "数字のみ",
    input: [1],
    expected: [1]
  },
  {
    test: "加算",
    input: [1, "+", 2],
    expected: [1, "+", 2],
  },
  {
    test: "乗算",
    input: [1, "*", 2],
    expected: [1, "*", 2],
  },
  {
    test: "かっこ",
    input: ["(", 2, "+", 3, ")"],
    expected: [[2, "+", 3]]
  },
  {
    test: "複数のかっこ",
    input: ["(", 2, "+", 3, ")", "*", "(", 4, "-", 5, ")"],
    expected: [[2, "+", 3], "*", [4, "-", 5]]
  },
  {
    test: "かっこの中にかっこ",
    input: [1, "+", "(", "(", 2, "+", 3, ")", "*", 4, ")"],
    expected: [1, "+", [[2, "+", 3], "*", 4]]
  },
  {
    test: "四則演算",
    input: [1, "+", 2, "*", 3, "-", 4, "/", 5],
    expected: [1, "+", 2, "*", 3, "-", 4, "/", 5],
  }
];

expandParenthesesTests.forEach(test => {
  Deno.test(`#expandParentheses ${test.test}`, () => {
    const [actual] = expandParentheses(test.input);
    assertEquals(actual, test.expected);
  });
});

const expandHighPriorityOperatorTests: Array<{
  test: string;
  // deno-lint-ignore no-explicit-any
  input: any[];
  // deno-lint-ignore no-explicit-any
  expected: any;
}> = [
  {
    test: "数字のみ",
    input: [1],
    expected: [1]
  },
  {
    test: "加算",
    input: [1, "+", 2],
    expected: [1, "+", 2],
  },
  {
    test: "乗算",
    input: [1, "*", 2],
    expected: [[1, "*", 2]],
  },
  {
    test: "かっこ",
    input: [[2, "+", 3]],
    expected: [[2, "+", 3]]
  },
  {
    test: "複数のかっこ",
    input: [[2, "+", 3], "*", [4, "-", 5]],
    expected: [[[2, "+", 3], "*", [4, "-", 5]]],
  },
  {
    test: "かっこの中にかっこ",
    input: [1, "+", [[2, "+", 3], "*", 4]],
    expected: [1, "+", [[[2, "+", 3], "*", 4]]]
  },
  {
    test: "四則演算",
    input: [1, "+", 2, "*", 3, "-", 4, "/", 5],
    expected: [1, "+", [2, "*", 3], "-", [4, "/", 5]],
  }
];

expandHighPriorityOperatorTests.forEach(test => {
  Deno.test(`#expandHighPriorityOperator ${test.test}`, () => {
    const actual = expandHighPriorityOperator(test.input);
    assertEquals(actual, test.expected);
  });
});

const tests: Array<{
  test: string;
  // deno-lint-ignore no-explicit-any
  input: any[];
  // deno-lint-ignore no-explicit-any
  expected: any;
}> = [
  {
    test: "数字のみ",
    input: [1],
    expected: { type: "Numeric", value: 1 }
  },
  {
    test: "加算",
    input: [1, "+", 2],
    expected: {
      type: "Expression",
      operator: "+",
      left: { type: "Numeric", value: 1 },
      right: { type: "Numeric", value: 2 }
    }
  },
  {
    test: "乗算",
    input: [1, "*", 2],
    expected: {
      type: "Expression",
      operator: "*",
      left: { type: "Numeric", value: 1 },
      right: { type: "Numeric", value: 2 }
    }
  },
  {
    test: "乗算と加算の優先度",
    input: [1, "+", 2, "*", 3],
    expected: {
      type: "Expression",
      operator: "+",
      left: { type: "Numeric", value: 1 },
      right: {
        type: "Expression",
        operator: "*",
        left: { type: "Numeric", value: 2 },
        right: { type: "Numeric", value: 3 }
      },
    }
  },
  {
    test: "かっこ",
    input: ["(", 2, "+", 3, ")"],
    expected: {
      type: "Expression",
      operator: "+",
      left: { type: "Numeric", value: 2 },
      right: { type: "Numeric", value: 3 }
    },
  },
  {
    test: "複数のかっこ",
    input: ["(", 2, "+", 3, ")", "*", "(", 4, "-", 5, ")"],
    expected: {
      type: "Expression",
      operator: "*",
      left: {
        type: "Expression",
        operator: "+",
        left: { type: "Numeric", value: 2 },
        right: { type: "Numeric", value: 3 }
      },
      right: {
        type: "Expression",
        operator: "-",
        left: { type: "Numeric", value: 4 },
        right: { type: "Numeric", value: 5 }
      }
    }
  },
  {
    test: "かっこの中にかっこ",
    input: [1, "+", "(", "(", 2, "+", 3, ")", "*", 4, ")"],
    expected: {
      type: "Expression",
      operator: "+",
      left: { type: "Numeric", value: 1 },
      right: {
        type: "Expression",
        operator: "*",
        left: {
          type: "Expression",
          operator: "+",
          left: { type: "Numeric", value: 2 },
          right: { type: "Numeric", value: 3 }
        },
        right: { type: "Numeric", value: 4 }
      }
    }
  },
  {
    test: "四則演算",
    input: [1, "+", 2, "*", 3, "-", 4, "/", 5],
    expected: {
      type: "Expression",
      operator: "-",
      left: {
        type: "Expression",
        operator: "+",
        left: { type: "Numeric", value: 1 },
        right: {
          type: "Expression",
          operator: "*",
          left: { type: "Numeric", value: 2 },
          right: { type: "Numeric", value: 3 }
        }
      },
      right: {
        type: "Expression",
        operator: "/",
        left: { type: "Numeric", value: 4 },
        right: { type: "Numeric", value: 5 }
      }
    }
  },
];

tests.forEach(test => {
  Deno.test(`#parse: ${test.test}`, () => {
    const actual = parse(test.input);
    assertEquals(actual, test.expected);
  });
});
