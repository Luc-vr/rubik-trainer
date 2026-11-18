<script setup lang="ts">
/**
 * 2D-stappenplan: het algoritme gegroepeerd per trigger, met per zet de notatie
 * en een beschrijving in de gekozen taal. De huidige zet wordt gemarkeerd; klikken op
 * een zet laat de 3D-speler naar die zet springen.
 */
import { computed } from 'vue'
import type { AlgStep } from '../data/types'
import { leafMoves } from '../lib/notation'
import { useI18n } from '../lib/i18n'

const props = defineProps<{ steps: AlgStep[]; current: number; total: number }>()
const emit = defineEmits<{ select: [index: number] }>()
const { t, move } = useI18n()

const groups = computed(() => {
  let i = 0
  return props.steps.map((s) => {
    const moves = leafMoves(s.moves).map((m) => ({ text: m, desc: move(m), index: i++ }))
    return { ...s, moves, start: moves[0]?.index ?? 0, end: i }
  })
})
</script>

<template>
  <ol class="space-y-3">
    <li
      v-for="(g, gi) in groups"
      :key="gi"
      class="rounded-xl border bg-white dark:bg-slate-800 p-3 transition"
      :class="current >= g.start && current < g.end ? 'border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-500/30' : 'border-slate-200 dark:border-slate-700'"
    >
      <div class="mb-2 flex flex-wrap items-baseline gap-x-2">
        <span class="text-xs font-bold text-slate-400 dark:text-slate-500">{{ gi + 1 }}.</span>
        <span class="alg font-semibold">{{ g.moves.map((m) => m.text).join(' ') }}</span>
        <span v-if="g.name" class="rounded bg-indigo-50 dark:bg-indigo-500/15 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">{{ g.name }}</span>
      </div>
      <p class="mb-2 text-sm text-slate-600 dark:text-slate-400">{{ g.desc }}</p>
      <ul class="flex flex-wrap gap-1.5">
        <li v-for="m in g.moves" :key="m.index">
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-left text-xs transition"
            :class="
              m.index === current
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : m.index < current
                  ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
            "
            :aria-current="m.index === current ? 'step' : undefined"
            :title="t('playMove', { move: m.text })"
            @click="emit('select', m.index)"
          >
            <span class="alg text-sm font-bold">{{ m.text }}</span>
            <span>{{ m.desc }}</span>
          </button>
        </li>
      </ul>
    </li>
  </ol>
  <p class="mt-2 text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
    <template v-if="current >= total">{{ t('stepsDone') }}</template>
    <template v-else>{{ t('stepOf', { n: current + 1, total }) }}</template>
  </p>
</template>
