import type { LiquidGlassCarouselItem } from './liquid-glass-carousel'

const PORTRAIT_ASPECT = 3 / 4

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&h=1200&q=85&auto=format&fit=crop`

/**
 * The vendored demo's placeholder set, kept verbatim so the component can run
 * standalone. KYNA passes its own Cloudinary service images instead.
 */
export const liquidGlassCarouselDefaultItems: LiquidGlassCarouselItem[] = [
  {
    title: 'Project One',
    src: photo('1600585154340-be6161a56a0c'),
    aspect: PORTRAIT_ASPECT,
  },
  {
    title: 'Project Two',
    src: photo('1514906689926-25ba6dcb584b'),
    aspect: PORTRAIT_ASPECT,
  },
  {
    title: 'Project Three',
    src: photo('1568557412756-7d219873dd11'),
    aspect: PORTRAIT_ASPECT,
  },
  {
    title: 'Project Four',
    src: photo('1581892805885-73bdd91beff0'),
    aspect: PORTRAIT_ASPECT,
  },
  {
    title: 'Project Five',
    src: photo('1482938289607-e9573fc25ebb'),
    aspect: PORTRAIT_ASPECT,
  },
  {
    title: 'Project Six',
    src: photo('1610846202780-b4d9837371ea'),
    aspect: PORTRAIT_ASPECT,
  },
  {
    title: 'Project Seven',
    src: photo('1527630941-4a229fd674ab'),
    aspect: PORTRAIT_ASPECT,
  },
  {
    title: 'Project Eight',
    src: photo('1603786420263-ad59136a7409'),
    aspect: PORTRAIT_ASPECT,
  },
]
