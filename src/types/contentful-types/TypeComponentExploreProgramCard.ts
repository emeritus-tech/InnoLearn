import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentExploreProgramCardFields {
  contentfulName: EntryFields.Symbol
  courseName: EntryFields.Symbol
  image?: Asset
  seoImage?: Entry<TypeSeoImageFields>
  url: EntryFields.Symbol
}

export type TypeComponentExploreProgramCard = Entry<TypeComponentExploreProgramCardFields>
