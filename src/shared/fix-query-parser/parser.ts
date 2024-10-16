import { Parser, alt, apply, kleft, kmid, kright, list_sc, opt, rep_sc, rule, seq, str as str_p, tok } from 'typescript-parsec'
import { Token } from 'typescript-parsec/lib/Lexer'
import { T, parse_expr } from './lexer.ts'
import {
  Aggregate,
  AggregateFunction,
  AggregateOp,
  AggregateVariable,
  AggregateVariableCombined,
  AggregateVariableName,
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
  Path,
  PathPart,
  Predicate,
  Query,
  Sort,
  SortOrder,
  Term,
  WithClause,
  WithClauseFilter,
  WithUsage,
} from './query'

export const JsonElementP = rule<T, JsonElement>()
export const TermP = rule<T, Term>()
export const EdgeTermP = rule<T, Term>()
export const PathP = rule<T, Path>()
export const BoolOperationP = rule<T, string>()
export const OperationP = rule<T, string>()
export const MergeQueryP = rule<T, MergeQuery>()
export const SortP = rule<T, Sort[]>()
export const LimitP = rule<T, Limit>()
export const WithClauseP = rule<T, WithClause>()
export const WithUsageP = rule<T, WithUsage>()
export const NavigationP = rule<T, Navigation>()
export const PartP = rule<T, Part>()
export const AggregateP = rule<T, Aggregate>()
export const QueryP = rule<T, Query>()

function times_n<TKind, TResult>(parser: Parser<TKind, TResult>): Parser<TKind, TResult[]> {
  return apply(seq(parser, rep_sc(parser)), ([first, rest]) => [first, ...rest])
}

function times_n_sep<TKind, TResult, TSeparator>(parser: Parser<TKind, TResult>, sep: Parser<TKind, TSeparator>): Parser<TKind, TResult[]> {
  return apply(seq(parser, rep_sc(kright(sep, parser))), ([first, rest]) => [first, ...rest])
}

function as_str(t: T): Parser<T, string> {
  return apply(tok(t), (t) => t.text)
}

function str(t: string): Parser<T, Token<T>> {
  return str_p(t)
}

function num(): Parser<T, number> {
  return apply(tok(T.Integer), (t) => parseInt(t.text))
}

const numberP = apply(alt(tok(T.Integer), tok(T.Float)), (t) => parseFloat(t.text))
const keywordP = alt(tok(T.All), tok(T.Count), tok(T.With), tok(T.Any), tok(T.Empty), tok(T.Default), tok(T.Delete), tok(T.IS), tok(T.ID))
const keywordS = apply(keywordP, (t) => t.text)
const literalP = alt(tok(T.Literal), keywordP)
const literalS = apply(literalP, (t) => t.text)
const lit_or_num = apply(alt(tok(T.Dot), tok(T.Literal), tok(T.Integer), tok(T.Float)), (t) => t.text)
const lit_combine = apply(alt(tok(T.Minus), tok(T.Colon)), (t) => t.text)
const lit_with_combine = apply(seq(opt(lit_combine), lit_or_num), ([cb, lit]) => (cb ? cb + lit : lit))
JsonElementP.setPattern(
  alt(
    apply(tok(T.True), () => true),
    apply(tok(T.False), () => false),
    apply(tok(T.Null), () => null),
    numberP,
    keywordS,
    apply(tok(T.DoubleQuotedString), (t) => t.text.slice(1, -1)),
    apply(times_n(lit_with_combine), (ts) => ts.join('')),
    apply(seq(tok(T.LBracket), tok(T.RBracket)), () => []),
    apply(seq(tok(T.LCurly), tok(T.RCurly)), () => ({})),
    kmid(tok(T.LBracket), list_sc(JsonElementP, tok(T.Comma)), tok(T.RBracket)),
    apply(kmid(tok(T.LCurly), list_sc(seq(literalP, tok(T.Colon), JsonElementP), tok(T.Comma)), tok(T.RCurly)), (pairs) => {
      const obj: { [key: string]: JsonElement } = {}
      for (const [key, _, value] of pairs) {
        obj[key.text] = value
      }
      return obj
    }),
  ),
)

const array_access = apply(kmid(tok(T.LBracket), opt(alt(num(), as_str(T.Star))), tok(T.RBracket)), (ac) => (ac != undefined ? ac : '*'))
const path_part = alt(
  apply(seq(literalS, opt(array_access)), ([name, array_access]) => new PathPart({ name, array_access, backtick: false })),
  apply(
    seq(as_str(T.BackTickedString), opt(array_access)),
    ([name, array_access]) => new PathPart({ name: name.slice(1, -1), array_access, backtick: true }),
  ),
)
PathP.setPattern(apply(seq(opt(tok(T.Slash)), list_sc(path_part, tok(T.Dot))), ([slash, parts]) => new Path({ parts, root: !!slash })))

BoolOperationP.setPattern(apply(alt(tok(T.And), tok(T.Or)), (t) => t.text))

