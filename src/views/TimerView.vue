<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getCase } from '../data'
import type { AlgCase } from '../data/types'
import CaseSelector from '../components/CaseSelector.vue'
import CubeCase from '../components/CubeCase.vue'
import TwistyCube from '../components/TwistyCube.vue'
import { makeScramble, type Scramble } from '../lib/scramble'
import { randomItem } from '../lib/cube'
import { averageOf, best, formatSolve, formatTime, mean, type Penalty, type Solve } from '../lib/stats'
import { useSelection } from '../lib/useSelection'
import { useTimes } from '../stores/times'
import { useSettings } from '../stores/settings'

const HOLD_MS = 300

const times = useTimes()
const settings = useSettings()
const selection = useSelection('timerSelection')
const showSelector = ref(false)

const pool = computed(() => selection.value.map(getCase).filter((c): c is AlgCase => !!c))

// ---------------- ronde ----------------
const round = ref<{ case: AlgCase; scramble: Scramble } | null>(null)
const last = ref<{ case: AlgCase; scramble: Scramble; solveId: string } | null>(null)

function newRound() {
  if (pool.value.length === 0) {
    round.value = null
    return
  }
  const candidates = pool.value.length > 1 ? pool.value.filter((c) => c.id !== round.value?.case.id) : pool.value
  const c = randomItem(candidates)
  round.value = { case: c, scramble: makeScramble(c.alg) }
}
watch(
  () => selection.value.join(','),
  () => {
    if (!round.value || !selection.value.includes(round.value.case.id)) newRound()
  },
)

// ---------------- timer-status ----------------
type TState = 'idle' | 'holding' | 'ready' | 'running'
const state = ref<TState>('idle')
const elapsed = ref(0)
let holdTimer: number | undefined
let startAt = 0
let raf = 0

function pressStart() {
  if (state.value === 'running') {
    stop()
    return
  }
  if (!round.value || state.value !== 'idle') return
  state.value = 'holding'
  holdTimer = window.setTimeout(() => {
    if (state.value === 'holding') state.value = 'ready'
  }, HOLD_MS)
}

function pressEnd() {
  window.clearTimeout(holdTimer)
  if (state.value === 'ready') startRun()
  else if (state.value === 'holding') state.value = 'idle'
}

function startRun() {
  ;(document.activeElement as HTMLElement | null)?.blur?.()
  state.value = 'running'
  startAt = performance.now()
  elapsed.value = 0
  const tick = () => {
    elapsed.value = performance.now() - startAt
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

function stop() {
  cancelAnimationFrame(raf)
  const ms = Math.round(performance.now() - startAt)
  elapsed.value = ms
  state.value = 'idle'
  if (round.value) {
    const s = times.add(round.value.case.id, ms)
    last.value = { ...round.value, solveId: s.id }
  }
  newRound()
}

function isTyping(e: Event) {
  const t = e.target as HTMLElement | null
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)
}

function onKeyDown(e: KeyboardEvent) {
  if (state.value === 'running') {
    e.preventDefault()
    stop()
    return
  }
  if (isTyping(e)) return
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault()
    if (!e.repeat) pressStart()
  } else if (e.key === 'Escape' && state.value !== 'idle') {
    window.clearTimeout(holdTimer)
    state.value = 'idle'
  }
}
function onKeyUp(e: KeyboardEvent) {
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault()
    pressEnd()
  }
}

// Aanraken/muis op het timervlak (op mobiel: vasthouden en loslaten).
function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  e.preventDefault()
  pressStart()
}
function onPointerUp(e: PointerEvent) {
  e.preventDefault()
  pressEnd()
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown, { capture: true })
  window.addEventListener('keyup', onKeyUp, { capture: true })
  newRound()
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown, { capture: true })
  window.removeEventListener('keyup', onKeyUp, { capture: true })
  cancelAnimationFrame(raf)
  window.clearTimeout(holdTimer)
})

const display = computed(() => {
  if (state.value === 'running') return formatTime(elapsed.value)
  if (state.value === 'holding' || state.value === 'ready') return '0.00'
  const s = last.value && times.solves.find((x) => x.id === last.value!.solveId)
  return s ? formatSolve(s) : '0.00'
})
const timerColor = computed(() =>
  state.value === 'holding' ? 'text-rose-500' : state.value === 'ready' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100',
)
const fullscreen = computed(() => state.value === 'running' || state.value === 'ready')

// ---------------- laatste tijd / statistiek ----------------
const lastSolve = computed(() => (last.value ? times.solves.find((s) => s.id === last.value!.solveId) : undefined))

