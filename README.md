# CFOP-trainer

Webapp om de CFOP-algoritmes voor de 3x3 te leren en te trainen: **41 F2L**, **57 OLL** en **21 PLL**-cases,
met 2-look-markering, 3D-demo's, een herkenningsquiz en een timer per case. Volledig statisch (geen backend);
voortgang staat in `localStorage`.

## Starten

```bash
npm install
npm run dev      # ontwikkelserver
npm test         # verificatie van alle algoritmes (Vitest + cubing.js KPuzzle)
npm run build    # statische site in dist/
```

## Deployen

`dist/` is een statische site met relatieve paden en hash-routing (`#/case/pll-t`), dus hij werkt zonder
rewrites op Netlify (publish directory `dist`, build command `npm run build`) en op GitHub Pages, ook in een
submap (`https://gebruiker.github.io/repo/`).

## Structuur

```
src/
  data/        types.ts, pll.ts, oll.ts, f2l.ts, triggers.ts (trigger-woordenboek + defineCases)
  lib/         cube.ts (KPuzzle-model, stickers, AUF), caseState.ts (analyse/vingerafdruk per case),
               scramble.ts (scrambles zonder rotaties), notation.ts (NL-uitleg per zet), stats.ts, storage.ts
  components/  CubeCase (case-afbeelding, overal hergebruikt), LLDiagram, F2LDiagram, TwistyCube
               (wrapper rond <twisty-player>), AlgSteps, PlayerControls, CaseSelector, CaseCard, MoveDemo
  views/       Home, Set (overzicht), CaseDetail, Quiz, Timer, Notation
  stores/      settings, quizStats, times (Pinia, opgeslagen in localStorage)
tests/         algorithms.test.ts, cube.test.ts, scramble.test.ts
```

## Wat de tests controleren

- OLL en PLL laten de eerste twee lagen intact; PLL laat ook de oriëntatie van de laatste laag intact.
- F2L laat het kruis en de andere drie slots intact en lost het slot rechtsvoor op.
- Elk algoritme lost zijn eigen case op; elk alternatief lost precies dezelfde case op.
- Binnen een set zijn alle startposities verschillend (modulo AUF) en het aantal klopt (41/57/21), dus
  de sets zijn compleet.
- Groepen kloppen met de kubustoestand (bijv. OLL "Lijn" = twee tegenoverliggende randen geel, geen hoeken;
  PLL "Alleen randen" verplaatst geen hoeken; F2L-groep = positie van hoek en rand).
- Scrambles zetten precies de gekozen case op en bevatten geen rotaties.

## Keuzes

- Kleuren: geel boven, groen voor, oranje rechts (wit kruis onder). In de 3D-speler gebeurt dat met een
  `z2`-setup en eigen stickering-maskers, omdat de maskers van cubing.js per stuk werken.
- Case-afbeeldingen in overzicht, quiz en timer zijn eigen SVG's, berekend uit dezelfde KPuzzle-toestand
  als de 3D-speler. Dat is veel lichter dan 57 `<twisty-player>`-elementen op één pagina en maakt
  PLL-pijlen en een grijze bovenlaag bij F2L mogelijk.
