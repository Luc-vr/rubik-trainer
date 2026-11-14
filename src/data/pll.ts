import { defineCases } from './triggers'

/**
 * PLL — 21 cases. Algoritmes volgens de gangbare sets (J Perm / SpeedCubeDB).
 * Herkenning beschrijft de kubus zoals je hem vasthoudt bij het begin van het
 * algoritme (geel boven). "Koplampen" = twee gelijke hoekstickers aan één zijde.
 */
export const PLL_GROUPS = ['Alleen randen', 'Alleen hoeken', 'Aangrenzende hoekwissel', 'Diagonale hoekwissel']

export const PLL = defineCases('PLL', [
  // ---------------- Alleen randen ----------------
  {
    id: 'pll-ua', name: 'Ua-perm', short: 'Ua', group: 'Alleen randen', isTwoLook: true,
    steps: [
      ['M2 U', 'Middenlaag halve slag en boven naar links: start van de randcyclus.'],
      ["M U2 M'", 'Middenlaag omlaag, halve slag boven, middenlaag terug: verschuift de randen.'],
      ['U M2', 'Boven naar links en middenlaag halve slag: cyclus afgerond.'],
    ],
    alternatives: ["R U' R U R U R U' R' U' R2"],
    recognition:
      'Alle hoeken kloppen al (koplampen op elke zijde). Eén zijde is helemaal opgelost: houd die achter. Er draaien drie randen rond. Ua: de rand vóór heeft de kleur van de rechterkant (de randen draaien tegen de klok in, van boven gezien).',
  },
  {
    id: 'pll-ub', name: 'Ub-perm', short: 'Ub', group: 'Alleen randen', isTwoLook: true,
    steps: [
      ["M2 U'", 'Middenlaag halve slag en boven naar rechts.'],
      ["M U2 M'", 'Middenlaag omlaag, halve slag boven, middenlaag terug.'],
      ["U' M2", 'Boven naar rechts en middenlaag halve slag.'],
    ],
    alternatives: ["R2 U R U R' U' R' U' R' U R'"],
    recognition:
      'Alle hoeken kloppen al. Eén zijde is helemaal opgelost: houd die achter. Drie randen draaien rond. Ub: de rand vóór heeft de kleur van de linkerkant (de randen draaien met de klok mee, van boven gezien).',
  },
  {
    id: 'pll-h', name: 'H-perm', short: 'H', group: 'Alleen randen', isTwoLook: true,
    steps: ['M2 U M2', ['U2', 'Bovenkant halve slag.'], 'M2 U M2'],
    alternatives: ["M2 U' M2 U2 M2 U' M2"],
    recognition:
      'Koplampen op alle vier de zijden, en elke middenrand heeft de kleur van de tegenoverliggende zijde (bijv. rood tussen twee oranje hoeken). Twee paar tegenover elkaar liggende randen wisselen.',
  },
  {
    id: 'pll-z', name: 'Z-perm', short: 'Z', group: 'Alleen randen', isTwoLook: true,
    steps: [
      ["M' U", 'Middenlaag omhoog, boven naar links.'],
      ['M2 U M2 U', 'Twee keer middenlaag halve slag met boven ertussen: wisselt de randparen.'],
      ["M' U2 M2", 'Middenlaag terug, halve slag boven, middenlaag halve slag.'],
    ],
    alternatives: ["M2 U M2 U M' U2 M2 U2 M'"],
    recognition:
      'Koplampen op alle vier de zijden, en elke middenrand hoort bij een áángrenzende zijde (bijv. groen tussen twee rode hoeken). Twee paar naast elkaar liggende randen wisselen. Houd de kubus zo dat de voorrand met de linkerrand moet wisselen (en de rechterrand met de achterrand).',
  },
  // ---------------- Alleen hoeken ----------------
  {
    id: 'pll-aa', name: 'Aa-perm', short: 'Aa', group: 'Alleen hoeken',
    steps: [
      ['x', 'Kantel de hele kubus zoals R: de voorkant komt boven.'],
      ["R' U R'", 'Haalt een hoek uit zijn plek.'],
      ['D2', 'Onderlaag (de oude voorkant) halve slag.'],
      ["R U' R'", 'Zet de hoek terug op zijn nieuwe plek.'],
      ['D2 R2', 'Onderlaag terug en rechts halve slag: drie hoeken zijn rondgedraaid.'],
      ["x'", 'Kubus terugkantelen.'],
    ],
    alternatives: ["R' F R' B2 R F' R' B2 R2"],
    recognition:
      'Alle randen kloppen; drie hoeken draaien rond. Koplampen aan de achterkant en een opgelost 2x2-blokje linksvoor (hoek + twee randen). Rechts geen koplampen.',
  },
  {
    id: 'pll-ab', name: 'Ab-perm', short: 'Ab', group: 'Alleen hoeken',
    steps: [
      ['x', 'Kantel de hele kubus zoals R.'],
      ['R2 D2', 'Rechts halve slag, onderlaag halve slag.'],
      ["R U R'", 'Hoek wegzetten.'],
      ['D2', 'Onderlaag terug.'],
      ["R U' R", 'Hoek op zijn plek; drie hoeken zijn rondgedraaid.'],
      ["x'", 'Kubus terugkantelen.'],
    ],
    alternatives: ["R2 B2 R F R' B2 R F' R"],
    recognition:
      'Alle randen kloppen; drie hoeken draaien rond. Koplampen aan de rechterkant en een opgelost 2x2-blokje linksvoor. De voorkant toont geen koplampen.',
  },
  {
    id: 'pll-e', name: 'E-perm', short: 'E', group: 'Alleen hoeken',
    steps: [
      ["x'", 'Kantel de hele kubus zoals L (voorkant naar onder).'],
      ["R U' R' D", 'Eerste commutatorhelft: hoek eruit, onderlaag draaien.'],
      ["R U R' D'", 'Hoek terug, onderlaag terug.'],
      ["R U R' D", 'Tweede commutator: herhaalt het patroon gespiegeld.'],
      ["R U' R' D'", 'Afronden: twee paar hoeken zijn gewisseld.'],
      ['x', 'Kubus terugkantelen.'],
    ],
    alternatives: ["R2 U R' U' y R U R' U' R U R' U' R U R' y' R U' R2"],
    recognition:
      'Alle randen kloppen en er zijn nergens koplampen: op elke zijde hebben de twee hoeken een verschillende (tegenovergestelde) kleur. Twee paar hoeken wisselen.',
  },
  // ---------------- Aangrenzende hoekwissel ----------------
  {
    id: 'pll-t', name: 'T-perm', short: 'T', group: 'Aangrenzende hoekwissel', isTwoLook: true,
    steps: [
      "R U R' U'",
      ["R' F R2 U' R'", 'Kern van de T-perm: wisselt de twee rechterhoeken.'],
      ["U' R U R' F'", 'Herstelt het F2L-paar en sluit af met F\'.'],
    ],
    alternatives: [],
    recognition:
      'Koplampen aan de linkerkant met een middenrand van de tegenovergestelde kleur. Voor en achter zie je links een blokje van 2. Wisselt de twee rechterhoeken en de linker- en rechterrand. In 2-look PLL gebruik je deze voor "koplampen": houd de koplampen dan links.',
  },
  {
    id: 'pll-ja', name: 'Ja-perm', short: 'Ja', group: 'Aangrenzende hoekwissel',
    steps: [
      ['x', 'Kantel de hele kubus zoals R.'],
      ["R2 F R F'", 'Setup met een sledgehammer-achtige beweging.'],
      ["R U2 r' U r U2", 'Brede r-zetten verplaatsen het blok.'],
      ["x'", 'Kubus terugkantelen.'],
    ],
    alternatives: ["R' U L' U2 R U' R' U2 R L"],
    recognition:
      'Een volledig opgeloste balk van 3 aan de linkerkant. Voor zie je links een blokje van 2 dat aansluit op die balk. Rechts (vooraan) en achter (rechts) zie je ook een blokje van 2, met de kleuren van elkaars zijde.',
  },
  {
    id: 'pll-jb', name: 'Jb-perm', short: 'Jb', group: 'Aangrenzende hoekwissel',
    steps: [
      ["R U R' F'", 'Setup: zet de stukken klaar voor de T-perm-kern.'],
      "R U R' U'",
      ["R' F R2 U' R'", 'Zelfde kern als de T-perm: wisselt hoeken en randen.'],
    ],
    alternatives: [],
    recognition:
      'Een balk van 3 gelijke stickers aan de linkerkant. De andere drie zijden hebben elk een blokje van 2 plus een losse hoek: voor zit het blokje rechts. Wisselt twee aangrenzende hoeken en twee randen.',
  },
  {
    id: 'pll-f', name: 'F-perm', short: 'F', group: 'Aangrenzende hoekwissel',
    steps: [
      ["R' U' F'", 'Setup: brengt de stukken in T-perm-positie.'],
      "R U R' U'",
      ["R' F R2 U' R' U'", 'Kern van de T-perm.'],
      ["R U R' U R", 'Afronden en het paar terugzetten.'],
    ],
    alternatives: [],
    recognition:
      'De linkerkant is helemaal opgelost (balk van 3). Rechts: de twee hoeken hebben tegenovergestelde kleuren (van voor en achter) met daartussen de juiste rand. Wisselt de twee rechterhoeken en de voor- en achterrand.',
  },
  {
    id: 'pll-ra', name: 'Ra-perm', short: 'Ra', group: 'Aangrenzende hoekwissel',
    steps: [
      ["R U' R' U'", 'Paar uit elkaar halen.'],
      ['R U R', 'Rechts omhoog, boven, rechts nóg eens omhoog.'],
      ["D R' U' R D'", 'Hoek via de onderlaag verwisselen; D\' herstelt de onderlaag.'],
      ["R' U2 R'", 'Paar terugzetten en afsluiten.'],
    ],
    alternatives: ["R U R' F' R U2 R' U2 R' F R U R U2 R'"],
    recognition:
      'Koplampen aan de linkerkant met een middenrand van een aangrenzende kleur. Voor zie je links een blokje van 2. De rechter- en achterkant hebben geen blok.',
  },
  {
    id: 'pll-rb', name: 'Rb-perm', short: 'Rb', group: 'Aangrenzende hoekwissel',
    steps: [
      ['R2 F', 'Rechts halve slag, voorkant met de klok mee: setup.'],
      ["R U R U' R'", 'Verplaatst de bovenlaagstukken.'],
      ["F'", 'Voorkant terug.'],
      ["R U2 R' U2 R", 'Afronden: herstelt de F2L.'],
    ],
    alternatives: ["R' U2 R U2 R' F R U R' U' R' F' R2"],
    recognition:
      'Koplampen aan de linkerkant met een middenrand van een aangrenzende kleur. Achter zie je een blokje van 2 aan de kant van de koplampen (links). Voor en rechts geen blok.',
  },
  {
    id: 'pll-ga', name: 'Ga-perm', short: 'Ga', group: 'Aangrenzende hoekwissel',
    steps: [
      ["R2 U R' U R' U' R U' R2", 'Kern: laat drie randen en drie hoeken rondgaan.'],
      ["U' D", 'Boven en onder tegelijk draaien: het blok verschuift.'],
      ["R' U R D'", 'Insert van het paar en onderlaag terug.'],
    ],
    alternatives: ["R2 u R' U R' U' R u' R2 F' U F"],
    recognition:
      'Koplampen aan de linkerkant met een middenrand van een aangrenzende kleur. Voor zie je rechts een blokje van 2 (rand + hoek). G-perms herken je aan de combinatie koplampen + één los blokje elders.',
  },
  {
    id: 'pll-gb', name: 'Gb-perm', short: 'Gb', group: 'Aangrenzende hoekwissel',
    steps: [
      ["R' U' R", 'Haalt het paar uit de bovenlaag.'],
      ["U D'", 'Boven en onder tegelijk.'],
      ["R2 U R' U R U' R U' R2", 'Kern: cyclus van drie randen en drie hoeken.'],
      ['D', 'Onderlaag terug.'],
    ],
    alternatives: [],
    recognition:
      'Koplampen aan de linkerkant met een middenrand van de tegenovergestelde kleur. Rechts zie je achteraan een blokje van 2.',
  },
  {
    id: 'pll-gc', name: 'Gc-perm', short: 'Gc', group: 'Aangrenzende hoekwissel',
    steps: [
      ["R2 U' R U' R U R' U R2", 'Kern: cyclus van drie randen en drie hoeken (spiegel van Ga).'],
      ["U D'", 'Boven en onder tegelijk.'],
      ["R U' R' D", 'Insert van het paar en onderlaag terug.'],
    ],
    alternatives: [],
    recognition:
      'Koplampen aan de linkerkant met een middenrand van een aangrenzende kleur. Achter zie je rechts (gezien vanaf de achterkant: links) een blokje van 2.',
  },
  {
    id: 'pll-gd', name: 'Gd-perm', short: 'Gd', group: 'Aangrenzende hoekwissel',
    steps: [
      "R U R' U'",
      ['D', 'Onderlaag draaien.'],
      ["R2 U' R U' R' U R' U R2", 'Kern: cyclus van drie randen en drie hoeken.'],
      ["D'", 'Onderlaag terug.'],
    ],
    alternatives: [],
    recognition:
      'Koplampen aan de linkerkant met een middenrand van de tegenovergestelde kleur. Rechts zie je vooraan een blokje van 2.',
  },
  // ---------------- Diagonale hoekwissel ----------------
  {
    id: 'pll-y', name: 'Y-perm', short: 'Y', group: 'Diagonale hoekwissel', isTwoLook: true,
    steps: [
      ["F R U' R' U' R U R' F'", 'Eerste helft: wisselt hoeken diagonaal en verplaatst twee randen.'],
      "R U R' U'",
      "R' F R F'",
    ],
    alternatives: [],
    recognition:
      'Nergens koplampen. Voor zie je links een blokje van 2 en rechts zie je achteraan een blokje van 2; de linker- en achterrand wisselen. In 2-look PLL gebruik je deze voor "geen koplampen" (diagonale hoekwissel).',
  },
  {
    id: 'pll-v', name: 'V-perm', short: 'V', group: 'Diagonale hoekwissel',
    steps: [
      ["R' U R' U'", 'Setup: rechts omlaag met boven ertussen.'],
      ['y', 'Draai de hele kubus zoals U.'],
      ["R' F' R2 U' R'", 'Kern: diagonale hoekwissel.'],
      ["U R' F R F", 'Afronden met een sledgehammer-achtige beweging.'],
    ],
    alternatives: ["R' U R' d' R' F' R2 U' R' U R' F R F"],
    recognition:
      'Een opgelost 2x2-blokje (hoek + twee randen) linksachter, verder nergens koplampen of blokjes. Twee hoeken wisselen diagonaal en twee randen wisselen.',
  },
  {
    id: 'pll-na', name: 'Na-perm', short: 'Na', group: 'Diagonale hoekwissel',
    steps: [
      ["R U R' U", 'Setup.'],
      ["R U R' F'", 'Paar inzetten en voorkant tegen de klok in.'],
      "R U R' U'",
      ["R' F R2 U' R'", 'T-perm-kern.'],
      ["U2 R U' R'", 'Afronden.'],
    ],
    alternatives: [],
    recognition:
      'Op alle vier de zijden zie je rechts een blokje van 2 en links een losse hoek. Voor en achter zijn spiegelbeeldig. Twee hoeken en twee randen wisselen diagonaal.',
  },
  {
    id: 'pll-nb', name: 'Nb-perm', short: 'Nb', group: 'Diagonale hoekwissel',
    steps: [
      ["R' U R U'", 'Setup.'],
      ["R' F' U' F", 'Voorkant-trigger.'],
      "R U R'",
      "F R' F' R",
      ["U' R", 'Afronden.'],
    ],
    alternatives: [],
    recognition:
      'Op alle vier de zijden zie je links een blokje van 2 en rechts een losse hoek (spiegelbeeld van de Na-perm). Twee hoeken en twee randen wisselen diagonaal.',
  },
])
