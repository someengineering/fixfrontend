import assert from 'assert'
import { lexer, T } from './lexer.ts'

function kinds(expr: string): T[] {
  let lexed = lexer.parse(expr)
  const result: T[] = []
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
  assert.deepEqual(kinds('is id with any empty all count'), [T.IS, T.ID, T.With, T.Any, T.Empty, T.All, T.Count])
  assert.deepEqual(kinds('not and or limit sort asc desc'), [T.Not, T.And, T.Or, T.Limit, T.Sort, T.Asc, T.Desc])
  assert.deepEqual(kinds('in true false null'), [T.In, T.True, T.False, T.Null])
})

test(`punctuation literals`, () => {
  assert.deepEqual(kinds('[] {} () '), [T.LBracket, T.RBracket, T.LCurly, T.RCurly, T.LParen, T.RParen])
  assert.deepEqual(kinds(';. .. , :'), [T.Semicolon, T.Dot, T.DotDot, T.Comma, T.Colon])
  assert.deepEqual(kinds('+ - * / = ~'), [T.Plus, T.Minus, T.Star, T.Slash, T.Equal, T.Tilde])
  assert.deepEqual(kinds('!= < > <= >='), [T.NotEqual, T.LessThan, T.GreaterThan, T.LessThanEqual, T.GreaterThanEqual])
  assert.deepEqual(kinds('<- ->'), [T.Inbound, T.Outbound])
})

test(`number literals`, () => {
  assert.deepEqual(kinds('1 +1234 -123 1.0 +1.345345 -123.3123'), [T.Integer, T.Integer, T.Integer, T.Float, T.Float, T.Float])
  assert.deepEqual(lex('1 +1234 -123 1.0 +1.345345 -123.3123'), [1, 1234, -123, 1.0, 1.345345, -123.3123])
})

test(`literal literals`, () => {
  assert.deepEqual(lex('Condition.IpAddress.`aws:SourceIp`[]'), ['Condition', '.', 'IpAddress', '.', '`aws:SourceIp`', '[', ']'])
  assert.deepEqual(lex('some-foo_bla-bar'), ['some-foo_bla-bar'])
  assert.deepEqual(lex('some_foo-bla-bar'), ['some_foo-bla-bar'])
  assert.deepEqual(lex('foo.bla[*].bar'), ['foo', '.', 'bla', '[', '*', ']', '.', 'bar'])
  assert.deepEqual(lex('foo.`bla[*]`.bar'), ['foo', '.', '`bla[*]`', '.', 'bar'])
  assert.deepEqual(lex('foo.`bla\\`[*]`.bar'), ['foo', '.', '`bla\\`[*]`', '.', 'bar'])
  assert.deepEqual(lex('with_usage(1d, foo)'), ['with_usage', '(', '1', 'd', ',', 'foo', ')'])
})

test(`double quoted literals`, () => {
  assert.deepEqual(lex('"was"'), ['"was"'])
  const complex_string = '"bat\\"man\\"is$%^@!coming!\n\tto town with a \\"bang\\""'
  assert.deepEqual(lex(complex_string), [complex_string])
})

test(`single quoted literals`, () => {
  assert.deepEqual(lex("'was'"), ["'was'"])
  const complex_string = "'bat\\'man\\'is$%^@!coming!\n\tto town with a \\'bang\\''"
  assert.deepEqual(lex(complex_string), [complex_string])
})
test(`more complex expression`, () => {
  assert.deepEqual(lex('is(aw) with(empty, -->'), ['is', '(', 'aw', ')', 'with', '(', 'empty', ',', '-', '->'])
  assert.deepEqual(lex('invert alll all+the*things'), ['invert', 'alll', 'all', '+', 'the', '*', 'things'])
  assert.deepEqual(lex('-[2:3]delete->'), ['-', '[', '2', ':', '3', ']', 'delete', '->'])
})
