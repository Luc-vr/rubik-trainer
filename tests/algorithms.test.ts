/**
 * Verificatie van alle algoritmes met cubing.js (KPuzzle).
 * - OLL/PLL laten de eerste twee lagen intact.
 * - PLL laat de oriëntatie van de laatste laag intact.
 * - F2L laat het kruis en de andere drie slots intact, en lost het FR-slot op.
 * - Binnen een set geven geen twee cases dezelfde startpositie (modulo AUF),
 *   en het aantal cases is precies het totale aantal mogelijke cases.
 * - Alternatieven lossen precies dezelfde case op als het hoofdalgoritme.
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { Alg } from 'cubing/alg'
import { AUFS, initCube, invertAlg, normalize, patternFromAlg } from '../src/lib/cube'
import {
  caseSignature,
  f2lSolved,
  frSlotSolved,
  llOriented,
  llPermuted,
  otherSlotsSolved,
  solvedSignature,
} from '../src/lib/caseState'
import { CASES_BY_SET, GROUPS_BY_SET } from '../src/data'
import type { AlgCase, CubeSet } from '../src/data/types'

beforeAll(async () => {
  await initCube()
})

const EXPECTED_COUNT: Record<CubeSet, number> = { F2L: 41, OLL: 57, PLL: 21 }

function allAlgs(c: AlgCase): string[] {
  return [c.alg, ...c.alternatives]
}

/** Voert het algoritme uit op een opgeloste kubus en draait de kubus recht. */
function after(alg: string) {
  return normalize(patternFromAlg(alg))
}

function checkAlgValid(set: CubeSet, alg: string) {
  const p = after(alg)
  if (set === 'OLL') {
    expect(f2lSolved(p), 'F2L moet intact blijven').toBe(true)
  } else if (set === 'PLL') {
    expect(f2lSolved(p), 'F2L moet intact blijven').toBe(true)
    expect(llOriented(p), 'oriëntatie laatste laag moet intact blijven').toBe(true)
  } else {
    expect(otherSlotsSolved(p), 'kruis en andere slots moeten intact blijven').toBe(true)
  }
}

function checkSolvesOwnCase(set: CubeSet, alg: string) {
  // Na setup + algoritme moet de relevante stap (op een AUF na) opgelost zijn.
  const setup = invertAlg(alg)
  const ok = AUFS.some((auf) => {
    const p = after(`${setup} ${auf} ${alg}`)
    if (set === 'OLL') return f2lSolved(p) && llOriented(p)
    if (set === 'PLL') return f2lSolved(p) && llOriented(p) && llPermuted(p)
    return otherSlotsSolved(p) && frSlotSolved(p)
  })
  expect(ok).toBe(true)
}

for (const set of ['PLL', 'OLL', 'F2L'] as CubeSet[]) {
  const cases = CASES_BY_SET[set]
  describe.skipIf(cases.length === 0)(`${set}`, () => {
    it(`heeft precies ${EXPECTED_COUNT[set]} cases met unieke id's`, () => {
      expect(cases.length).toBe(EXPECTED_COUNT[set])
      expect(new Set(cases.map((c) => c.id)).size).toBe(cases.length)
    })

    it('elke case hoort bij een bekende groep en heeft herkenning + stappen', () => {
      for (const c of cases) {
        expect(GROUPS_BY_SET[set], c.id).toContain(c.group)
        expect(c.recognition.length, c.id).toBeGreaterThan(20)
        expect(c.steps.length, c.id).toBeGreaterThan(0)
        for (const s of c.steps) expect(s.desc.length, `${c.id} ${s.moves}`).toBeGreaterThan(3)
      }
    })

    it('alle algoritmes zijn geldige notatie', () => {
      for (const c of cases) for (const a of allAlgs(c)) expect(() => new Alg(a), `${c.id}: ${a}`).not.toThrow()
    })

    for (const c of cases) {
      describe(c.name, () => {
        it('hoofdalgoritme laat de rest van de kubus intact', () => checkAlgValid(set, c.alg))
        it('hoofdalgoritme lost zijn eigen case op', () => checkSolvesOwnCase(set, c.alg))
        it('is geen triviale (al opgeloste) case', () => {
          expect(caseSignature(set, invertAlg(c.alg))).not.toBe(solvedSignature(set))
        })
        for (const alt of c.alternatives) {
          it(`alternatief "${alt}" is geldig en lost dezelfde case op`, () => {
            checkAlgValid(set, alt)
            expect(caseSignature(set, invertAlg(alt))).toBe(caseSignature(set, invertAlg(c.alg)))
          })
        }
      })
    }

    it('geen twee cases leveren dezelfde startpositie op (modulo AUF)', () => {
      const seen = new Map<string, string>()
      const dups: string[] = []
      for (const c of cases) {
        const sig = caseSignature(set, invertAlg(c.alg))
        const other = seen.get(sig)
        if (other) dups.push(`${c.id} = ${other}`)
        seen.set(sig, c.id)
      }
      expect(dups).toEqual([])
    })
  })
}

