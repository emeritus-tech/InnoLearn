import type { Entry, EntryFields } from 'contentful'
import type { TypeComponentModalLinkTypeFields } from './TypeComponentModalLinkType'
import type { TypeComponentProgramOtherInfoSectionFields } from './TypeComponentProgramOtherInfoSection'

export interface TypeComponentProgramInfoLabelFields {
  contentfulName?: EntryFields.Symbol
  startDateLabel?: EntryFields.Symbol
  startDateSubtext?: EntryFields.Symbol
  lastDayEnrollLabel?: EntryFields.Symbol
  durationLabel?: EntryFields.Symbol
  programFeeLabel?: EntryFields.Symbol
  applicationFee?: EntryFields.Symbol
  programFeeSubText?: EntryFields.Symbol
  programFeeLink?: Entry<TypeComponentModalLinkTypeFields>
  programTextModal?: Entry<TypeComponentModalLinkTypeFields>[]
  programMoreInfoSection?: Entry<TypeComponentProgramOtherInfoSectionFields>
}

export type TypeComponentProgramInfoLabel = Entry<TypeComponentProgramInfoLabelFields>
