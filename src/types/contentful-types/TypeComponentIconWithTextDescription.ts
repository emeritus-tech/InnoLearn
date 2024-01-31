import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentIconWithTextDescriptionFields {
  contentfulName: EntryFields.Symbol
  title?: EntryFields.Symbol
  description?: EntryFields.RichText
  image: Asset
  seoImage?: Entry<TypeSeoImageFields>
}

export type TypeComponentIconWithTextDescription = Entry<TypeComponentIconWithTextDescriptionFields>
