import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentLinkFields {
  contentfulName: EntryFields.Symbol
  title: EntryFields.Symbol
  slug: EntryFields.Symbol
  eventName?: EntryFields.Symbol
}

export type TypeComponentLink = Entry<TypeComponentLinkFields>
