/**
 * Interfaceteksten in het Nederlands en Engels. `nl` is de bron; `en` moet
 * dezelfde sleutels hebben (afgedwongen door het type). `{naam}` in een tekst
 * wordt vervangen door de bijbehorende parameter.
 * Casedata (herkenning, stappen, groepen) wordt vertaald via data/en.ts.
 */
import { computed } from 'vue'
import { useSettings } from '../stores/settings'
import { groupLabel, localizeCase, setDescription } from '../data'
import type { AlgCase, CubeSet } from '../data/types'
import { describeMove } from './notation'
import type { Locale } from './locale'

const nl = {
  // navigatie / instellingen
  navOverview: 'Overzicht',
  navQuiz: 'Quiz',
  navTimer: 'Timer',
  navNotation: 'Notatie',
  mainMenu: 'Hoofdmenu',
  settings: 'Instellingen',
  theme: 'Thema',
  themeLight: 'Licht',
  themeDark: 'Donker',
  themeSystem: 'Systeem',
  language: 'Taal',

  // algemeen
  cases: 'cases',
  bestTime: 'Beste tijd',
  twoLookOnly: 'Alleen 2-look',
  all: 'Alles',
  filterTwoLook: 'Filter op 2-look',
  partOfTwoLook: 'Hoort bij 2-look',
  quizScoreTitle: 'Quiz: {correct} goed, {wrong} fout',
  whichCase: 'Welke case is dit?',
  f2lDiagramLabel: '3D-aanzicht van de F2L-case',
  llDiagramLabel: 'Bovenaanzicht van de case',
  cube3d: '3D-kubus',
  cubeLoadFailed: 'De 3D-kubus kon niet geladen worden.',

  // speler
  playMove: 'Speel {move} af',
  stepsDone: 'Klaar: de case is opgelost.',
  stepOf: 'Zet {n} van {total}',
  demoOf: 'Demo van {alg}',
  play: '▶ Speel af',
  toStart: 'Naar begin',
  stepBack: 'Zet terug',
  stepForward: 'Zet vooruit',
  toEnd: 'Naar eind',
  pause: '⏸ Pauze',
  playAll: '▶ Afspelen',
  speed: 'Snelheid',

  // case-selectie
  casesSelected: 'cases geselecteerd',
  selectAll: 'Alle {set}',
  selectTwoLook: 'Alleen 2-look {set}',
  selectNone: 'Geen {set}',
  clearAll: 'Alles wissen',
  groups: 'Groepen',
  pickManually: 'Handmatig aanvinken',

  // overzicht
  homeTitle: 'Van 2-look naar full CFOP',
  homeIntro:
    'Leer alle F2L-, OLL- en PLL-cases: bekijk hoe je ze herkent, speel het algoritme stap voor stap af, oefen de herkenning in de quiz en train je tijden per case.',
  total: '{n} totaal',
  inTwoLook: '{n} in 2-look',
  practiced: '{n} geoefend',
  homeQuizTitle: 'Herkenningsquiz →',
  homeQuizText: 'Zie een case vanuit een willekeurige hoek en kies de juiste naam uit vier opties.',
  homeTimerTitle: 'Timer per case →',
  homeTimerText: 'Krijg een scramble die precies jouw gekozen cases opzet en meet je tijd.',
  homeNotationTitle: 'Notatie-uitleg →',
  homeNotationText: "R, U', r, M, x … met een 3D-demo per zet. Handig voor full OLL.",
  chooseSet: 'Kies set',
  noCasesInSelection: 'Geen cases in deze selectie.',

  // case-detail
  caseNotFound: 'Deze case bestaat niet.',
  backToOverview: 'Terug naar overzicht',
  setOverview: '{set}-overzicht',
  whenToUse: 'Wanneer gebruik je dit?',
  pllArrowsHint: 'Pijlen: waar de stukken naartoe gaan.',
  f2lColorsHint: 'Gekleurd: het paar voor het slot rechtsvoor. Grijs: stukken die er nu niet toe doen.',
  demo3d: '3D-demo',
  demoHint: 'Sleep om de kubus te draaien. Pijltjestoetsen: zet vooruit/terug.',
  demo3dOf: '3D-demo van {name}',
  algorithms: 'Algoritmes',
  chooseAlgorithm: 'Kies algoritme',
  mainAlgorithm: 'Hoofdalgoritme',
  alternativeN: 'Alternatief {n}',
  alternative: 'Alternatief',
  alternativeDesc: 'Alternatief algoritme voor dezelfde case (zonder opsplitsing in triggers).',
  stepByStep: 'Stappenplan',
  yourProgress: 'Jouw voortgang',
  quizCorrect: 'Quiz goed',
  quizWrong: 'Quiz fout',
  timerWithCase: 'Timer met deze case',

  // quiz
  quizTitle: 'Herkenningsquiz',
  quizIntro:
    'Je ziet een case vanuit een willekeurige hoek (willekeurige AUF). Kies de juiste naam. Cases die je vaak fout hebt, komen vaker terug.',
  startQuiz: 'Start quiz',
  pickAtLeastOne: 'Kies minstens één case.',
  changeSelection: '← Selectie aanpassen ({n})',
  score: 'Score',
  whichSetCase: 'Welke {set}-case is dit?',
  correct: 'Goed!',
  wrong: 'Helaas, fout.',
  thisIs: 'Dit is',
  nextEnter: 'Volgende (Enter)',
  viewCase: 'Bekijk {name} →',
  quizKeyTip: 'Tip: toets 1–4 om te antwoorden.',

  // timer
  timerTitle: 'Timer per case',
  hideSelection: 'Selectie verbergen',
  selectionN: 'Selectie ({n})',
  scrambleHeading: 'Scramble (geel boven, groen voor)',
  scrambleHint: 'Begin met een opgeloste kubus. De scramble zet precies één van je gekozen cases op.',
  preview3d: '3D-preview',
  previewLabel: 'Preview van de gescramblede kubus',
  timerAria: 'Timer: houd spatie of het vlak ingedrukt tot het groen wordt, laat los om te starten',
  timerRunning: 'Druk op een toets of tik om te stoppen',
  timerReady: 'Loslaten om te starten',
  timerHolding: 'Blijf vasthouden…',
  timerNoCases: 'Kies eerst cases om te oefenen.',
  timerIdleBefore: 'Houd',
  spaceKey: 'spatie',
  timerIdleAfter: 'ingedrukt (of tik en houd vast) tot de tijd groen wordt',
  thatWas: 'Dat was',
  delete: 'Verwijderen',
  deleteConfirm: 'Tijd {time} verwijderen?',
  deleteTime: 'Verwijder {time}',
  slowestCases: 'Traagste cases',
  practiceThese: '(oefen deze!)',
  noTimesYet: 'Nog geen tijden.',
  meanN: 'gem. ({n})',
  recentTimes: 'Laatste tijden',
  statsPerCase: 'Statistiek per case',
  colCase: 'Case',
  colBest: 'Beste',
  colMean: 'Gem.',

  // notatie
  notationTitle: 'Notatie-uitleg',
}

