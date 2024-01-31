import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentTextAndIconFields {
  contentfulName: EntryFields.Symbol
  title?: EntryFields.Symbol
  description: EntryFields.Text
  image: Asset
  seoImage?: Entry<TypeSeoImageFields>
}

export type TypeComponentTextAndIcon = Entry<TypeComponentTextAndIconFields>
