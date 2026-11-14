import type { AlgCase, CubeSet } from './types'
import { PLL, PLL_GROUPS } from './pll'
import { OLL, OLL_GROUPS } from './oll'
import { F2L, F2L_GROUPS } from './f2l'

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
