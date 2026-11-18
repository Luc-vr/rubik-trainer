import type { AlgCase, CubeSet } from './types'
import { PLL, PLL_GROUPS } from './pll'
import { OLL, OLL_GROUPS } from './oll'
import { F2L, F2L_GROUPS } from './f2l'
import { EN_CASES, EN_GROUPS, EN_SET_DESCRIPTIONS, EN_TRIGGERS } from './en'
import type { Locale } from '../lib/locale'

export const CASES_BY_SET: Record<CubeSet, AlgCase[]> = {
  F2L,
  OLL,
  PLL,
}

export const GROUPS_BY_SET: Record<CubeSet, string[]> = {
  F2L: F2L_GROUPS,
  OLL: OLL_GROUPS,
  PLL: PLL_GROUPS,
}

export const ALL_CASES: AlgCase[] = [...CASES_BY_SET.F2L, ...CASES_BY_SET.OLL, ...CASES_BY_SET.PLL]

const byId = new Map(ALL_CASES.map((c) => [c.id, c]))

export function getCase(id: string): AlgCase | undefined {
  return byId.get(id)
}

export const SET_INFO: Record<CubeSet, { title: string; description: string }> = {
  F2L: { title: 'F2L', description: 'First Two Layers: hoek en rand als paar in een slot zetten.' },
  OLL: { title: 'OLL', description: 'Orientation of the Last Layer: de bovenkant helemaal geel maken.' },
  PLL: { title: 'PLL', description: 'Permutation of the Last Layer: de bovenlaag op de juiste plek zetten.' },
}

// ---------------- vertaling ----------------

export function setDescription(set: CubeSet, locale: Locale): string {
  return locale === 'en' ? EN_SET_DESCRIPTIONS[set] : SET_INFO[set].description
}

/** Weergavenaam van een groep. `group` blijft intern de Nederlandse sleutel. */
export function groupLabel(group: string, locale: Locale): string {
  return locale === 'en' ? (EN_GROUPS[group] ?? group) : group
}

const enCache = new Map<string, AlgCase>()

/**
 * De case met teksten in de gekozen taal (naam, herkenning, notitie, stappen).
 * `group` blijft de Nederlandse sleutel; gebruik `groupLabel` voor weergave.
 */
export function localizeCase(c: AlgCase, locale: Locale): AlgCase {
  if (locale === 'nl') return c
  const hit = enCache.get(c.id)
  if (hit) return hit
  const tr = EN_CASES[c.id]
  if (!tr) return c
  const out: AlgCase = {
    ...c,
    name: tr.name ?? c.name,
    recognition: tr.recognition,
    note: c.note && tr.note,
    steps: c.steps.map((s, i) => {
      const trig = EN_TRIGGERS[s.moves]
      return { moves: s.moves, name: s.name && (trig?.name ?? s.name), desc: tr.steps[i] ?? trig?.desc ?? s.desc }
    }),
  }
  enCache.set(c.id, out)
  return out
}
