<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CASES_BY_SET, getCase } from '../data'
import type { AlgCase } from '../data/types'
import CaseSelector from '../components/CaseSelector.vue'
import CubeCase from '../components/CubeCase.vue'
import { AUFS, randomItem } from '../lib/cube'
import { shuffle, useSelection, weightedPick } from '../lib/useSelection'
import { useQuizStats } from '../stores/quizStats'
import { useI18n } from '../lib/i18n'

const { t, tg, lc } = useI18n()
const quiz = useQuizStats()
const selection = useSelection('quizSelection')

const phase = ref<'setup' | 'question' | 'answered'>('setup')
const current = ref<AlgCase | null>(null)
const pre = ref('')
const post = ref('')
const options = ref<AlgCase[]>([])
const chosen = ref<string | null>(null)
const session = ref({ correct: 0, total: 0 })

const pool = computed(() => selection.value.map(getCase).filter((c): c is AlgCase => !!c))

/** Cases die je vaak fout hebt komen vaker langs. */
function weight(c: AlgCase): number {
  const s = quiz.stats[c.id]
  if (!s || s.recent.length === 0) return 1.5
  const wrong = s.recent.filter((x) => !x).length / s.recent.length
  return 0.5 + 3 * wrong
}

function makeOptions(c: AlgCase): AlgCase[] {
  const others = CASES_BY_SET[c.set].filter((x) => x.id !== c.id)
  const sameGroup = shuffle(others.filter((x) => x.group === c.group)).slice(0, 2)
  const rest = shuffle(others.filter((x) => !sameGroup.includes(x)))
  return shuffle([c, ...sameGroup, ...rest].slice(0, 4))
}

function next() {
  if (pool.value.length === 0) return
  const candidates = pool.value.length > 1 ? pool.value.filter((c) => c.id !== current.value?.id) : pool.value
  const c = weightedPick(candidates, weight)
  current.value = c
  pre.value = randomItem(AUFS)
  post.value = randomItem(AUFS)
  options.value = makeOptions(c)
  chosen.value = null
  phase.value = 'question'
}

function answer(id: string) {
  if (phase.value !== 'question' || !current.value) return
  chosen.value = id
  const ok = id === current.value.id
  quiz.record(current.value.id, ok)
  session.value = { correct: session.value.correct + (ok ? 1 : 0), total: session.value.total + 1 }
  phase.value = 'answered'
}

const isCorrect = computed(() => chosen.value !== null && chosen.value === current.value?.id)
/** De huidige case met teksten in de gekozen taal. */
const shown = computed(() => current.value && lc(current.value))

function onKey(e: KeyboardEvent) {
  if (phase.value === 'question' && ['1', '2', '3', '4'].includes(e.key)) {
    const o = options.value[Number(e.key) - 1]
    if (o) answer(o.id)
  } else if (phase.value === 'answered' && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault()
    next()
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

function start() {
  session.value = { correct: 0, total: 0 }
  next()
}
</script>

<template>
  <h1 class="text-2xl font-bold">{{ t('quizTitle') }}</h1>
  <p class="mb-4 text-slate-600 dark:text-slate-400">{{ t('quizIntro') }}</p>

  <template v-if="phase === 'setup'">
    <CaseSelector v-model="selection" />
    <div class="mt-4 flex items-center gap-3">
      <button type="button" class="btn-primary px-5 py-2.5 text-base" :disabled="pool.length === 0" @click="start">{{ t('startQuiz') }}</button>
      <span v-if="pool.length === 0" class="text-sm text-rose-600 dark:text-rose-400">{{ t('pickAtLeastOne') }}</span>
    </div>
  </template>

  <template v-else-if="current && shown">
    <div class="mb-3 flex items-center justify-between text-sm">
      <button type="button" class="text-indigo-600 dark:text-indigo-400 hover:underline" @click="phase = 'setup'">{{ t('changeSelection', { n: pool.length }) }}</button>
      <span class="font-medium text-slate-600 dark:text-slate-400" aria-live="polite">{{ t('score') }}: {{ session.correct }}/{{ session.total }}</span>
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <div class="card flex items-center justify-center p-6">
        <div class="aspect-square w-full max-w-72">
          <CubeCase :case="current" :pre-auf="pre" :post-auf="post" anonymous />
        </div>
      </div>

      <div>
        <p class="mb-2 font-semibold">{{ t('whichSetCase', { set: current.set }) }}</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="(o, i) in options"
            :key="o.id"
            type="button"
            class="rounded-xl border-2 px-3 py-4 text-left font-semibold transition"
            :class="
              phase === 'question'
                ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/15'
                : o.id === current.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                  : o.id === chosen
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-50'
            "
            :disabled="phase !== 'question'"
            @click="answer(o.id)"
          >
            <span class="mr-1 text-xs text-slate-400 dark:text-slate-500">{{ i + 1 }}</span> {{ lc(o).name }}
            <span class="block text-xs font-normal text-slate-500 dark:text-slate-400">{{ tg(o.group) }}</span>
          </button>
        </div>

        <div v-if="phase === 'answered'" class="mt-4 rounded-xl border p-4" :class="isCorrect ? 'border-emerald-300 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/15' : 'border-rose-300 dark:border-rose-500/50 bg-rose-50 dark:bg-rose-500/15'" role="status">
          <p class="text-lg font-bold" :class="isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'">
            {{ isCorrect ? t('correct') : t('wrong') }}
          </p>
          <p class="mt-1">{{ t('thisIs') }} <strong>{{ shown.name }}</strong> ({{ tg(shown.group) }}).</p>
          <p class="alg mt-1 text-slate-800 dark:text-slate-200">{{ shown.alg }}</p>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ shown.recognition }}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" class="btn-primary" @click="next">{{ t('nextEnter') }}</button>
            <RouterLink :to="`/case/${current.id}`" class="btn">{{ t('viewCase', { name: current.short }) }}</RouterLink>
          </div>
        </div>
        <p v-else class="mt-3 text-xs text-slate-500 dark:text-slate-400">{{ t('quizKeyTip') }}</p>
      </div>
    </div>
  </template>
</template>
