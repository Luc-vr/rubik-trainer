export type CubeSet = 'F2L' | 'OLL' | 'PLL'

export const SETS: CubeSet[] = ['F2L', 'OLL', 'PLL']

/** Een herkenbaar stuk van een algoritme (trigger, setup-zet, enz.). */
export interface AlgStep {
  /** De zetten van dit stuk, in standaardnotatie. */
  moves: string
  /** Naam van de trigger, als die een bekende naam heeft (bijv. "Sexy move"). */
  name?: string
  /** Korte Nederlandse uitleg van wat dit stuk doet. */
  desc: string
}

export interface AlgCase {
  /** Unieke id, bijv. `pll-t`, `oll-27`, `f2l-12`. */
  id: string
  set: CubeSet
  /** Volgnummer binnen de set (OLL 1-57, F2L 1-41); PLL gebruikt letters. */
  number?: number
  /** Weergavenaam, bijv. "T-perm", "OLL 27 (Sune)", "F2L 12". */
  name: string
  /** Korte naam voor kleine tegels, bijv. "T", "27". */
  short: string
  /** Groep binnen de set (voor indeling in het overzicht). */
  group: string
  /** Hoofdalgoritme. */
  alg: string
  /** Alternatieve algoritmes voor dezelfde case. */
  alternatives: string[]
  /** Nederlands: wanneer gebruik je dit algoritme / wat zie je op de kubus. */
  recognition: string
  /** Het hoofdalgoritme opgeknipt in herkenbare stukken. Samengevoegd = `alg`. */
  steps: AlgStep[]
  /** Hoort bij 2-look OLL/PLL. */
  isTwoLook: boolean
  /** Eventuele extra uitleg. */
  note?: string
}

/** Invoervorm voor stappen: alleen zetten (bekende trigger) of [zetten, uitleg] of [zetten, naam, uitleg]. */
export type StepInput = string | [string, string] | [string, string, string]
