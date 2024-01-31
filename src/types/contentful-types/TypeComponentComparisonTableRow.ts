import type { Entry, EntryFields } from 'contentful'
import type { TypeComponentTableColFields } from './TypeComponentTableCol'

export interface TypeComponentComparisonTableRowFields {
  contentfulName: EntryFields.Symbol
  isTableHeading?: EntryFields.Boolean
  tableRow?: Entry<TypeComponentTableColFields>[]
  fullRowText?: EntryFields.Symbol
}

export type TypeComponentComparisonTableRow = Entry<TypeComponentComparisonTableRowFields>
