<script setup lang="ts">
import { ref } from 'vue'
import TwistyCube from './TwistyCube.vue'
import { useI18n } from '../lib/i18n'

const props = withDefaults(defineProps<{ alg: string; desc?: string; title?: string }>(), { desc: '', title: '' })
const player = ref<InstanceType<typeof TwistyCube> | null>(null)
const { t, move } = useI18n()
</script>

<template>
  <figure class="card flex flex-col items-center p-3">
    <div class="aspect-square w-full max-w-40">
      <TwistyCube ref="player" :alg="props.alg" anchor="start" :hint="false" :label="t('demoOf', { alg: props.alg })" />
    </div>
    <figcaption class="mt-1 w-full text-center">
      <span class="alg block text-xl font-bold">{{ props.title || props.alg }}</span>
      <span class="block min-h-8 text-xs text-slate-600 dark:text-slate-400">{{ props.desc || move(props.alg) }}</span>
      <button type="button" class="btn mt-2 w-full py-1" @click="player?.play()">{{ t('play') }}</button>
    </figcaption>
  </figure>
</template>
