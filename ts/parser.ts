import { HighPriorityOperators, type NumericToken, type OperatorToken, type Token } from "./tokenizer.ts";

export type Tokens = NumericToken | OperatorToken | Tokens[];

type Numeric = {
  type: "Numeric";
  value: number;
};

interface Operation {
  type: "Expression";
  left: Expression;
  operator: "+" | "-" | "*" | "/";
  right: Expression;
}

export type Expression = Operation | Numeric;
export function expandParentheses(tokens: Token[]): [Tokens[], number] {
  const results: Tokens[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "(") {
      const [nestedTokens, end] = expandParentheses(tokens.slice(i + 1));
      results.push(nestedTokens);
      i = end + i;
      continue;
    }
    if (token === ")") {
      return [results, i + 1];
    }
    results.push(token);
  }
  return [results, 0];
}

export function expandHighPriorityOperator(tokens: Tokens[]): Tokens[] {
  const results: Tokens[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (HighPriorityOperators.includes(token as string)) {
      const left = results.pop()!;
      const operator = token;
      const right = tokens[i + 1];
      results.push([left, operator, right]);
      i += 1;
      continue;
    }
    if (Array.isArray(token)) {
      const newToken = expandHighPriorityOperator(token);
      results.push(newToken);
      continue;
    }
    results.push(token);
  }
  return results;
}

function parseExpression(tokens: Tokens): Expression {
  if (typeof tokens === "number") {
    return {
      type: "Numeric",
      value: tokens,
    }
  }
  if (Array.isArray(tokens)) {
    const rest = tokens = [...tokens]
    const rightToken = rest.pop();
    if (rightToken == null) {
      throw Error(`Tokens must have 3 or more element. but tokens has: ${JSON.stringify(rest)}`)
    }
    const right = parseExpression(rightToken);
    const operatorToken = rest.pop();
    if (operatorToken == null) {
      return right;
    }
    const left = parseExpression(rest);
    return {
      type: "Expression",
      left: left,
      operator: operatorToken as OperatorToken,
      right: right,
    }
  } else {
    throw Error(`Tokens must be array of number. but was: ${JSON.stringify(tokens)}`);
  }
}

export function parse(tokens: Token[]): Expression {
  const [nestedTokensByParen] = expandParentheses(tokens);
  const nestedTokenByOperator = expandHighPriorityOperator(nestedTokensByParen);
  return parseExpression(nestedTokenByOperator);
}
