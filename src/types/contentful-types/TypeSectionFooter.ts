import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeSectionFooterFields {
  contentfulName: EntryFields.Symbol
  body?: EntryFields.RichText
  backgroundColor?: 'section-black' | 'section-dark-gray' | 'section-gray'
  logo?: Asset
  seoLogo?: Entry<TypeSeoImageFields>
}

export type TypeSectionFooter = Entry<TypeSectionFooterFields>
