<script setup lang="ts">
/**
 * Wrapper rond cubing.js `<twisty-player>`.
 * - Geel boven / groen voor: we zetten "z2" vóór de setup. Omdat stickering-maskers
 *   in cubing.js per stuk werken, gebruiken we eigen maskers waarin de gele stukken
 *   (oorspronkelijk de D-laag) als laatste laag gelden.
 * - `anchor="end"`: de kubus start in de case en het algoritme lost hem op.
 */
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { TwistyPlayer } from 'cubing/twisty'

export type Stickering = 'OLL' | 'PLL' | 'F2L' | 'full'

const props = withDefaults(
  defineProps<{
    alg?: string
    /** Extra setup (na z2). Bij anchor "end" is dit de eindtoestand. */
    setup?: string
    anchor?: 'start' | 'end'
    stickering?: Stickering
    tempo?: number
    hint?: boolean
    label?: string
  }>(),
  { alg: '', setup: '', anchor: 'end', stickering: 'full', tempo: 1, hint: true, label: '3D-kubus' },
)

const emit = defineEmits<{
  /** Index van de zet die nu bezig is / als volgende komt; `total` = aantal zetten. */
  progress: [index: number, total: number, atEnd: boolean]
  playing: [playing: boolean]
  ready: []
}>()

// Maskers per stuk-identiteit (EDGES 0-11, CORNERS 0-7, CENTERS U L F R B D).
// Na z2 liggen de stukken 4-7 (oorspronkelijke D-laag, geel) bovenop.
const MASKS: Record<Stickering, string | null> = {
  OLL: 'EDGES:DDDDOOOODDDD,CORNERS:DDDDOOOO,CENTERS:DDDDD-',
  PLL: 'EDGES:DDDDPPPPDDDD,CORNERS:DDDDPPPP,CENTERS:DDDDDD',
  F2L: 'EDGES:----IIII----,CORNERS:----IIII,CENTERS:------',
  full: null,
}

type Indexer = {
  indexToMoveStartTimestamp(index: number): number
  moveDuration(index: number): number
}

/**
 * Index van de zet die bezig is of als volgende komt. Niet `indexer.timestampToIndex`:
 * die geeft op de grens tussen twee zetten nog de vorige zet terug, waardoor de
 * speler na zet 1 denkt dat hij nog aan het begin staat.
 */
function moveIndexAt(indexer: Indexer, timestamp: number, total: number): number {
  for (let i = 0; i < total; i++) {
    if (indexer.indexToMoveStartTimestamp(i) + indexer.moveDuration(i) > timestamp) return i
  }
  return total
}

const el = ref<TwistyPlayer | null>(null)
const player = shallowRef<TwistyPlayer | null>(null)
const failed = ref(false)
let disposed = false

async function apply() {
  const p = player.value
  if (!p) return
  p.puzzle = '3x3x3'
  p.experimentalSetupAnchor = props.anchor
  p.experimentalSetupAlg = `z2 ${props.setup}`.trim()
  p.alg = props.alg
  const mask = MASKS[props.stickering]
  if (mask) p.experimentalStickeringMaskOrbits = mask
  else {
    p.experimentalStickeringMaskOrbits = 'EDGES:------------,CORNERS:--------,CENTERS:------'
  }
  p.tempoScale = props.tempo
}

onMounted(async () => {
  try {
    await import('cubing/twisty')
    await customElements.whenDefined('twisty-player')
  } catch {
    failed.value = true
    return
  }
  if (disposed || !el.value) return
  const p = el.value
  p.controlPanel = 'none'
  p.background = 'none'
  p.hintFacelets = props.hint ? 'floating' : 'none'
  p.backView = 'none'
  p.experimentalDragInput = 'auto'
  player.value = p
  await apply()

  const model = p.experimentalModel
  model.detailedTimelineInfo.addFreshListener(async (info) => {
    const indexer = await model.indexer.get()
    const total = indexer.numAnimatedLeaves()
    emit('progress', info.atEnd ? total : moveIndexAt(indexer, info.timestamp, total), total, info.atEnd)
  })
  model.playingInfo.addFreshListener((info) => emit('playing', info.playing))
  emit('ready')
})

onBeforeUnmount(() => {
  disposed = true
  player.value?.pause()
})

watch(
  () => [props.alg, props.setup, props.anchor, props.stickering],
  () => apply(),
)
watch(
  () => props.tempo,
  (t) => {
    if (player.value) player.value.tempoScale = t
  },
)

// ---- Bediening (aangeroepen door de ouder via ref) ----
function play() {
  const p = player.value
  if (!p) return
  // Aan het eind? Dan eerst naar het begin.
  p.experimentalModel.detailedTimelineInfo.get().then((info) => {
    if (info.atEnd) p.jumpToStart()
    p.play()
  })
}
function pause() {
  player.value?.pause()
}
function step(direction: 1 | -1) {
  const p = player.value
  if (!p) return
  p.pause()
  p.controller.animationController.play({ direction, untilBoundary: 'move', autoSkipToOtherEndIfStartingAtBoundary: false })
}
function jumpToStart() {
  player.value?.jumpToStart()
}
function jumpToEnd() {
  player.value?.jumpToEnd()
}
/** Spring naar vlak vóór zet `index` en speel die ene zet af. */
async function playMove(index: number) {
  const p = player.value
  if (!p) return
  p.pause()
  const indexer = await p.experimentalModel.indexer.get()
  const total = indexer.numAnimatedLeaves()
  if (index >= total) {
    p.jumpToEnd()
    return
  }
  p.experimentalModel.timestampRequest.set(indexer.indexToMoveStartTimestamp(index as never))
  // kleine vertraging zodat de sprong verwerkt is voordat de animatie start
  setTimeout(() => step(1), 30)
}

defineExpose({ play, pause, step, jumpToStart, jumpToEnd, playMove })
</script>

<template>
  <div class="relative h-full w-full">
    <twisty-player ref="el" :aria-label="label" />
    <p v-if="failed" class="absolute inset-0 grid place-items-center p-4 text-center text-sm text-slate-500 dark:text-slate-400">
      De 3D-kubus kon niet geladen worden.
    </p>
  </div>
</template>
