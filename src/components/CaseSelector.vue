<script setup lang="ts">
/**
 * Selectie van cases voor quiz en timer: filter op set, groep, 2-look/alles,
 * en handmatig aanvinken.
 */
import { computed, ref } from 'vue'
import { CASES_BY_SET, GROUPS_BY_SET } from '../data'
import { SETS, type CubeSet } from '../data/types'
import CubeCase from './CubeCase.vue'

const selected = defineModel<string[]>({ required: true })
const props = withDefaults(defineProps<{ initialSet?: CubeSet }>(), { initialSet: 'PLL' })

const activeSet = ref<CubeSet>(props.initialSet)
const showManual = ref(false)
const sel = computed(() => new Set(selected.value))

const setCases = computed(() => CASES_BY_SET[activeSet.value])
const groups = computed(() =>
  GROUPS_BY_SET[activeSet.value].map((g) => {
    const cases = setCases.value.filter((c) => c.group === g)
    const n = cases.filter((c) => sel.value.has(c.id)).length
    return { name: g, cases, n, all: n === cases.length && n > 0 }
  }),
)
const countPerSet = computed(() =>
  Object.fromEntries(SETS.map((s) => [s, CASES_BY_SET[s].filter((c) => sel.value.has(c.id)).length])) as Record<CubeSet, number>,
)

function setIds(ids: string[], on: boolean) {
  const next = new Set(selected.value)
  for (const id of ids) {
    if (on) next.add(id)
    else next.delete(id)
  }
  selected.value = [...next]
}
function toggle(id: string) {
  setIds([id], !sel.value.has(id))
}
function onlyThis(filter: 'all' | 'twoLook') {
  const ids = setCases.value.filter((c) => filter === 'all' || c.isTwoLook).map((c) => c.id)
  setIds(setCases.value.map((c) => c.id), false)
  setIds(ids, true)
}
</script>

<template>
  <div class="card p-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-0.5" role="tablist" aria-label="Set">
        <button
          v-for="s in SETS"
          :key="s"
          type="button"
          role="tab"
          :aria-selected="s === activeSet"
          class="rounded-md px-3 py-1.5 text-sm font-semibold transition"
          :class="s === activeSet ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
          @click="activeSet = s"
        >
          {{ s }}
          <span v-if="countPerSet[s]" class="ml-0.5 text-xs opacity-80">({{ countPerSet[s] }})</span>
        </button>
      </div>
      <p class="text-sm text-slate-600 dark:text-slate-400"><strong>{{ selected.length }}</strong> cases geselecteerd</p>
    </div>

    <div class="mt-3 flex flex-wrap gap-1.5">
      <button type="button" class="chip chip-off" @click="onlyThis('all')">Alle {{ activeSet }}</button>
      <button v-if="activeSet !== 'F2L'" type="button" class="chip chip-off" @click="onlyThis('twoLook')">Alleen 2-look {{ activeSet }}</button>
      <button type="button" class="chip chip-off" @click="setIds(setCases.map((c) => c.id), false)">Geen {{ activeSet }}</button>
      <button v-if="selected.length" type="button" class="chip chip-off" @click="selected = []">Alles wissen</button>
    </div>

    <div class="mt-3 flex flex-wrap gap-1.5" aria-label="Groepen">
      <button
        v-for="g in groups"
        :key="g.name"
        type="button"
        class="chip"
        :class="g.all ? 'chip-on' : g.n ? 'border-indigo-300 dark:border-indigo-500/60 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300' : 'chip-off'"
        :aria-pressed="g.all"
        @click="setIds(g.cases.map((c) => c.id), !g.all)"
      >
        {{ g.name }} <span class="ml-1 opacity-75">{{ g.n }}/{{ g.cases.length }}</span>
      </button>
    </div>

    <button type="button" class="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline" :aria-expanded="showManual" @click="showManual = !showManual">
      {{ showManual ? '▾' : '▸' }} Handmatig aanvinken
    </button>
    <div v-if="showManual" class="mt-2 grid grid-cols-5 gap-1.5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
      <button
        v-for="c in setCases"
        :key="c.id"
        type="button"
        class="relative rounded-lg border p-1 transition"
        :class="sel.has(c.id) ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-60 hover:opacity-100'"
        :aria-pressed="sel.has(c.id)"
        :title="c.name"
        @click="toggle(c.id)"
      >
        <div class="aspect-square"><CubeCase :case="c" /></div>
        <div class="text-center text-[11px] font-semibold">{{ c.short }}</div>
      </button>
    </div>
  </div>
</template>
