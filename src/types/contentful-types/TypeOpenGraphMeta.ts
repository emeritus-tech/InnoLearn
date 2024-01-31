import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeKeyValueFields } from './TypeKeyValue'

export interface TypeOpenGraphMetaFields {
  contentfulName?: EntryFields.Symbol
  ogTitle?: EntryFields.Symbol
  ogDescription?: EntryFields.Symbol
  ogUrl?: EntryFields.Symbol
  ogImage?: Asset
  ogType?: EntryFields.Symbol
  additionalOg?: Entry<TypeKeyValueFields>[]
}

export type TypeOpenGraphMeta = Entry<TypeOpenGraphMetaFields>
