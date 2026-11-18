/**
 * Engelse vertalingen van de casedata. De Nederlandse teksten in pll.ts, oll.ts,
 * f2l.ts en triggers.ts blijven de bron; dit bestand legt er een Engelse laag over.
 *
 * - Groepsnamen blijven intern Nederlands (ze zijn sleutels); hier staat alleen de weergavenaam.
 * - `steps` loopt gelijk met de stappen van de case. `null` = de stap is een bekende
 *   trigger zonder eigen uitleg; de Engelse uitleg komt dan uit EN_TRIGGERS.
 * - `name` alleen als de naam iets Nederlands bevat.
 * De test in tests/i18n.test.ts controleert dat alles compleet is en gelijk loopt.
 */

export interface CaseTranslation {
  name?: string
  recognition: string
  note?: string
  steps: (string | null)[]
}

export const EN_GROUPS: Record<string, string> = {
  // F2L
  Basis: 'Basic',
  'Hoek boven, wit opzij': 'Corner on top, white on the side',
  'Hoek boven, wit boven': 'Corner on top, white on top',
  'Hoek in slot, rand boven': 'Corner in slot, edge on top',
  'Rand in slot, hoek boven': 'Edge in slot, corner on top',
  'Beide in slot': 'Both in slot',
  // OLL
  'Kruis (OCLL)': 'Cross (OCLL)',
  Punt: 'Dot',
  Lijn: 'Line',
  'T-vorm': 'T shape',
  Vierkant: 'Square',
  'C-vorm': 'C shape',
  'W-vorm': 'W shape',
  'Hoeken goed': 'Corners oriented',
  'P-vorm': 'P shape',
  'Kleine bliksem': 'Small lightning bolt',
  Vis: 'Fish',
  Paard: 'Knight move',
  Lastig: 'Awkward',
  'Grote L': 'L shape',
  'Grote bliksem': 'Big lightning bolt',
  // PLL
  'Alleen randen': 'Edges only',
  'Alleen hoeken': 'Corners only',
  'Aangrenzende hoekwissel': 'Adjacent corner swap',
  'Diagonale hoekwissel': 'Diagonal corner swap',
}

export const EN_TRIGGERS: Record<string, { name: string; desc: string }> = {
  "R U R' U'": { name: 'Sexy move', desc: 'The best-known trigger: right up, top to the left, right back, top back.' },
  "U R U' R'": { name: 'Reverse sexy move', desc: 'The sexy move the other way round: top first, then right up and back again.' },
  "R' U' R U": { name: 'Left-hand sexy (right hand)', desc: 'Mirror form of the sexy move with the right hand: right down, top to the right, back.' },
  "L' U' L U": { name: 'Left sexy move', desc: 'The sexy move mirrored for the left hand.' },
  "R' F R F'": { name: 'Sledgehammer', desc: 'Right down, front clockwise, right up, front back.' },
  "F R' F' R": { name: 'Hedgeslammer', desc: 'Reverse sledgehammer: front first, then right.' },
  "R U R' U R U2 R'": { name: 'Sune', desc: 'Classic trigger that twists three corners (OLL 27).' },
  "R U2 R' U' R U' R'": { name: 'Anti-Sune', desc: 'Mirror/inverse of the Sune (OLL 26).' },
  "R U R'": { name: 'Insert', desc: 'Basic insert: right up, top to the left, right back.' },
  "R U' R'": { name: 'Insert', desc: 'Right up, top to the right, right back.' },
  "R U2 R'": { name: 'Insert (U2)', desc: 'Right up, half turn on top, right back.' },
  "R' U' R": { name: 'Insert', desc: 'Right down, top to the right, right back up.' },
  "R' U R": { name: 'Insert', desc: 'Right down, top to the left, right back up.' },
  "F' U' F": { name: 'Insert (front)', desc: 'Front counterclockwise, top to the right, front back: insert via the front.' },
  "F' U F": { name: 'Insert (front)', desc: 'Front counterclockwise, top to the left, front back.' },
  "F' U2 F": { name: 'Insert (front, U2)', desc: 'Front counterclockwise, half turn on top, front back.' },
  "F R U R' U' F'": { name: "F-sexy-F'", desc: "Sexy move sandwiched between F and F': orients two edges (line → cross)." },
  "f R U R' U' f'": { name: "f-sexy-f'", desc: 'Sexy move between wide f moves: orients edges (L shape → cross).' },
  'M2 U M2': { name: 'M2-U-M2', desc: 'Middle slice half turn, top, middle slice half turn: swaps two opposite edges.' },
  "M2 U' M2": { name: "M2-U'-M2", desc: 'Like M2 U M2, but with the top turning the other way.' },
}

