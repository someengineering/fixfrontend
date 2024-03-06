import {
  alt,
  apply,
  buildLexer,
  kmid,
  kright,
  Lexer,
  list_sc,
  opt,
  Parser,
  rep_sc,
  rule,
  seq,
  tok,
} from 'typescript-parsec'
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
  MergeTerm,
  Navigation,
  NotTerm,
  Part,
  Predicate,
  Query,
  Sort,
  SortOrder,
  Term,
  WithClause,
  WithClauseFilter,
} from './query'

export enum Token {
  Space,
  IS,
  ID,
  With, // with
  Any, // any
  Empty, // empty
  All, // all
  Count, // count
  Not,
  And,
  Or,
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
  Star, // *
  Slash, // /
  DoubleQuotedString, // "abc"
  Equal, // =
  Tilde, // ~
  NotEqual, // !=
  LessThanEqual, // <=
  GreaterThanEqual, // >=
  LessThan, // <
  GreaterThan, // >
  In, // in
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
  [true, /^in/g, Token.In],
  [true, /^with/g, Token.With],
  [true, /^any/g, Token.Any],
  [true, /^empty/g, Token.Empty],
  [true, /^all/g, Token.All],
  [true, /^count/g, Token.Count],
  [true, /^not/g, Token.Not],
  [true, /^and/g, Token.And],
  [true, /^or/g, Token.Or],
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
  [true, /^-/g, Token.Minus],
  [true, /^\*/g, Token.Star],
  [true, /^[+-]?[0-9]+/g, Token.Integer],
  [true, /^\//g, Token.Slash],
  [true, /^~/g, Token.Tilde],
  [true, /^=/g, Token.Equal],
  [true, /^!=/g, Token.NotEqual],
  [true, /^default/g, Token.Default],
  [true, /^delete/g, Token.Delete],
  [true, /^<=/g, Token.LessThanEqual],
  [true, /^>=/g, Token.GreaterThanEqual],
  [true, /^</g, Token.LessThan],
  [true, /^>/g, Token.GreaterThan],
  [true, /^"[^"\\]*"/g, Token.DoubleQuotedString], // TODO: handle escape
  [
    true,
    /^(?!delete|default|with|any|empty|count|not|and|or|limit|sort|asc|desc|true|false|null)[A-Za-z0-9][A-Za-z0-9_\\-]*/g,
    Token.Literal,
  ],
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

function times_n<TKind, TResult>(parser: Parser<TKind, TResult>): Parser<TKind, TResult[]> {
  return apply(seq(parser, rep_sc(parser)), ([first, rest]) => [first, ...rest])
}

function times_n_sep<TKind, TResult, TSeparator>(parser: Parser<TKind, TResult>, sep: Parser<TKind, TSeparator>): Parser<TKind, TResult[]> {
  return apply(seq(parser, rep_sc(kright(sep, parser))), ([first, rest]) => [first, ...rest])
}

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

const allowed_characters = alt(tok(Token.Literal), tok(Token.Star), tok(Token.LBracket), tok(Token.RBracket))
VariableP.setPattern(
  apply(
    seq(opt(tok(Token.Slash)), list_sc(times_n(allowed_characters), tok(Token.Dot))),
    ([slash, parts]) => (slash ? '/' : '') + parts.map((part) => part.map((r) => r.text).join('')).join('.'),
  ),
)

BoolOperationP.setPattern(apply(alt(tok(Token.And), tok(Token.Or)), (t) => t.text))

OperationP.setPattern(
  alt(
    apply(tok(Token.In), (_) => "in"),
    apply(seq(tok(Token.Not), tok(Token.In)), (_) => "not in"),
    apply(tok(Token.Equal), (t) => t.text),
    apply(seq(tok(Token.Equal),tok(Token.Equal)), (_) => "=="),
    apply(seq(tok(Token.Tilde),tok(Token.Equal)), (_) => "~="),
    apply(tok(Token.Tilde), (t) => t.text),
    apply(tok(Token.NotEqual), (t) => t.text),
    apply(tok(Token.LessThanEqual), (t) => t.text),
    apply(tok(Token.GreaterThanEqual), (t) => t.text),
    apply(tok(Token.LessThan), (t) => t.text),
    apply(tok(Token.GreaterThan), (t) => t.text),
  ),
)

SimpleTermP.setPattern(
  alt(
    kmid(tok(Token.LParen), TermP, tok(Token.RParen)),
    apply(kright(tok(Token.Not), TermP), (term) => new NotTerm({ term })),
    apply(
      seq(VariableP, tok(Token.Dot), kmid(tok(Token.LCurly), TermP, tok(Token.RCurly))),
      ([name, _, term]) => new ContextTerm({ name, term }),
    ),
    apply(seq(VariableP, OperationP, JsonElementP), ([name, op, value]) => new Predicate({ name, op, value })),
    apply(kright(tok(Token.IS), kmid(tok(Token.LParen), tok(Token.Literal), tok(Token.RParen))), (t) => new IsTerm({ kinds: [t.text] })),
    apply(kright(tok(Token.ID), kmid(tok(Token.LParen), tok(Token.Literal), tok(Token.RParen))), (t) => new IdTerm({ ids: [t.text] })),
    apply(tok(Token.DoubleQuotedString), (t) => new FulltextTerm({ text: t.text.slice(1, -1) })),
    apply(tok(Token.All), (_) => new AllTerm()),
  ),
)

TermP.setPattern(
  // simple_term <and|or> simple_term
  apply(seq(SimpleTermP, rep_sc(seq(BoolOperationP, SimpleTermP))), ([term, op_terms]) => {
    let left = term
    for (const [op, right] of op_terms) {
      left = new CombinedTerm({ left, op, right })
    }
    return left
  }),
)

MergeQueryP.setPattern(
  apply(
    seq(VariableP, tok(Token.Colon), QueryP),
    ([name, _, query]) => new MergeQuery({ name: name.replace(/\[]$/, ''), query, onlyFirst: name.endsWith('[]') }),
  ),
)

LimitP.setPattern(
  apply(kright(tok(Token.Limit), seq(tok(Token.Integer), opt(kright(tok(Token.Comma), tok(Token.Integer))))), ([first, second]) =>
    second
      ? new Limit({
        offset: parseInt(first.text),
        length: parseInt(second.text),
      })
      : new Limit({ length: parseInt(first.text) }),
  ),
)

const asc = apply(tok(Token.Asc), (_b) => SortOrder.Asc)
const desc = apply(tok(Token.Desc), (_b) => SortOrder.Desc)
SortP.setPattern(
  apply(kright(tok(Token.Sort), list_sc(seq(VariableP, opt(alt(asc, desc))), tok(Token.Comma))), (sorts) =>
    sorts.map(([name, dir]) => new Sort({ name, order: dir || SortOrder.Asc })),
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
  return new Navigation({ start: start, until: end, edge_types: et_before || et_after || [EdgeType.default] })
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

const with_filter = alt(
  apply(tok(Token.Empty), (_) => new WithClauseFilter({ op: '==', num: 0 })),
  apply(tok(Token.Any), (_) => new WithClauseFilter({ op: '>', num: 0 })),
  apply(
    kright(tok(Token.Count), seq(OperationP, tok(Token.Integer))),
    ([op, count]) => new WithClauseFilter({ op, num: parseInt(count.text) }),
  ),
)
WithClauseP.setPattern(
  apply(
    kright(
      tok(Token.With),
      kmid(tok(Token.LParen), seq(with_filter, tok(Token.Comma), NavigationP, opt(TermP), opt(WithClauseP)), tok(Token.RParen)),
    ),
    ([with_filter, _, navigation, term, with_clause]) => new WithClause({ with_filter, navigation, term, with_clause }),
  ),
)

const part_term = apply(
  seq(TermP, opt(kmid(tok(Token.LCurly), times_n_sep(MergeQueryP, tok(Token.Comma)), tok(Token.RCurly)))),
  ([preFilter, merge]) => {
    if (merge) {
      return new MergeTerm({ preFilter, merge })
    } else {
      return preFilter
    }
  },
)

PartP.setPattern(
  apply(
    seq(part_term, opt(WithClauseP), opt(SortP), opt(LimitP), opt(NavigationP)),
    ([term, with_clause, sort, limit, navigation]) =>
      new Part({
        term: term || new AllTerm(),
        with_clause,
        sort,
        limit,
        navigation,
      }),
  ),
)

QueryP.setPattern(apply(rep_sc(PartP), (parts) => new Query({ parts })))
