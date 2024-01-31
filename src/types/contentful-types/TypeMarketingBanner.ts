import type { Block, Inline } from '@contentful/rich-text-types'
import type { Entry, EntryFields } from 'contentful'
import type { TypeLanding_pagesFields } from './TypeLanding_pages'

export interface TypeMarketingBannerFields {
  displayName?: EntryFields.Symbol
  landingPages?: Entry<TypeLanding_pagesFields>[]
  landingPageTemplateIds?: EntryFields.Symbol[]
  title: EntryFields.Symbol
  description?: Block | Inline
  position: EntryFields.Integer
  backgroundColor: 'gray' | 'white'
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
}

export type TypeMarketingBanner = Entry<TypeMarketingBannerFields>
