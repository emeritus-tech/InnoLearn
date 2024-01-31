import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentStatsFields {
  contentfulName?: EntryFields.Symbol
  statsValue?: EntryFields.Symbol
  statValueText?: EntryFields.Symbol
  description?: EntryFields.Symbol
  sourceLabel?: EntryFields.Symbol
  source?: EntryFields.Symbol
}

export type TypeComponentStats = Entry<TypeComponentStatsFields>
