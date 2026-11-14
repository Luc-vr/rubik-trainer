<script setup lang="ts">
/**
 * Toont een case als afbeelding. Wordt gebruikt in het overzicht, de quiz en de timer.
 * OLL/PLL: 2D-bovenaanzicht. F2L: isometrisch 3D-aanzicht met grijze bovenlaag.
 */
import { computed } from 'vue'
import type { AlgCase } from '../data/types'
import { casePattern } from '../lib/cube'
import LLDiagram from './LLDiagram.vue'
import F2LDiagram from './F2LDiagram.vue'

const props = withDefaults(
  defineProps<{
    case: AlgCase
    /** Alternatief algoritme om de case uit af te leiden (zelfde case, ander startbeeld mogelijk). */
    alg?: string
    preAuf?: string
    postAuf?: string
    arrows?: boolean
    /** Verberg de naam in de toegankelijke titel (bijv. tijdens de quiz). */
    anonymous?: boolean
  }>(),
  { alg: undefined, preAuf: '', postAuf: '', arrows: false, anonymous: false },
)

const pattern = computed(() => casePattern(props.alg ?? props.case.alg, props.preAuf, props.postAuf))
const title = computed(() => (props.anonymous ? 'Welke case is dit?' : props.case.name))
</script>

<template>
  <F2LDiagram v-if="props.case.set === 'F2L'" :pattern="pattern" :title="title" />
  <LLDiagram v-else :pattern="pattern" :mode="props.case.set === 'OLL' ? 'OLL' : 'PLL'" :arrows="arrows" :title="title" />
</template>
