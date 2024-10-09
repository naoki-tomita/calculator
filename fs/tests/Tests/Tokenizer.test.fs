module Tests

open Expecto

[<Tests>]
let tests =
  testList "Tokenizer" [
    testList "tokenize" [
      test "数字のみ" {
        Expect.equal (Tokenizer.tokenize "1") [Tokenizer.Numeric 1] "Error"
      }
      test "2桁以上の数字" {
        Expect.equal (Tokenizer.tokenize "12") [Tokenizer.Numeric 12] "Error"
      }
      test "加算" {
        let actual: Tokenizer.Token list = [Tokenizer.Numeric 1; Tokenizer.Operator Tokenizer.Add; Tokenizer.Numeric 12]
        Expect.equal (Tokenizer.tokenize "1+1") actual "Error"
      }
    ]
  ]
