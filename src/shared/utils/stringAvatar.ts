import { stringToColor } from './stringToColor'

export const stringAvatar = (name: string) => {
  const splittedName = name.split(/[^A-Za-z]/)
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${splittedName[0]?.[0]?.toLocaleUpperCase() ?? ''}${splittedName[1]?.[0]?.toLocaleUpperCase() ?? ''}`,
  }
}
