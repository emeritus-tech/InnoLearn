import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentImageAndTextColumnFields {
  contentfulName: EntryFields.Symbol
  title?: EntryFields.Symbol
  image?: Asset
  seoImage?: Entry<TypeSeoImageFields>
  description?: EntryFields.RichText
  truncateAtLine?: EntryFields.Integer
  disclaimer?: EntryFields.RichText
}

export type TypeComponentImageAndTextColumn = Entry<TypeComponentImageAndTextColumnFields>
