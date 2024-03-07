import { alt, apply, kmid, kright, list_sc as listSc, opt, Parser, rep_sc as repSc, rule, seq, tok } from 'typescript-parsec'

import {
  AllTerm,
  CombinedTerm,
  ContextTerm,
  Direction,
  EdgeType,
  FixQuery,
  FullTextTerm,
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
  Sort,
  SortOrder,
  Term,
  WithClause,
  WithClauseFilter,
} from './FixQuery.ts'
import { FixTokens } from './FixTokens.ts'
import { parseExpr } from './parseExpr.ts'

export const JsonElementP = rule<FixTokens, JsonElement>()
export const SimpleTermP = rule<FixTokens, Term>()
export const TermP = rule<FixTokens, Term>()
export const VariableP = rule<FixTokens, string>()
export const BoolOperationP = rule<FixTokens, string>()
export const OperationP = rule<FixTokens, string>()
export const MergeQueryP = rule<FixTokens, MergeQuery>()
export const SortP = rule<FixTokens, Sort[]>()
export const LimitP = rule<FixTokens, Limit>()
export const WithClauseP = rule<FixTokens, WithClause>()
export const NavigationP = rule<FixTokens, Navigation>()
export const PartP = rule<FixTokens, Part>()
export const QueryP = rule<FixTokens, FixQuery>()

function timesN<TKind, TResult>(parser: Parser<TKind, TResult>): Parser<TKind, TResult[]> {
  return apply(seq(parser, repSc(parser)), ([first, rest]) => [first, ...rest])
}

function timesNSep<TKind, TResult, TSeparator>(parser: Parser<TKind, TResult>, sep: Parser<TKind, TSeparator>): Parser<TKind, TResult[]> {
  return apply(seq(parser, repSc(kright(sep, parser))), ([first, rest]) => [first, ...rest])
}

