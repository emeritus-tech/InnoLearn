import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeComponentButtonFields } from './TypeComponentButton'

export interface TypeSectionHeroProgramMicroSitesFields {
  contentfulName: EntryFields.Symbol
  heroImage: Asset
  title?: EntryFields.Symbol
  subTitle?: EntryFields.Symbol
  paragraphText?: EntryFields.Text
  cta?: Entry<TypeComponentButtonFields>
  startDateLabel?: EntryFields.Symbol
  lastDateToEnrolLabel?: EntryFields.Symbol
  tuitionFeeLabel?: EntryFields.Symbol
  durationLabel?: EntryFields.Symbol
  backgroundVariants?:
    | 'primary-reverse'
    | 'primary-secondary'
    | 'reverse-primary'
    | 'reverse-secondary'
    | 'secondary-primary'
    | 'secondary-reverse'
}

export type TypeSectionHeroProgramMicroSites = Entry<TypeSectionHeroProgramMicroSitesFields>
