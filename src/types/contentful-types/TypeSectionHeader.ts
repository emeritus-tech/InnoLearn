import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeComponentLinkFields } from './TypeComponentLink'
import type { TypeComponentLinkExternalFields } from './TypeComponentLinkExternal'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeSectionHeaderFields {
  contentfulName: EntryFields.Symbol
  logo?: Asset
  seoLogo?: Entry<TypeSeoImageFields>
  logoLink?: EntryFields.Symbol
  secondaryLogo?: Asset
  secondaryLogoLink?: EntryFields.Symbol
  seoSecondaryLogo?: Entry<TypeSeoImageFields>
  coBrandedMessage?: EntryFields.Symbol
  tabReferences?: Entry<TypeComponentLinkExternalFields | TypeComponentLinkFields>[]
  backgroundColor?: EntryFields.Symbol
  foregroundColor?: EntryFields.Symbol
  rightMessage?: EntryFields.Symbol
  logoVariants?: 'Default' | 'Logo Center' | 'Logo Left' | 'Logo with Menu' | 'Multi Logo Apart'
}

export type TypeSectionHeader = Entry<TypeSectionHeaderFields>
