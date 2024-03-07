import { Token, TokenPosition } from 'typescript-parsec'
import { FixLexer } from './FixLexer'
import { FixTokens } from './FixTokens'

// Token implementation for the FixLexer
export class LexerToken implements Token<FixTokens> {
  private nextToken: LexerToken | undefined | null

  constructor(
    private readonly lexer: FixLexer,
    private readonly input: string,
    public kind: FixTokens,
    public text: string,
    public pos: TokenPosition,
    public keep: boolean,
  ) {}

  public get next(): LexerToken | undefined {
    if (this.nextToken === undefined) {
      this.nextToken = this.lexer.parseNextAvailable(this.input, this.pos.index + this.text.length, this.pos.rowEnd, this.pos.columnEnd)
      if (this.nextToken === undefined) {
        this.nextToken = null
      }
    }
    return this.nextToken === null ? undefined : this.nextToken
  }
}
