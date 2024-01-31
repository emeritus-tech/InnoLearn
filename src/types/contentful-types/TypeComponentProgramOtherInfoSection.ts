import type { Entry, EntryFields } from 'contentful'
import type { TypeComponentModalLinkTypeFields } from './TypeComponentModalLinkType'

export interface TypeComponentProgramOtherInfoSectionFields {
  contentfulName?: EntryFields.Symbol
  label?: EntryFields.Symbol
  subText?: EntryFields.Symbol
  linkType?: Entry<TypeComponentModalLinkTypeFields>
  description?: EntryFields.Symbol
}

export type TypeComponentProgramOtherInfoSection = Entry<TypeComponentProgramOtherInfoSectionFields>
