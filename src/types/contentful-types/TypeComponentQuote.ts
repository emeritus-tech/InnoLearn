import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentQuoteFields {
  contentfulName?: EntryFields.Symbol
  speakerName: EntryFields.Symbol
  speakerTitle: EntryFields.Text
  speakerImage?: Asset
  speakerSeoImage?: Entry<TypeSeoImageFields>
  quote: EntryFields.Text
}

export type TypeComponentQuote = Entry<TypeComponentQuoteFields>
