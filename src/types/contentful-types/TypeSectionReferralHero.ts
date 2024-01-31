import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeComponentButtonFields } from './TypeComponentButton'
import type { TypeFormFieldInputFields } from './TypeFormFieldInput'

export interface TypeSectionReferralHeroFields {
  contentfulName: EntryFields.Symbol
  title?: EntryFields.Symbol
  subTitle?: EntryFields.Symbol
  imageBackground?:
    | 'accent'
    | 'accent-gradient'
    | 'black'
    | 'black-gradient'
    | 'gradient'
    | 'primary'
    | 'primary-gradient'
    | 'secondary'
    | 'secondary-gradient'
  desktopImage?: Asset
  mobileImage?: Asset
  formFieldInput?: Entry<TypeFormFieldInputFields>
  ctaBranding?: 'primary' | 'reverse' | 'secondary'
  cta?: Entry<TypeComponentButtonFields>
  isSmall?: EntryFields.Boolean
}

export type TypeSectionReferralHero = Entry<TypeSectionReferralHeroFields>
