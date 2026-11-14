import { ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { getCase, CASES_BY_SET } from '../data'
import { loadJSON, saveJSON } from './storage'

/**
 * Bewaarde case-selectie (per pagina). `?cases=id1,id2` in de URL heeft voorrang,
 * zodat je vanaf een detailpagina direct met één case kunt oefenen.
 */
export function useSelection(key: string): Ref<string[]> {
  const route = useRoute()
  const fromQuery = typeof route.query.cases === 'string' ? route.query.cases.split(',').filter((id) => getCase(id)) : []
  const stored = loadJSON<string[]>(key, CASES_BY_SET.PLL.map((c) => c.id)).filter((id) => getCase(id))
  const selection = ref<string[]>(fromQuery.length ? fromQuery : stored)
  watch(selection, (v) => saveJSON(key, v))
  return selection
}

/** Kies een willekeurig element, met gewichten. */
export function weightedPick<T>(items: T[], weight: (t: T) => number): T {
  const ws = items.map((t) => Math.max(0.01, weight(t)))
  let r = Math.random() * ws.reduce((a, b) => a + b, 0)
  for (let i = 0; i < items.length; i++) {
    r -= ws[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
