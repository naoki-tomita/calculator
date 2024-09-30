import type { Expression } from "./parser.ts";

export function execute(expression: Expression): number {
  if (expression.type === "Numeric") {
    return expression.value;
  }
  const left = execute(expression.left);
  const right = execute(expression.right);
  switch (expression.operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
  }
}
