export type Penalty = 'none' | '+2' | 'DNF'

export interface Solve {
  id: string
  caseId: string
  /** Gemeten tijd in milliseconden (zonder straf). */
  ms: number
  penalty: Penalty
  /** Tijdstip (epoch ms). */
  at: number
}

/** Effectieve tijd: +2 telt 2 seconden extra, DNF is oneindig. */
export function effective(s: Solve): number {
  if (s.penalty === 'DNF') return Infinity
  return s.ms + (s.penalty === '+2' ? 2000 : 0)
}

export function best(solves: Solve[]): number | null {
  if (solves.length === 0) return null
  return Math.min(...solves.map(effective))
}

/**
 * Gemiddelde van de laatste `n` tijden volgens WCA: de beste en slechtste
 * (5%, minimaal 1) vallen weg. Meer DNF's dan weggestreept kunnen worden → DNF.
 * Geeft `null` als er minder dan `n` tijden zijn.
 */
export function averageOf(solves: Solve[], n: number): number | null {
  if (solves.length < n) return null
  const last = solves.slice(-n).map(effective).sort((a, b) => a - b)
  const trim = Math.max(1, Math.ceil(n * 0.05))
  const kept = last.slice(trim, n - trim)
  if (kept.some((t) => !Number.isFinite(t))) return Infinity
  return kept.reduce((a, b) => a + b, 0) / kept.length
}

/** Gewoon gemiddelde van alle niet-DNF tijden (voor "traagste cases"). */
export function mean(solves: Solve[]): number | null {
  const ok = solves.map(effective).filter(Number.isFinite)
  if (ok.length === 0) return null
  return ok.reduce((a, b) => a + b, 0) / ok.length
}

export function formatTime(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return '–'
  if (!Number.isFinite(ms)) return 'DNF'
  const totalCs = Math.floor(ms / 10)
  const cs = totalCs % 100
  const s = Math.floor(totalCs / 100)
  if (s < 60) return `${s}.${String(cs).padStart(2, '0')}`
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export function formatSolve(s: Solve): string {
  if (s.penalty === 'DNF') return `DNF (${formatTime(s.ms)})`
  if (s.penalty === '+2') return `${formatTime(s.ms + 2000)}+`
  return formatTime(s.ms)
}