JsonElementP.setPattern(
  alt(
    apply(tok(FixTokens.True), () => true),
    apply(tok(FixTokens.False), () => false),
    apply(tok(FixTokens.Null), () => null),
    apply(tok(FixTokens.Integer), (t) => parseInt(t.text)),
    apply(tok(FixTokens.Float), (t) => parseFloat(t.text)),
    apply(tok(FixTokens.DoubleQuotedString), (t) => t.text.slice(1, -1)),
    apply(
      timesN(
        alt(
          tok(FixTokens.Literal),
          tok(FixTokens.Minus),
          tok(FixTokens.Dot),
          tok(FixTokens.Colon),
          tok(FixTokens.Integer),
          tok(FixTokens.Float),
        ),
      ),
      (ts) => ts.map((t) => t.text).join(''),
    ),
    apply(seq(tok(FixTokens.LBracket), tok(FixTokens.RBracket)), () => []),
    apply(seq(tok(FixTokens.LCurly), tok(FixTokens.RCurly)), () => ({})),
    kmid(tok(FixTokens.LBracket), listSc(JsonElementP, tok(FixTokens.Comma)), tok(FixTokens.RBracket)),
    apply(
      kmid(
        tok(FixTokens.LCurly),
        listSc(seq(tok(FixTokens.Literal), tok(FixTokens.Colon), JsonElementP), tok(FixTokens.Comma)),
        tok(FixTokens.RCurly),
      ),
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

const allowedCharacters = alt(
  tok(FixTokens.Literal),
  tok(FixTokens.Star),
  tok(FixTokens.LBracket),
  tok(FixTokens.RBracket),
  tok(FixTokens.Integer),
)
VariableP.setPattern(
  apply(
    seq(opt(tok(FixTokens.Slash)), listSc(timesN(allowedCharacters), tok(FixTokens.Dot))),
    ([slash, parts]) => (slash ? '/' : '') + parts.map((part) => part.map((r) => r.text).join('')).join('.'),
  ),
)

BoolOperationP.setPattern(apply(alt(tok(FixTokens.And), tok(FixTokens.Or)), (t) => t.text))

OperationP.setPattern(
  alt(
    apply(tok(FixTokens.In), (_) => 'in'),
    apply(seq(tok(FixTokens.Not), tok(FixTokens.In)), (_) => 'not in'),
    apply(tok(FixTokens.Equal), (t) => t.text),
    apply(seq(tok(FixTokens.Equal), tok(FixTokens.Equal)), (_) => '=='),
    apply(seq(tok(FixTokens.Tilde), tok(FixTokens.Equal)), (_) => '~='),
    apply(tok(FixTokens.Tilde), (t) => t.text),
    apply(tok(FixTokens.NotTilde), (t) => t.text),
    apply(tok(FixTokens.NotEqual), (t) => t.text),
    apply(tok(FixTokens.LessThanEqual), (t) => t.text),
    apply(tok(FixTokens.GreaterThanEqual), (t) => t.text),
    apply(tok(FixTokens.LessThan), (t) => t.text),
    apply(tok(FixTokens.GreaterThan), (t) => t.text),
  ),
)

const listOrSimple = apply(
  alt(
    timesNSep(tok(FixTokens.Literal), tok(FixTokens.Comma)),
    kmid(tok(FixTokens.LBracket), timesNSep(tok(FixTokens.Literal), tok(FixTokens.Comma)), tok(FixTokens.RBracket)),
  ),
  (l) => l.map((t) => t.text),
)
SimpleTermP.setPattern(
  alt(
    kmid(tok(FixTokens.LParen), TermP, tok(FixTokens.RParen)),
    apply(kright(tok(FixTokens.Not), TermP), (term) => new NotTerm({ term })),
    apply(
      seq(VariableP, tok(FixTokens.Dot), kmid(tok(FixTokens.LCurly), TermP, tok(FixTokens.RCurly))),
      ([name, _, term]) => new ContextTerm({ name, term }),
    ),
    apply(seq(VariableP, OperationP, JsonElementP), ([name, op, value]) => new Predicate({ name, op, value })),
    apply(kright(tok(FixTokens.IS), kmid(tok(FixTokens.LParen), listOrSimple, tok(FixTokens.RParen))), (t) => new IsTerm({ kinds: t })),
    apply(kright(tok(FixTokens.ID), kmid(tok(FixTokens.LParen), listOrSimple, tok(FixTokens.RParen))), (t) => new IdTerm({ ids: t })),
    apply(tok(FixTokens.DoubleQuotedString), (t) => new FullTextTerm({ text: t.text.slice(1, -1) })),
    apply(tok(FixTokens.All), (_) => new AllTerm()),
  ),
)

TermP.setPattern(
  // simple_term <and|or> simple_term
  apply(seq(SimpleTermP, repSc(seq(BoolOperationP, SimpleTermP))), ([term, opTerms]) => {
    let left = term
    for (const [op, right] of opTerms) {
      left = new CombinedTerm({ left, op, right })
    }
    return left
  }),
)

MergeQueryP.setPattern(
  apply(
    seq(VariableP, tok(FixTokens.Colon), NavigationP, repSc(PartP)),
    ([name, _, navigation, parts]) =>
      new MergeQuery({
        name: name.replace(/\[]$/, ''),
        query: new FixQuery({ parts: [new Part({ term: new AllTerm(), navigation }), ...parts] }),
        onlyFirst: name.endsWith('[]'),
      }),
  ),
)

LimitP.setPattern(
  apply(
    kright(tok(FixTokens.Limit), seq(tok(FixTokens.Integer), opt(kright(tok(FixTokens.Comma), tok(FixTokens.Integer))))),
    ([first, second]) =>
      second
        ? new Limit({
            offset: parseInt(first.text),
            length: parseInt(second.text),
          })
        : new Limit({ length: parseInt(first.text) }),
  ),
)

const asc = apply(tok(FixTokens.Asc), (_b) => SortOrder.Asc)
const desc = apply(tok(FixTokens.Desc), (_b) => SortOrder.Desc)
SortP.setPattern(
  apply(kright(tok(FixTokens.Sort), listSc(seq(VariableP, opt(alt(asc, desc))), tok(FixTokens.Comma))), (sorts) =>
    sorts.map(([name, dir]) => new Sort({ name, order: dir || SortOrder.Asc })),
  ),
)

const defaultEdge = apply(tok(FixTokens.Default), (_) => EdgeType.default)
const deleteEdge = apply(tok(FixTokens.Delete), (_) => EdgeType.delete)
const edgeTypeP = listSc(alt(defaultEdge, deleteEdge), tok(FixTokens.Comma))
const sepa = alt(tok(FixTokens.Comma), tok(FixTokens.Colon), tok(FixTokens.DotDot))
const range = apply(
  kmid(tok(FixTokens.LBracket), seq(tok(FixTokens.Integer), opt(kright(sepa, opt(tok(FixTokens.Integer))))), tok(FixTokens.RBracket)),
  ([start, end]) => [parseInt(start.text), end ? parseInt(end.text) : undefined],
)
const edgeDetail = apply(seq(opt(edgeTypeP), opt(range), opt(edgeTypeP)), ([etBefore, range, etAfter]) => {
  if (etBefore && etAfter) {
    throw new Error('Edge type can not be specified both before and after range')
  }
  const start: number = range ? range[0] || 1 : 1
  const end: number | undefined = range ? range[1] : 1
  return new Navigation({ start: start, until: end, edgeTypes: etBefore || etAfter || [EdgeType.default] })
})
NavigationP.setPattern(
  alt(
    apply(kmid(tok(FixTokens.Minus), opt(edgeDetail), tok(FixTokens.Outbound)), (nav) => {
      return new Navigation({ ...(nav || new Navigation()), direction: Direction.outbound })
    }),
    apply(kmid(tok(FixTokens.Inbound), opt(edgeDetail), tok(FixTokens.Minus)), (nav) => {
      return new Navigation({ ...(nav ? nav : new Navigation()), direction: Direction.inbound })
    }),
    apply(kmid(tok(FixTokens.Inbound), opt(edgeDetail), tok(FixTokens.Outbound)), (nav) => {
      return new Navigation({ ...(nav ? nav : new Navigation()), direction: Direction.any })
    }),
  ),
)

const withFilter = alt(
  apply(tok(FixTokens.Empty), (_) => new WithClauseFilter({ op: '==', num: 0 })),
  apply(tok(FixTokens.Any), (_) => new WithClauseFilter({ op: '>', num: 0 })),
  apply(
    kright(tok(FixTokens.Count), seq(OperationP, tok(FixTokens.Integer))),
    ([op, count]) => new WithClauseFilter({ op, num: parseInt(count.text) }),
  ),
)
WithClauseP.setPattern(
  apply(
    kright(
      tok(FixTokens.With),
      kmid(tok(FixTokens.LParen), seq(withFilter, tok(FixTokens.Comma), NavigationP, opt(TermP), opt(WithClauseP)), tok(FixTokens.RParen)),
    ),
    ([withFilter, _, navigation, term, withClause]) => new WithClause({ withFilter, navigation, term, withClause }),
  ),
)

const partTerm = apply(
  seq(TermP, opt(kmid(tok(FixTokens.LCurly), timesNSep(MergeQueryP, tok(FixTokens.Comma)), tok(FixTokens.RCurly)))),
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
    seq(partTerm, opt(WithClauseP), opt(SortP), opt(LimitP), opt(NavigationP)),
    ([term, withClause, sort, limit, navigation]) =>
      new Part({
        term: term || new AllTerm(),
        withClause,
        sort,
        limit,
        navigation,
      }),
  ),
)

QueryP.setPattern(apply(repSc(PartP), (parts) => new FixQuery({ parts })))

export const fixQueryParser = parseExpr(QueryP)
