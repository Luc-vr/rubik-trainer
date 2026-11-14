/**
 * Scrambles voor de timer: inverse van het algoritme plus een willekeurige AUF
 * ervoor en erna. Rotaties (x, y, z) worden weggewerkt door de volgende zetten
 * om te rekenen naar vaste zijden, zodat je de kubus niet hoeft te draaien.
 */
import { Alg, Move } from 'cubing/alg'
import { AUFS, caseSetup, randomItem, type Face } from './cube'

type Frame = Record<Face, Face>
const IDENTITY: Frame = { U: 'U', D: 'D', F: 'F', B: 'B', R: 'R', L: 'L' }

function rotateOnce(f: Frame, axis: 'x' | 'y' | 'z'): Frame {
  if (axis === 'x') return { ...f, U: f.F, F: f.D, D: f.B, B: f.U }
  if (axis === 'y') return { ...f, F: f.R, R: f.B, B: f.L, L: f.F }
  return { ...f, U: f.L, L: f.D, D: f.R, R: f.U }
}

/** Slice die draait in dezelfde richting als zijde X. */
const SLICE_LIKE: Record<Face, [string, number]> = {
  L: ['M', 1], R: ['M', -1], D: ['E', 1], U: ['E', -1], F: ['S', 1], B: ['S', -1],
}
const SLICE_BASE: Record<string, Face> = { M: 'L', E: 'D', S: 'F' }

/** Herschrijft een algoritme zonder rotaties (zetten t.o.v. vaste zijden). */
export function removeRotations(alg: string): string {
  let frame = { ...IDENTITY }
  const out: string[] = []
  for (const m of new Alg(alg).experimentalLeafMoves()) {
    const fam = m.family
    const amt = m.amount
    if (fam === 'x' || fam === 'y' || fam === 'z') {
      const times = ((amt % 4) + 4) % 4
      for (let i = 0; i < times; i++) frame = rotateOnce(frame, fam)
      continue
    }
    if (fam in SLICE_BASE) {
      const [slice, sign] = SLICE_LIKE[frame[SLICE_BASE[fam]]]
      out.push(new Move(slice, amt * sign).toString())
      continue
    }
    const upper = fam[0].toUpperCase() as Face
    const isWide = fam === fam.toLowerCase() || fam.endsWith('w')
    if (!(upper in frame)) {
      out.push(m.toString())
      continue
    }
    const phys = frame[upper]
    out.push(new Move(isWide ? phys.toLowerCase() : phys, amt).toString())
  }
  return out.join(' ')
}

/** Voegt opeenvolgende zetten van dezelfde laag samen (modulo 4), bijv. "U U'" → weg, "U U" → "U2". */
export function simplify(alg: string): string {
  const stack: Move[] = []
  for (const m of new Alg(alg).experimentalLeafMoves()) {
    const top = stack[stack.length - 1]
    if (top && top.family === m.family && top.innerLayer === m.innerLayer && top.outerLayer === m.outerLayer) {
      stack.pop()
      const amt = (((top.amount + m.amount) % 4) + 4) % 4
      if (amt !== 0) stack.push(top.modified({ amount: amt === 3 ? -1 : amt }))
    } else {
      const amt = ((m.amount % 4) + 4) % 4
      if (amt !== 0) stack.push(m.modified({ amount: amt === 3 ? -1 : amt }))
    }
  }
  return stack.map((m) => m.toString()).join(' ')
}

export interface Scramble {
  pre: string
  post: string
  /** De scramble zoals getoond (zonder rotaties, vereenvoudigd). */
  text: string
}

export function makeScramble(alg: string): Scramble {
  const pre = randomItem(AUFS)
  const post = randomItem(AUFS)
  const text = simplify(removeRotations(caseSetup(alg, pre, post)))
  return { pre, post, text }
}
