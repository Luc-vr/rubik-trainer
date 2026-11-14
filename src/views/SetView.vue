<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { CASES_BY_SET, GROUPS_BY_SET, SET_INFO } from '../data'
import { SETS, type CubeSet } from '../data/types'
import CaseCard from '../components/CaseCard.vue'
import TwoLookToggle from '../components/TwoLookToggle.vue'
import { useSettings } from '../stores/settings'

const props = defineProps<{ set: string }>()
const settings = useSettings()
const set = computed(() => props.set as CubeSet)
watchEffect(() => {
  document.title = `${set.value} · CFOP-trainer`
})

/** 2-look bestaat alleen voor OLL en PLL. */
const hasTwoLook = computed(() => set.value !== 'F2L')

const groups = computed(() => {
  const cases = CASES_BY_SET[set.value].filter((c) => !hasTwoLook.value || !settings.twoLookOnly || c.isTwoLook)
  return GROUPS_BY_SET[set.value]
    .map((g) => ({ name: g, cases: cases.filter((c) => c.group === g) }))
    .filter((g) => g.cases.length > 0)
})
const count = computed(() => groups.value.reduce((n, g) => n + g.cases.length, 0))
</script>

<template>
  <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
    <nav class="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-0.5 shadow-sm" aria-label="Kies set">
      <RouterLink
        v-for="s in SETS"
        :key="s"
        :to="`/set/${s}`"
        class="rounded-md px-4 py-1.5 text-sm font-semibold transition"
        :class="s === set ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
        >{{ s }}</RouterLink
      >
    </nav>
    <TwoLookToggle v-if="hasTwoLook" />
  </div>

  <h1 class="text-2xl font-bold">{{ SET_INFO[set].title }} <span class="text-slate-400 dark:text-slate-500">· {{ count }} cases</span></h1>
  <p class="mb-6 text-slate-600 dark:text-slate-400">{{ SET_INFO[set].description }}</p>

  <p v-if="count === 0" class="card p-6 text-center text-slate-500 dark:text-slate-400">Geen cases in deze selectie.</p>

  <div class="flex flex-wrap gap-x-8 gap-y-6">
    <section v-for="g in groups" :key="g.name" class="w-full sm:w-auto sm:max-w-full">
      <h2 class="mb-2 text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
        {{ g.name }} <span class="font-normal normal-case">({{ g.cases.length }})</span>
      </h2>
      <div class="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        <CaseCard v-for="c in g.cases" :key="c.id" :case="c" class="sm:w-28" />
      </div>
    </section>
  </div>
</template>