function setPenalty(s: Solve, p: Penalty) {
  times.setPenalty(s.id, s.penalty === p ? 'none' : p)
}
function removeSolve(s: Solve) {
  if (window.confirm(`Tijd ${formatSolve(s)} verwijderen?`)) times.remove(s.id)
}

const recent = computed(() => [...times.solves].reverse().slice(0, 12))

const perCase = computed(() =>
  Object.entries(times.byCase)
    .map(([id, solves]) => {
      const c = getCase(id)
      return c ? { c, n: solves.length, best: best(solves), ao5: averageOf(solves, 5), ao12: averageOf(solves, 12), mean: mean(solves) } : null
    })
    .filter((x): x is NonNullable<typeof x> => !!x),
)
/** Traagste cases: op ao5, anders gemiddelde. */
const slowest = computed(() =>
  [...perCase.value]
    .map((r) => ({ ...r, key: r.ao5 ?? r.mean ?? -1 }))
    .filter((r) => r.key > 0)
    .sort((a, b) => b.key - a.key)
    .slice(0, 8),
)
const tableSorted = computed(() => [...perCase.value].sort((a, b) => a.c.set.localeCompare(b.c.set) || (a.c.number ?? 0) - (b.c.number ?? 0) || a.c.short.localeCompare(b.c.short)))
</script>

