import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeImageAndLinkFields {
  contentfulName?: EntryFields.Symbol
  image?: Asset
  seoImage?: Entry<TypeSeoImageFields>
  link?: EntryFields.Symbol
}

export type TypeImageAndLink = Entry<TypeImageAndLinkFields>
