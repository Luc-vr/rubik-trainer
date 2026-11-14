import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loadJSON, removeKey, saveJSON } from '../lib/storage'

export interface QuizStat {
  correct: number
  wrong: number
  /** Laatste antwoorden (true = goed), meest recent achteraan, max 10. */
  recent: boolean[]
}

export const useQuizStats = defineStore('quizStats', () => {
  const stats = ref<Record<string, QuizStat>>(loadJSON('quiz', {}))

  function record(caseId: string, correct: boolean) {
    const s = stats.value[caseId] ?? { correct: 0, wrong: 0, recent: [] }
    if (correct) s.correct++
    else s.wrong++
    s.recent = [...(s.recent ?? []), correct].slice(-10)
    stats.value = { ...stats.value, [caseId]: s }
    saveJSON('quiz', stats.value)
  }

  function get(caseId: string): QuizStat | undefined {
    return stats.value[caseId]
  }

  function reset() {
    stats.value = {}
    removeKey('quiz')
  }

  return { stats, record, get, reset }
})
