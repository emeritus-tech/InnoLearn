import type { Entry, EntryFields } from 'contentful'

export interface TypeKeyValueFields {
  contentfulName?: EntryFields.Symbol
  fieldName: EntryFields.Symbol
  fieldValue: EntryFields.Symbol
}

export type TypeKeyValue = Entry<TypeKeyValueFields>
