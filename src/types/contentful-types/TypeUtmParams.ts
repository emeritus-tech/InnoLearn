import type { Entry, EntryFields } from 'contentful'

export interface TypeUtmParamsFields {
  contentfulName?: EntryFields.Symbol
  utm_source?: EntryFields.Symbol
  utm_medium?: EntryFields.Symbol
  utm_content?: EntryFields.Symbol
  utm_campaign?: EntryFields.Symbol
}

export type TypeUtmParams = Entry<TypeUtmParamsFields>
