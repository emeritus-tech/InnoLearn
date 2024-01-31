import type { Entry, EntryFields } from 'contentful'

export interface TypeHrefLangFields {
  name?: EntryFields.Symbol
  href: EntryFields.Symbol
  hrefLang: EntryFields.Symbol
}

export type TypeHrefLang = Entry<TypeHrefLangFields>
