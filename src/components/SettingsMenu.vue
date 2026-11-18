<script setup lang="ts">
/**
 * Tandwielknop in de navigatiebalk met een uitklapmenu voor thema en taal.
 * Sluit bij klikken buiten het menu en met Escape.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSettings } from '../stores/settings'
import { useI18n } from '../lib/i18n'
import type { Theme } from '../lib/theme'
import type { Locale } from '../lib/locale'

const settings = useSettings()
const { t } = useI18n()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)

const themes = computed<{ value: Theme; label: string }[]>(() => [
  { value: 'light', label: t('themeLight') },
  { value: 'dark', label: t('themeDark') },
  { value: 'system', label: t('themeSystem') },
])
// Elke taal in haar eigen taal, zodat je hem altijd terugvindt.
const locales: { value: Locale; label: string }[] = [
  { value: 'nl', label: 'Nederlands' },
  { value: 'en', label: 'English' },
]

function onPointerDown(e: PointerEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
function onKeyDown(e: KeyboardEvent) {
  if (open.value && e.key === 'Escape') {
    open.value = false
    button.value?.focus()
  }
}
onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeyDown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeyDown)
})

const optionClass = (on: boolean) =>
  on
    ? 'bg-indigo-600 text-white'
    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
</script>

<template>
  <div ref="root" class="relative shrink-0">
    <button
      ref="button"
      type="button"
      class="grid h-8 w-8 place-items-center rounded-md transition"
      :class="open ? 'bg-white/20 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'"
      :aria-label="t('settings')"
      :title="t('settings')"
      aria-haspopup="true"
      :aria-expanded="open"
      aria-controls="settings-panel"
      @click="open = !open"
    >
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        />
      </svg>
    </button>

    <div
      v-if="open"
      id="settings-panel"
      class="absolute top-full right-0 z-40 mt-2 w-64 max-w-[calc(100vw-2rem)] space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      role="dialog"
      :aria-label="t('settings')"
    >
      <div>
        <p id="settings-theme" class="mb-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">{{ t('theme') }}</p>
        <div class="grid grid-cols-3 gap-0.5 rounded-lg border border-slate-300 p-0.5 dark:border-slate-600" role="radiogroup" aria-labelledby="settings-theme">
          <button
            v-for="o in themes"
            :key="o.value"
            type="button"
            role="radio"
            :aria-checked="settings.theme === o.value"
            class="flex flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-xs font-medium transition"
            :class="optionClass(settings.theme === o.value)"
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
            {{ o.label }}
          </button>
        </div>
      </div>

      <div>
        <p id="settings-language" class="mb-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">{{ t('language') }}</p>
        <div class="grid grid-cols-2 gap-0.5 rounded-lg border border-slate-300 p-0.5 dark:border-slate-600" role="radiogroup" aria-labelledby="settings-language">
          <button
            v-for="o in locales"
            :key="o.value"
            type="button"
            role="radio"
            :lang="o.value"
            :aria-checked="settings.locale === o.value"
            class="rounded-md px-2 py-1.5 text-sm font-medium transition"
            :class="optionClass(settings.locale === o.value)"
            @click="settings.locale = o.value"
          >
            {{ o.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
