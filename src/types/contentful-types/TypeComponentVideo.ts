import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentVideoFields {
  contentfulName?: EntryFields.Symbol
  videoLink?: EntryFields.Symbol
  videoThumbnail?: Asset
  seoVideoThumbnail?: Entry<TypeSeoImageFields>
  subHeading?: EntryFields.Symbol
  highlights?: EntryFields.Symbol[]
}

export type TypeComponentVideo = Entry<TypeComponentVideoFields>
