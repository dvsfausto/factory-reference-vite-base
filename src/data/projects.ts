// Homepage gallery / portfolio data — the PIPELINE-SEEDED model (mirrors the
// painter template's src/data/projects.ts + serviceImageUrl/areaImageUrl image
// pattern). The image SOURCE is a data field: seeded here with honest illustrative
// stock photos now, and REPLACED by genuine customer-owned photos later (the
// WhatsApp -> Supabase asset library wiring). This is NOT omit-when-empty — the
// gallery renders populated from day one off this seed; the components read the
// data field exactly as the painter reads `p.image`.
//
// HONESTY (ported from the painter's documented lesson): these are ILLUSTRATIVE
// category photos, not specific completed jobs. before/after pairs are optional
// and, when shown, are labeled illustrative — a real before/after needs the
// customer's own photos (a stock pair would dishonestly imply "we did this").
// Real images (Unsplash photos), never LLM-generated.

const U = (id: string, w = 900, h = 700) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`

export interface GalleryItem {
  title: string
  caption?: string
  image: string
  alt?: string
  // Optional before/after pair (the slider variant); only rendered when present.
  beforeImage?: string
  afterImage?: string
}

export const PROJECTS: GalleryItem[] = [
  {
    title: 'Bright open kitchen',
    caption: 'Illustrative — a typical project',
    image: U('1556909114-f6e7ad7d3136'),
    alt: 'Bright modern kitchen — illustrative example',
    beforeImage: U('1581858726788-75bc0f6a952d'),
    afterImage: U('1556909114-f6e7ad7d3136'),
  },
  {
    title: 'Calm living room',
    caption: 'Illustrative — a typical project',
    image: U('1505691938895-1758d7feb511'),
    alt: 'Calm, freshly finished living room — illustrative example',
  },
  {
    title: 'Refined exterior',
    caption: 'Illustrative — a typical project',
    image: U('1568605114967-8130f3a36994'),
    alt: 'Refined home exterior — illustrative example',
    beforeImage: U('1570129477492-45c003edd2be'),
    afterImage: U('1568605114967-8130f3a36994'),
  },
  {
    title: 'Detailed trim work',
    caption: 'Illustrative — a typical project',
    image: U('1615529182904-14819c35db37'),
    alt: 'Painted trim and millwork — illustrative example',
  },
  {
    title: 'Warm bedroom',
    caption: 'Illustrative — a typical project',
    image: U('1522708323590-d24dbb6b0267'),
    alt: 'Warm finished bedroom — illustrative example',
  },
  {
    title: 'Modern bathroom',
    caption: 'Illustrative — a typical project',
    image: U('1620626011761-996317b8d101'),
    alt: 'Modern finished bathroom — illustrative example',
  },
]
