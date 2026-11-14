<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed, toRef } from 'vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { useSettings } from './stores/settings'
import { useThemeSync } from './lib/theme'

useThemeSync(toRef(useSettings(), 'theme'))

const logo = `${import.meta.env.BASE_URL}favicon.svg`
const route = useRoute()
const links = [
  { to: '/', label: 'Overzicht', match: ['home', 'set', 'case'] },
  { to: '/quiz', label: 'Quiz', match: ['quiz'] },
  { to: '/timer', label: 'Timer', match: ['timer'] },
  { to: '/notatie', label: 'Notatie', match: ['notation'] },
]
const active = computed(() => String(route.name ?? ''))
</script>

<template>
  <div class="min-h-dvh pb-[env(safe-area-inset-bottom)]">
    <header class="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/95 text-white backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <RouterLink to="/" class="flex shrink-0 items-center gap-2 font-bold tracking-tight">
          <img :src="logo" alt="" class="h-7 w-7" />
          <span class="hidden sm:inline">CFOP-trainer</span>
        </RouterLink>
        <nav class="flex flex-1 justify-end gap-1 overflow-x-auto" aria-label="Hoofdmenu">
          <RouterLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition"
            :class="l.match.includes(active) ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'"
          >
            {{ l.label }}
          </RouterLink>
        </nav>
        <ThemeToggle />
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-5 sm:py-8">
      <RouterView />
    </main>
  </div>
</template>
