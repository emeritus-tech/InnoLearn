import type { Entry, EntryFields } from 'contentful'

export interface TypeEmailFields {
  contentfulName?: EntryFields.Symbol
  email?: EntryFields.Symbol
  eventName: EntryFields.Symbol
}

export type TypeEmail = Entry<TypeEmailFields>
