const replaceDashToSpace = (str: string) => str.replace(/[-_]/g, ' ')

export const wordToUFStr = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const snakeCaseToUFStr = (str: string) => str.charAt(0).toUpperCase() + replaceDashToSpace(str.slice(1))

export const snakeCaseWordsToUFStr = (str: string) => replaceDashToSpace(str).split(' ').map(wordToUFStr).join(' ')
