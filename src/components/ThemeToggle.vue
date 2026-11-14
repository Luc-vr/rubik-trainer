<script setup lang="ts">
import { useSettings } from '../stores/settings'
import type { Theme } from '../lib/theme'

const settings = useSettings()
const options: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Licht' },
  { value: 'dark', label: 'Donker' },
  { value: 'system', label: 'Systeem' },
]
</script>

<template>
  <div class="inline-flex shrink-0 rounded-lg bg-white/10 p-0.5" role="radiogroup" aria-label="Kleurthema">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="radio"
      :aria-checked="settings.theme === o.value"
      :aria-label="o.label"
      :title="o.label"
      class="grid h-7 w-7 place-items-center rounded-md transition"
      :class="settings.theme === o.value ? 'bg-white/20 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'"
      @click="settings.theme = o.value"
    >
      <svg v-if="o.value === 'light'" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg v-else-if="o.value === 'dark'" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    </button>
  </div>
</template>
