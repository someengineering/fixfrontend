import { alt, apply, kmid, kright, list_sc, opt, Parser, rep_sc, rule, seq, tok } from 'typescript-parsec'
import { T } from './lexer.ts'
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

export const JsonElementP = rule<T, JsonElement>()
export const SimpleTermP = rule<T, Term>()
export const TermP = rule<T, Term>()
export const VariableP = rule<T, string>()
export const BoolOperationP = rule<T, string>()
export const OperationP = rule<T, string>()
export const MergeQueryP = rule<T, MergeQuery>()
export const SortP = rule<T, Sort[]>()
export const LimitP = rule<T, Limit>()
export const WithClauseP = rule<T, WithClause>()
export const NavigationP = rule<T, Navigation>()
export const PartP = rule<T, Part>()
export const QueryP = rule<T, Query>()

function times_n<TKind, TResult>(parser: Parser<TKind, TResult>): Parser<TKind, TResult[]> {
  return apply(seq(parser, rep_sc(parser)), ([first, rest]) => [first, ...rest])
}

function times_n_sep<TKind, TResult, TSeparator>(parser: Parser<TKind, TResult>, sep: Parser<TKind, TSeparator>): Parser<TKind, TResult[]> {
  return apply(seq(parser, rep_sc(kright(sep, parser))), ([first, rest]) => [first, ...rest])
}

JsonElementP.setPattern(
  alt(
    apply(tok(T.True), () => true),
    apply(tok(T.False), () => false),
    apply(tok(T.Null), () => null),
    apply(tok(T.Integer), (t) => parseInt(t.text)),
    apply(tok(T.Float), (t) => parseFloat(t.text)),
    apply(tok(T.DoubleQuotedString), (t) => t.text.slice(1, -1)),
    apply(times_n(alt(tok(T.Literal), tok(T.Minus), tok(T.Dot), tok(T.Colon), tok(T.Integer), tok(T.Float))), (ts) =>
      ts.map((t) => t.text).join(''),
    ),
    apply(seq(tok(T.LBracket), tok(T.RBracket)), () => []),
    apply(seq(tok(T.LCurly), tok(T.RCurly)), () => ({})),
    kmid(tok(T.LBracket), list_sc(JsonElementP, tok(T.Comma)), tok(T.RBracket)),
    apply(kmid(tok(T.LCurly), list_sc(seq(tok(T.Literal), tok(T.Colon), JsonElementP), tok(T.Comma)), tok(T.RCurly)), (pairs) => {
      const obj: { [key: string]: JsonElement } = {}
      for (const [key, _, value] of pairs) {
        obj[key.text] = value
      }
      return obj
    }),
  ),
)

const allowed_characters = alt(tok(T.Literal), tok(T.Star), tok(T.LBracket), tok(T.RBracket), tok(T.Integer))
VariableP.setPattern(
  apply(
    seq(opt(tok(T.Slash)), list_sc(times_n(allowed_characters), tok(T.Dot))),
    ([slash, parts]) => (slash ? '/' : '') + parts.map((part) => part.map((r) => r.text).join('')).join('.'),
  ),
)

BoolOperationP.setPattern(apply(alt(tok(T.And), tok(T.Or)), (t) => t.text))

OperationP.setPattern(
  alt(
    apply(tok(T.In), (_) => 'in'),
    apply(seq(tok(T.Not), tok(T.In)), (_) => 'not in'),
    apply(tok(T.Equal), (t) => t.text),
    apply(seq(tok(T.Equal), tok(T.Equal)), (_) => '=='),
    apply(seq(tok(T.Tilde), tok(T.Equal)), (_) => '~='),
    apply(tok(T.Tilde), (t) => t.text),
    apply(tok(T.NotTilde), (t) => t.text),
    apply(tok(T.NotEqual), (t) => t.text),
    apply(tok(T.LessThanEqual), (t) => t.text),
    apply(tok(T.GreaterThanEqual), (t) => t.text),
    apply(tok(T.LessThan), (t) => t.text),
    apply(tok(T.GreaterThan), (t) => t.text),
  ),
)

