import { beforeAll, describe, expect, it } from 'vitest'
import { initCube, normalize, patternFromAlg, caseSetup, AUFS } from '../src/lib/cube'
import { makeScramble, removeRotations, simplify } from '../src/lib/scramble'
import { ALL_CASES } from '../src/data'

beforeAll(async () => {
  await initCube()
})

function same(a: string, b: string) {
  return normalize(patternFromAlg(a)).isIdentical(normalize(patternFromAlg(b)))
}

describe('scrambles', () => {
  it('rotaties wegwerken verandert de toestand niet (op een rotatie na)', () => {
    for (const a of ["y R U R'", "x R U' x'", "z U R z' F", "y' M U M'", "x' r U y E S"]) {
      const r = removeRotations(a)
      expect(r).not.toMatch(/[xyz]/)
      expect(same(a, r), `${a} -> ${r}`).toBe(true)
    }
  })
  it('vereenvoudigen voegt U-zetten samen', () => {
    expect(simplify("U R U' U'")).toBe("U R U2")
    expect(simplify("R U U' R' F F F")).toBe("F'")
    expect(simplify("R2' U2'")).toBe('R2 U2')
  })
  it('elke case: scramble zet precies de case op en bevat geen rotaties', () => {
    for (const c of ALL_CASES) {
      for (let i = 0; i < 3; i++) {
        const s = makeScramble(c.alg)
        expect(s.text, c.id).not.toMatch(/[xyz]/)
        expect(AUFS).toContain(s.pre)
        expect(same(s.text, caseSetup(c.alg, s.pre, s.post)), `${c.id}: ${s.text}`).toBe(true)
      }
    }
  })
})
