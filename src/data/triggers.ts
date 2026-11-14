import type { AlgCase, AlgStep, CubeSet, StepInput } from './types'

/**
 * Bekende triggers met een naam en uitleg. Een stap die alleen als zetten
 * wordt opgegeven, moet hierin voorkomen.
 */
export const TRIGGERS: Record<string, { name: string; desc: string }> = {
  "R U R' U'": { name: 'Sexy move', desc: 'De bekendste trigger: rechts omhoog, boven naar links, rechts terug, boven terug.' },
  "U R U' R'": { name: 'Omgekeerde sexy move', desc: 'Sexy move andersom: boven eerst, dan rechts omhoog en weer terug.' },
  "R' U' R U": { name: 'Linkshandige sexy (rechts)', desc: 'Spiegelvorm van de sexy move met de rechterhand: rechts omlaag, boven naar rechts, terug.' },
  "L' U' L U": { name: 'Linker sexy move', desc: 'De sexy move gespiegeld voor de linkerhand.' },
  "R' F R F'": { name: 'Sledgehammer', desc: 'Rechts omlaag, voorkant met de klok mee, rechts omhoog, voorkant terug.' },
  "F R' F' R": { name: 'Hedgeslammer', desc: 'Omgekeerde sledgehammer: voorkant eerst, dan rechts.' },
  "R U R' U R U2 R'": { name: 'Sune', desc: 'Klassieke trigger die drie hoeken draait (OLL 27).' },
  "R U2 R' U' R U' R'": { name: 'Anti-Sune', desc: 'Spiegelbeeld/omkering van de Sune (OLL 26).' },
  "R U R'": { name: 'Insert', desc: 'Basis-insert: rechts omhoog, boven naar links, rechts terug.' },
  "R U' R'": { name: 'Insert', desc: 'Rechts omhoog, boven naar rechts, rechts terug.' },
  "R U2 R'": { name: 'Insert (U2)', desc: 'Rechts omhoog, halve slag boven, rechts terug.' },
  "R' U' R": { name: 'Insert', desc: 'Rechts omlaag, boven naar rechts, rechts terug omhoog.' },
  "R' U R": { name: 'Insert', desc: 'Rechts omlaag, boven naar links, rechts terug omhoog.' },
  "F' U' F": { name: 'Insert (voorkant)', desc: 'Voorkant tegen de klok in, boven naar rechts, voorkant terug: insert via de voorkant.' },
  "F' U F": { name: 'Insert (voorkant)', desc: 'Voorkant tegen de klok in, boven naar links, voorkant terug.' },
  "F' U2 F": { name: 'Insert (voorkant, U2)', desc: 'Voorkant tegen de klok in, halve slag boven, voorkant terug.' },
  "F R U R' U' F'": { name: 'F-sexy-F\'', desc: 'Sexy move ingeklemd tussen F en F\': oriënteert twee randen (lijn → kruis).' },
  "f R U R' U' f'": { name: 'f-sexy-f\'', desc: 'Sexy move tussen brede f-zetten: oriënteert randen (L-vorm → kruis).' },
  "M2 U M2": { name: 'M2-U-M2', desc: 'Middenlaag halve slag, boven, middenlaag halve slag: wisselt twee tegenoverliggende randen.' },
  "M2 U' M2": { name: "M2-U'-M2", desc: 'Als M2 U M2, maar boven de andere kant op.' },
}

/** Normaliseert spaties zodat vergelijken betrouwbaar is. */
export function cleanAlg(s: string): string {
  return s.trim().split(/\s+/).join(' ')
}

export function toStep(input: StepInput): AlgStep {
  if (typeof input === 'string') {
    const t = TRIGGERS[cleanAlg(input)]
    if (!t) throw new Error(`Onbekende trigger zonder uitleg: "${input}"`)
    return { moves: cleanAlg(input), name: t.name, desc: t.desc }
  }
  if (input.length === 2) {
    const t = TRIGGERS[cleanAlg(input[0])]
    return { moves: cleanAlg(input[0]), name: t?.name, desc: input[1] }
  }
  return { moves: cleanAlg(input[0]), name: input[1], desc: input[2] }
}

export interface CaseInput {
  id: string
  number?: number
  name: string
  short: string
  group: string
  steps: StepInput[]
  alternatives?: string[]
  recognition: string
  isTwoLook?: boolean
  note?: string
}

/** Bouwt een AlgCase; `alg` is altijd exact de samenvoeging van de stappen. */
export function defineCases(set: CubeSet, inputs: CaseInput[]): AlgCase[] {
  return inputs.map((c) => {
    const steps = c.steps.map(toStep)
    return {
      id: c.id,
      set,
      number: c.number,
      name: c.name,
      short: c.short,
      group: c.group,
      alg: steps.map((s) => s.moves).join(' '),
      alternatives: (c.alternatives ?? []).map(cleanAlg),
      recognition: c.recognition,
      steps,
      isTwoLook: c.isTwoLook ?? false,
      note: c.note,
    }
  })
}
