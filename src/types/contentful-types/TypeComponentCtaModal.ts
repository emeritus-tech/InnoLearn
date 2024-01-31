import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentCtaModalFields {
  contentfulName?: EntryFields.Symbol
  text: EntryFields.Symbol
  link?: EntryFields.Symbol
  title?: EntryFields.Symbol
  description?: EntryFields.RichText
  eventType?: 'apply_now' | 'generic' | 'lead_form_pop_up' | 'search'
}

export type TypeComponentCtaModal = Entry<TypeComponentCtaModalFields>
