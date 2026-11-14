<script setup lang="ts">
import { RouterLink } from 'vue-router'
import MoveDemo from '../components/MoveDemo.vue'

const triggers = [
  { alg: "R U R' U'", title: 'Sexy move', desc: "R U R' U' — de meest gebruikte trigger." },
  { alg: "R' F R F'", title: 'Sledgehammer', desc: "R' F R F' — vaak aan het eind van OLL's." },
  { alg: "R U R' U R U2 R'", title: 'Sune', desc: 'OLL 27, en een bouwsteen voor veel andere cases.' },
  { alg: "r U R' U'", title: 'Brede sexy move', desc: 'Sexy move met r: draait ook de middenlaag mee.' },
]
</script>

<template>
  <h1 class="text-2xl font-bold">Notatie-uitleg</h1>
  <p class="mb-6 max-w-3xl text-slate-600 dark:text-slate-400">
    Alle algoritmes gebruiken de standaardnotatie. Houd de kubus met <strong>geel boven</strong> en <strong>groen voor</strong>.
    Elke letter is een draai van één laag, <em>met de klok mee gezien vanaf die zijde</em>. Klik op ▶ om een zet te zien.
  </p>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">Zijden: R, L, U, D, F, B</h2>
    <p class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      R = rechts (right), L = links (left), U = boven (up), D = onder (down), F = voor (front), B = achter (back).
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MoveDemo v-for="m in ['R', 'L', 'U', 'D', 'F', 'B']" :key="m" :alg="m" />
    </div>
  </section>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">Accent (') en 2</h2>
    <p class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      Een accent (<span class="alg">R'</span>, spreek uit: “R prime”) betekent tegen de klok in. Een 2 (<span class="alg">R2</span>) is een halve slag;
      de richting maakt dan niet uit. <span class="alg">U2'</span> is hetzelfde als <span class="alg">U2</span>.
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MoveDemo v-for="m in ['R', `R'`, 'R2', 'U', `U'`, 'U2']" :key="m" :alg="m" />
    </div>
  </section>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">Brede zetten: r, l, u, d, f, b (of Rw, Lw …)</h2>
    <p class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      Een kleine letter draait <strong>twee lagen tegelijk</strong>: de buitenlaag plus de middenlaag ernaast.
      <span class="alg">r</span> en <span class="alg">Rw</span> betekenen hetzelfde. In full OLL zie je ze vaak, bijvoorbeeld in
      <RouterLink to="/case/oll-7" class="text-indigo-600 dark:text-indigo-400 hover:underline">OLL 7</RouterLink> (<span class="alg">r U R' U R U2 r'</span>).
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MoveDemo alg="r" />
      <MoveDemo alg="Rw" desc="Zelfde als r: rechter twee lagen omhoog." />
      <MoveDemo alg="r'" />
      <MoveDemo alg="l" />
      <MoveDemo alg="u" />
      <MoveDemo alg="f" />
    </div>
  </section>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">Middenlagen: M, E, S</h2>
    <p class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      <span class="alg">M</span> is de middenlaag tussen L en R en draait <strong>zoals L</strong> (voorkant naar beneden).
      <span class="alg">E</span> ligt tussen U en D en draait zoals D. <span class="alg">S</span> ligt tussen F en B en draait zoals F.
      Handig om te onthouden: <span class="alg">r = R M'</span> en <span class="alg">l = L M</span>. M-zetten zitten in o.a. de
      <RouterLink to="/case/pll-ua" class="text-indigo-600 dark:text-indigo-400 hover:underline">U-perms</RouterLink>,
      <RouterLink to="/case/pll-h" class="text-indigo-600 dark:text-indigo-400 hover:underline">H-perm</RouterLink> en
      <RouterLink to="/case/oll-20" class="text-indigo-600 dark:text-indigo-400 hover:underline">OLL 20</RouterLink>.
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MoveDemo v-for="m in ['M', `M'`, 'M2', 'E', 'S', `S'`]" :key="m" :alg="m" />
    </div>
  </section>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">Rotaties: x, y, z</h2>
    <p class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      Rotaties draaien de <strong>hele kubus</strong> in je handen; er verandert niets aan de puzzel zelf.
      <span class="alg">x</span> volgt R, <span class="alg">y</span> volgt U en <span class="alg">z</span> volgt F.
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MoveDemo v-for="m in ['x', `x'`, 'y', `y'`, 'z', `z'`]" :key="m" :alg="m" />
    </div>
  </section>

  <section class="mb-8">
    <h2 class="mb-1 text-lg font-bold">Triggers en overige afspraken</h2>
    <p class="mb-3 text-sm text-slate-600 dark:text-slate-400">
      Haakjes zoals <span class="alg">(R U R' U')</span> groeperen alleen zetten die je als één vloeiende beweging doet.
      <strong>AUF</strong> (“adjust U face”) is een U-zet vóór of na een algoritme om de bovenlaag goed te zetten.
      Veel algoritmes zijn opgebouwd uit vaste <strong>triggers</strong>:
    </p>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MoveDemo v-for="t in triggers" :key="t.alg" :alg="t.alg" :title="t.title" :desc="t.desc" />
    </div>
  </section>
</template>
