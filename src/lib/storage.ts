/**
 * Veilige localStorage-wrapper: elke read/write zit in try/catch, zodat de app
 * ook werkt als opslag geblokkeerd of vol is (privévenster, quota, enz.).
 */
const PREFIX = 'cfop-trainer:'

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveJSON(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    /* opslag niet beschikbaar: niets te doen */
  }
}
