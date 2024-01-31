import type { Entry, EntryFields } from 'contentful'
import type { TypeCallToActionFields } from './TypeCallToAction'
import type { TypeLanding_pagesFields } from './TypeLanding_pages'

export interface TypeDynamicRibbonFields {
  contentfulName: EntryFields.Symbol
  mainCopy: EntryFields.Symbol
  landingPages?: Entry<TypeLanding_pagesFields>[]
  landingPageTemplateIds: EntryFields.Symbol[]
  cta?: Entry<TypeCallToActionFields>
  relativeDaysBatchStartDate: EntryFields.Integer
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
  experiments?: EntryFields.Symbol[]
  eventType: 'referral'
  background?: 'background' | 'background-primary_cta-secondary' | 'background-reverse_cta-primary' | 'background-secondary_cta-primary'
}

export type TypeDynamicRibbon = Entry<TypeDynamicRibbonFields>
