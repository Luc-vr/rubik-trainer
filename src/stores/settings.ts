import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { loadJSON, saveJSON } from '../lib/storage'
import { isTheme, type Theme } from '../lib/theme'
import { detectLocale, isLocale, type Locale } from '../lib/locale'

export const useSettings = defineStore('settings', () => {
  const saved = loadJSON<Record<string, unknown>>('settings', {})
  const twoLookOnly = ref<boolean>(!!saved.twoLookOnly)
  const tempo = ref<number>(typeof saved.tempo === 'number' ? saved.tempo : 1)
  const showPreview = ref<boolean>(saved.showPreview === true)
  const theme = ref<Theme>(isTheme(saved.theme) ? saved.theme : 'system')
  const locale = ref<Locale>(isLocale(saved.locale) ? saved.locale : detectLocale())
  watch([twoLookOnly, tempo, showPreview, theme, locale], () =>
    saveJSON('settings', {
      twoLookOnly: twoLookOnly.value,
      tempo: tempo.value,
      showPreview: showPreview.value,
      theme: theme.value,
      locale: locale.value,
    }),
  )
  return { twoLookOnly, tempo, showPreview, theme, locale }
})
