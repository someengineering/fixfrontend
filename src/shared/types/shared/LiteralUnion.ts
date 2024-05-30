type Nothing = { _?: never }

export type LiteralUnion<LiteralType extends BaseType, BaseType> = LiteralType | (BaseType & Nothing)
