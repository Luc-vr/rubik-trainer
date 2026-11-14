import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loadJSON, saveJSON } from '../lib/storage'
import type { Penalty, Solve } from '../lib/stats'

export const useTimes = defineStore('times', () => {
  const solves = ref<Solve[]>(loadJSON<Solve[]>('solves', []))

  const byCase = computed(() => {
    const m: Record<string, Solve[]> = {}
    for (const s of solves.value) (m[s.caseId] ??= []).push(s)
    return m
  })

  function persist() {
    saveJSON('solves', solves.value)
  }

  function add(caseId: string, ms: number): Solve {
    const s: Solve = { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, caseId, ms, penalty: 'none', at: Date.now() }
    solves.value = [...solves.value, s]
    persist()
    return s
  }

  function setPenalty(id: string, penalty: Penalty) {
    solves.value = solves.value.map((s) => (s.id === id ? { ...s, penalty } : s))
    persist()
  }

  function remove(id: string) {
    solves.value = solves.value.filter((s) => s.id !== id)
    persist()
  }

  function clearCase(caseId: string) {
    solves.value = solves.value.filter((s) => s.caseId !== caseId)
    persist()
  }

  return { solves, byCase, add, setPenalty, remove, clearCase }
})
