import type { Block, Inline } from '@contentful/rich-text-types'
import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentTextAndImageFields {
  contentfulName: EntryFields.Symbol
  title?: EntryFields.Symbol
  descriptionNew?: Block | Inline
  description: EntryFields.Text
  truncateAtLine?: EntryFields.Integer
  image: Asset
  seoImage?: Entry<TypeSeoImageFields>
  reversePosition: EntryFields.Boolean
}

export type TypeComponentTextAndImage = Entry<TypeComponentTextAndImageFields>
