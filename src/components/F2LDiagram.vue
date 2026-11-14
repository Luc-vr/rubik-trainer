<script setup lang="ts">
/**
 * Isometrisch 3D-aanzicht (boven, voor, rechts) voor F2L-cases.
 * Stukken in de bovenlaag zijn grijs, behalve het F2L-paar (hoek DRF + rand FR).
 */
import { computed } from 'vue'
import type { KPattern } from 'cubing/kpuzzle'
import { FACE_GRIDS, GREY, STICKER_COLORS, pieceAt, stickerAt, type Face } from '../lib/cube'

const props = withDefaults(defineProps<{ pattern: KPattern; highlightPair?: boolean; title?: string }>(), {
  highlightPair: true,
  title: '',
})

const PAIR = new Set(['DRF', 'FR'])

/** x = naar rechts, y = omhoog, z = naar de kijker; kijkrichting vanuit (1,1,1). */
function project(x: number, y: number, z: number): [number, number] {
  const sx = (x - z) / Math.SQRT2
  const sy = -(-x + 2 * y - z) / Math.sqrt(6)
  return [sx * 10, sy * 10]
}

type V3 = [number, number, number]

function cellCorners(face: 'U' | 'F' | 'R', r: number, c: number): V3[] {
  const inset = 0.07
  const a = inset
  const b = 1 - inset
  if (face === 'U') {
    return [[c + a, 3, r + a], [c + b, 3, r + a], [c + b, 3, r + b], [c + a, 3, r + b]]
  }
  if (face === 'F') {
    const y0 = 3 - r
    return [[c + a, y0 - a, 3], [c + b, y0 - a, 3], [c + b, y0 - b, 3], [c + a, y0 - b, 3]]
  }
  const y0 = 3 - r
  const z0 = 3 - c
  return [[3, y0 - a, z0 - a], [3, y0 - a, z0 - b], [3, y0 - b, z0 - b], [3, y0 - b, z0 - a]]
}

function poly(points: V3[]): string {
  return points.map((p) => project(...p).map((v) => v.toFixed(2)).join(',')).join(' ')
}

const faces: { face: 'U' | 'F' | 'R'; outline: V3[] }[] = [
  { face: 'U', outline: [[0, 3, 0], [3, 3, 0], [3, 3, 3], [0, 3, 3]] },
  { face: 'F', outline: [[0, 3, 3], [3, 3, 3], [3, 0, 3], [0, 0, 3]] },
  { face: 'R', outline: [[3, 3, 3], [3, 3, 0], [3, 0, 0], [3, 0, 3]] },
]

const stickers = computed(() => {
  const p = props.pattern
  const out: { points: string; fill: string }[] = []
  for (const { face } of faces) {
    FACE_GRIDS[face].forEach((pos, i) => {
      const r = Math.floor(i / 3)
      const c = i % 3
      const col: Face = stickerAt(p, pos, face)
      // Grijs = stuk uit de bovenlaag (wat er nu niet toe doet), ongeacht waar het zit.
      const piece = pieceAt(p, pos)
      const grey = props.highlightPair && piece.length > 1 && piece.includes('U') && !PAIR.has(piece)
      out.push({ points: poly(cellCorners(face, r, c)), fill: grey ? GREY : STICKER_COLORS[col] })
    })
  }
  return out
})

const box = (() => {
  const pts = [project(0, 3, 0), project(3, 3, 0), project(3, 0, 0), project(3, 0, 3), project(0, 0, 3), project(0, 3, 3)]
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const pad = 1.2
  return `${Math.min(...xs) - pad} ${Math.min(...ys) - pad} ${Math.max(...xs) - Math.min(...xs) + 2 * pad} ${Math.max(...ys) - Math.min(...ys) + 2 * pad}`
})()
</script>

<template>
  <svg :viewBox="box" role="img" :aria-label="title || '3D-aanzicht van de F2L-case'" class="block h-full w-full">
    <title v-if="title">{{ title }}</title>
    <polygon v-for="f in faces" :key="f.face" :points="poly(f.outline)" fill="#1e293b" stroke="#1e293b" stroke-width="0.6" stroke-linejoin="round" />
    <polygon v-for="(s, i) in stickers" :key="i" :points="s.points" :fill="s.fill" stroke-linejoin="round" />
  </svg>
</template>
