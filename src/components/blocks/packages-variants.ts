import { PackagesBundleCardsBlock } from './PackagesBundleCardsBlock'
import { PackagesTieredBlock } from './PackagesTieredBlock'
import { PackagesFeatureListBlock } from './PackagesFeatureListBlock'
import { PackagesGridBlock } from './PackagesGridBlock'
import { PackagesComparisonBlock } from './PackagesComparisonBlock'

// One package — a bundled set of services at one price. OPTIONAL data (read from
// SITE.packages via cast — never on the emitted SITE literal), so a site with no
// packages renders nothing and stays byte-identical. Distinct from pricing
// (one-time service price) and membership (recurring): a curated bundle, sold by
// what it INCLUDES.
export interface ServicePackage {
  name: string
  price: string
  includes?: string[]
  popular?: boolean
}

// Per-type variant map (additive, like HERO_VARIANTS), bundle-cards default.
export const PACKAGES_VARIANTS: Record<string, typeof PackagesBundleCardsBlock> = {
  'bundle-cards': PackagesBundleCardsBlock,
  tiered: PackagesTieredBlock,
  'feature-list': PackagesFeatureListBlock,
  grid: PackagesGridBlock,
  comparison: PackagesComparisonBlock,
}
