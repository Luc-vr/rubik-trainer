<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { CASES_BY_SET, SET_INFO } from '../data'
import { SETS, type CubeSet } from '../data/types'
import CubeCase from '../components/CubeCase.vue'
import TwoLookToggle from '../components/TwoLookToggle.vue'
import { useSettings } from '../stores/settings'
import { useQuizStats } from '../stores/quizStats'
import { useTimes } from '../stores/times'
import { useI18n } from '../lib/i18n'

const { t, setDesc } = useI18n()
const settings = useSettings()
const quiz = useQuizStats()
const times = useTimes()

const PREVIEW: Record<CubeSet, string> = { F2L: 'f2l-1', OLL: 'oll-27', PLL: 'pll-t' }

const sets = computed(() =>
  SETS.map((set) => {
    const all = CASES_BY_SET[set]
    const twoLook = all.filter((c) => c.isTwoLook)
    // 2-look bestaat alleen voor OLL en PLL; F2L toont altijd alles.
    const shown = settings.twoLookOnly && set !== 'F2L' ? twoLook : all
    const practiced = shown.filter((c) => quiz.stats[c.id] || times.byCase[c.id]).length
    const preview = all.find((c) => c.id === PREVIEW[set]) ?? all[0]
    return { set, info: SET_INFO[set], total: all.length, twoLook: twoLook.length, shown: shown.length, practiced, preview }
  }),
)
</script>

<template>
  <section class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ t('homeTitle') }}</h1>
      <p class="mt-1 max-w-2xl text-slate-600 dark:text-slate-400">{{ t('homeIntro') }}</p>
    </div>
    <TwoLookToggle />
  </section>

  <section class="grid gap-4 sm:grid-cols-3">
    <RouterLink
      v-for="s in sets"
      :key="s.set"
      :to="`/set/${s.set}`"
      class="card group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:shadow-md"
    >
      <div class="h-24 w-24 shrink-0">
        <CubeCase v-if="s.preview" :case="s.preview" />
      </div>
      <div class="min-w-0">
        <h2 class="text-xl font-bold">{{ s.info.title }}</h2>
        <p class="text-3xl font-black tabular-nums text-indigo-600 dark:text-indigo-400">
          {{ s.shown }}<span class="text-base font-semibold text-slate-400 dark:text-slate-500"> {{ t('cases') }}</span>
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          {{ t('total', { n: s.total }) }}<template v-if="s.set !== 'F2L'"> · {{ t('inTwoLook', { n: s.twoLook }) }}</template>
          <template v-if="s.practiced"> · {{ t('practiced', { n: s.practiced }) }}</template>
        </p>
      </div>
    </RouterLink>
  </section>

  <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">
    {{ setDesc('F2L') }} {{ setDesc('OLL') }} {{ setDesc('PLL') }}
  </p>

  <section class="mt-8 grid gap-4 sm:grid-cols-3">
    <RouterLink to="/quiz" class="card p-4 transition hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:shadow-md">
      <h2 class="font-bold">{{ t('homeQuizTitle') }}</h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ t('homeQuizText') }}</p>
    </RouterLink>
    <RouterLink to="/timer" class="card p-4 transition hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:shadow-md">
      <h2 class="font-bold">{{ t('homeTimerTitle') }}</h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ t('homeTimerText') }}</p>
    </RouterLink>
    <RouterLink to="/notatie" class="card p-4 transition hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:shadow-md">
      <h2 class="font-bold">{{ t('homeNotationTitle') }}</h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ t('homeNotationText') }}</p>
    </RouterLink>
  </section>
</template>