describe('groepen kloppen met de kubustoestand', () => {
  it('OLL: vorm van de randen en aantal gele hoeken per groep', async () => {
    const { casePattern } = await import('../src/lib/cube')
    const { llOrientationCounts } = await import('../src/lib/caseState')
    const EDGES: Record<string, string> = {
      'Kruis (OCLL)': 'all', Punt: 'none', Lijn: 'line', 'T-vorm': 'line', 'C-vorm': 'line', Paard: 'line',
      'Grote bliksem': 'line', Vierkant: 'L', 'W-vorm': 'L', 'P-vorm': 'L', 'Kleine bliksem': 'L', Vis: 'L',
      Lastig: 'L', 'Grote L': 'L', 'Hoeken goed': '*',
    }
    for (const c of CASES_BY_SET.OLL) {
      const info = llOrientationCounts(casePattern(c.alg))
      if (EDGES[c.group] !== '*') expect(info.edgeShape, c.name).toBe(EDGES[c.group])
      if (c.group === 'Hoeken goed') expect(info.corners, c.name).toBe(4)
      if (c.group === 'Lijn' || c.group === 'Grote L') expect(info.corners, c.name).toBe(0)
      if (c.group === 'Paard' || c.group === 'Kleine bliksem' || c.group === 'Vierkant') expect(info.corners, c.name).toBe(1)
    }
  })
  it('PLL: groep past bij welke stukken verplaatst worden', async () => {
    const { casePattern } = await import('../src/lib/cube')
    for (const c of CASES_BY_SET.PLL) {
      // AUF zoeken waarbij zo weinig mogelijk stukken verkeerd staan
      let bestE = 9
      let bestC = 9
      for (const auf of AUFS) {
        const p = casePattern(c.alg).applyAlg(auf)
        const e = p.patternData['EDGES'].pieces.slice(0, 4).filter((v, i) => v !== i).length
        const k = p.patternData['CORNERS'].pieces.slice(0, 4).filter((v, i) => v !== i).length
        if (e + k < bestE + bestC) [bestE, bestC] = [e, k]
      }
      if (c.group === 'Alleen randen') expect(bestC, c.name).toBe(0)
      if (c.group === 'Alleen hoeken') expect(bestE, c.name).toBe(0)
      if (c.group.includes('hoekwissel')) expect(bestC, c.name).toBeGreaterThan(0)
    }
  })
  it('F2L: groep past bij de positie van hoek en rand', async () => {
    const { casePattern } = await import('../src/lib/cube')
    for (const c of CASES_BY_SET.F2L) {
      const p = casePattern(c.alg)
      const cp = p.patternData['CORNERS'].pieces.indexOf(4)
      const co = p.patternData['CORNERS'].orientation[cp]
      const ep = p.patternData['EDGES'].pieces.indexOf(8)
      const cornerInSlot = cp === 4
      const edgeInSlot = ep === 8
      const g = c.group
      if (g === 'Beide in slot') expect([cornerInSlot, edgeInSlot], c.name).toEqual([true, true])
      else if (g === 'Hoek in slot, rand boven') expect([cornerInSlot, edgeInSlot], c.name).toEqual([true, false])
      else if (g === 'Rand in slot, hoek boven') expect([cornerInSlot, edgeInSlot], c.name).toEqual([false, true])
      else {
        expect([cornerInSlot, edgeInSlot], c.name).toEqual([false, false])
        if (g === 'Hoek boven, wit boven') expect(co, c.name).toBe(0)
        else expect(co, c.name).not.toBe(0)
      }
    }
  })
})
