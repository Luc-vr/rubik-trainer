<script setup lang="ts">
defineProps<{ playing: boolean; atStart: boolean; atEnd: boolean }>()
const tempo = defineModel<number>('tempo', { required: true })
const emit = defineEmits<{ start: []; back: []; toggle: []; forward: []; end: [] }>()
const speeds = [0.25, 0.5, 1, 1.5, 2, 3]
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <div class="flex gap-1">
      <button type="button" class="btn px-2.5" :disabled="atStart" title="Naar begin" aria-label="Naar begin" @click="emit('start')">⏮</button>
      <button type="button" class="btn px-2.5" :disabled="atStart" title="Zet terug" aria-label="Zet terug" @click="emit('back')">◀</button>
      <button type="button" class="btn-primary min-w-24" @click="emit('toggle')">
        {{ playing ? '⏸ Pauze' : '▶ Afspelen' }}
      </button>
      <button type="button" class="btn px-2.5" :disabled="atEnd" title="Zet vooruit" aria-label="Zet vooruit" @click="emit('forward')">▶</button>
      <button type="button" class="btn px-2.5" :disabled="atEnd" title="Naar eind" aria-label="Naar eind" @click="emit('end')">⏭</button>
    </div>
    <label class="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
      Snelheid
      <select v-model.number="tempo" class="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm">
        <option v-for="s in speeds" :key="s" :value="s">{{ s }}×</option>
      </select>
    </label>
  </div>
</template>
