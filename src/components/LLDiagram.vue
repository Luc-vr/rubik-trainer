<script setup lang="ts">
/**
 * 2D-bovenaanzicht van de laatste laag: bovenkant 3x3 plus de zijstickers.
 * OLL-modus: alleen geel is gekleurd. PLL-modus: alle kleuren, optioneel met pijlen.
 */
import { computed } from 'vue'
import type { KPattern } from 'cubing/kpuzzle'
import { DARK_GREY, FACE_GRIDS, STICKER_COLORS, faceStickers, patternFromAlg, AUFS, type Face } from '../lib/cube'
import { useI18n } from '../lib/i18n'

const props = withDefaults(
  defineProps<{ pattern: KPattern; mode: 'OLL' | 'PLL'; arrows?: boolean; title?: string }>(),
  { arrows: false, title: '' },
)
const { t } = useI18n()

const CELL = 10
const GAP = 1
const STRIP = 3.4
const OFF = STRIP + 1.6 // ruimte voor de zijstrips
const SIZE = OFF * 2 + CELL * 3

function color(f: Face): string {
  if (props.mode === 'OLL') return f === 'U' ? STICKER_COLORS.U : DARK_GREY
  return STICKER_COLORS[f]
}

interface Rect { x: number; y: number; w: number; h: number; fill: string }

const rects = computed<Rect[]>(() => {
  const p = props.pattern
  const out: Rect[] = []
  const u = faceStickers(p, 'U')
  u.forEach((f, i) => {
    const r = Math.floor(i / 3)
    const c = i % 3
    out.push({ x: OFF + c * CELL + GAP / 2, y: OFF + r * CELL + GAP / 2, w: CELL - GAP, h: CELL - GAP, fill: color(f) })
  })
  const top = (face: Face) => faceStickers(p, face).slice(0, 3)
  const long = CELL - GAP * 1.5
  // achterkant: van boven gezien links→rechts = UBL, UB, URB (omgekeerd t.o.v. B-raster)
  top('B').reverse().forEach((f, c) => out.push({ x: OFF + c * CELL + GAP * 0.75, y: OFF - STRIP - 0.8, w: long, h: STRIP, fill: color(f) }))
  top('F').forEach((f, c) => out.push({ x: OFF + c * CELL + GAP * 0.75, y: OFF + 3 * CELL + 0.8, w: long, h: STRIP, fill: color(f) }))
  top('L').forEach((f, r) => out.push({ x: OFF - STRIP - 0.8, y: OFF + r * CELL + GAP * 0.75, w: STRIP, h: long, fill: color(f) }))
  top('R').reverse().forEach((f, r) => out.push({ x: OFF + 3 * CELL + 0.8, y: OFF + r * CELL + GAP * 0.75, w: STRIP, h: long, fill: color(f) }))
  return out
})

function center(pos: string): [number, number] {
  const i = FACE_GRIDS.U.indexOf(pos)
  return [OFF + (i % 3) * CELL + CELL / 2, OFF + Math.floor(i / 3) * CELL + CELL / 2]
}

const U_CORNERS = ['UFR', 'URB', 'UBL', 'ULF']
const U_EDGES = ['UF', 'UR', 'UB', 'UL']

interface Arrow { x1: number; y1: number; x2: number; y2: number; both: boolean }

/** Pijlen: waar moet elk stuk naartoe (met de AUF die de minste pijlen geeft). */
const arrowList = computed<Arrow[]>(() => {
  if (!props.arrows || props.mode !== 'PLL') return []
  const p = props.pattern
  let best: [number, number][] | null = null
  for (const auf of AUFS) {
    const t = patternFromAlg(auf)
    const moves: [number, number][] = []
    for (const orbit of ['CORNERS', 'EDGES'] as const) {
      const pieces = p.patternData[orbit].pieces
      const tp = t.patternData[orbit].pieces
      for (let pos = 0; pos < 4; pos++) {
        const target = tp[pieces[pos]]
        if (target !== pos) {
          moves.push(orbit === 'CORNERS' ? [pos, target] : [pos + 100, target + 100])
        }
      }
    }
    if (!best || moves.length < best.length) best = moves
  }
  const out: Arrow[] = []
  const done = new Set<string>()
  for (const [a, b] of best ?? []) {
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`
    if (done.has(key)) continue
    const swap = (best ?? []).some(([c, d]) => c === b && d === a)
    if (swap) done.add(key)
    const name = (n: number) => (n >= 100 ? U_EDGES[n - 100] : U_CORNERS[n])
    const [x1, y1] = center(name(a))
    const [x2, y2] = center(name(b))
    // pijl iets inkorten zodat de punt niet in het midden van de sticker valt
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.hypot(dx, dy)
    const s = 2.2 / len
    out.push({ x1: x1 + dx * s, y1: y1 + dy * s, x2: x2 - dx * s, y2: y2 - dy * s, both: swap })
  }
  return out
})

const uid = `ah${Math.random().toString(36).slice(2, 8)}`
</script>

<template>
  <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" role="img" :aria-label="title || t('llDiagramLabel')" class="block h-full w-full">
    <title v-if="title">{{ title }}</title>
    <defs>
      <marker :id="uid" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="#0f172a" />
      </marker>
    </defs>
    <rect :x="OFF - 0.4" :y="OFF - 0.4" :width="CELL * 3 + 0.8" :height="CELL * 3 + 0.8" rx="1.5" fill="#1e293b" />
    <rect v-for="(r, i) in rects" :key="i" :x="r.x" :y="r.y" :width="r.w" :height="r.h" rx="1.1" :fill="r.fill" />
    <g v-for="(a, i) in arrowList" :key="'a' + i">
      <line :x1="a.x1" :y1="a.y1" :x2="a.x2" :y2="a.y2" stroke="white" stroke-width="1.8" stroke-linecap="round" />
      <line
        :x1="a.x1" :y1="a.y1" :x2="a.x2" :y2="a.y2" stroke="#0f172a" stroke-width="0.9" stroke-linecap="round"
        :marker-end="`url(#${uid})`" :marker-start="a.both ? `url(#${uid})` : undefined"
      />
    </g>
  </svg>
</template>
