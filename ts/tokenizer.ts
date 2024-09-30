export type Token = OperatorToken | ParenthesisToken | NumericToken;
export type OperatorToken = "+" | "-" | "*" | "/";
export type ParenthesisToken = "(" | ")";
export type NumericToken = number;

// tokenizer
function tokenizeNumber(text: string): number {
  let end = 0;
  while (end < text.length && Numbers.includes(text[end])) {
    end++;
  }
  return parseInt(text.substring(0, end));
}

const Splitters = " \n\t";
const Parentheses = "()";
export const HighPriorityOperators = "*/";
const LowPriorityOperators = "+-";
export const Operators = HighPriorityOperators + LowPriorityOperators;
const Numbers = "0123456789";
export function tokenize(text: string): Token[] {
  const results: Token[] = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (Splitters.includes(char)) {
      continue;
    }
    if (Numbers.includes(char)) {
      const number = tokenizeNumber(text.substring(i));
      i += number.toString().length - 1;
      results.push(number);
      continue;
    }
    if (Operators.includes(char)) {
      results.push(char as "+" | "-" | "*" | "/");
      continue;
    }
    if (Parentheses.includes(char)) {
      results.push(char as "(" | ")");
      continue;
    }
    throw Error(`Tokenize error: Unexpected character "${char}"`);
  }
  return results;
}
