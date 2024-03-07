import assert from 'assert'
import { FixTokens } from './FixTokens.ts'
import { lexer } from './lexer.ts'

function kinds(expr: string): FixTokens[] {
  let lexed = lexer.parse(expr)
  const result: FixTokens[] = []
  while (lexed !== undefined) {
    result.push(lexed.kind)
    lexed = lexed.next
  }
  return result
}
function lex(expr: string): string[] {
  let lexed = lexer.parse(expr)
  const result: string[] = []
  while (lexed !== undefined) {
    result.push(lexed.text)
    lexed = lexed.next
  }
  return result
}

test(`string literals`, () => {
  assert.deepEqual(kinds('is id with any empty all count'), [
    FixTokens.IS,
    FixTokens.ID,
    FixTokens.With,
    FixTokens.Any,
    FixTokens.Empty,
    FixTokens.All,
    FixTokens.Count,
  ])
  assert.deepEqual(kinds('not and or limit sort asc desc'), [
    FixTokens.Not,
    FixTokens.And,
    FixTokens.Or,
    FixTokens.Limit,
    FixTokens.Sort,
    FixTokens.Asc,
    FixTokens.Desc,
  ])
  assert.deepEqual(kinds('in true false null'), [FixTokens.In, FixTokens.True, FixTokens.False, FixTokens.Null])
})

test(`punctuation literals`, () => {
  assert.deepEqual(kinds('[] {} () '), [
    FixTokens.LBracket,
    FixTokens.RBracket,
    FixTokens.LCurly,
    FixTokens.RCurly,
    FixTokens.LParen,
    FixTokens.RParen,
  ])
  assert.deepEqual(kinds(';. .. , :'), [FixTokens.Semicolon, FixTokens.Dot, FixTokens.DotDot, FixTokens.Comma, FixTokens.Colon])
  assert.deepEqual(kinds('+ - * / = ~'), [
    FixTokens.Plus,
    FixTokens.Minus,
    FixTokens.Star,
    FixTokens.Slash,
    FixTokens.Equal,
    FixTokens.Tilde,
  ])
  assert.deepEqual(kinds('!= < > <= >='), [
    FixTokens.NotEqual,
    FixTokens.LessThan,
    FixTokens.GreaterThan,
    FixTokens.LessThanEqual,
    FixTokens.GreaterThanEqual,
  ])
  assert.deepEqual(kinds('<- ->'), [FixTokens.Inbound, FixTokens.Outbound])
})

test(`number literals`, () => {
  assert.deepEqual(kinds('1 +1234 -123 1.0 +1.345345 -123.3123'), [
    FixTokens.Integer,
    FixTokens.Integer,
    FixTokens.Integer,
    FixTokens.Float,
    FixTokens.Float,
    FixTokens.Float,
  ])
  assert.deepEqual(lex('1 +1234 -123 1.0 +1.345345 -123.3123'), [1, 1234, -123, 1.0, 1.345345, -123.3123])
})

test(`literal literals`, () => {
  assert.deepEqual(lex('some-foo_bla-bar'), ['some-foo_bla-bar'])
  assert.deepEqual(lex('some_foo-bla-bar'), ['some_foo-bla-bar'])
  assert.deepEqual(lex('foo.bla[*].bar'), ['foo', '.', 'bla', '[', '*', ']', '.', 'bar'])
  assert.deepEqual(lex('foo.`bla[*]`.bar'), ['foo', '.', '`bla[*]`.bar'])
  assert.deepEqual(lex('foo.`bla\\`[*]`.bar'), ['foo', '.', '`bla\\`[*]`.bar'])
})

test(`double quoted literals`, () => {
  assert.deepEqual(lex('"was"'), ['"was"'])
  const complexString = '"bat\\"man\\"is$%^@!coming!\n\tto town with a \\"bang\\""'
  assert.deepEqual(lex(complexString), [complexString])
})

test(`single quoted literals`, () => {
  assert.deepEqual(lex("'was'"), ["'was'"])
  const complexString = "'bat\\'man\\'is$%^@!coming!\n\tto town with a \\'bang\\''"
  assert.deepEqual(lex(complexString), [complexString])
})
test(`more complex expression`, () => {
  assert.deepEqual(lex('is(aw) with(empty, -->'), ['is', '(', 'aw', ')', 'with', '(', 'empty', ',', '-', '->'])
  assert.deepEqual(lex('invert alll all+the*things'), ['invert', 'alll', 'all', '+', 'the', '*', 'things'])
  assert.deepEqual(lex('-[2:3]delete->'), ['-', '[', '2', ':', '3', ']', 'delete', '->'])
})
