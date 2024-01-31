import type { Entry, EntryFields } from 'contentful'

export interface TypeCallToActionFields {
  contentfulName: EntryFields.Symbol
  buttonText: EntryFields.Symbol
  link: EntryFields.Symbol
  eventName: EntryFields.Symbol
  openInANewTab?: EntryFields.Boolean
}

export type TypeCallToAction = Entry<TypeCallToActionFields>
