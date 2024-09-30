import { execute } from "./executor.ts";
import { parse } from "./parser.ts";
import { tokenize } from "./tokenizer.ts";

function main() {
  const formula = "(1 + 2) * ((3 - 4) - 1)";
  console.log(formula);
  const tokens = tokenize(formula);
  console.log(tokens);
  const ast = parse(tokens);
  console.log(ast);
  const result = execute(ast);
  console.log(result);
}

main();
