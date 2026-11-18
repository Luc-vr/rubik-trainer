import { describe, expect, it } from 'vitest'
import { ALL_CASES, GROUPS_BY_SET, localizeCase } from '../src/data'
import { EN_CASES, EN_GROUPS, EN_TRIGGERS } from '../src/data/en'
import { TRIGGERS } from '../src/data/triggers'
import { SETS } from '../src/data/types'
import { describeMove } from '../src/lib/notation'
import { translate } from '../src/lib/i18n'

describe('Engelse vertaling van de casedata', () => {
  it('elke groep heeft een Engelse naam', () => {
    for (const set of SETS) for (const g of GROUPS_BY_SET[set]) expect(EN_GROUPS[g], g).toBeTruthy()
  })

  it('elke trigger heeft een Engelse naam en uitleg', () => {
    for (const alg of Object.keys(TRIGGERS)) {
      expect(EN_TRIGGERS[alg]?.name, alg).toBeTruthy()
      expect(EN_TRIGGERS[alg]?.desc, alg).toBeTruthy()
    }
  })

  it('er zijn geen vertalingen voor onbekende cases', () => {
    const ids = new Set(ALL_CASES.map((c) => c.id))
    for (const id of Object.keys(EN_CASES)) expect(ids.has(id), id).toBe(true)
  })

  for (const c of ALL_CASES) {
    it(`${c.id}: vertaling compleet en gelijklopend met de stappen`, () => {
      const tr = EN_CASES[c.id]
      expect(tr, c.id).toBeDefined()
      expect(tr.recognition.length).toBeGreaterThan(20)
      expect(tr.steps).toHaveLength(c.steps.length)
      // `null` mag alleen bij een bekende trigger: dan komt de uitleg uit EN_TRIGGERS.
      tr.steps.forEach((s, i) => {
        if (s === null) expect(EN_TRIGGERS[c.steps[i].moves], `${c.id} stap ${i + 1}`).toBeDefined()
      })
      expect(!!tr.note, `${c.id} notitie`).toBe(!!c.note)

      const en = localizeCase(c, 'en')
      expect(en.alg).toBe(c.alg)
      expect(en.group).toBe(c.group)
      expect(en.steps.map((s) => s.moves)).toEqual(c.steps.map((s) => s.moves))
      expect(en.steps.every((s) => s.desc.length > 0)).toBe(true)
      expect(localizeCase(c, 'nl')).toBe(c)
    })
  }
})

describe('interfaceteksten', () => {
  it('vult parameters in', () => {
    expect(translate('nl', 'stepOf', { n: 2, total: 7 })).toBe('Zet 2 van 7')
    expect(translate('en', 'stepOf', { n: 2, total: 7 })).toBe('Move 2 of 7')
  })

  it('beschrijft zetten in beide talen', () => {
    expect(describeMove('R', 'nl')).toBe('rechterkant omhoog (van je af)')
    expect(describeMove('R', 'en')).toBe('right face up (away from you)')
    expect(describeMove("U'", 'en')).toBe('top face to the right')
    expect(describeMove('M2', 'en')).toBe('middle slice (between L and R) half turn')
    expect(describeMove('y', 'en')).toBe('turn the whole cube like U: front goes left')
  })
})