OperationP.setPattern(
  alt(
    apply(tok(T.In), (_) => 'in'),
    apply(seq(tok(T.Not), tok(T.In)), (_) => 'not in'),
    apply(seq(tok(T.Equal), tok(T.Equal)), (_) => '=='),
    apply(seq(tok(T.Equal), tok(T.Tilde)), (_) => '=~'),
    apply(tok(T.Equal), (t) => t.text),
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
  alt(times_n_sep(literalP, tok(T.Comma)), kmid(tok(T.LBracket), times_n_sep(literalP, tok(T.Comma)), tok(T.RBracket))),
  (l) => l.map((t) => t.text),
)
const parensTerm = kmid(tok(T.LParen), TermP, tok(T.RParen))
const notTerm = apply(kright(tok(T.Not), TermP), (term) => new NotTerm({ term }))
const contextTerm = apply(
  seq(PathP, tok(T.Dot), kmid(tok(T.LCurly), TermP, tok(T.RCurly))),
  ([name, _, term]) => new ContextTerm({ path: name, term }),
)
const predicateTerm = apply(seq(PathP, OperationP, JsonElementP), ([name, op, value]) => new Predicate({ path: name, op, value }))
const isTerm = apply(kright(tok(T.IS), kmid(tok(T.LParen), list_or_simple, tok(T.RParen))), (t) => new IsTerm({ kinds: t }))
const idTerm = apply(kright(tok(T.ID), kmid(tok(T.LParen), list_or_simple, tok(T.RParen))), (t) => new IdTerm({ ids: t }))
const fulltextTerm = apply(tok(T.DoubleQuotedString), (t) => new FulltextTerm({ text: t.text.slice(1, -1).replace(/\\"/g, '"') }))
const allTerm = apply(tok(T.All), (_) => new AllTerm())
const simpleTerm = alt(parensTerm, notTerm, contextTerm, predicateTerm, isTerm, idTerm, fulltextTerm, allTerm)
const simpleEdgeTerm = alt(parensTerm, notTerm, contextTerm, predicateTerm, allTerm)

function combine_term(simple_term: Parser<T, Term>) {
  // simple_term <and|or> simple_term
  return apply(seq(simple_term, rep_sc(seq(BoolOperationP, simple_term))), ([term, op_terms]) => {
    // combine all terms from right to left, so the order from left to right remains
    const combine_term = (left: Term, rest: [string, Term][]): Term => {
      if (rest.length === 0) {
        return left
      }
      const [[op, next], ...remaining] = rest
      return new CombinedTerm({ left, op, right: combine_term(next, remaining) })
    }
    return combine_term(term, op_terms)
  })
}

TermP.setPattern(combine_term(simpleTerm))
EdgeTermP.setPattern(combine_term(simpleEdgeTerm))

MergeQueryP.setPattern(
  apply(
    seq(PathP, tok(T.Colon), NavigationP, rep_sc(PartP)),
    ([path, _, navigation, parts]) =>
      new MergeQuery({
        path,
        query: new Query({ parts: [new Part({ term: new AllTerm(), navigation }), ...parts] }),
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

const asc = apply(tok(T.Asc), (_b) => SortOrder.asc)
const desc = apply(tok(T.Desc), (_b) => SortOrder.desc)
SortP.setPattern(
  apply(kright(tok(T.Sort), list_sc(seq(PathP, opt(alt(asc, desc))), tok(T.Comma))), (sorts) =>
    sorts.map(([path, dir]) => new Sort({ path, order: dir || SortOrder.asc })),
  ),
)

const default_edge = apply(tok(T.Default), (_) => EdgeType.default)
const delete_edge = apply(tok(T.Delete), (_) => EdgeType.delete)
const iam_edge = apply(tok(T.Iam), (_) => EdgeType.iam)
const edge_types_p = list_sc(alt(default_edge, delete_edge, iam_edge), tok(T.Comma))
const sepa = alt(tok(T.Comma), tok(T.Colon), tok(T.DotDot))
const range = apply(kmid(tok(T.LBracket), seq(tok(T.Integer), opt(sepa), opt(tok(T.Integer))), tok(T.RBracket)), ([start, sepa, end]) => {
  const start_num = parseInt(start.text)
  return sepa ? [start_num, end ? parseInt(end.text) : undefined] : [start_num, start_num]
})
const edge_filter_p = kmid(tok(T.LCurly), EdgeTermP, tok(T.RCurly))
const edge_detail = apply(
  seq(opt(edge_types_p), opt(range), opt(edge_filter_p), opt(edge_types_p)),
  ([et_before, range, edge_filter, et_after]) => {
    const start: number = range ? (range[0] ?? 1) : 1
    const until: number | undefined = range ? range[1] : 1
    return new Navigation({ start, until, edge_types: et_before || et_after || [EdgeType.default], edge_filter })
  },
)
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
  apply(
    kright(tok(T.Count), seq(OperationP, tok(T.Integer))),
    ([op, count]) =>
      new WithClauseFilter({
        op,
        num: parseInt(count.text),
      }),
  ),
)
WithClauseP.setPattern(
  apply(
    kright(tok(T.With), kmid(tok(T.LParen), seq(with_filter, tok(T.Comma), NavigationP, opt(TermP), opt(WithClauseP)), tok(T.RParen))),
    ([with_filter, _, navigation, term, with_clause]) => new WithClause({ with_filter, navigation, term, with_clause }),
  ),
)

const duration_part = apply(times_n(alt(as_str(T.Float), as_str(T.Integer), literalS)), (ts) => ts.join(''))
const duration_or_time = apply(times_n_sep(duration_part, tok(T.Colon)), (ts) => ts.join(':'))
const optional_end = opt(kright(seq(tok(T.Colon), tok(T.Colon)), duration_or_time))
const with_usage = apply(
  seq(duration_or_time, optional_end, tok(T.Comma), list_or_simple),
  ([start, end, _, metrics]) => new WithUsage({ start, end, metrics }),
)
WithUsageP.setPattern(kright(tok(T.WithUsage), kmid(tok(T.LParen), with_usage, tok(T.RParen))))

const part_term = apply(
  seq(TermP, opt(kmid(tok(T.LCurly), times_n_sep(MergeQueryP, tok(T.Comma)), tok(T.RCurly))), opt(TermP)),
  ([preFilter, merge, postFilter]) => {
    if (merge) {
      return new MergeTerm({ preFilter, merge, postFilter })
    } else {
      return preFilter
    }
  },
)

PartP.setPattern(
  apply(
    seq(opt(WithUsageP), part_term, opt(WithClauseP), opt(SortP), opt(LimitP), opt(NavigationP)),
    ([with_usage, term, with_clause, sort, limit, navigation]) =>
      new Part({
        term: term || new AllTerm(),
        with_clause,
        with_usage,
        sort,
        limit,
        navigation,
      }),
  ),
)

const aggregate_variable_name = apply(PathP, (path) => new AggregateVariableName({ path }))
const aggregate_variable_combined = apply(tok(T.DoubleQuotedString), (t) => new AggregateVariableCombined({ name: t.text }))
const aggregate_variable = apply(
  seq(alt(aggregate_variable_name, aggregate_variable_combined), opt(kright(str('as'), literalS))),
  ([name, as_name]) => new AggregateVariable({ name, as_name }),
)
const aggregate_func_name = alt(str('sum'), str('count'), str('min'), str('max'), str('avg'), str('stddev'), str('variance'))
const aggregate_func_ops = alt(tok(T.Plus), tok(T.Minus), tok(T.Star), tok(T.Slash), tok(T.Percent))
const aggregate_func_op = apply(
  seq(aggregate_func_ops, alt(tok(T.Float), tok(T.Integer))),
  ([op, value]) => new AggregateOp({ operation: op.text, value: parseFloat(value.text) }),
)
const aggregate_func = apply(
  seq(aggregate_func_name, tok(T.LParen), alt(PathP, numberP), rep_sc(aggregate_func_op), tok(T.RParen), opt(kright(str('as'), literalS))),
  ([func, _, path, ops, __, as_name]) => new AggregateFunction({ func: func.text, path, ops, as_name }),
)
const aggregate_parameter = seq(
  opt(kleft(times_n_sep(aggregate_variable, tok(T.Comma)), tok(T.Colon))),
  times_n_sep(aggregate_func, tok(T.Comma)),
)
AggregateP.setPattern(
  apply(
    kright(str('aggregate'), alt(kmid(tok(T.LParen), aggregate_parameter, tok(T.RParen)), aggregate_parameter)),
    ([group_by, group_func]) => new Aggregate({ group_by: group_by || [], group_func }),
  ),
)

const single_query = apply(
  seq(opt(str('search')), opt(kleft(AggregateP, tok(T.Colon))), times_n(PartP)),
  ([_, aggregate, parts]) => new Query({ parts, aggregate }),
)

function combine_parts(l: Query | Aggregate, r: Query | Aggregate): Query {
  if (l instanceof Query && r instanceof Query) {
    return l.combine(r)
  } else if (l instanceof Query && l.aggregate == undefined && r instanceof Aggregate) {
    return new Query({ parts: l.parts, aggregate: r })
  } else if (l instanceof Aggregate && r instanceof Query && r.aggregate == undefined) {
    return new Query({ parts: r.parts, aggregate: l })
  } else {
    throw new Error(`Can not combine ${l.toString()} and ${r.toString()}`)
  }
}

QueryP.setPattern(apply(times_n_sep(alt(single_query, AggregateP), tok(T.Pipe)), (ps) => ps.reduce((l, r) => combine_parts(l, r)) as Query))

export const parse_query = parse_expr(QueryP)
export const parse_path = parse_expr(PathP)
