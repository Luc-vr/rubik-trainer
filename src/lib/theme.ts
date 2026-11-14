/**
 * Kleurthema: licht, donker of volgens het systeem. De klasse `dark` op <html>
 * schakelt de `dark:`-varianten van Tailwind in. Een inline script in index.html
 * zet die klasse al vóór de eerste render, zodat er geen witte flits is.
 */
import { onBeforeUnmount, watch, type Ref } from 'vue'

export const THEMES = ['light', 'dark', 'system'] as const
export type Theme = (typeof THEMES)[number]

export function isTheme(v: unknown): v is Theme {
  return typeof v === 'string' && (THEMES as readonly string[]).includes(v)
}

function systemPrefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

export function applyTheme(theme: Theme): void {
  const dark = theme === 'dark' || (theme === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
}

/** Houdt <html> in sync met de instelling en, bij "systeem", met het besturingssysteem. */
export function useThemeSync(theme: Ref<Theme>): void {
  watch(theme, applyTheme, { immediate: true })
  let mq: MediaQueryList | null = null
  try {
    mq = window.matchMedia('(prefers-color-scheme: dark)')
  } catch {
    /* geen matchMedia: alleen handmatige keuze */
  }
  const onChange = () => {
    if (theme.value === 'system') applyTheme('system')
  }
  mq?.addEventListener('change', onChange)
  onBeforeUnmount(() => mq?.removeEventListener('change', onChange))
}
