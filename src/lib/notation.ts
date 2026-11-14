import { Alg, Move } from 'cubing/alg'

/** Alle losse zetten van een algoritme (haakjes uitgevouwen), als tekst. */
export function leafMoves(alg: string): string[] {
  return [...new Alg(alg).experimentalLeafMoves()].map((m) => m.toString())
}

const LAYER: Record<string, string> = {
  R: 'rechterkant',
  L: 'linkerkant',
  U: 'bovenkant',
  D: 'onderkant',
  F: 'voorkant',
  B: 'achterkant',
  M: 'middenlaag (tussen L en R)',
  E: 'middenlaag (tussen U en D)',
  S: 'middenlaag (tussen F en B)',
}

const WIDE: Record<string, string> = {
  r: 'rechter twee lagen',
  l: 'linker twee lagen',
  u: 'bovenste twee lagen',
  d: 'onderste twee lagen',
  f: 'voorste twee lagen',
  b: 'achterste twee lagen',
}

/** Richting bij een kwartslag met de klok mee (+) of tegen de klok in (−). */
const DIRECTION: Record<string, [string, string]> = {
  R: ['omhoog (van je af)', 'omlaag (naar je toe)'],
  L: ['omlaag (naar je toe)', 'omhoog (van je af)'],
  U: ['naar links', 'naar rechts'],
  D: ['naar rechts', 'naar links'],
  F: ['met de klok mee', 'tegen de klok in'],
  B: ['met de klok mee (gezien vanaf de achterkant)', 'tegen de klok in (gezien vanaf de achterkant)'],
  M: ['omlaag, zoals L', 'omhoog, zoals R'],
  E: ['naar rechts, zoals D', 'naar links, zoals D\''],
  S: ['met de klok mee, zoals F', 'tegen de klok in, zoals F\''],
}

const ROTATION: Record<string, [string, string, string]> = {
  x: ['hele kubus kantelen zoals R: voorkant naar boven', "hele kubus kantelen zoals R': voorkant naar onder", 'hele kubus halve slag kantelen (zoals R2)'],
  y: ['hele kubus draaien zoals U: voorkant naar links', "hele kubus draaien zoals U': voorkant naar rechts", 'hele kubus halve slag draaien (zoals U2)'],
  z: ['hele kubus kantelen zoals F: bovenkant naar rechts', "hele kubus kantelen zoals F': bovenkant naar links", 'hele kubus halve slag kantelen (zoals F2)'],
}

/** Nederlandse beschrijving van één zet, bijv. "R" → "rechterkant omhoog (van je af)". */
export function describeMove(moveText: string): string {
  let move: Move
  try {
    move = new Move(moveText)
  } catch {
    return moveText
  }
  // `Rw` en `3Rw` enz. behandelen als brede zetten.
  let family = move.family
  if (family.endsWith('w') && family.length === 2) family = family[0].toLowerCase()
  const amount = move.amount
  const half = Math.abs(amount) === 2
  const ccw = amount < 0

  if (ROTATION[family]) {
    const [cw, acw, h] = ROTATION[family]
    return half ? h : ccw ? acw : cw
  }
  const upper = family.toUpperCase()
  const layer = LAYER[family] ?? WIDE[family]
  const dir = DIRECTION[family] ?? DIRECTION[upper]
  if (!layer || !dir) return moveText
  if (half) return `${layer} halve slag`
  return `${layer} ${ccw ? dir[1] : dir[0]}`
}
