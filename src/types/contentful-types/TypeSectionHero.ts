import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeLeadFormParentFields } from './TypeLeadFormParent'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeSectionHeroFields {
  contentfulName: EntryFields.Symbol
  heroImage: Asset
  seoHeroImage?: Entry<TypeSeoImageFields>
  title?: EntryFields.Symbol
  subTitle?: EntryFields.Symbol
  leadForm?: Entry<TypeLeadFormParentFields>
}

export type TypeSectionHero = Entry<TypeSectionHeroFields>
