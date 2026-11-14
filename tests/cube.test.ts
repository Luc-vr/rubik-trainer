import { beforeAll, describe, expect, it } from 'vitest'
import { caseSetup, faceStickers, initCube, invertAlg, netRotation, patternFromAlg, solved } from '../src/lib/cube'

beforeAll(async () => {
  await initCube()
})

describe('stickermodel', () => {
  it('opgeloste kubus: elke zijde heeft één kleur', () => {
    for (const f of ['U', 'D', 'F', 'B', 'R', 'L'] as const) {
      expect(new Set(faceStickers(solved(), f))).toEqual(new Set([f]))
    }
  })
  it('na R: rechterkolom van U toont F, rechterkolom van F toont D', () => {
    const p = patternFromAlg('R')
    const u = faceStickers(p, 'U')
    const f = faceStickers(p, 'F')
    expect([u[2], u[5], u[8]]).toEqual(['F', 'F', 'F'])
    expect([f[2], f[5], f[8]]).toEqual(['D', 'D', 'D'])
    expect([u[0], u[3], u[6]]).toEqual(['U', 'U', 'U'])
  })
  it("na U: bovenste rij van F toont R (bovenkant draait naar links)", () => {
    const f = faceStickers(patternFromAlg('U'), 'F')
    expect(f.slice(0, 3)).toEqual(['R', 'R', 'R'])
  })
  it('na F: onderste rij van U toont L', () => {
    const u = faceStickers(patternFromAlg('F'), 'U')
    expect(u.slice(6)).toEqual(['L', 'L', 'L'])
  })
  it('rotaties verplaatsen de middenstukken', () => {
    expect(faceStickers(patternFromAlg('x'), 'U')[4]).toBe('F')
    expect(netRotation("R U R'")).toBe('')
    expect(netRotation('y')).not.toBe('')
  })
  it('caseSetup = AUF + inverse + AUF', () => {
    expect(caseSetup("R U R'", 'U', 'U2')).toBe(`U ${invertAlg("R U R'")} U2`)
  })
})
