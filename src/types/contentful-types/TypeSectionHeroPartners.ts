import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeComponentHeroFeatureFields } from './TypeComponentHeroFeature'
import type { TypeComponentLinkFields } from './TypeComponentLink'
import type { TypeComponentLinkExternalFields } from './TypeComponentLinkExternal'

export interface TypeSectionHeroPartnersFields {
  contentfulName?: EntryFields.Symbol
  image?: Asset
  mobileImage?: Asset
  title?: EntryFields.Symbol
  subtitle?: EntryFields.Symbol
  subHeadlineText?: EntryFields.Symbol
  links?: Entry<TypeComponentLinkExternalFields | TypeComponentLinkFields>[]
  features?: Entry<TypeComponentHeroFeatureFields>[]
  foregroundColor?: EntryFields.Symbol
  heroVariant?: 'Default' | 'Without Tint Black Font' | 'Without Tint White Font'
}

export type TypeSectionHeroPartners = Entry<TypeSectionHeroPartnersFields>
