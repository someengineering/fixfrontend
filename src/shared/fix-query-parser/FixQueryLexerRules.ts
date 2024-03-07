import { FixTokens } from './FixTokens'

// Simple lexer rules that can be expresses as a regular expression.
// [keep, is_text, regexp, kind]
// keep: if true, the token is kept, if false, the token is discarded
// regexp: the regular expression to match the token
// kind: the token kind to return when the regular expression matches.
//

// Note: we have special rules only for: Literal, SingleQuotedString, DoubleQuotedString
export const FixQueryLexerRules: [boolean, RegExp, FixTokens][] = [
  [false, /^\s+/g, FixTokens.Space],
  [true, /^is/g, FixTokens.IS],
  [true, /^id/g, FixTokens.ID],
  [true, /^in/g, FixTokens.In],
  [true, /^with/g, FixTokens.With],
  [true, /^any/g, FixTokens.Any],
  [true, /^empty/g, FixTokens.Empty],
  [true, /^all/g, FixTokens.All],
  [true, /^count/g, FixTokens.Count],
  [true, /^not/g, FixTokens.Not],
  [true, /^and/g, FixTokens.And],
  [true, /^or/g, FixTokens.Or],
  [true, /^limit/g, FixTokens.Limit],
  [true, /^sort/g, FixTokens.Sort],
  [true, /^asc/g, FixTokens.Asc],
  [true, /^desc/g, FixTokens.Desc],
  [true, /^true/g, FixTokens.True],
  [true, /^false/g, FixTokens.False],
  [true, /^null/g, FixTokens.Null],
  [true, /^default/g, FixTokens.Default],
  [true, /^delete/g, FixTokens.Delete],
  [true, /^\(/g, FixTokens.LParen],
  [true, /^\)/g, FixTokens.RParen],
  [true, /^\[/g, FixTokens.LBracket],
  [true, /^]/g, FixTokens.RBracket],
  [true, /^[{]/g, FixTokens.LCurly],
  [true, /^[}]/g, FixTokens.RCurly],
  [true, /^[.]/g, FixTokens.Dot],
  [true, /^[.]{2}/g, FixTokens.DotDot],
  [true, /^;/g, FixTokens.Semicolon],
  [true, /^,/g, FixTokens.Comma],
  [true, /^:/g, FixTokens.Colon],
  [true, /^[+-]?[0-9]+\.[0-9]+/g, FixTokens.Float],
  [true, /^[+-]?[0-9]+/g, FixTokens.Integer],
  [true, /^->/g, FixTokens.Outbound],
  [true, /^<-/g, FixTokens.Inbound],
  [true, /^[+]/g, FixTokens.Plus],
  [true, /^-/g, FixTokens.Minus],
  [true, /^\*/g, FixTokens.Star],
  [true, /^\//g, FixTokens.Slash],
  [true, /^!~/g, FixTokens.NotTilde],
  [true, /^~/g, FixTokens.Tilde],
  [true, /^=/g, FixTokens.Equal],
  [true, /^!=/g, FixTokens.NotEqual],
  [true, /^<=/g, FixTokens.LessThanEqual],
  [true, /^>=/g, FixTokens.GreaterThanEqual],
  [true, /^</g, FixTokens.LessThan],
  [true, /^>/g, FixTokens.GreaterThan],
]
