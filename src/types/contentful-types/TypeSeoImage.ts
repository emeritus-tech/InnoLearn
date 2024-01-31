import type { Asset, Entry, EntryFields } from 'contentful'

export interface TypeSeoImageFields {
  contentfulName?: EntryFields.Symbol
  image: Asset
  imageTitleText?: EntryFields.Symbol
  imageAltText?: EntryFields.Symbol
}

export type TypeSeoImage = Entry<TypeSeoImageFields>
