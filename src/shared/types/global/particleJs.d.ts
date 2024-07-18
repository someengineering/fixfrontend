interface ParticleJS {
  particles?: Particles
  interactivity?: Interactivity
  retina_detect?: boolean
}

interface Interactivity {
  detect_on?: string
  events?: Events
  modes?: Modes
}

interface Events {
  onhover?: Onclick
  onclick?: Onclick
  resize?: boolean
}

interface Onclick {
  enable?: boolean
  mode?: string
}

interface Modes {
  grab?: Grab
  bubble?: Bubble
  repulse?: Repulse
  push?: Push
  remove?: Push
}

interface Bubble {
  distance?: number
  size?: number
  duration?: number
  opacity?: number
  speed?: number
}

interface Grab {
  distance?: number
  line_linked?: GrabLineLinked
}

interface GrabLineLinked {
  opacity?: number
}

interface Push {
  particles_nb?: number
}

interface Repulse {
  distance?: number
  duration?: number
}

interface Particles {
  number?: ParticleNumber
  color?: Color
  shape?: Shape
  opacity?: Opacity
  size?: Opacity
  line_linked?: ParticlesLineLinked
  move?: Move
}

interface Color {
  value?: string
}

interface ParticlesLineLinked {
  enable?: boolean
  distance?: number
  color?: string
  opacity?: number
  width?: number
}

interface Move {
  enable?: boolean
  speed?: number
  direction?: string
  random?: boolean
  straight?: boolean
  out_mode?: string
  bounce?: boolean
  attract?: Attract
}

interface Attract {
  enable?: boolean
  rotateX?: number
  rotateY?: number
}

interface ParticleNumber {
  value?: number
  density?: Density
}

interface Density {
  enable?: boolean
  value_area?: number
}

interface Opacity {
  value?: number
  random?: boolean
  anim?: Anim
}

interface Anim {
  enable?: boolean
  speed?: number
  opacity_min?: number
  sync?: boolean
  size_min?: number
}

interface Shape {
  type?: string
  stroke?: Stroke
  polygon?: Polygon
  image?: Image
}

interface Image {
  src?: string
  width?: number
  height?: number
}

interface Polygon {
  nb_sides?: number
}

interface Stroke {
  width?: number
  color?: string
}

declare global {
  interface Window {
    particlesJS: (elementId: string, options: ParticleJS, nonce?: string) => void
    pJSDom: {
      pJS: {
        fn: {
          vendors: {
            destroypJS: () => void
          }
          canvasClear: () => void
          particlesEmpty: () => void
        }
      }
    }[]
  }
}

// convert it into a module by adding an empty export statement.
export {}
