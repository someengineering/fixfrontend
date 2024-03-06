import { alt, apply, buildLexer, fail, kmid, kright, Lexer, list_sc, opt, rep_sc, rule, seq, tok } from 'typescript-parsec'
import {
  AllTerm,
  CombinedTerm,
  ContextTerm,
  Direction,
  EdgeType,
  FulltextTerm,
  IdTerm,
  IsTerm,
  JsonElement,
  Limit,
  MergeQuery,
  Navigation,
  NotTerm,
  Part,
  Predicate,
  Query,
  Sort,
  SortOrder,
  Term,
  WithClause,
} from './query'

export enum Token {
  Space,
  IS,
  ID,
  ALL, // all
  NOT,
  AND,
  OR,
  Limit,
  Sort,
  Asc,
  Desc,
  True, // true
  False, // false
  Null, // null
  LParen, // (
  RParen, // )
  LBracket, // [
  RBracket, // ]
  LCurly, // {
  RCurly, // }
  Semicolon, // ;
  Dot, // .
  DotDot, // ..
  Comma, // ,
  Colon, // :
  Float, // 1.0
  Integer, // 1
  Plus, // +
  Minus, // -
  Slash, // /
  DoubleQuotedString, // "abc"
  Equal, // ==
  EqualEqual, // ==
  NotEqual, // !=
  LessThanEqual, // <=
  GreaterThanEqual, // >=
  LessThan, // <
  GreaterThan, // >
  Outbound, // ->
  Inbound, // <-
  Default, // default
  Delete, // delete
  Literal, // abc
}

