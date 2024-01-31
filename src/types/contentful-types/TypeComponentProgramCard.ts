import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeLanding_pagesFields } from './TypeLanding_pages'
import type { TypeProgramFields } from './TypeProgram'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentProgramCardFields {
  contentfulName: EntryFields.Symbol
  landingPage?: Entry<TypeLanding_pagesFields>
  schoolName?: EntryFields.Symbol
  schoolLogo?: Asset
  seoSchoolLogo?: Entry<TypeSeoImageFields>
  courseName?: EntryFields.Symbol
  programSfid?: EntryFields.Symbol
  landingPageId?: EntryFields.Integer
  title?: EntryFields.Symbol
  subtitle?: EntryFields.Symbol
  startsOnLabel?: EntryFields.Symbol
  imageicon?: Asset
  seoImageIcon?: Entry<TypeSeoImageFields>
  mobileImage?: Asset
  seoMobileImage?: Entry<TypeSeoImageFields>
  url?: EntryFields.Symbol
  id?: EntryFields.Integer
  lastDayToEnrollLabel?: EntryFields.Symbol
  program?: Entry<TypeProgramFields>
}

export type TypeComponentProgramCard = Entry<TypeComponentProgramCardFields>