<template>
  <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
    <h1 class="text-2xl font-bold">Timer per case</h1>
    <button type="button" class="btn" :aria-expanded="showSelector" @click="showSelector = !showSelector">
      {{ showSelector ? 'Selectie verbergen' : `Selectie (${pool.length})` }}
    </button>
  </div>

  <CaseSelector v-if="showSelector || pool.length === 0" v-model="selection" class="mb-4" />

  <section v-if="round" class="card mb-4 p-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <h2 class="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">Scramble (geel boven, groen voor)</h2>
        <p class="alg mt-1 text-xl break-words sm:text-2xl" data-testid="scramble">{{ round.scramble.text }}</p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Begin met een opgeloste kubus. De scramble zet precies één van je gekozen cases op.</p>
      </div>
      <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <input v-model="settings.showPreview" type="checkbox" class="accent-indigo-600" />
        3D-preview
      </label>
    </div>
    <div v-if="settings.showPreview" class="mx-auto mt-2 aspect-square w-48">
      <TwistyCube :setup="round.scramble.text" anchor="start" :hint="false" label="Preview van de gescramblede kubus" />
    </div>
  </section>

  <!-- Timervlak -->
  <section
    class="card flex touch-none flex-col items-center justify-center p-6 select-none"
    :class="fullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'min-h-56 cursor-pointer'"
    role="button"
    tabindex="0"
    aria-label="Timer: houd spatie of het vlak ingedrukt tot het groen wordt, laat los om te starten"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @contextmenu.prevent
  >
    <div class="font-mono text-6xl font-bold tabular-nums transition-colors sm:text-8xl" :class="timerColor" aria-live="off">
      {{ display }}
    </div>
    <p class="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
      <template v-if="state === 'running'">Druk op een toets of tik om te stoppen</template>
      <template v-else-if="state === 'ready'">Loslaten om te starten</template>
      <template v-else-if="state === 'holding'">Blijf vasthouden…</template>
      <template v-else-if="!round">Kies eerst cases om te oefenen.</template>
      <template v-else>Houd <kbd class="rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 px-1">spatie</kbd> ingedrukt (of tik en houd vast) tot de tijd groen wordt</template>
    </p>
  </section>

  <!-- Resultaat laatste solve -->
  <section v-if="last && lastSolve" class="card mt-4 flex flex-col gap-4 p-4 sm:flex-row sm:items-center" aria-live="polite">
    <div class="mx-auto h-28 w-28 shrink-0 sm:mx-0">
      <CubeCase :case="last.case" :pre-auf="last.scramble.pre" :post-auf="last.scramble.post" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-sm text-slate-500 dark:text-slate-400">Dat was</p>
      <p class="text-xl font-bold">
        <RouterLink :to="`/case/${last.case.id}`" class="hover:underline">{{ last.case.name }}</RouterLink>
        <span class="ml-2 font-mono tabular-nums">{{ formatSolve(lastSolve) }}</span>
      </p>
      <p class="alg text-slate-700 dark:text-slate-300">{{ last.case.alg }}</p>
      <div class="mt-2 flex flex-wrap gap-1.5">
        <button type="button" class="btn py-1" :class="lastSolve.penalty === '+2' ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/15' : ''" @click="setPenalty(lastSolve, '+2')">+2</button>
        <button type="button" class="btn py-1" :class="lastSolve.penalty === 'DNF' ? 'border-rose-400 bg-rose-50 dark:bg-rose-500/15' : ''" @click="setPenalty(lastSolve, 'DNF')">DNF</button>
        <button type="button" class="btn py-1 text-rose-600 dark:text-rose-400" @click="removeSolve(lastSolve)">Verwijderen</button>
      </div>
    </div>
  </section>

  <div class="mt-6 grid gap-5 lg:grid-cols-2">
    <section class="card p-4">
      <h2 class="mb-2 font-bold">Traagste cases <span class="text-sm font-normal text-slate-500 dark:text-slate-400">(oefen deze!)</span></h2>
      <p v-if="slowest.length === 0" class="text-sm text-slate-500 dark:text-slate-400">Nog geen tijden.</p>
      <ol v-else class="space-y-1.5">
        <li v-for="(r, i) in slowest" :key="r.c.id" class="flex items-center gap-3">
          <span class="w-4 text-right text-xs text-slate-400 dark:text-slate-500">{{ i + 1 }}</span>
          <div class="h-10 w-10 shrink-0"><CubeCase :case="r.c" /></div>
          <RouterLink :to="`/case/${r.c.id}`" class="flex-1 font-medium hover:underline">{{ r.c.name }}</RouterLink>
          <span class="font-mono text-sm tabular-nums">{{ formatTime(r.key) }}</span>
          <span class="w-14 text-right text-xs text-slate-500 dark:text-slate-400">{{ r.ao5 !== null ? 'ao5' : `gem. (${r.n})` }}</span>
        </li>
      </ol>
    </section>

    <section class="card p-4">
      <h2 class="mb-2 font-bold">Laatste tijden</h2>
      <p v-if="recent.length === 0" class="text-sm text-slate-500 dark:text-slate-400">Nog geen tijden.</p>
      <ul v-else class="divide-y divide-slate-100 dark:divide-slate-800">
        <li v-for="s in recent" :key="s.id" class="flex items-center gap-2 py-1.5 text-sm">
          <span class="w-24 font-mono tabular-nums" :class="s.penalty === 'DNF' ? 'text-rose-600 dark:text-rose-400' : ''">{{ formatSolve(s) }}</span>
          <RouterLink :to="`/case/${s.caseId}`" class="flex-1 truncate text-slate-600 dark:text-slate-400 hover:underline">{{ getCase(s.caseId)?.name ?? s.caseId }}</RouterLink>
          <button type="button" class="rounded px-1.5 py-0.5 text-xs" :class="s.penalty === '+2' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'" :aria-pressed="s.penalty === '+2'" @click="setPenalty(s, '+2')">+2</button>
          <button type="button" class="rounded px-1.5 py-0.5 text-xs" :class="s.penalty === 'DNF' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'" :aria-pressed="s.penalty === 'DNF'" @click="setPenalty(s, 'DNF')">DNF</button>
          <button type="button" class="rounded px-1.5 py-0.5 text-xs text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-400" :aria-label="`Verwijder ${formatSolve(s)}`" @click="removeSolve(s)">✕</button>
        </li>
      </ul>
    </section>
  </div>

  <section v-if="tableSorted.length" class="card mt-5 overflow-x-auto p-4">
    <h2 class="mb-2 font-bold">Statistiek per case</h2>
    <table class="w-full text-sm">
      <thead class="text-left text-xs text-slate-500 dark:text-slate-400 uppercase">
        <tr>
          <th class="py-1 pr-2 font-semibold">Case</th>
          <th class="px-2 text-right font-semibold">#</th>
          <th class="px-2 text-right font-semibold">Beste</th>
          <th class="px-2 text-right font-semibold">ao5</th>
          <th class="px-2 text-right font-semibold">ao12</th>
          <th class="pl-2 text-right font-semibold">Gem.</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
        <tr v-for="r in tableSorted" :key="r.c.id">
          <td class="py-1 pr-2 font-sans"><RouterLink :to="`/case/${r.c.id}`" class="hover:underline">{{ r.c.name }}</RouterLink></td>
          <td class="px-2 text-right">{{ r.n }}</td>
          <td class="px-2 text-right">{{ formatTime(r.best) }}</td>
          <td class="px-2 text-right">{{ formatTime(r.ao5) }}</td>
          <td class="px-2 text-right">{{ formatTime(r.ao12) }}</td>
          <td class="pl-2 text-right">{{ formatTime(r.mean) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
