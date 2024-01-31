import type { Block, Inline } from '@contentful/rich-text-types'
import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentTextBlockFields {
  contentfulName: EntryFields.Symbol
  textBlock: Block | Inline
}

export type TypeComponentTextBlock = Entry<TypeComponentTextBlockFields>
