import type { Entry, EntryFields } from 'contentful'
import type { TypeComponentProgramInfoLabelFields } from './TypeComponentProgramInfoLabel'
import type { TypeComponentProgramRoundsFields } from './TypeComponentProgramRounds'
import type { TypeDynamicRibbonFields } from './TypeDynamicRibbon'
import type { TypeSectionLandingHeroFields } from './TypeSectionLandingHero'
import type { TypeSectionModuleFields } from './TypeSectionModule'

export interface TypeLandingPageChildPageTemplateFields {
  contentfulName?: EntryFields.Symbol
  slug?: EntryFields.Symbol
  dynamicRibbon?: Entry<TypeDynamicRibbonFields>
  pageSections?: Entry<
    TypeComponentProgramInfoLabelFields | TypeComponentProgramRoundsFields | TypeSectionLandingHeroFields | TypeSectionModuleFields
  >[]
  trackpointMeta?: EntryFields.Object
}

export type TypeLandingPageChildPageTemplate = Entry<TypeLandingPageChildPageTemplateFields>
