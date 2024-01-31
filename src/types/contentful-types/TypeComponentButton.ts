import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentButtonFields {
  contentfulName: EntryFields.Symbol
  text: EntryFields.Symbol
  link: EntryFields.Symbol
  openInNewTab: EntryFields.Boolean
  eventName: EntryFields.Symbol
  eventType?: 'apply_now' | 'generic' | 'lead_form_pop_up' | 'search'
}

export type TypeComponentButton = Entry<TypeComponentButtonFields>
