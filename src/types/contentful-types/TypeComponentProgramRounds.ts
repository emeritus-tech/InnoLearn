import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentProgramRoundsFields {
  contentfulName?: EntryFields.Symbol
  title?: EntryFields.Symbol
  introText?: EntryFields.RichText
  subText?: EntryFields.Symbol
  roundInfoText?: EntryFields.Symbol
  disclaimer?: EntryFields.RichText
}

export type TypeComponentProgramRounds = Entry<TypeComponentProgramRoundsFields>
