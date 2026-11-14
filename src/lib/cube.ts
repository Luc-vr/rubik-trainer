/**
 * Kubusmodel bovenop cubing.js (KPuzzle).
 *
 * Conventies van cubing.js (3x3x3):
 * - `pieces[p]` = welk stuk er op positie `p` staat.
 * - Sticker `i` van een positie (letter `i` in de positienaam) toont
 *   stuknaam[(i + orientatie) mod n].
 * - Middenstukken (centers) volgen hele-kubusrotaties (x, y, z) en slice-zetten.
 */
import { Alg } from 'cubing/alg'
import type { KPattern, KPuzzle } from 'cubing/kpuzzle'
import { cube3x3x3 } from 'cubing/puzzles'

export type Face = 'U' | 'D' | 'F' | 'B' | 'R' | 'L'

export const CORNER_NAMES = ['UFR', 'URB', 'UBL', 'ULF', 'DRF', 'DFL', 'DLB', 'DBR'] as const
export const EDGE_NAMES = ['UF', 'UR', 'UB', 'UL', 'DF', 'DR', 'DB', 'DL', 'FR', 'FL', 'BR', 'BL'] as const
export const CENTER_NAMES = ['U', 'L', 'F', 'R', 'B', 'D'] as const

let kp: KPuzzle | null = null

/** Laadt de KPuzzle-definitie. Moet één keer (async) gebeuren voordat de rest werkt. */
export async function initCube(): Promise<KPuzzle> {
  kp ??= await cube3x3x3.kpuzzle()
  return kp
}

export function kpuzzle(): KPuzzle {
  if (!kp) throw new Error('initCube() is nog niet aangeroepen')
  return kp
}

export function solved(): KPattern {
  return kpuzzle().defaultPattern()
}

export function patternFromAlg(alg: string): KPattern {
  return solved().applyAlg(alg)
}

export function invertAlg(alg: string): string {
  return new Alg(alg).invert().toString()
}

/** Plat algoritme zonder haakjes (cubing.js-uitgeschreven). */
export function expandAlg(alg: string): string {
  return new Alg(alg).expand().toString()
}

export const AUFS = ['', 'U', 'U2', "U'"] as const

/** Alle 24 hele-kubusrotaties. */
export const ROTATIONS: string[] = (() => {
  const a = ['', 'x', 'x2', "x'", 'z', "z'"]
  const b = ['', 'y', 'y2', "y'"]
  const out: string[] = []
  for (const p of a) for (const q of b) out.push(`${p} ${q}`.trim())
  return out
})()

function centersSolved(p: KPattern): boolean {
  const c = p.patternData['CENTERS'].pieces
  return c.every((v, i) => v === i)
}

/** Draait de hele kubus zo dat de middenstukken weer op hun plek staan (U boven, F voor). */
export function normalize(p: KPattern): KPattern {
  if (centersSolved(p)) return p
  for (const r of ROTATIONS) {
    const q = p.applyAlg(r)
    if (centersSolved(q)) return q
  }
  throw new Error('Kon de middenstukken niet terugdraaien')
}

/** Kleur (= oorspronkelijke zijde) van de sticker op positie `pos` aan zijde `face`. */
export function stickerAt(p: KPattern, pos: string, face: Face): Face {
  const i = pos.indexOf(face)
  if (i < 0) throw new Error(`Positie ${pos} heeft geen ${face}-sticker`)
  if (pos.length === 1) {
    const idx = CENTER_NAMES.indexOf(pos as Face)
    return CENTER_NAMES[p.patternData['CENTERS'].pieces[idx]] as Face
  }
  const isCorner = pos.length === 3
  const names: readonly string[] = isCorner ? CORNER_NAMES : EDGE_NAMES
  const orbit = p.patternData[isCorner ? 'CORNERS' : 'EDGES']
  const idx = names.indexOf(pos)
  if (idx < 0) throw new Error(`Onbekende positie ${pos}`)
  const piece = names[orbit.pieces[idx]]
  const o = orbit.orientation[idx]
  return piece[(i + o) % pos.length] as Face
}

/** Positienamen per zijde, als 3x3-raster (rij voor rij) zoals je die zijde bekijkt. */
export const FACE_GRIDS: Record<Face, string[]> = {
  // Bovenaanzicht: achterkant boven in beeld, voorkant onder.
  U: ['UBL', 'UB', 'URB', 'UL', 'U', 'UR', 'ULF', 'UF', 'UFR'],
  F: ['ULF', 'UF', 'UFR', 'FL', 'F', 'FR', 'DFL', 'DF', 'DRF'],
  R: ['UFR', 'UR', 'URB', 'FR', 'R', 'BR', 'DRF', 'DR', 'DBR'],
  B: ['URB', 'UB', 'UBL', 'BR', 'B', 'BL', 'DBR', 'DB', 'DLB'],
  L: ['UBL', 'UL', 'ULF', 'BL', 'L', 'FL', 'DLB', 'DL', 'DFL'],
  D: ['DFL', 'DF', 'DRF', 'DL', 'D', 'DR', 'DLB', 'DB', 'DBR'],
}

export function faceStickers(p: KPattern, face: Face): Face[] {
  return FACE_GRIDS[face].map((pos) => stickerAt(p, pos, face))
}

/**
 * Setup-zetten die precies de case van `alg` opzetten:
 * `preAUF` + inverse(alg) + `postAUF`. Het algoritme lost dit op na
 * eerst inverse(postAUF) te doen; daarna blijft hooguit inverse(preAUF) over.
 */
export function caseSetup(alg: string, preAUF = '', postAUF = ''): string {
  return [preAUF, invertAlg(alg), postAUF].filter(Boolean).join(' ')
}

export function casePattern(alg: string, preAUF = '', postAUF = ''): KPattern {
  return patternFromAlg(caseSetup(alg, preAUF, postAUF))
}

/** Netto hele-kubusrotatie van een algoritme (leeg als er geen is). */
export function netRotation(alg: string): string {
  const p = patternFromAlg(alg)
  if (centersSolved(p)) return ''
  for (const r of ROTATIONS) {
    if (centersSolved(p.applyAlg(r))) return invertAlg(r)
  }
  return '?'
}

export function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Naam van het stuk (bijv. "DRF") dat op positie `pos` staat. */
export function pieceAt(p: KPattern, pos: string): string {
  if (pos.length === 1) return CENTER_NAMES[p.patternData['CENTERS'].pieces[CENTER_NAMES.indexOf(pos as Face)]]
  const isCorner = pos.length === 3
  const names: readonly string[] = isCorner ? CORNER_NAMES : EDGE_NAMES
  return names[p.patternData[isCorner ? 'CORNERS' : 'EDGES'].pieces[names.indexOf(pos)]]
}

/** Kleuren: geel boven, groen voor, oranje rechts (wit kruis onder). */
export const STICKER_COLORS: Record<Face, string> = {
  U: '#fcd34d',
  D: '#f8fafc',
  F: '#16a34a',
  B: '#2563eb',
  R: '#f97316',
  L: '#dc2626',
}
export const GREY = '#94a3b8'
export const DARK_GREY = '#475569'
