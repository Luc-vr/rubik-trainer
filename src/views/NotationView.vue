<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import MoveDemo from '../components/MoveDemo.vue'
import { useI18n } from '../lib/i18n'

// Lopende tekst met links en opmaak staat per taal in de template (v-if="nl").
const { t, locale } = useI18n()
const nl = computed(() => locale.value === 'nl')

const triggers = computed(() =>
  nl.value
    ? [
        { alg: "R U R' U'", title: 'Sexy move', desc: "R U R' U' — de meest gebruikte trigger." },
        { alg: "R' F R F'", title: 'Sledgehammer', desc: "R' F R F' — vaak aan het eind van OLL's." },
        { alg: "R U R' U R U2 R'", title: 'Sune', desc: 'OLL 27, en een bouwsteen voor veel andere cases.' },
        { alg: "r U R' U'", title: 'Brede sexy move', desc: 'Sexy move met r: draait ook de middenlaag mee.' },
      ]
    : [
        { alg: "R U R' U'", title: 'Sexy move', desc: "R U R' U' — the most used trigger." },
        { alg: "R' F R F'", title: 'Sledgehammer', desc: "R' F R F' — often at the end of OLLs." },
        { alg: "R U R' U R U2 R'", title: 'Sune', desc: 'OLL 27, and a building block for many other cases.' },
        { alg: "r U R' U'", title: 'Wide sexy move', desc: 'Sexy move with r: turns the middle slice too.' },
      ],
)
const link = 'text-indigo-600 dark:text-indigo-400 hover:underline'
</script>

