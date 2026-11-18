import { Alg, Move } from 'cubing/alg'
import type { Locale } from './locale'

/** Alle losse zetten van een algoritme (haakjes uitgevouwen), als tekst. */
export function leafMoves(alg: string): string[] {
  return [...new Alg(alg).experimentalLeafMoves()].map((m) => m.toString())
}

const LAYER_NL: Record<string, string> = {
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

const WIDE_NL: Record<string, string> = {
  r: 'rechter twee lagen',
  l: 'linker twee lagen',
  u: 'bovenste twee lagen',
  d: 'onderste twee lagen',
  f: 'voorste twee lagen',
  b: 'achterste twee lagen',
}

/** Richting bij een kwartslag met de klok mee (+) of tegen de klok in (−). */
const DIRECTION_NL: Record<string, [string, string]> = {
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

const ROTATION_NL: Record<string, [string, string, string]> = {
  x: ['hele kubus kantelen zoals R: voorkant naar boven', "hele kubus kantelen zoals R': voorkant naar onder", 'hele kubus halve slag kantelen (zoals R2)'],
  y: ['hele kubus draaien zoals U: voorkant naar links', "hele kubus draaien zoals U': voorkant naar rechts", 'hele kubus halve slag draaien (zoals U2)'],
  z: ['hele kubus kantelen zoals F: bovenkant naar rechts', "hele kubus kantelen zoals F': bovenkant naar links", 'hele kubus halve slag kantelen (zoals F2)'],
}

const LAYER_EN: Record<string, string> = {
  R: 'right face',
  L: 'left face',
  U: 'top face',
  D: 'bottom face',
  F: 'front face',
  B: 'back face',
  M: 'middle slice (between L and R)',
  E: 'middle slice (between U and D)',
  S: 'middle slice (between F and B)',
}

const WIDE_EN: Record<string, string> = {
  r: 'right two layers',
  l: 'left two layers',
  u: 'top two layers',
  d: 'bottom two layers',
  f: 'front two layers',
  b: 'back two layers',
}

const DIRECTION_EN: Record<string, [string, string]> = {
  R: ['up (away from you)', 'down (towards you)'],
  L: ['down (towards you)', 'up (away from you)'],
  U: ['to the left', 'to the right'],
  D: ['to the right', 'to the left'],
  F: ['clockwise', 'counterclockwise'],
  B: ['clockwise (seen from the back)', 'counterclockwise (seen from the back)'],
  M: ['down, like L', 'up, like R'],
  E: ['to the right, like D', "to the left, like D'"],
  S: ['clockwise, like F', "counterclockwise, like F'"],
}

const ROTATION_EN: Record<string, [string, string, string]> = {
  x: ['tilt the whole cube like R: front goes up', "tilt the whole cube like R': front goes down", 'tilt the whole cube a half turn (like R2)'],
  y: ['turn the whole cube like U: front goes left', "turn the whole cube like U': front goes right", 'turn the whole cube a half turn (like U2)'],
  z: ['tilt the whole cube like F: top goes right', "tilt the whole cube like F': top goes left", 'tilt the whole cube a half turn (like F2)'],
}

const TABLES = {
  nl: { LAYER: LAYER_NL, WIDE: WIDE_NL, DIRECTION: DIRECTION_NL, ROTATION: ROTATION_NL, halfTurn: 'halve slag' },
  en: { LAYER: LAYER_EN, WIDE: WIDE_EN, DIRECTION: DIRECTION_EN, ROTATION: ROTATION_EN, halfTurn: 'half turn' },
}

/** Beschrijving van één zet, bijv. "R" → "rechterkant omhoog (van je af)" / "right face up (away from you)". */
export function describeMove(moveText: string, locale: Locale = 'nl'): string {
  const { LAYER, WIDE, DIRECTION, ROTATION, halfTurn } = TABLES[locale]
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
  if (half) return `${layer} ${halfTurn}`
  return `${layer} ${ccw ? dir[1] : dir[0]}`
}
