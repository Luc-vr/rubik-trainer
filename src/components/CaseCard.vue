<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { AlgCase } from '../data/types'
import CubeCase from './CubeCase.vue'
import { useQuizStats } from '../stores/quizStats'
import { useTimes } from '../stores/times'
import { best, formatTime } from '../lib/stats'
import { useI18n } from '../lib/i18n'

const props = defineProps<{ case: AlgCase }>()
const { t } = useI18n()
const quiz = useQuizStats()
const times = useTimes()

const q = computed(() => quiz.stats[props.case.id])
const pct = computed(() => {
  const s = q.value
  if (!s || s.correct + s.wrong === 0) return null
  return Math.round((100 * s.correct) / (s.correct + s.wrong))
})
const pb = computed(() => best(times.byCase[props.case.id] ?? []))
</script>

<template>
  <RouterLink
    :to="`/case/${props.case.id}`"
    class="group card relative flex flex-col items-center gap-1 p-2 transition hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:shadow-md focus-visible:outline-2 focus-visible:outline-indigo-500"
  >
    <span
      v-if="props.case.isTwoLook"
      class="absolute top-1 left-1 z-10 rounded bg-amber-100 dark:bg-amber-500/20 px-1 text-[10px] leading-4 font-bold text-amber-800 dark:text-amber-300"
      :title="t('partOfTwoLook')"
      >2L</span
    >
    <div class="aspect-square w-full px-1 pt-2">
      <CubeCase :case="props.case" />

    </div>
    <div class="w-full text-center">
      <div class="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{{ props.case.short }}</div>
      <div class="flex min-h-4 items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <span
          v-if="pct !== null"
          :class="pct >= 80 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'"
          :title="t('quizScoreTitle', { correct: q?.correct ?? 0, wrong: q?.wrong ?? 0 })"
          >✓{{ q?.correct }} ✗{{ q?.wrong }}</span
        >
        <span v-if="pb !== null" :title="t('bestTime')">⏱ {{ formatTime(pb) }}</span>
      </div>
    </div>
  </RouterLink>
</template>
