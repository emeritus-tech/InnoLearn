import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentLinkExternalFields {
  contentfulName: EntryFields.Symbol
  title: EntryFields.Symbol
  url: EntryFields.Symbol
  eventName?: EntryFields.Symbol
}

export type TypeComponentLinkExternal = Entry<TypeComponentLinkExternalFields>
