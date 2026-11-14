<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { CASES_BY_SET, getCase } from '../data'
import type { AlgStep } from '../data/types'
import CubeCase from '../components/CubeCase.vue'
import TwistyCube from '../components/TwistyCube.vue'
import AlgSteps from '../components/AlgSteps.vue'
import PlayerControls from '../components/PlayerControls.vue'
import { useSettings } from '../stores/settings'
import { useQuizStats } from '../stores/quizStats'
import { useTimes } from '../stores/times'
import { averageOf, best, formatTime } from '../lib/stats'

const props = defineProps<{ id: string }>()
const settings = useSettings()
const quiz = useQuizStats()
const times = useTimes()

const c = computed(() => getCase(props.id))
watchEffect(() => {
  if (c.value) document.title = `${c.value.name} · CFOP-trainer`
})

/** 0 = hoofdalgoritme, 1.. = alternatieven */
const choice = ref(0)
watch(
  () => props.id,
  () => {
    choice.value = 0
    current.value = 0
  },
)
const algs = computed(() => (c.value ? [c.value.alg, ...c.value.alternatives] : []))
const alg = computed(() => algs.value[choice.value] ?? '')
const steps = computed<AlgStep[]>(() => {
  if (!c.value) return []
  if (choice.value === 0) return c.value.steps
  return [{ moves: alg.value, name: 'Alternatief', desc: 'Alternatief algoritme voor dezelfde case (zonder opsplitsing in triggers).' }]
})

// ---- speler-status ----
const player = ref<InstanceType<typeof TwistyCube> | null>(null)
const current = ref(0)
const total = ref(0)
const atEnd = ref(false)
const playing = ref(false)
function onProgress(i: number, t: number, end: boolean) {
  current.value = i
  total.value = t
  atEnd.value = end
}
function toggle() {
  if (playing.value) player.value?.pause()
  else player.value?.play()
}

// navigatie naar vorige/volgende case in dezelfde set
const neighbours = computed(() => {
  if (!c.value) return { prev: undefined, next: undefined }
  const list = CASES_BY_SET[c.value.set]
  const i = list.findIndex((x) => x.id === c.value!.id)
  return { prev: list[i - 1], next: list[i + 1] }
})

const quizStat = computed(() => (c.value ? quiz.stats[c.value.id] : undefined))
const solves = computed(() => (c.value ? (times.byCase[c.value.id] ?? []) : []))

