/**
 * Taal van de interface: Nederlands of Engels. Zonder opgeslagen keuze volgt de
 * app de browsertaal. Een inline script in index.html zet `lang` op <html> al
 * vóór de eerste render.
 */
import { watch, type Ref } from 'vue'

export const LOCALES = ['nl', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v)
}

export function detectLocale(): Locale {
  try {
    return /^nl\b/i.test(navigator.language ?? '') ? 'nl' : 'en'
  } catch {
    return 'nl'
  }
}

/** Houdt `lang` op <html> in sync met de instelling. */
export function useLocaleSync(locale: Ref<Locale>): void {
  watch(locale, (l) => (document.documentElement.lang = l), { immediate: true })
}
