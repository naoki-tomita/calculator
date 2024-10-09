module Tokenizer

open System

type Operator =
  | Add
  | Sub
  | Mul
  | Div
type Token =
  | Numeric of int
  | Operator of Operator
type Tokens = Token list

let op(c: char) =
  match c with
  | '+' -> Add
  | '-' -> Sub
  | '*' -> Mul
  | '/' -> Div
  | _ -> failwith "Unknown operator"

let tokenize(text: string): Tokens =
  let rec parse acc current chars =
    match chars with
    | [] when current <> "" ->
      (Numeric(int current))::acc |> List.rev
    | [] ->
      acc |> List.rev
    | c::rest when Char.IsDigit c ->
      parse acc (current + c.ToString()) rest
    | c::rest when current <> "" ->
      parse ((Numeric(int current))::(c |> op |> Operator)::acc) "" rest
    | c::rest ->
      parse ((c |> op |> Operator)::acc) "" rest

  text.ToCharArray()
    |> Array.toList
    |> parse [] ""
