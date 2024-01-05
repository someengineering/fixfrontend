const pluralRegex = new RegExp(
  '(?:zero {([# a-zA-Z0-9]*)} )?(?:one {([# a-zA-Z0-9]*)} )?(?:two {([# a-zA-Z0-9]*)} )?(?:few {([# a-zA-Z0-9]*)} )?(?:many {([# a-zA-Z0-9]*)} )?(?:other {([# a-zA-Z0-9]*)})?',
)

const pluralWorks = (message: string, values: Record<string, number>) => {
  const groups = pluralRegex.exec(message.substring(12, message.length - 1))
  if (groups) {
    const [, zero, one, two, few, many, other] = groups
    if (values['0'] === 0 && zero) {
      return zero.replace('#', '0')
    }
    if (values['0'] === 1 && one) {
      return one.replace('#', '1')
    }
    if (values['0'] === 2 && two) {
      return two.replace('#', '2')
    }
    if (values['0'] < 10 && few) {
      return few.replace('#', values['0'].toString())
    }
    if (values['0'] > 0 && many) {
      return many.replace('#', values['0'].toString())
    }
    return other.replace('#', values['0'].toString())
  }
  return message
}

export const i18n = {
  load: () => {},
  loadLocaleData: () => {},
  activate: () => {},
  _: ({ message, values }: { message: string; values: Record<string, string> }) =>
    message
      ? message.startsWith('{') && message.endsWith('}')
        ? pluralWorks(message, values as unknown as Record<string, number>)
        : message.replace(/{([A-Za-z0-9]+)}/g, (_, prop) => values[prop].toString())
      : '',
}
