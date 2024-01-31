import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentHeroFeatureFields {
  contentfulName: EntryFields.Symbol
  description: EntryFields.Symbol
  icon: Asset
  seoIcon?: Entry<TypeSeoImageFields>
}

export type TypeComponentHeroFeature = Entry<TypeComponentHeroFeatureFields>
