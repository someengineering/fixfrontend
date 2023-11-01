type Color = [number, number, number]
type ColorList = Color[]

const RED: Color = [224, 26, 79]
const GREEN: Color = [0, 172, 107]
const YELLOW: Color = [255, 179, 0]

export const getColor = () => {
  function createGradient(colors: ColorList, steps: number = 255): ColorList {
    function gradientBetween(color1: Color, color2: Color, steps: number): ColorList {
      const gradient: ColorList = []
      for (let step = 0; step < steps; step++) {
        gradient.push([
          Math.round(color1[0] + ((color2[0] - color1[0]) * step) / steps),
          Math.round(color1[1] + ((color2[1] - color1[1]) * step) / steps),
          Math.round(color1[2] + ((color2[2] - color1[2]) * step) / steps),
        ])
      }
      return gradient
    }

    const fullGradient: ColorList = []
    for (let i = 0; i < colors.length - 1; i++) {
      fullGradient.push(...gradientBetween(colors[i], colors[i + 1], steps))
    }
    fullGradient.push(colors[colors.length - 1])
    return fullGradient
  }

  function remap(x: number, inMin: number, inMax: number, outMin: number, outMax: number, minMaxCutoff: boolean = true): number {
    if (minMaxCutoff) {
      x = Math.min(Math.max(x, inMin), inMax)
    }
    return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }

  const colorGradient: ColorList = createGradient([RED, YELLOW, GREEN]) as ColorList

  const alertScore: number = 20
  const scoreMap: ColorList = []
  const result: string[] = []

  for (let score = 0; score <= 100; score++) {
    const colorIndex: number = Math.round(remap(score, alertScore, 100, 0, colorGradient.length - 1))
    scoreMap.push(colorGradient[colorIndex])
  }

  for (let i = 0; i < scoreMap.length; i++) {
    const score = scoreMap[i]
    result.push(
      `#${('0' + score[0].toString(16)).slice(-2)}${('0' + score[1].toString(16)).slice(-2)}${('0' + score[2].toString(16)).slice(-2)}`,
    )
  }

  return result
}

export const colorFromRedToGreen = getColor()
// [
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04040',
//   '#c04340',
//   '#c04640',
//   '#c04a40',
//   '#c04d40',
//   '#c05040',
//   '#c05340',
//   '#c05640',
//   '#c05a40',
//   '#c05c40',
//   '#c06040',
//   '#c06340',
//   '#c06640',
//   '#c06a40',
//   '#c06c40',
//   '#c07040',
//   '#c07340',
//   '#c07640',
//   '#c07a40',
//   '#c07c40',
//   '#c08040',
//   '#c08340',
//   '#c08640',
//   '#c08a40',
//   '#c08c40',
//   '#c09040',
//   '#c09340',
//   '#c09640',
//   '#c09940',
//   '#c09c40',
//   '#c0a040',
//   '#c0a340',
//   '#c0a640',
//   '#c0a940',
//   '#c0ac40',
//   '#c0b040',
//   '#c0b340',
//   '#c0b640',
//   '#c0b940',
//   '#c0bc40',
//   '#c0c040',
//   '#bcc040',
//   '#b9c040',
//   '#b6c040',
//   '#b3c040',
//   '#b0c040',
//   '#acc040',
//   '#a9c040',
//   '#a6c040',
//   '#a3c040',
//   '#a0c040',
//   '#9cc040',
//   '#99c040',
//   '#96c040',
//   '#93c040',
//   '#90c040',
//   '#8cc040',
//   '#8ac040',
//   '#86c040',
//   '#83c040',
//   '#80c040',
//   '#7cc040',
//   '#7ac040',
//   '#76c040',
//   '#73c040',
//   '#70c040',
//   '#6cc040',
//   '#6ac040',
//   '#66c040',
//   '#63c040',
//   '#60c040',
//   '#5cc040',
//   '#5ac040',
//   '#56c040',
//   '#53c040',
//   '#50c040',
//   '#4dc040',
//   '#4ac040',
//   '#46c040',
//   '#43c040',
//   '#40c040',
// ]