<template>
  <h1 class="text-2xl font-bold">{{ t('notationTitle') }}</h1>
  <p v-if="nl" class="mb-6 max-w-3xl text-slate-600 dark:text-slate-400">
    Alle algoritmes gebruiken de standaardnotatie. Houd de kubus met <strong>geel boven</strong> en <strong>groen voor</strong>.
    Elke letter is een draai van één laag, <em>met de klok mee gezien vanaf die zijde</em>. Klik op ▶ om een zet te zien.
  </p>
  <p v-else class="mb-6 max-w-3xl text-slate-600 dark:text-slate-400">
    All algorithms use standard notation. Hold the cube with <strong>yellow on top</strong> and <strong>green in front</strong>.
    Each letter is a turn of one layer, <em>clockwise as seen from that side</em>. Click ▶ to see a move.
  </p>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">{{ nl ? 'Zijden' : 'Faces' }}: R, L, U, D, F, B</h2>
    <p class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      <template v-if="nl">R = rechts (right), L = links (left), U = boven (up), D = onder (down), F = voor (front), B = achter (back).</template>
      <template v-else>R = right, L = left, U = up (top), D = down (bottom), F = front, B = back.</template>
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MoveDemo v-for="m in ['R', 'L', 'U', 'D', 'F', 'B']" :key="m" :alg="m" />
    </div>
  </section>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">{{ nl ? 'Accent' : 'Prime' }} (') {{ nl ? 'en' : 'and' }} 2</h2>
    <p v-if="nl" class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      Een accent (<span class="alg">R'</span>, spreek uit: “R prime”) betekent tegen de klok in. Een 2 (<span class="alg">R2</span>) is een halve slag;
      de richting maakt dan niet uit. <span class="alg">U2'</span> is hetzelfde als <span class="alg">U2</span>.
    </p>
    <p v-else class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      A prime (<span class="alg">R'</span>, pronounced “R prime”) means counterclockwise. A 2 (<span class="alg">R2</span>) is a half turn;
      the direction doesn't matter then. <span class="alg">U2'</span> is the same as <span class="alg">U2</span>.
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MoveDemo v-for="m in ['R', `R'`, 'R2', 'U', `U'`, 'U2']" :key="m" :alg="m" />
    </div>
  </section>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">{{ nl ? 'Brede zetten: r, l, u, d, f, b (of Rw, Lw …)' : 'Wide moves: r, l, u, d, f, b (or Rw, Lw …)' }}</h2>
    <p v-if="nl" class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      Een kleine letter draait <strong>twee lagen tegelijk</strong>: de buitenlaag plus de middenlaag ernaast.
      <span class="alg">r</span> en <span class="alg">Rw</span> betekenen hetzelfde. In full OLL zie je ze vaak, bijvoorbeeld in
      <RouterLink to="/case/oll-7" :class="link">OLL 7</RouterLink> (<span class="alg">r U R' U R U2 r'</span>).
    </p>
    <p v-else class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      A lowercase letter turns <strong>two layers at once</strong>: the outer layer plus the middle slice next to it.
      <span class="alg">r</span> and <span class="alg">Rw</span> mean the same thing. You see them a lot in full OLL, for example in
      <RouterLink to="/case/oll-7" :class="link">OLL 7</RouterLink> (<span class="alg">r U R' U R U2 r'</span>).
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MoveDemo alg="r" />
      <MoveDemo alg="Rw" :desc="nl ? 'Zelfde als r: rechter twee lagen omhoog.' : 'Same as r: right two layers up.'" />
      <MoveDemo alg="r'" />
      <MoveDemo alg="l" />
      <MoveDemo alg="u" />
      <MoveDemo alg="f" />
    </div>
  </section>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">{{ nl ? 'Middenlagen' : 'Slice moves' }}: M, E, S</h2>
    <p v-if="nl" class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      <span class="alg">M</span> is de middenlaag tussen L en R en draait <strong>zoals L</strong> (voorkant naar beneden).
      <span class="alg">E</span> ligt tussen U en D en draait zoals D. <span class="alg">S</span> ligt tussen F en B en draait zoals F.
      Handig om te onthouden: <span class="alg">r = R M'</span> en <span class="alg">l = L M</span>. M-zetten zitten in o.a. de
      <RouterLink to="/case/pll-ua" :class="link">U-perms</RouterLink>,
      <RouterLink to="/case/pll-h" :class="link">H-perm</RouterLink> en
      <RouterLink to="/case/oll-20" :class="link">OLL 20</RouterLink>.
    </p>
    <p v-else class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      <span class="alg">M</span> is the middle slice between L and R and turns <strong>like L</strong> (front goes down).
      <span class="alg">E</span> sits between U and D and turns like D. <span class="alg">S</span> sits between F and B and turns like F.
      Handy to remember: <span class="alg">r = R M'</span> and <span class="alg">l = L M</span>. M moves appear in, among others, the
      <RouterLink to="/case/pll-ua" :class="link">U-perms</RouterLink>,
      <RouterLink to="/case/pll-h" :class="link">H-perm</RouterLink> and
      <RouterLink to="/case/oll-20" :class="link">OLL 20</RouterLink>.
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MoveDemo v-for="m in ['M', `M'`, 'M2', 'E', 'S', `S'`]" :key="m" :alg="m" />
    </div>
  </section>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">{{ nl ? 'Rotaties' : 'Rotations' }}: x, y, z</h2>
    <p v-if="nl" class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      Rotaties draaien de <strong>hele kubus</strong> in je handen; er verandert niets aan de puzzel zelf.
      <span class="alg">x</span> volgt R, <span class="alg">y</span> volgt U en <span class="alg">z</span> volgt F.
    </p>
    <p v-else class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      Rotations turn the <strong>whole cube</strong> in your hands; nothing changes about the puzzle itself.
      <span class="alg">x</span> follows R, <span class="alg">y</span> follows U and <span class="alg">z</span> follows F.
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MoveDemo v-for="m in ['x', `x'`, 'y', `y'`, 'z', `z'`]" :key="m" :alg="m" />
    </div>
  </section>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">{{ nl ? 'Triggers en overige afspraken' : 'Triggers and other conventions' }}</h2>
    <p v-if="nl" class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      Haakjes zoals <span class="alg">(R U R' U')</span> groeperen alleen zetten die je als één vloeiende beweging doet.
      <strong>AUF</strong> (“adjust U face”) is een U-zet vóór of na een algoritme om de bovenlaag goed te zetten.
      Veel algoritmes zijn opgebouwd uit vaste <strong>triggers</strong>:
    </p>
    <p v-else class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      Parentheses like <span class="alg">(R U R' U')</span> only group moves you do as one fluid motion.
      <strong>AUF</strong> (“adjust U face”) is a U move before or after an algorithm to line up the top layer.
      Many algorithms are built from fixed <strong>triggers</strong>:
    </p>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MoveDemo v-for="tr in triggers" :key="tr.alg" :alg="tr.alg" :title="tr.title" :desc="tr.desc" />
    </div>
  </section>
</template>