function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null
  if (t && ['INPUT', 'SELECT', 'TEXTAREA'].includes(t.tagName)) return
  if (e.key === 'ArrowRight') player.value?.step(1)
  else if (e.key === 'ArrowLeft') player.value?.step(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="!c" class="card p-6 text-center">
    <p class="text-slate-600 dark:text-slate-400">Deze case bestaat niet.</p>
    <RouterLink to="/" class="btn mt-3">Terug naar overzicht</RouterLink>
  </div>

  <article v-else>
    <nav class="mb-3 flex items-center justify-between gap-2 text-sm">
      <RouterLink :to="`/set/${c.set}`" class="text-indigo-600 dark:text-indigo-400 hover:underline">← {{ c.set }}-overzicht</RouterLink>
      <div class="flex gap-1">
        <RouterLink v-if="neighbours.prev" :to="`/case/${neighbours.prev.id}`" class="btn px-2.5 py-1">‹ {{ neighbours.prev.short }}</RouterLink>
        <RouterLink v-if="neighbours.next" :to="`/case/${neighbours.next.id}`" class="btn px-2.5 py-1">{{ neighbours.next.short }} ›</RouterLink>
      </div>
    </nav>

    <header class="mb-5">
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="text-2xl font-bold sm:text-3xl">{{ c.name }}</h1>
        <span class="chip border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">{{ c.set }} · {{ c.group }}</span>
        <span v-if="c.isTwoLook" class="chip border-amber-300 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300">2-look</span>
      </div>
      <p class="alg mt-1 text-lg text-slate-700 dark:text-slate-300 sm:text-xl">{{ c.alg }}</p>
    </header>

    <div class="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <!-- Linkerkolom: herkenning + 3D -->
      <div class="space-y-5">
        <section class="card p-4" aria-labelledby="wanneer">
          <h2 id="wanneer" class="mb-3 text-lg font-bold">Wanneer gebruik je dit?</h2>
          <div class="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div class="h-40 w-40 shrink-0">
              <CubeCase :case="c" :alg="alg" arrows />
            </div>
            <div class="text-slate-700 dark:text-slate-300">
              <p>{{ c.recognition }}</p>
              <p v-if="c.note" class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ c.note }}</p>
              <p v-if="c.set === 'PLL'" class="mt-2 text-xs text-slate-500 dark:text-slate-400">Pijlen: waar de stukken naartoe gaan.</p>
              <p v-if="c.set === 'F2L'" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Gekleurd: het paar voor het slot rechtsvoor. Grijs: stukken die er nu niet toe doen.
              </p>
            </div>
          </div>
        </section>

        <section class="card p-4 lg:sticky lg:top-16" aria-labelledby="demo">
          <h2 id="demo" class="mb-1 text-lg font-bold">3D-demo</h2>
          <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">Sleep om de kubus te draaien. Pijltjestoetsen: zet vooruit/terug.</p>
          <div class="mx-auto aspect-square w-full max-w-sm">
            <TwistyCube
              ref="player"
              :alg="alg"
              :stickering="c.set"
              :tempo="settings.tempo"
              :label="`3D-demo van ${c.name}`"
              @progress="onProgress"
              @playing="(p) => (playing = p)"
            />
          </div>
          <PlayerControls
            v-model:tempo="settings.tempo"
            class="mt-3"
            :playing="playing"
            :at-start="current === 0 && !playing"
            :at-end="atEnd"
            @start="player?.jumpToStart()"
            @back="player?.step(-1)"
            @toggle="toggle"
            @forward="player?.step(1)"
            @end="player?.jumpToEnd()"
          />
        </section>
      </div>

      <!-- Rechterkolom: algoritmes + stappenplan -->
      <div class="space-y-5">
        <section v-if="algs.length > 1" class="card p-4" aria-labelledby="algs">
          <h2 id="algs" class="mb-2 text-lg font-bold">Algoritmes</h2>
          <div class="space-y-1.5" role="radiogroup" aria-label="Kies algoritme">
            <label
              v-for="(a, i) in algs"
              :key="a"
              class="flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 transition"
              :class="i === choice ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
            >
              <input v-model="choice" type="radio" :value="i" class="mt-1 accent-indigo-600" />
              <span>
                <span class="alg block">{{ a }}</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">{{ i === 0 ? 'Hoofdalgoritme' : `Alternatief ${i}` }}</span>
              </span>
            </label>
          </div>
        </section>

        <section aria-labelledby="stappen">
          <h2 id="stappen" class="mb-2 text-lg font-bold">Stappenplan</h2>
          <AlgSteps :steps="steps" :current="current" :total="total" @select="(i) => player?.playMove(i)" />
        </section>

        <section class="card p-4 text-sm" aria-labelledby="voortgang">
          <h2 id="voortgang" class="mb-2 font-bold">Jouw voortgang</h2>
          <dl class="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
            <dt class="text-slate-500 dark:text-slate-400">Quiz goed</dt>
            <dd class="font-semibold">{{ quizStat?.correct ?? 0 }}</dd>
            <dt class="text-slate-500 dark:text-slate-400">Quiz fout</dt>
            <dd class="font-semibold">{{ quizStat?.wrong ?? 0 }}</dd>
            <dt class="text-slate-500 dark:text-slate-400">Beste tijd</dt>
            <dd class="font-semibold tabular-nums">{{ formatTime(best(solves)) }}</dd>
            <dt class="text-slate-500 dark:text-slate-400">ao5</dt>
            <dd class="font-semibold tabular-nums">{{ formatTime(averageOf(solves, 5)) }}</dd>
          </dl>
          <div class="mt-3 flex gap-2">
            <RouterLink :to="{ path: '/quiz', query: { cases: c.id } }" class="btn">Quiz</RouterLink>
            <RouterLink :to="{ path: '/timer', query: { cases: c.id } }" class="btn">Timer met deze case</RouterLink>
          </div>
        </section>
      </div>
    </div>
  </article>
</template>
