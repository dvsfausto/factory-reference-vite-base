// The legibility rule, on the numbers measured over Karli's own photo and over a dark one (2026-09-29). Run with tsx.
import { legibleGlassLevel } from '../src/components/blocks/HeroGlassBlock'
let failed = 0
const check = (name: string, ok: boolean, detail = '') => { console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`); if (!ok) failed++ }
const ink: [number, number, number] = [28, 26, 24]
const hers: [number, number, number] = [122, 139, 151] // the tone behind her panel, back-solved from the measured 25% mix
const dark: [number, number, number] = [20, 18, 16]
check("her photo: 'lightest' stands", legibleGlassLevel('lightest', hers, ink, true) === 'lightest')
check("her photo: 'lighter' stands", legibleGlassLevel('lighter', hers, ink, true) === 'lighter')
check("a dark photo: 'lightest' asked → standard applied (only standard reads)", legibleGlassLevel('lightest', dark, ink, true) === 'standard')
check("a dark photo: 'lighter' asked → standard applied", legibleGlassLevel('lighter', dark, ink, true) === 'standard')
check("a mid-dark photo: 'lightest' asked → 'lighter' applied", legibleGlassLevel('lightest', [60, 60, 60], ink, true) === 'lighter')
check("a phone keeps heavier tints, so the same dark photo allows 'lighter' there", legibleGlassLevel('lighter', dark, ink, false) === 'lighter')
check("never lighter than asked", legibleGlassLevel('standard', [240, 240, 240], ink, true) === 'standard')
console.log(failed ? `\n${failed} failed` : '\ncheck-glass-math: ok')
process.exit(failed ? 1 : 0)
