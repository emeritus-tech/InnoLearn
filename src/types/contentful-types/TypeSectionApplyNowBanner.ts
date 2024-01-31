import type { Entry, EntryFields } from 'contentful'
import type { TypeComponentButtonFields } from './TypeComponentButton'
import type { TypeComponentModalLinkTypeFields } from './TypeComponentModalLinkType'
import type { TypeComponentTextBlockFields } from './TypeComponentTextBlock'

export interface TypeSectionApplyNowBannerFields {
  contentfulName?: EntryFields.Symbol
  sectionName?: EntryFields.Symbol
  title?: EntryFields.Symbol
  subTitle?: EntryFields.Symbol
  startDateLabel?: EntryFields.Symbol
  lastDayEnrollLabel?: EntryFields.Symbol
  content?: Entry<TypeComponentModalLinkTypeFields | TypeComponentTextBlockFields>[]
  backgroundColor?:
    | 'background-primary_cta-reverse'
    | 'background-primary_cta-secondary'
    | 'background-reverse_cta-primary'
    | 'background-reverse_cta-secondary'
    | 'background-secondary_cta-primary'
    | 'background-secondary_cta-reverse'
  cta?: Entry<TypeComponentButtonFields>[]
}

export type TypeSectionApplyNowBanner = Entry<TypeSectionApplyNowBannerFields>
