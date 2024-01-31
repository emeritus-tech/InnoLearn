import type { Entry, EntryFields } from 'contentful'
import type { TypeHrefLangFields } from './TypeHrefLang'

export interface TypeSeoMetaFields {
  contentfulName?: EntryFields.Symbol
  follow?: 'Hostname' | 'No' | 'Vanity hostname'
  title: EntryFields.Symbol
  description?: EntryFields.Symbol
  canonical?: EntryFields.Symbol
  schemaFaq?: EntryFields.Object
  hrefLang?: Entry<TypeHrefLangFields>[]
}

export type TypeSeoMeta = Entry<TypeSeoMetaFields>