export const FixQueryLexer: Lexer<Token> = buildLexer([
  [false, /^\s+/g, Token.Space],
  [true, /^is/g, Token.IS],
  [true, /^id/g, Token.ID],
  [true, /^all/g, Token.ALL],
  [true, /^not/g, Token.NOT],
  [true, /^and/g, Token.AND],
  [true, /^or/g, Token.OR],
  [true, /^limit/g, Token.Limit],
  [true, /^sort/g, Token.Sort],
  [true, /^asc/g, Token.Asc],
  [true, /^desc/g, Token.Desc],
  [true, /^true/g, Token.True],
  [true, /^false/g, Token.False],
  [true, /^null/g, Token.Null],
  [true, /^\(/g, Token.LParen],
  [true, /^\)/g, Token.RParen],
  [true, /^\[/g, Token.LBracket],
  [true, /^]/g, Token.RBracket],
  [true, /^[{]/g, Token.LCurly],
  [true, /^[}]/g, Token.RCurly],
  [true, /^[.]/g, Token.Dot],
  [true, /^[.]{2}/g, Token.DotDot],
  [true, /^;/g, Token.Semicolon],
  [true, /^,/g, Token.Comma],
  [true, /^:/g, Token.Colon],
  [true, /^[+-]?[0-9]+\.[0-9]+/g, Token.Float],
  [true, /^[+-]?[0-9]+/g, Token.Integer],
  [true, /^->/g, Token.Outbound],
  [true, /^<-/g, Token.Inbound],
  [true, /^[+]/g, Token.Plus],
  [true, /^[-]/g, Token.Minus],
  [true, /^[+-]?[0-9]+/g, Token.Integer],
  [true, /^\//g, Token.Slash],
  [true, /^=/g, Token.Equal],
  [true, /^==/g, Token.EqualEqual],
  [true, /^!=/g, Token.NotEqual],
  [true, /^default/g, Token.Default],
  [true, /^delete/g, Token.Delete],
  [true, /^<=/g, Token.LessThanEqual],
  [true, /^>=/g, Token.GreaterThanEqual],
  [true, /^</g, Token.LessThan],
  [true, /^>/g, Token.GreaterThan],
  [true, /^"[^"\\]+"/g, Token.DoubleQuotedString], // TODO: handle escape
  [true, /^(?!delete|default)[A-Za-z0-9][A-Za-z0-9_\\-]*/g, Token.Literal],
])

export const JsonElementP = rule<Token, JsonElement>()
export const SimpleTermP = rule<Token, Term>()
export const TermP = rule<Token, Term>()
export const VariableP = rule<Token, string>()
export const BoolOperationP = rule<Token, string>()
export const OperationP = rule<Token, string>()
export const MergeQueryP = rule<Token, MergeQuery>()
export const SortP = rule<Token, Sort[]>()
export const LimitP = rule<Token, Limit>()
export const WithClauseP = rule<Token, WithClause>()
export const NavigationP = rule<Token, Navigation>()
export const PartP = rule<Token, Part>()
export const QueryP = rule<Token, Query>()

JsonElementP.setPattern(
  alt(
    apply(tok(Token.True), () => true),
    apply(tok(Token.False), () => false),
    apply(tok(Token.Null), () => null),
    apply(tok(Token.Integer), (t) => parseInt(t.text)),
    apply(tok(Token.Float), (t) => parseFloat(t.text)),
    apply(tok(Token.DoubleQuotedString), (t) => t.text.slice(1, -1)),
    apply(tok(Token.Literal), (t) => t.text),
    apply(seq(tok(Token.LBracket), tok(Token.RBracket)), () => []),
    apply(seq(tok(Token.LCurly), tok(Token.RCurly)), () => ({})),
    kmid(tok(Token.LBracket), list_sc(JsonElementP, tok(Token.Comma)), tok(Token.RBracket)),
    apply(
      kmid(tok(Token.LCurly), list_sc(seq(tok(Token.Literal), tok(Token.Colon), JsonElementP), tok(Token.Comma)), tok(Token.RCurly)),
      (pairs) => {
        const obj: { [key: string]: JsonElement } = {}
        for (const [key, _, value] of pairs) {
          obj[key.text] = value
        }
        return obj
      },
    ),
  ),
)

VariableP.setPattern(
  apply(
    seq(opt(tok(Token.Slash)), list_sc(tok(Token.Literal), tok(Token.Dot))),
    ([slash, parts]) => (slash ? '/' : '') + parts.map((part) => part.text).join('.'),
  ),
)

BoolOperationP.setPattern(apply(alt(tok(Token.AND), tok(Token.OR)), (t) => t.text))

OperationP.setPattern(
  apply(
    alt(
      tok(Token.Equal),
      tok(Token.EqualEqual),
      tok(Token.NotEqual),
      tok(Token.LessThanEqual),
      tok(Token.GreaterThanEqual),
      tok(Token.LessThan),
      tok(Token.GreaterThan),
    ),
    (t) => t.text,
  ),
)

SimpleTermP.setPattern(
  alt(
    kmid(tok(Token.LParen), TermP, tok(Token.RParen)),
    apply(kright(tok(Token.NOT), TermP), (term) => new NotTerm({term})),
    apply(
      seq(VariableP, tok(Token.Dot), kmid(tok(Token.LCurly), TermP, tok(Token.RCurly))),
      ([name, _, term]) => new ContextTerm({name, term}),
    ),
    apply(seq(VariableP, OperationP, JsonElementP), ([name, op, value]) => new Predicate({name, op, value})),
    apply(kright(tok(Token.IS), kmid(tok(Token.LParen), tok(Token.Literal), tok(Token.RParen))), (t) => new IsTerm({kinds:[t.text]})),
    apply(kright(tok(Token.ID), kmid(tok(Token.LParen), tok(Token.Literal), tok(Token.RParen))), (t) => new IdTerm({ids:[t.text]})),
    apply(tok(Token.DoubleQuotedString), (t) => new FulltextTerm({text:t.text.slice(1, -1)})),
    apply(tok(Token.ALL), (_) => new AllTerm()),
  ),
)

TermP.setPattern(
  alt(
    // simple_term <and|or> simple_term
    apply(seq(SimpleTermP, rep_sc(seq(BoolOperationP, SimpleTermP))), ([term, op_terms]) => {
      let left = term
      for (const [op, right] of op_terms) {
        left = new CombinedTerm({left, op, right})
      }
      return left
    }),
    // (term)
    kmid(tok(Token.LParen), TermP, tok(Token.RParen)),
    // term {merge} <term>
    // TODO: Fix merge query
    // apply(seq(TermP, list_sc(MergeQueryP, tok(Token.Comma)), opt(TermP)), ([pre, queries, post]) => new MergeTerm(pre, queries, post)),
  ),
)

MergeQueryP.setPattern(
  apply(seq(VariableP, tok(Token.Colon), QueryP), ([name, _, query]) => new MergeQuery({name, query})), //TODO: array flag
)

LimitP.setPattern(
  apply(kright(tok(Token.Limit), seq(tok(Token.Integer), opt(kright(tok(Token.Comma), tok(Token.Integer))))), ([first, second]) =>
    second ? new Limit({offset:parseInt(first.text), length:parseInt(second.text)}) : new Limit({length: parseInt(first.text)}),
  ),
)

const asc = apply(tok(Token.Asc), (_b) => SortOrder.Asc)
const desc = apply(tok(Token.Desc), (_b) => SortOrder.Desc)
SortP.setPattern(
  apply(kright(tok(Token.Sort), list_sc(seq(VariableP, opt(alt(asc, desc))), tok(Token.Comma))), (sorts) =>
    sorts.map(([name, dir]) => new Sort({name, order:dir || SortOrder.Asc})),
  ),
)

const default_edge = apply(tok(Token.Default), (_) => EdgeType.default)
const delete_edge = apply(tok(Token.Delete), (_) => EdgeType.delete)
const edge_type_p = list_sc(alt(default_edge, delete_edge), tok(Token.Comma))
const sepa = alt(tok(Token.Comma), tok(Token.Colon), tok(Token.DotDot))
const range = apply(
  kmid(tok(Token.LBracket), seq(tok(Token.Integer), opt(kright(sepa, tok(Token.Integer)))), tok(Token.RBracket)),
  ([start, end]) => [parseInt(start.text), end ? parseInt(end.text) : undefined],
)
const edge_detail = apply(seq(opt(edge_type_p), opt(range), opt(edge_type_p)), ([et_before, range, et_after]) => {
  if (et_before && et_after) {
    throw new Error('Edge type can not be specified both before and after range')
  }
  const start: number = range ? range[0] || 1 : 1
  const end: number | undefined = range ? range[1] : 1
  return new Navigation({start:start, until:end, edge_types:et_before || et_after || [EdgeType.default]})
})
NavigationP.setPattern(
  alt(
    apply(kmid(tok(Token.Minus), opt(edge_detail), tok(Token.Outbound)), (nav) => {
      return new Navigation({ ...(nav || new Navigation()), direction: Direction.outbound })
    }),
    apply(kmid(tok(Token.Inbound), opt(edge_detail), tok(Token.Minus)), (nav) => {
      return new Navigation({ ...(nav ? nav : new Navigation()), direction: Direction.inbound })
    }),
    apply(kmid(tok(Token.Inbound), opt(edge_detail), tok(Token.Outbound)), (nav) => {
      return new Navigation({ ...(nav ? nav : new Navigation()), direction: Direction.any })
    }),
  ),
)

WithClauseP.setPattern(fail('Not implemented'))

PartP.setPattern(
  apply(
    seq(TermP, opt(WithClauseP), opt(SortP), opt(LimitP), opt(NavigationP)),
    ([term, with_clause, sort, limit, navigation]) => new Part({term, with_clause, sort, limit, navigation}),
  ),
)

QueryP.setPattern(apply(rep_sc(PartP), (parts) => new Query({parts})))