export type MessageKey = keyof typeof nl

const en: Record<MessageKey, string> = {
  navOverview: 'Overview',
  navQuiz: 'Quiz',
  navTimer: 'Timer',
  navNotation: 'Notation',
  mainMenu: 'Main menu',
  settings: 'Settings',
  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  language: 'Language',

  cases: 'cases',
  bestTime: 'Best time',
  twoLookOnly: '2-look only',
  all: 'All',
  filterTwoLook: 'Filter by 2-look',
  partOfTwoLook: 'Part of 2-look',
  quizScoreTitle: 'Quiz: {correct} right, {wrong} wrong',
  whichCase: 'Which case is this?',
  f2lDiagramLabel: '3D view of the F2L case',
  llDiagramLabel: 'Top view of the case',
  cube3d: '3D cube',
  cubeLoadFailed: 'The 3D cube could not be loaded.',

  playMove: 'Play {move}',
  stepsDone: 'Done: the case is solved.',
  stepOf: 'Move {n} of {total}',
  demoOf: 'Demo of {alg}',
  play: '▶ Play',
  toStart: 'To start',
  stepBack: 'Step back',
  stepForward: 'Step forward',
  toEnd: 'To end',
  pause: '⏸ Pause',
  playAll: '▶ Play',
  speed: 'Speed',

  casesSelected: 'cases selected',
  selectAll: 'All {set}',
  selectTwoLook: '2-look {set} only',
  selectNone: 'No {set}',
  clearAll: 'Clear all',
  groups: 'Groups',
  pickManually: 'Pick manually',

  homeTitle: 'From 2-look to full CFOP',
  homeIntro:
    'Learn every F2L, OLL and PLL case: see how to recognize them, play the algorithm step by step, practice recognition in the quiz and train your times per case.',
  total: '{n} total',
  inTwoLook: '{n} in 2-look',
  practiced: '{n} practiced',
  homeQuizTitle: 'Recognition quiz →',
  homeQuizText: 'See a case from a random angle and pick the right name out of four options.',
  homeTimerTitle: 'Timer per case →',
  homeTimerText: 'Get a scramble that sets up exactly the cases you picked, and time your solve.',
  homeNotationTitle: 'Notation guide →',
  homeNotationText: "R, U', r, M, x … with a 3D demo for each move. Handy for full OLL.",
  chooseSet: 'Choose set',
  noCasesInSelection: 'No cases in this selection.',

  caseNotFound: 'This case does not exist.',
  backToOverview: 'Back to overview',
  setOverview: '{set} overview',
  whenToUse: 'When do you use this?',
  pllArrowsHint: 'Arrows: where the pieces go.',
  f2lColorsHint: "Colored: the pair for the front-right slot. Grey: pieces that don't matter right now.",
  demo3d: '3D demo',
  demoHint: 'Drag to rotate the cube. Arrow keys: step forward/back.',
  demo3dOf: '3D demo of {name}',
  algorithms: 'Algorithms',
  chooseAlgorithm: 'Choose algorithm',
  mainAlgorithm: 'Main algorithm',
  alternativeN: 'Alternative {n}',
  alternative: 'Alternative',
  alternativeDesc: 'Alternative algorithm for the same case (not split into triggers).',
  stepByStep: 'Step by step',
  yourProgress: 'Your progress',
  quizCorrect: 'Quiz right',
  quizWrong: 'Quiz wrong',
  timerWithCase: 'Timer with this case',

  quizTitle: 'Recognition quiz',
  quizIntro:
    "You see a case from a random angle (random AUF). Pick the right name. Cases you often get wrong come back more often.",
  startQuiz: 'Start quiz',
  pickAtLeastOne: 'Pick at least one case.',
  changeSelection: '← Change selection ({n})',
  score: 'Score',
  whichSetCase: 'Which {set} case is this?',
  correct: 'Correct!',
  wrong: 'Sorry, wrong.',
  thisIs: 'This is',
  nextEnter: 'Next (Enter)',
  viewCase: 'View {name} →',
  quizKeyTip: 'Tip: press 1–4 to answer.',

  timerTitle: 'Timer per case',
  hideSelection: 'Hide selection',
  selectionN: 'Selection ({n})',
  scrambleHeading: 'Scramble (yellow on top, green in front)',
  scrambleHint: 'Start from a solved cube. The scramble sets up exactly one of the cases you picked.',
  preview3d: '3D preview',
  previewLabel: 'Preview of the scrambled cube',
  timerAria: 'Timer: hold space or the timer area until it turns green, release to start',
  timerRunning: 'Press any key or tap to stop',
  timerReady: 'Release to start',
  timerHolding: 'Keep holding…',
  timerNoCases: 'Pick some cases to practice first.',
  timerIdleBefore: 'Hold',
  spaceKey: 'space',
  timerIdleAfter: '(or tap and hold) until the time turns green',
  thatWas: 'That was',
  delete: 'Delete',
  deleteConfirm: 'Delete time {time}?',
  deleteTime: 'Delete {time}',
  slowestCases: 'Slowest cases',
  practiceThese: '(practice these!)',
  noTimesYet: 'No times yet.',
  meanN: 'mean ({n})',
  recentTimes: 'Recent times',
  statsPerCase: 'Stats per case',
  colCase: 'Case',
  colBest: 'Best',
  colMean: 'Mean',

  notationTitle: 'Notation guide',
}

const MESSAGES: Record<Locale, Record<MessageKey, string>> = { nl, en }

export function translate(locale: Locale, key: MessageKey, params?: Record<string, string | number>): string {
  const text = MESSAGES[locale][key] ?? MESSAGES.nl[key]
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (m, name: string) => (name in params ? String(params[name]) : m))
}

/** Vertaalhulpjes voor componenten; reageren op een wijziging van de taalinstelling. */
export function useI18n() {
  const settings = useSettings()
  const locale = computed(() => settings.locale)
  return {
    locale,
    t: (key: MessageKey, params?: Record<string, string | number>) => translate(settings.locale, key, params),
    /** Case met teksten in de gekozen taal. */
    lc: (c: AlgCase) => localizeCase(c, settings.locale),
    /** Weergavenaam van een groep. */
    tg: (group: string) => groupLabel(group, settings.locale),
    setDesc: (set: CubeSet) => setDescription(set, settings.locale),
    move: (m: string) => describeMove(m, settings.locale),
  }
}
