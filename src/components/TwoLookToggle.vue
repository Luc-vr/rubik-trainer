<script setup lang="ts">
import { useSettings } from '../stores/settings'
const settings = useSettings()
</script>

<template>
  <div class="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-0.5 text-sm shadow-sm" role="group" aria-label="Filter op 2-look">
    <button
      type="button"
      class="rounded-md px-3 py-1.5 font-medium transition"
      :class="!settings.twoLookOnly ? 'bg-slate-900 text-white dark:bg-slate-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
      :aria-pressed="!settings.twoLookOnly"
      @click="settings.twoLookOnly = false"
    >
      Alles
    </button>
    <button
      type="button"
      class="rounded-md px-3 py-1.5 font-medium transition"
      :class="settings.twoLookOnly ? 'bg-slate-900 text-white dark:bg-slate-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
      :aria-pressed="settings.twoLookOnly"
      @click="settings.twoLookOnly = true"
    >
      Alleen 2-look
    </button>
  </div>
</template>
