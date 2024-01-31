import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeKeyStatsItemFields } from './TypeKeyStatsItem'
import type { TypeLanding_pagesFields } from './TypeLanding_pages'

export interface TypeKeyStatsFields {
  contentfulName: EntryFields.Symbol
  title: EntryFields.Symbol
  description?: EntryFields.Symbol
  footer?: EntryFields.Symbol
  backgroundImage: Asset
  backgroundColor: 'primary' | 'secondary'
  items: Entry<TypeKeyStatsItemFields>[]
  landingPages?: Entry<TypeLanding_pagesFields>[]
  landingPageTemplateIds?: EntryFields.Symbol[]
  position: EntryFields.Integer
  experiments?: EntryFields.Symbol[]
}

export type TypeKeyStats = Entry<TypeKeyStatsFields>
