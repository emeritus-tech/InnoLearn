import type { Entry, EntryFields } from 'contentful'

export interface TypeFormSelectOptionsFields {
  contentfulName?: EntryFields.Symbol
  label: EntryFields.Symbol
  value: EntryFields.Symbol
  showInfoModal?: EntryFields.Boolean
}

export type TypeFormSelectOptions = Entry<TypeFormSelectOptionsFields>