export const EN_SET_DESCRIPTIONS = {
  F2L: 'First Two Layers: insert a corner and edge as a pair into a slot.',
  OLL: 'Orientation of the Last Layer: make the top face completely yellow.',
  PLL: 'Permutation of the Last Layer: move the top layer pieces to their correct spots.',
}

// Veelgebruikte F2L-zinsdelen.
const CT = 'Corner on top at front-right'
const CS = 'Corner in the slot'
const ES_OK = 'Edge in the slot, correctly oriented (green in front).'
const ES_FLIP = 'Edge in the slot, flipped (green on the right).'
const SIDE = 'green on the side (orange on top)'

export const EN_CASES: Record<string, CaseTranslation> = {
  // ---------------- F2L ----------------
  'f2l-1': { steps: ['Setup: place the pair above the slot.', 'The pair is formed and goes into the slot in one go.'], recognition: `${CT}, white facing front. Edge on top at the right, green on top. Basic case: one setup move and one insert put the pair in the slot.` },
  'f2l-2': { steps: ['Setup: corner to back-right.', 'Insert via the front.'], recognition: `${CT}, white facing right. Edge on top at the front, ${SIDE}. Basic case, mirror of F2L 1 via the front.` },
  'f2l-3': { steps: [null], recognition: `${CT}, white facing front. Edge on top at the left, ${SIDE}. Basic case: corner and edge already form a pair that can go straight into the slot via the front.` },
  'f2l-4': { steps: [null], recognition: `${CT}, white facing right. Edge on top at the back, green on top. Basic case: corner and edge already form a pair that can go straight into the slot.` },
  'f2l-5': { steps: ['Setup.', 'Move the edge away so the corner can join it.', 'Bring the corner above the edge.', 'Insert the pair.'], recognition: `${CT}, white facing front. Edge on top at the back, green on top.` },
  'f2l-6': { steps: ['Setup.', 'Move the edge away via the front.', 'Bring corner and edge together.', 'Insert the pair via the front.'], recognition: `${CT}, white facing right. Edge on top at the left, ${SIDE}.` },
  'f2l-7': { steps: ['Setup.', 'Temporarily separate corner and edge.', 'Turn so the pair forms.', 'Insert the pair.'], recognition: `${CT}, white facing front. Edge on top at the left, green on top.` },
  'f2l-8': { steps: ['Setup.', 'Temporarily separate corner and edge (via the front).', 'Turn so the pair forms.', 'Insert the pair.'], recognition: `${CT}, white facing right. Edge on top at the back, ${SIDE}.` },
  'f2l-9': { steps: ['Setup.', 'Move the edge and twist the corner.', 'Set up the pair.', 'Insert via the front.'], recognition: `${CT}, white facing front. Edge on top at the back, ${SIDE}.` },
  'f2l-10': { steps: ['Setup.', 'Bring corner and edge together.', 'Set up the pair.', 'Insert the pair.'], recognition: `${CT}, white facing right. Edge on top at the left, green on top.` },
  'f2l-11': { steps: ['Setup.', 'Separate corner and edge.', 'Set up the pair.', 'Insert via the front.'], recognition: `${CT}, white facing front. Edge on top at the right, ${SIDE}.` },
  'f2l-12': { steps: ['Edge out of the way.', 'Setup.', 'Corner and edge side by side.', 'Set up the pair.', 'Insert the pair.'], recognition: `${CT}, white facing right. Edge on top at the front, green on top.` },
  'f2l-13': { steps: ['Setup.', 'Edge out of the way (via the front).', 'Set up the pair.', 'Insert the pair via the front.'], recognition: `${CT}, white facing front. Edge on top at the front, ${SIDE}.` },
  'f2l-14': { steps: ['Setup.', 'Bring corner and edge together.', 'Set up the pair.', 'Insert the pair.'], recognition: `${CT}, white facing right. Edge on top at the right, green on top.` },
  'f2l-15': { steps: ['Bring corner and edge together via the front.', 'Set up the pair.', 'Insert the pair.'], recognition: `${CT}, white facing front. Edge on top at the front, green on top.` },
  'f2l-16': { steps: ['Bring corner and edge together.', 'Set up the pair.', 'Insert the pair via the front.'], recognition: `${CT}, white facing right. Edge on top at the right, ${SIDE}.` },
  'f2l-17': { steps: ['‘Flip’ the corner with white on top: white moves to the side.', 'Set up the pair.', 'Insert the pair.'], recognition: `${CT}, white on top. Edge on top at the right, green on top. White on top is tricky: first ‘flip’ the corner with a U2 insert.` },
  'f2l-18': { steps: ['Flip the corner with white on top (via the front).', 'Set up the pair.', 'Insert the pair via the front.'], recognition: `${CT}, white on top. Edge on top at the front, ${SIDE}. White on top, mirrored via the front.` },
  'f2l-19': { steps: ['Setup.', 'Flip the corner, edge next to it.', 'Set up the pair.', 'Insert the pair.'], recognition: `${CT}, white on top. Edge on top at the back, green on top.` },
  'f2l-20': { steps: ['Setup.', 'Flip the corner via the front.', 'Set up the pair.', 'Insert the pair via the front.'], recognition: `${CT}, white on top. Edge on top at the left, ${SIDE}.` },
  'f2l-21': { steps: ['Setup: corner to back-left.', 'Bring edge and corner together.', 'Set up the pair.', 'Insert the pair.'], recognition: `${CT}, white on top. Edge on top at the left, green on top.` },
  'f2l-22': { steps: ['Setup.', 'Bring edge and corner together via the front.', 'Set up the pair.', 'Insert the pair via the front.'], recognition: `${CT}, white on top. Edge on top at the back, ${SIDE}.` },
  'f2l-23': { steps: ['Setup.', 'First insert: break up the pair.', 'Turn the top layer.', 'Form the pair.', 'Set up the pair.', 'Insert the pair.'], recognition: `${CT}, white on top. Edge on top at the front, green on top.` },
  'f2l-24': { steps: ['Setup with the front face.', null, 'Front face back: the pair is formed.', 'Insert the pair.'], recognition: `${CT}, white on top. Edge on top at the right, ${SIDE}.` },
  'f2l-25': { steps: ['Setup: edge to the back.', 'Sledgehammer: takes the corner out and forms the pair.', 'Insert the pair.'], recognition: `${CS}, white facing down (correctly oriented). Edge on top at the right, green on top. The corner is correct in the slot; only the edge needs to join it.` },
  'f2l-26': { steps: [null, 'Hedgeslammer: inserts the pair.'], recognition: `${CS}, white facing down (correctly oriented). Edge on top at the front, ${SIDE}. The corner is correct in the slot; only the edge needs to join it.` },
  'f2l-27': { steps: ['Take the pair out of the slot.', 'Form the pair.', 'Insert the pair.'], recognition: `${CS}, white facing front. Edge on top at the right, green on top.` },
  'f2l-28': { steps: [null, 'Hedgeslammer: inserts the pair.'], recognition: `${CS}, white facing right. Edge on top at the front, ${SIDE}.` },
  'f2l-29': { steps: ['Take the pair out of the slot (via the front).', 'Form the pair.', 'Insert the pair via the front.'], recognition: `${CS}, white facing front. Edge on top at the front, ${SIDE}.` },
  'f2l-30': { steps: ['Take the pair out of the slot.', 'Insert the pair.'], recognition: `${CS}, white facing right. Edge on top at the right, green on top.` },
  'f2l-31': { steps: ['Corner out, white rotates.', 'Again: corner and edge come together.', 'Insert the pair.'], recognition: `${CT}, white on top. ${ES_OK} The edge is correct; the corner with white on top needs to join it.` },
  'f2l-32': { steps: ['Setup.', 'Sledgehammer: edge out, form the pair.', 'Insert the pair.'], recognition: `${CT}, white on top. ${ES_FLIP}` },
  'f2l-33': { steps: ['Setup.', 'Take the edge out of the slot.', 'Form the pair.', 'Insert the pair.'], recognition: `${CT}, white facing front. ${ES_OK}` },
  'f2l-34': { steps: ['Setup.', 'Take the edge out of the slot.', 'Form the pair.', 'Insert the pair.'], recognition: `${CT}, white facing right. ${ES_OK}` },
  'f2l-35': { steps: ['Setup.', 'Edge out of the slot.', 'Set up the pair.', 'Insert via the front.'], recognition: `${CT}, white facing front. ${ES_FLIP}` },
  'f2l-36': { steps: ['Setup.', 'Edge out of the slot (via the front).', 'Set up the pair.', 'Insert the pair.'], recognition: `${CT}, white facing right. ${ES_FLIP}` },
  'f2l-37': { steps: ['Pair out of the slot and to the side.', 'Flip the edge.', 'Set up the pair.', 'Put the pair back.'], recognition: `${CS}, white facing down (correctly oriented). ${ES_FLIP} Everything is in the slot, but the edge is flipped.` },
  'f2l-38': { steps: ['Pair out of the slot.', 'Turn the top layer.', 'Form the pair.', 'Set up the pair.', 'Insert the pair.'], recognition: `${CS}, white facing front. ${ES_OK}` },
  'f2l-39': { steps: ['Pair out of the slot.', 'Turn the top layer.', 'Form the pair.', 'Set up the pair.', 'Insert the pair.'], recognition: `${CS}, white facing right. ${ES_OK}` },
  'f2l-40': { steps: ['Pair out of the slot.', 'Setup.', 'Form the pair again via the front.', 'Set up the pair.', 'Insert the pair via the front.'], recognition: `${CS}, white facing front. ${ES_FLIP}` },
  'f2l-41': { steps: ['Pair out of the slot.', 'Wide r: flips the edge.', 'Set up the pair.', 'Put the pair back with wide r.'], recognition: `${CS}, white facing right. ${ES_FLIP}` },

  // ---------------- OLL ----------------
  'oll-1': { steps: ['Setup: right up and a half turn on top.', 'Sledgehammer-like move with R2.', 'Top half turn.', null], recognition: 'Dot: on top only the center is yellow. On the left and right you see a full yellow bar of 3; front and back only the middle sticker.' },
  'oll-2': { steps: [null, null], recognition: 'Dot. On the left a full yellow bar of 3; front and back have their two right stickers yellow, the right side only the middle one.', note: "In 2-look OLL this is exactly the combination for the edge ‘dot’: first F (R U R' U') F', then f (R U R' U') f'." },
  'oll-3': { steps: ['Wide r variant of a Sune-like trigger.', 'Finish with wide r and the middle slice.'], recognition: 'Dot with one yellow corner at front-left (no yellow edges on top). Back, right and front each show two yellow stickers side by side; the left only the middle.' },
  'oll-4': { steps: ['Middle slice down, then a wide r trigger.', "Finish; M' puts the middle slice back."], recognition: 'Dot with one yellow corner at front-right (no yellow edges on top). Back, front and left show two yellow stickers side by side; the right only the middle.' },
  'oll-5': { steps: ['Wide r down, half turn on top.', 'Trigger in the top layer.', 'Wide r back: the square is yellow.'], recognition: 'Square: a yellow 2x2 block at front-right (center, right edge, front edge and the corner). Left and back show two yellow stickers.' },
  'oll-6': { steps: ['Wide r up, half turn on top.', 'Trigger in the top layer.', 'Wide r back.'], recognition: 'Square: a yellow 2x2 block at back-right. Front and left show two yellow stickers.' },
  'oll-7': { steps: ['‘Wide Sune’: a Sune with wide r at the start and end.'], recognition: 'Small lightning bolt: yellow at the back edge, left edge, center and the front-left corner. Front and right show two yellow stickers.' },
  'oll-8': { steps: ['‘Wide left anti-Sune’: mirrored wide Sune with the left hand.'], recognition: 'Small lightning bolt (mirror): yellow at the back edge, center, right edge and the front-right corner. Front and left show two yellow stickers.' },
  'oll-9': { steps: [null, "Sledgehammer start with R2, finished with F'."], recognition: 'Fish: yellow at the back edge, left edge, center and the front-right corner. At the front the two left stickers are yellow.' },
  'oll-10': { steps: ['Start of a Sune.', null, null], recognition: 'Fish: yellow at the left edge, center, front edge and the back-right corner. Two yellow stickers at the back.' },
  'oll-11': { steps: ['Start of a wide Sune.', null, 'Finish with wide r.'], recognition: 'Small lightning bolt: yellow at the back edge, left edge, center and the back-right corner. At the front the two right stickers are yellow.' },
  'oll-12': { steps: ['Middle slice up (like R).', 'Left-hand-style anti-Sune from the right.', 'Finish; M puts the middle slice back.'], recognition: 'Small lightning bolt: yellow at the back-left corner, back edge, center and right edge. At the front the two left stickers are yellow.' },
  'oll-13': { steps: ['Front clockwise, then a sexy-like trigger.', 'Front back and restore the pair.', null], recognition: 'Knight move: a yellow horizontal line (left–center–right) plus the front-left corner. No yellow stickers on the left.' },
  'oll-14': { steps: ['Sledgehammer variant that sandwiches the front.', 'Front trigger to finish.'], recognition: 'Knight move: a yellow horizontal line plus the front-right corner. At the front the two left stickers are yellow.' },
  'oll-15': { steps: ['Wide r down trigger.', null, 'Wide r trigger back.'], recognition: 'Knight move: a yellow horizontal line plus the front-right corner. At the front only the middle sticker is yellow.' },
  'oll-16': { steps: ['Wide r trigger.', null, 'Wide r trigger back.'], recognition: 'Knight move: a yellow horizontal line plus the back-right corner. At the front the two left stickers are yellow.' },
  'oll-17': { steps: ['Start of a Sune.', null, 'Top half turn.', null], recognition: 'Dot with two diagonal yellow corners (back-left and front-right), no yellow edges on top.' },
  'oll-18': { steps: ['Wide Sune that continues into r2.', 'Anti-Sune-like finish with wide r.'], recognition: 'Dot with two yellow corners at the back. At the front you see a full yellow bar of 3.' },
  'oll-19': { steps: ["r' R is an M move; then a trigger in the top layer.", 'Middle slice up.', null], recognition: 'Dot with two yellow corners at the back. Left and right have their two front stickers yellow; the front only the middle.' },
  'oll-20': { steps: ['Sexy move with wide r.', 'Middle slice half turn.', null, 'Finish with the middle slice.'], recognition: 'All four corners are yellow, but none of the edges: a yellow ‘X’. On every side only the middle sticker is yellow.' },
  'oll-21': { steps: ['Right up, half turn on top, right back.', 'Top back and insert.', 'Once more: the three R triggers twist all corners.'], recognition: 'Yellow cross, no yellow corners on top. Front and back show double headlights (two yellow stickers per side).' },
  'oll-22': { steps: ['Start with R2.', "Alternating U' and R2: twists four corners.", 'Finish.'], recognition: 'Yellow cross, no yellow corners on top. Headlights on the left; front and back have their yellow sticker on the right.' },
  'oll-23': { name: 'OLL 23 (Headlights)', steps: ['Right half turn, bottom layer to the left.', 'Twist the top corners via the bottom layer.', 'Bottom layer back.', 'Finish.'], recognition: 'Yellow cross with the two front corners yellow. Headlights at the back (two yellow stickers).' },
  'oll-24': { name: 'OLL 24 (T / Chameleon)', steps: ['Sexy move with wide r.', 'Front trigger.'], recognition: 'Yellow cross with the two right corners yellow. Front and back have their yellow sticker on the left.' },
  'oll-25': { name: 'OLL 25 (Bowtie)', steps: ['Front counterclockwise.', 'Sexy move with wide r.', 'Finish.'], recognition: 'Yellow cross with two diagonal yellow corners (back-right and front-left).' },
  'oll-26': { steps: [null], recognition: 'Yellow cross with one yellow corner, at back-right. At the front the yellow sticker is on the left. (Anti-Sune)' },
  'oll-27': { steps: [null], recognition: 'Yellow cross with one yellow corner, at front-left. At the front the yellow sticker is on the right. (Sune)' },
  'oll-28': { name: 'OLL 28 (Arrow)', steps: ['Sexy move with wide r (turns the middle slice too).', 'Finish: the two edges become yellow.'], recognition: 'All corners are yellow; only the front and right edges are not yellow (the top looks like an arrow).' },
  'oll-29': { steps: [null, 'Insert.', 'Front insert.', null], recognition: 'Awkward: yellow at the back edge, left edge, center and the back-right and front-right corners. At the front the two left stickers are yellow.' },
  'oll-30': { steps: ['Front and right alternating.', 'Core.', 'Finish with F2.'], recognition: 'Awkward: yellow at the back edge, left edge, center and both front corners. On the right the two back stickers are yellow.' },
  'oll-31': { steps: ['Setup with the front.', null, 'Finish.'], recognition: 'P shape right: yellow 2x2 block at back-right plus the front-right corner. At the front the two left stickers are yellow.' },
  'oll-32': { steps: ['Setup with left and front.', 'Left trigger.', 'Finish.'], recognition: 'P shape left: yellow 2x2 block at back-left plus the front-left corner. At the front the two right stickers are yellow.' },
  'oll-33': { steps: [null, null], recognition: 'T shape: a yellow horizontal line plus the two right corners. Front and back have a pair of yellow stickers on the left.' },
  'oll-34': { steps: ['Trigger that moves the corner away with R2.', 'Front trigger to finish.'], recognition: 'C shape: a yellow horizontal line plus the two front corners; no yellow bar on the side.' },
  'oll-35': { steps: ['Start with R2.', 'Front trigger.', null], recognition: 'Fish: yellow 2x2 block at front-right plus the diagonal back-left corner.' },
  'oll-36': { steps: ['Left trigger.', 'Left trigger back.', 'Left sledgehammer.'], recognition: 'W shape: yellow like a staircase — back-left corner, back edge, center, right edge and front-right corner. Two yellow stickers on the left (at the front).' },
  'oll-37': { steps: [null, null], recognition: 'Fish: yellow 2x2 block at back-left plus the front-right corner. On the right the two back stickers are yellow.' },
  'oll-38': { steps: ['Start of a Sune.', 'Insert and back.', null], recognition: 'W shape: yellow like a staircase — back-right corner, back edge, center, left edge and front-left corner. Two yellow stickers on the right (at the front).' },
  'oll-39': { steps: ['Left setup with the front.', 'Trigger in the top layer.', 'Finish.'], recognition: 'Big lightning bolt: a yellow horizontal line with the back-right and front-left corners.' },
  'oll-40': { steps: ['Setup with the front.', 'Trigger in the top layer.', 'Finish.'], recognition: 'Big lightning bolt: a yellow horizontal line with the back-left and front-right corners.' },
  'oll-41': { steps: [null, null], recognition: 'Awkward: yellow at the back edge, left edge, center and both front corners. Headlights at the back.' },
  'oll-42': { steps: ["Reverse Sune with R'.", null], recognition: 'Awkward: yellow at both back corners, left edge, center and front edge. Headlights at the front.' },
  'oll-43': { steps: ['Front counterclockwise.', 'Left sexy move (mirrored).', 'Front back.'], recognition: 'P shape right: yellow 2x2 block at back-right plus the front-right corner. On the left a full yellow bar of 3.' },
  'oll-44': { steps: [null], recognition: 'P shape right: yellow 2x2 block at front-right plus the back-right corner. On the left a full yellow bar of 3. In 2-look OLL this is the algorithm for the edge ‘L shape’.', note: "2-look: f (R U R' U') f' orients the edges from an L shape, regardless of the corners. Hold the yellow L at front-right (front and right edges yellow). With the alternative F (U R U' R') F' you hold the L at back-left." },
  'oll-45': { steps: [null], recognition: 'T shape: a yellow horizontal line plus the two right corners. Headlights on the left. In 2-look OLL this is the algorithm for the edge ‘line’ (hold the line horizontally).', note: '2-look: this algorithm orients the edges from a line (hold it horizontally), regardless of the corners.' },
  'oll-46': { steps: ['Setup.', null, 'Finish.'], recognition: 'C shape: a yellow vertical line (back–center–front) plus the two left corners. On the right a full yellow bar of 3.' },
  'oll-47': { steps: ['Setup.', null, null, 'Finish.'], recognition: 'L shape: yellow at the back edge, center and right edge; no yellow corners. Headlights on the right.' },
  'oll-48': { steps: ['Front clockwise.', null, null, 'Front back.'], recognition: 'L shape: yellow at the back edge, center and left edge; no yellow corners. Headlights on the left.' },
  'oll-49': { steps: ['Wide r moves.', 'Alternating U and r2.', 'Finish.'], recognition: 'L shape: yellow at the back edge, center and right edge; no yellow corners. On the left a full yellow bar of 3.' },
  'oll-50': { steps: ['Wide r moves.', "Alternating U' and r2.", 'Finish.'], recognition: 'L shape: yellow at the center, right edge and front edge; no yellow corners. On the left a full yellow bar of 3.' },
  'oll-51': { steps: ['Front clockwise.', null, null, 'Front back.'], recognition: 'Line: a yellow horizontal line without yellow corners. Headlights on the right; at the front the two left stickers are yellow.' },
  'oll-52': { steps: ['Start of a Sune.', 'Trigger with the back.'], recognition: 'Line: a yellow vertical line (back–center–front) without yellow corners. On the right a full yellow bar of 3.' },
  'oll-53': { steps: ['Wide l down, half turn on top.', 'Left trigger.', 'Left trigger.', 'Wide l back.'], recognition: 'L shape: yellow at the back edge, center and right edge. A full yellow bar at the front, headlights at the back.' },
  'oll-54': { steps: ['Wide r up, half turn on top.', null, 'Trigger.', 'Wide r back.'], recognition: 'L shape: yellow at the back edge, center and left edge. A full yellow bar at the front, headlights at the back.' },
  'oll-55': { steps: ['Setup with the front.', 'Core.', 'Finish.'], recognition: 'Line: a yellow horizontal line without yellow corners. Front and back each have a full yellow bar of 3.' },
  'oll-56': { steps: ['Wide r trigger.', 'Trigger.', 'Once more.', 'Wide r back.'], recognition: 'Line: a yellow horizontal line without yellow corners. Headlights on the left and right.' },
  'oll-57': { name: 'OLL 57 (H edges)', steps: [null, 'Middle slice up.', 'Finish with wide r.'], recognition: 'All corners yellow plus a horizontal line; only the front and back edges are not yellow.' },

  // ---------------- PLL ----------------
  'pll-ua': {
    steps: ['Middle slice half turn and top to the left: start of the edge cycle.', 'Middle slice down, half turn on top, middle slice back: shifts the edges.', 'Top to the left and middle slice half turn: cycle complete.'],
    recognition: 'All corners are already correct (headlights on every side). One side is fully solved: hold it at the back. Three edges cycle. Ua: the front edge has the color of the right side (the edges cycle counterclockwise, seen from above).',
  },
  'pll-ub': {
    steps: ['Middle slice half turn and top to the right.', 'Middle slice down, half turn on top, middle slice back.', 'Top to the right and middle slice half turn.'],
    recognition: 'All corners are already correct. One side is fully solved: hold it at the back. Three edges cycle. Ub: the front edge has the color of the left side (the edges cycle clockwise, seen from above).',
  },
  'pll-h': {
    steps: [null, 'Top half turn.', null],
    recognition: 'Headlights on all four sides, and every middle edge has the color of the opposite side (e.g. red between two orange corners). Two pairs of opposite edges swap.',
  },
  'pll-z': {
    steps: ['Middle slice up, top to the left.', 'Two middle slice half turns with a top turn in between: swaps the edge pairs.', 'Middle slice back, half turn on top, middle slice half turn.'],
    recognition: 'Headlights on all four sides, and every middle edge belongs to an adjacent side (e.g. green between two red corners). Two pairs of adjacent edges swap. Hold the cube so the front edge has to swap with the left edge (and the right edge with the back edge).',
  },
  'pll-aa': {
    steps: ['Tilt the whole cube like R: the front comes to the top.', 'Takes a corner out of its spot.', 'Bottom layer (the old front) half turn.', 'Puts the corner back in its new spot.', 'Bottom layer back and right half turn: three corners have cycled.', 'Tilt the cube back.'],
    recognition: 'All edges are correct; three corners cycle. Headlights at the back and a solved 2x2 block at front-left (corner + two edges). No headlights on the right.',
  },
  'pll-ab': {
    steps: ['Tilt the whole cube like R.', 'Right half turn, bottom layer half turn.', 'Move the corner away.', 'Bottom layer back.', 'Corner in its spot; three corners have cycled.', 'Tilt the cube back.'],
    recognition: 'All edges are correct; three corners cycle. Headlights on the right and a solved 2x2 block at front-left. The front shows no headlights.',
  },
  'pll-e': {
    steps: ['Tilt the whole cube like L (front goes down).', 'First half of the commutator: corner out, turn the bottom layer.', 'Corner back, bottom layer back.', 'Second commutator: repeats the pattern mirrored.', 'Finish: two pairs of corners have swapped.', 'Tilt the cube back.'],
    recognition: 'All edges are correct and there are no headlights anywhere: on every side the two corners have a different (opposite) color. Two pairs of corners swap.',
  },
  'pll-t': {
    steps: [null, 'Core of the T-perm: swaps the two right corners.', "Restores the F2L pair and finishes with F'."],
    recognition: 'Headlights on the left with a middle edge of the opposite color. Front and back show a block of 2 on the left. Swaps the two right corners and the left and right edges. In 2-look PLL you use this for "headlights": hold the headlights on the left.',
  },
  'pll-ja': {
    steps: ['Tilt the whole cube like R.', 'Setup with a sledgehammer-like move.', 'Wide r moves shift the block.', 'Tilt the cube back.'],
    recognition: "A fully solved bar of 3 on the left. At the front you see a block of 2 on the left that connects to that bar. On the right (at the front) and at the back (on the right) you also see a block of 2, with each other's side colors.",
  },
  'pll-jb': {
    steps: ['Setup: prepares the pieces for the T-perm core.', null, 'Same core as the T-perm: swaps corners and edges.'],
    recognition: 'A bar of 3 matching stickers on the left. The other three sides each have a block of 2 plus a loose corner: at the front the block is on the right. Swaps two adjacent corners and two edges.',
  },
  'pll-f': {
    steps: ['Setup: brings the pieces into T-perm position.', null, 'Core of the T-perm.', 'Finish and put the pair back.'],
    recognition: 'The left side is fully solved (bar of 3). On the right: the two corners have opposite colors (those of front and back) with the correct edge between them. Swaps the two right corners and the front and back edges.',
  },
  'pll-ra': {
    steps: ['Split up the pair.', 'Right up, top, right up once more.', "Swap the corner via the bottom layer; D' restores the bottom layer.", 'Put the pair back and finish.'],
    recognition: 'Headlights on the left with a middle edge of an adjacent color. At the front you see a block of 2 on the left. The right and back sides have no block.',
  },
  'pll-rb': {
    steps: ['Right half turn, front clockwise: setup.', 'Moves the top layer pieces.', 'Front back.', 'Finish: restores the F2L.'],
    recognition: 'Headlights on the left with a middle edge of an adjacent color. At the back you see a block of 2 on the side of the headlights (left). No block at the front and right.',
  },
  'pll-ga': {
    steps: ['Core: cycles three edges and three corners.', 'Turn top and bottom at the same time: the block shifts.', 'Insert the pair and bottom layer back.'],
    recognition: 'Headlights on the left with a middle edge of an adjacent color. At the front you see a block of 2 on the right (edge + corner). G-perms are recognized by the combination of headlights + one loose block elsewhere.',
  },
  'pll-gb': {
    steps: ['Takes the pair out of the top layer.', 'Top and bottom at the same time.', 'Core: cycle of three edges and three corners.', 'Bottom layer back.'],
    recognition: 'Headlights on the left with a middle edge of the opposite color. On the right you see a block of 2 at the back.',
  },
  'pll-gc': {
    steps: ['Core: cycle of three edges and three corners (mirror of Ga).', 'Top and bottom at the same time.', 'Insert the pair and bottom layer back.'],
    recognition: 'Headlights on the left with a middle edge of an adjacent color. At the back you see a block of 2 on the right (seen from the back: on the left).',
  },
  'pll-gd': {
    steps: [null, 'Turn the bottom layer.', 'Core: cycle of three edges and three corners.', 'Bottom layer back.'],
    recognition: 'Headlights on the left with a middle edge of the opposite color. On the right you see a block of 2 at the front.',
  },
  'pll-y': {
    steps: ['First half: swaps corners diagonally and moves two edges.', null, null],
    recognition: 'No headlights anywhere. At the front you see a block of 2 on the left and on the right a block of 2 at the back; the left and back edges swap. In 2-look PLL you use this for "no headlights" (diagonal corner swap).',
  },
  'pll-v': {
    steps: ['Setup: right down with top turns in between.', 'Turn the whole cube like U.', 'Core: diagonal corner swap.', 'Finish with a sledgehammer-like move.'],
    recognition: 'A solved 2x2 block (corner + two edges) at back-left, and no other headlights or blocks anywhere. Two corners swap diagonally and two edges swap.',
  },
  'pll-na': {
    steps: ['Setup.', 'Insert the pair and front counterclockwise.', null, 'T-perm core.', 'Finish.'],
    recognition: 'On all four sides you see a block of 2 on the right and a loose corner on the left. Front and back are mirror images. Two corners and two edges swap diagonally.',
  },
  'pll-nb': {
    steps: ['Setup.', 'Front trigger.', null, null, 'Finish.'],
    recognition: 'On all four sides you see a block of 2 on the left and a loose corner on the right (mirror of the Na-perm). Two corners and two edges swap diagonally.',
  },
}
