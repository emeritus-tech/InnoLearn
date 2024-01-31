import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentTableColFields {
  contentfulName: EntryFields.Symbol
  tableDefinition?: EntryFields.RichText
  tableSubtext?: EntryFields.Symbol
  tableLongSubtext?: EntryFields.Text
  checkMarkOrCrossMark?: 'Check Mark' | 'Cross Mark' | 'Default'
}

export type TypeComponentTableCol = Entry<TypeComponentTableColFields>
