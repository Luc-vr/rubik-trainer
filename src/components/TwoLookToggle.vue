<script setup lang="ts">
import { useSettings } from '../stores/settings'
import { useI18n } from '../lib/i18n'
const settings = useSettings()
const { t } = useI18n()
</script>

<template>
  <div class="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-0.5 text-sm shadow-sm" role="group" :aria-label="t('filterTwoLook')">
    <button
      type="button"
      class="rounded-md px-3 py-1.5 font-medium transition"
      :class="!settings.twoLookOnly ? 'bg-slate-900 text-white dark:bg-slate-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
      :aria-pressed="!settings.twoLookOnly"
      @click="settings.twoLookOnly = false"
    >
      {{ t('all') }}
    </button>
    <button
      type="button"
      class="rounded-md px-3 py-1.5 font-medium transition"
      :class="settings.twoLookOnly ? 'bg-slate-900 text-white dark:bg-slate-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
      :aria-pressed="settings.twoLookOnly"
      @click="settings.twoLookOnly = true"
    >
      {{ t('twoLookOnly') }}
    </button>
  </div>
</template>
