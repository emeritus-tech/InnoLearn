import type { Asset, Entry, EntryFields } from 'contentful'

export interface TypeKeyStatsItemFields {
  contentfulName: EntryFields.Symbol
  title: EntryFields.Symbol
  value: EntryFields.Integer
  icon: Asset
}

export type TypeKeyStatsItem = Entry<TypeKeyStatsItemFields>
