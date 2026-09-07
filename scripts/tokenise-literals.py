#!/usr/bin/env python3
"""ONE-TIME REWRITE (2026-09-07): literal colours → the family tokens (see src/styles/app.css), and the root
padding pair → the rhythm token. The colour map is EXACTLY the scaffolder's former re-point seam
(factory-build family-theme.ts EMERALD_MAP + ROLE_OF_HEX), so a branded site renders byte-for-byte the same
colours after the seam is removed. Kept in the repo as the record of what was mapped to what."""
import re, glob, sys, collections

EMERALD = {  # utility → token utility (the seam's map; variants prefixes are preserved by the regex)
  'text-emerald-500': 'text-fam-accent-text', 'text-emerald-600': 'text-fam-accent-text', 'text-emerald-700': 'text-fam-accent-text-strong', 'text-emerald-800': 'text-fam-accent-text-strong',
  'text-emerald-100': 'text-fam-accent-on-dark', 'text-emerald-50': 'text-fam-accent-on-dark',
  'text-emerald-700/30': 'text-fam-accent/30',
  'bg-emerald-500': 'bg-fam-accent', 'bg-emerald-600': 'bg-fam-accent', 'bg-emerald-700': 'bg-fam-accent-deep',
  'bg-emerald-50': 'bg-fam-accent-soft', 'bg-emerald-100': 'bg-fam-accent-soft-2',
  'bg-emerald-600/10': 'bg-fam-accent/10', 'bg-emerald-600/50': 'bg-fam-accent/50',
  'border-emerald-200': 'border-fam-accent-tint', 'border-emerald-500': 'border-fam-accent', 'border-emerald-600': 'border-fam-accent',
  'border-emerald-600/40': 'border-fam-accent/40', 'border-emerald-600/60': 'border-fam-accent/60',
  'ring-emerald-50': 'ring-fam-accent-soft', 'ring-emerald-100': 'ring-fam-accent-soft-2', 'ring-emerald-600': 'ring-fam-accent',
  'fill-emerald-500': 'fill-fam-accent', 'fill-emerald-600': 'fill-fam-accent',
  'to-emerald-600/10': 'to-fam-accent/10',
  # not in the seam (stayed emerald on branded sites): the one range-input accent → the accent
  'accent-emerald-600': 'accent-fam-accent',
  # not in the seam either (src/lib/character-tokens.ts): the faint accent text + the soft accent border
  'text-emerald-200': 'text-fam-accent-tint', 'border-emerald-100': 'border-fam-accent-soft-2',
}
ROLE = {  # family hex → role (ROLE_OF_HEX over every family palette; white is not a role)
  'surface': ['#FBF7EF', '#FFFBF5', '#F7F8FA'],
  'surface-2': ['#F3ECDE', '#FFF6EC', '#F6F7F9', '#F4F6F9', '#FBFAFC', '#EEF1F6', '#F8FAFC'],
  'hairline': ['#E7DCC9', '#F0E6DA', '#E6E8EC', '#E2E8F0', '#D8DEE7', '#ECECEF'],
  'ink': ['#2B2620', '#3D3530', '#0F172A', '#1E293B', '#1A2433', '#18181B'],
  'ink-muted': ['#8A7E6E', '#7A6F66', '#64748B', '#5A6678', '#71717A', '#475569'],
  'ink-faint': ['#94A3B8'],  # not in the seam; a constant role token (the niche arc derives it)
}
HEX_UTILS = ['bg', 'text', 'border', 'divide']  # divide- was not in the seam (6 uses): a rule is a hairline
SECTION_PAIRS = ['py-20 md:py-28', 'py-16 md:py-24', 'py-16 md:py-20', 'py-24 md:py-32', 'py-24 md:py-36', 'py-24 md:py-28', 'py-20 md:py-24', 'py-28 md:py-44', 'py-28 md:py-40', 'py-14 md:py-20', 'py-12 md:py-16']
BAND_PAIRS = ['py-14 md:py-16', 'py-12 md:py-16', 'py-8 md:py-10', 'py-14 md:py-20']
BAND_FILES = re.compile(r'(TrustBar\w*Block|PromotionsBannerBlock|PromotionsCountdownBandBlock|PartnersStripBlock|TrustBar)\.tsx$')

hex_map = {h.upper(): role for role, hs in ROLE.items() for h in hs}
counts = collections.Counter(); per_file = collections.Counter()

def rewrite(path):
  s = open(path).read(); o = s
  # 1. emerald utilities (longest keys first so 'bg-emerald-600/10' wins over 'bg-emerald-600')
  for k in sorted(EMERALD, key=len, reverse=True):
    n = len(re.findall(r'(?<![\w-])' + re.escape(k) + r'(?![\w/])', s))
    if n: s = re.sub(r'(?<![\w-])' + re.escape(k) + r'(?![\w/])', EMERALD[k], s); counts['emerald:' + k] += n; per_file[path] += n
  # 2. family hexes by role
  def hexsub(m):
    util, hx = m.group(1), m.group(2).upper()
    role = hex_map.get(hx)
    if not role: return m.group(0)
    counts['hex:' + hx + '→' + role] += 1; per_file[path] += 1
    return f'{util}-fam-{role}'
  s = re.sub(r'\b(' + '|'.join(HEX_UTILS) + r')-\[(#[0-9A-Fa-f]{6})\]', hexsub, s)
  # 3. the rhythm: the root padding pair on the container line → the token
  band = bool(BAND_FILES.search(path))
  out = []
  for line in s.split('\n'):
    if 'container-x' in line and not line.strip().startswith('//'):
      for pair in (BAND_PAIRS if band else SECTION_PAIRS) + (SECTION_PAIRS if band else []):
        tok = 'py-band' if (band and pair in BAND_PAIRS) else 'py-section'
        if re.search(r'\b' + re.escape(pair) + r'\b', line):
          line = re.sub(r'\b' + re.escape(pair) + r'\b', tok, line); counts['rhythm:' + pair + '→' + tok] += 1; per_file[path] += 1; break
      # the split form: `py-20 … md:py-28` with classes between
      m = re.search(r'\bpy-(\d+)\b([^"]*?)\bmd:py-(\d+)\b', line)
      if m and ('py-' + m.group(1) + ' md:py-' + m.group(3)) in SECTION_PAIRS:
        line = line.replace('py-' + m.group(1) + ' ', 'py-section ', 1).replace(' md:py-' + m.group(3), '', 1); counts['rhythm:split→py-section'] += 1; per_file[path] += 1
    out.append(line)
  s = '\n'.join(out)
  # 4. comments that named the emerald ramp: keep them truthful
  s = re.sub(r'emerald-\* \(DNA\)', 'fam-accent-* (DNA)', s)
  s = re.sub(r'(//.*?)emerald-600', lambda m: m.group(1) + 'fam-accent', s)
  s = re.sub(r'(//.*?)emerald-700', lambda m: m.group(1) + 'fam-accent-text-strong', s)
  s = re.sub(r'(//.*?)emerald-50\b', lambda m: m.group(1) + 'fam-accent-soft', s)
  s = re.sub(r'(//.*?)emerald-100', lambda m: m.group(1) + 'fam-accent-soft-2', s)
  if s != o: open(path, 'w').write(s)

files = sorted(glob.glob('src/components/**/*.tsx', recursive=True)) + sorted(glob.glob('src/lib/*.ts'))
for f in files: rewrite(f)
print('files touched:', sum(1 for f in per_file if per_file[f]))
for k, v in sorted(counts.items()): print(f'  {v:4}  {k}')
