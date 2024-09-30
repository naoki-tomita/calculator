import { execute } from "./executor.ts";
import { parse } from "./parser.ts";
import { tokenize } from "./tokenizer.ts";

export function calculate(formula: string): number {
  const tokens = tokenize(formula);
  const ast = parse(tokens);
  return execute(ast);
}