const list_or_simple = apply(
  alt(times_n_sep(tok(T.Literal), tok(T.Comma)), kmid(tok(T.LBracket), times_n_sep(tok(T.Literal), tok(T.Comma)), tok(T.RBracket))),
  (l) => l.map((t) => t.text),
)
SimpleTermP.setPattern(
  alt(
    kmid(tok(T.LParen), TermP, tok(T.RParen)),
    apply(kright(tok(T.Not), TermP), (term) => new NotTerm({ term })),
    apply(seq(VariableP, tok(T.Dot), kmid(tok(T.LCurly), TermP, tok(T.RCurly))), ([name, _, term]) => new ContextTerm({ name, term })),
    apply(seq(VariableP, OperationP, JsonElementP), ([name, op, value]) => new Predicate({ name, op, value })),
    apply(kright(tok(T.IS), kmid(tok(T.LParen), list_or_simple, tok(T.RParen))), (t) => new IsTerm({ kinds: t })),
    apply(kright(tok(T.ID), kmid(tok(T.LParen), list_or_simple, tok(T.RParen))), (t) => new IdTerm({ ids: t })),
    apply(tok(T.DoubleQuotedString), (t) => new FulltextTerm({ text: t.text.slice(1, -1) })),
    apply(tok(T.All), (_) => new AllTerm()),
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
    seq(VariableP, tok(T.Colon), NavigationP, rep_sc(PartP)),
    ([name, _, navigation, parts]) =>
      new MergeQuery({
        name: name.replace(/\[]$/, ''),
        query: new Query({ parts: [new Part({ term: new AllTerm(), navigation }), ...parts] }),
        onlyFirst: name.endsWith('[]'),
      }),
  ),
)

LimitP.setPattern(
  apply(kright(tok(T.Limit), seq(tok(T.Integer), opt(kright(tok(T.Comma), tok(T.Integer))))), ([first, second]) =>
    second
      ? new Limit({
          offset: parseInt(first.text),
          length: parseInt(second.text),
        })
      : new Limit({ length: parseInt(first.text) }),
  ),
)

const asc = apply(tok(T.Asc), (_b) => SortOrder.Asc)
const desc = apply(tok(T.Desc), (_b) => SortOrder.Desc)
SortP.setPattern(
  apply(kright(tok(T.Sort), list_sc(seq(VariableP, opt(alt(asc, desc))), tok(T.Comma))), (sorts) =>
    sorts.map(([name, dir]) => new Sort({ name, order: dir || SortOrder.Asc })),
  ),
)

const default_edge = apply(tok(T.Default), (_) => EdgeType.default)
const delete_edge = apply(tok(T.Delete), (_) => EdgeType.delete)
const edge_type_p = list_sc(alt(default_edge, delete_edge), tok(T.Comma))
const sepa = alt(tok(T.Comma), tok(T.Colon), tok(T.DotDot))
const range = apply(kmid(tok(T.LBracket), seq(tok(T.Integer), opt(kright(sepa, opt(tok(T.Integer))))), tok(T.RBracket)), ([start, end]) => [
  parseInt(start.text),
  end ? parseInt(end.text) : undefined,
])
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
    apply(kmid(tok(T.Minus), opt(edge_detail), tok(T.Outbound)), (nav) => {
      return new Navigation({ ...(nav || new Navigation()), direction: Direction.outbound })
    }),
    apply(kmid(tok(T.Inbound), opt(edge_detail), tok(T.Minus)), (nav) => {
      return new Navigation({ ...(nav ? nav : new Navigation()), direction: Direction.inbound })
    }),
    apply(kmid(tok(T.Inbound), opt(edge_detail), tok(T.Outbound)), (nav) => {
      return new Navigation({ ...(nav ? nav : new Navigation()), direction: Direction.any })
    }),
  ),
)

const with_filter = alt(
  apply(tok(T.Empty), (_) => new WithClauseFilter({ op: '==', num: 0 })),
  apply(tok(T.Any), (_) => new WithClauseFilter({ op: '>', num: 0 })),
  apply(kright(tok(T.Count), seq(OperationP, tok(T.Integer))), ([op, count]) => new WithClauseFilter({ op, num: parseInt(count.text) })),
)
WithClauseP.setPattern(
  apply(
    kright(tok(T.With), kmid(tok(T.LParen), seq(with_filter, tok(T.Comma), NavigationP, opt(TermP), opt(WithClauseP)), tok(T.RParen))),
    ([with_filter, _, navigation, term, with_clause]) => new WithClause({ with_filter, navigation, term, with_clause }),
  ),
)

const part_term = apply(
  seq(TermP, opt(kmid(tok(T.LCurly), times_n_sep(MergeQueryP, tok(T.Comma)), tok(T.RCurly)))),
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
