import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeSectionLandingHeroFields {
  contentfulName?: EntryFields.Symbol
  title: EntryFields.Symbol
  subtitle?: EntryFields.Symbol
  subHeadlineText?: EntryFields.Symbol
  tagline?: EntryFields.Symbol
  ratings?: EntryFields.Number
  ratingsSubtext?: EntryFields.Symbol
  bullets?: EntryFields.Symbol[]
  videoLink?: EntryFields.Symbol
  videoThumbnail?: Asset
  seoVideoThumbnail?: Entry<TypeSeoImageFields>
  videoTitle?: EntryFields.Symbol
  imageBackground?: 'gradient' | 'image-focussed' | 'primary' | 'secondary'
  desktopImage?: Asset
  seoDesktopImage?: Entry<TypeSeoImageFields>
  mobileImage?: Asset
  seoMobileImage?: Entry<TypeSeoImageFields>
  foregroundColor?: EntryFields.Symbol
}

export type TypeSectionLandingHero = Entry<TypeSectionLandingHeroFields>
