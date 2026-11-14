/**
 * Analyse van kubustoestanden: is F2L heel, is de laatste laag georiënteerd,
 * en een "vingerafdruk" per case (ongevoelig voor AUF) om cases te herkennen.
 */
import type { KPattern } from 'cubing/kpuzzle'
import { AUFS, CORNER_NAMES, EDGE_NAMES, normalize, patternFromAlg } from './cube'
import type { CubeSet } from '../data/types'

function solvedAt(p: KPattern, orbit: 'EDGES' | 'CORNERS', idx: number): boolean {
  const o = p.patternData[orbit]
  return o.pieces[idx] === idx && o.orientation[idx] === 0
}

const D_EDGES = [4, 5, 6, 7]
const SLOT_EDGES = [8, 9, 10, 11] // FR, FL, BR, BL
const D_CORNERS = [4, 5, 6, 7] // DRF, DFL, DLB, DBR

export function crossSolved(p: KPattern): boolean {
  return D_EDGES.every((i) => solvedAt(p, 'EDGES', i))
}

export function f2lSolved(p: KPattern): boolean {
  return (
    crossSolved(p) &&
    SLOT_EDGES.every((i) => solvedAt(p, 'EDGES', i)) &&
    D_CORNERS.every((i) => solvedAt(p, 'CORNERS', i))
  )
}

/** Kruis + de slots FL, BL en BR (alles behalve het FR-slot). */
export function otherSlotsSolved(p: KPattern): boolean {
  return (
    crossSolved(p) &&
    [9, 10, 11].every((i) => solvedAt(p, 'EDGES', i)) &&
    [5, 6, 7].every((i) => solvedAt(p, 'CORNERS', i))
  )
}

export function frSlotSolved(p: KPattern): boolean {
  return solvedAt(p, 'EDGES', 8) && solvedAt(p, 'CORNERS', 4)
}

export function llOriented(p: KPattern): boolean {
  const e = p.patternData['EDGES'].orientation
  const c = p.patternData['CORNERS'].orientation
  return [0, 1, 2, 3].every((i) => e[i] === 0 && c[i] === 0)
}

export function llPermuted(p: KPattern): boolean {
  const e = p.patternData['EDGES'].pieces
  const c = p.patternData['CORNERS'].pieces
  return [0, 1, 2, 3].every((i) => e[i] === i && c[i] === i)
}

/** Oriëntatiepatroon van de bovenlaag (randen + hoeken), positie voor positie. */
function ollKey(p: KPattern): string {
  const e = p.patternData['EDGES'].orientation.slice(0, 4).join('')
  const c = p.patternData['CORNERS'].orientation.slice(0, 4).join('')
  return `${e}/${c}`
}

function pllKey(p: KPattern): string {
  const e = p.patternData['EDGES'].pieces.slice(0, 4).join('')
  const c = p.patternData['CORNERS'].pieces.slice(0, 4).join('')
  return `${e}/${c}`
}

function f2lKey(p: KPattern): string {
  const c = p.patternData['CORNERS']
  const e = p.patternData['EDGES']
  const cp = c.pieces.indexOf(4)
  const ep = e.pieces.indexOf(8)
  return `${CORNER_NAMES[cp]}${c.orientation[cp]}-${EDGE_NAMES[ep]}${e.orientation[ep]}`
}

/**
 * Vingerafdruk van de case die ontstaat na de setup-zetten `setup`,
 * minimaal over alle AUF's, zodat dezelfde case vanuit een andere hoek
 * dezelfde vingerafdruk geeft.
 */
export function caseSignature(set: CubeSet, setup: string): string {
  const keys: string[] = []
  const pres = set === 'PLL' ? AUFS : ['']
  for (const a of pres) {
    for (const b of AUFS) {
      const p = normalize(patternFromAlg(`${a} ${setup} ${b}`))
      keys.push(set === 'OLL' ? ollKey(p) : set === 'PLL' ? pllKey(p) : f2lKey(p))
    }
  }
  keys.sort()
  return keys[0]
}

/** Vingerafdruk van de opgeloste toestand (voor de controle "case is niet triviaal"). */
export function solvedSignature(set: CubeSet): string {
  return caseSignature(set, '')
}

/** Info voor tests/diagnose: waar zitten het FR-hoekje en de FR-rand? */
export function describeF2L(setup: string): string {
  return f2lKey(normalize(patternFromAlg(setup)))
}

/** Aantal georiënteerde randen/hoeken in de bovenlaag. */
export function llOrientationCounts(p: KPattern): { edges: number; corners: number; edgeShape: 'none' | 'line' | 'L' | 'all' | 'other' } {
  const e = p.patternData['EDGES'].orientation.slice(0, 4)
  const c = p.patternData['CORNERS'].orientation.slice(0, 4)
  const edges = e.filter((x) => x === 0).length
  const corners = c.filter((x) => x === 0).length
  let edgeShape: 'none' | 'line' | 'L' | 'all' | 'other' = 'other'
  if (edges === 0) edgeShape = 'none'
  else if (edges === 4) edgeShape = 'all'
  else if (edges === 2) edgeShape = e[0] === e[2] ? 'line' : 'L'
  return { edges, corners, edgeShape }
}
