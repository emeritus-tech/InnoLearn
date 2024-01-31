import type { Block, Inline } from '@contentful/rich-text-types'
import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentFaqFields {
  contentfulName: EntryFields.Symbol
  questionText: EntryFields.Text
  answerText: Block | Inline
  eventName?: EntryFields.Symbol
}

export type TypeComponentFaq = Entry<TypeComponentFaqFields>
