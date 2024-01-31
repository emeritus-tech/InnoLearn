import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeComponentProgramInfoLabelFields } from './TypeComponentProgramInfoLabel'
import type { TypeComponentProgramRoundsFields } from './TypeComponentProgramRounds'
import type { TypeDynamicRibbonFields } from './TypeDynamicRibbon'
import type { TypeProgramFields } from './TypeProgram'
import type { TypeSchoolFields } from './TypeSchool'
import type { TypeSectionApplyNowBannerFields } from './TypeSectionApplyNowBanner'
import type { TypeSectionFooterFields } from './TypeSectionFooter'
import type { TypeSectionHeaderFields } from './TypeSectionHeader'
import type { TypeSectionLandingHeroFields } from './TypeSectionLandingHero'
import type { TypeSectionModuleFields } from './TypeSectionModule'
import type { TypeSectionReferralHeroFields } from './TypeSectionReferralHero'
import type { TypeSeoMetaFields } from './TypeSeoMeta'
import type { TypeThankYouParentFields } from './TypeThankYouParent'
import type { TypeUtmParamsFields } from './TypeUtmParams'

export interface TypeReferralPageParentTemplateFields {
  contentfulName: EntryFields.Symbol
  slug: EntryFields.Symbol
  defaultLocale?: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR'
  availableLocales: ('en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR')[]
  dynamicRibbon?: Entry<TypeDynamicRibbonFields>
  header?: Entry<TypeSectionHeaderFields>
  sections?: Entry<
    | TypeComponentProgramInfoLabelFields
    | TypeComponentProgramRoundsFields
    | TypeSectionLandingHeroFields
    | TypeSectionModuleFields
    | TypeSectionReferralHeroFields
  >[]
  applyNow?: Entry<TypeSectionApplyNowBannerFields>
  footer?: Entry<TypeSectionFooterFields>
  seoMeta?: Entry<TypeSeoMetaFields>
  trackpointMeta: EntryFields.Object
  program?: Entry<TypeProgramFields>
  cookieBotId?: EntryFields.Symbol
  favicon?: Asset
  utmParams?: Entry<TypeUtmParamsFields>
  school?: Entry<TypeSchoolFields>
  thankYou?: Entry<TypeThankYouParentFields>
}

export type TypeReferralPageParentTemplate = Entry<TypeReferralPageParentTemplateFields>
