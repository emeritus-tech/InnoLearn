import type { Block, Inline } from '@contentful/rich-text-types'
import type { Entry, EntryFields } from 'contentful'
import type { TypeLanding_pagesFields } from './TypeLanding_pages'

export interface TypeGenericSectionFields {
  contentfulName: EntryFields.Symbol
  title?: EntryFields.Symbol
  mainText: Block | Inline
  sectionName: 'contact'
  landingPages?: Entry<TypeLanding_pagesFields>[]
  landingPageTemplateIds?: EntryFields.Symbol[]
  subText?: EntryFields.Symbol
  pageTypes?: (
    | 'apply'
    | 'b2b_form'
    | 'b2b_no_form'
    | 'b2b_thank_you'
    | 'b2c_form'
    | 'b2c_thank_you'
    | 'electives'
    | 'landing'
    | 'microsite_child'
    | 'thank_you'
  )[]
}

export type TypeGenericSection = Entry<TypeGenericSectionFields>
