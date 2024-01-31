import { LocaleListType } from 'types/LocaleListType'
import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeComponentProgramInfoLabelFields } from './TypeComponentProgramInfoLabel'
import type { TypeComponentProgramRoundsFields } from './TypeComponentProgramRounds'
import type { TypeDynamicRibbonFields } from './TypeDynamicRibbon'
import type { TypeLandingPageChildPageTemplateFields } from './TypeLandingPageChildPageTemplate'
import type { TypeLeadFormParentFields } from './TypeLeadFormParent'
import type { TypeOpenGraphMetaFields } from './TypeOpenGraphMeta'
import type { TypeProgramFields } from './TypeProgram'
import type { TypeSchoolFields } from './TypeSchool'
import type { TypeSectionApplyNowBannerFields } from './TypeSectionApplyNowBanner'
import type { TypeSectionFooterFields } from './TypeSectionFooter'
import type { TypeSectionHeaderFields } from './TypeSectionHeader'
import type { TypeSectionLandingHeroFields } from './TypeSectionLandingHero'
import type { TypeSectionModuleFields } from './TypeSectionModule'
import type { TypeSectionStickyBrochureFields } from './TypeSectionStickyBrochure'
import type { TypeSeoMetaFields } from './TypeSeoMeta'
import type { TypeThankYouParentFields } from './TypeThankYouParent'
import type { TypeUtmParamsFields } from './TypeUtmParams'

export interface TypeLandingPageParentTemplateFields {
  contentfulName: EntryFields.Symbol
  slug: EntryFields.Symbol
  defaultLocale?: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR'
  availableLocales?: LocaleListType
  dynamicRibbon?: Entry<TypeDynamicRibbonFields>
  header?: Entry<TypeSectionHeaderFields>
  sections?: Entry<
    TypeComponentProgramInfoLabelFields | TypeComponentProgramRoundsFields | TypeSectionLandingHeroFields | TypeSectionModuleFields
  >[]
  applyNow?: Entry<TypeSectionApplyNowBannerFields>
  footer?: Entry<TypeSectionFooterFields>
  stickyBrochure?: Entry<TypeSectionStickyBrochureFields>
  seoMeta?: Entry<TypeSeoMetaFields>
  seoSchema?: EntryFields.Object
  trackpointMeta: EntryFields.Object
  program?: Entry<TypeProgramFields>
  leadForm?: Entry<TypeLeadFormParentFields>
  cookieBotId?: EntryFields.Symbol
  favicon?: Asset
  utmParams?: Entry<TypeUtmParamsFields>
  school?: Entry<TypeSchoolFields>
  thankYou?: Entry<TypeThankYouParentFields>
  b2bThankYouConfig?: Entry<TypeThankYouParentFields>
  pages?: Entry<TypeLandingPageChildPageTemplateFields>[]
  openGraphMeta?: Entry<TypeOpenGraphMetaFields>
}

export type TypeLandingPageParentTemplate = Entry<TypeLandingPageParentTemplateFields>
