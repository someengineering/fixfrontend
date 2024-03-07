// A string is parsed into a stream of tokens. All available token kinds are defined in the T enum.
export enum FixTokens {
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
  DotDot, // ..
  Dot, // .
  Comma, // ,
  Colon, // :
  Float, // 1.0
  Integer, // 1
  Plus, // +
  Minus, // -
  Star, // *
  Slash, // /
  Equal, // =
  Tilde, // ~
  NotTilde,
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
  SingleQuotedString, // "abc"
  DoubleQuotedString, // "abc"
  Literal, // abc
}
