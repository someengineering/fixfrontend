const replaceDashToSpace = (str: string) => str.replace(/-/g, ' ')

export const snakeCaseToUFStr = (str: string) => str.charAt(0).toUpperCase() + replaceDashToSpace(str.slice(1))
