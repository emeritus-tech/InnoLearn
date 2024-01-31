import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSchoolFields } from './TypeSchool'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentPartnerLogoFields {
  contentfulName: EntryFields.Symbol
  school?: Entry<TypeSchoolFields>
  logo: Asset
  seoLogo?: Entry<TypeSeoImageFields>
}

export type TypeComponentPartnerLogo = Entry<TypeComponentPartnerLogoFields>
