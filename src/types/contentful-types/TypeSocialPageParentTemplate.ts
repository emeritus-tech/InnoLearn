import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeDynamicRibbonFields } from './TypeDynamicRibbon'
import type { TypeOpenGraphMetaFields } from './TypeOpenGraphMeta'
import type { TypeSchoolFields } from './TypeSchool'
import type { TypeSectionFooterFields } from './TypeSectionFooter'
import type { TypeSectionHeaderFields } from './TypeSectionHeader'
import type { TypeSectionModuleFields } from './TypeSectionModule'
import type { TypeSectionReferralHeroFields } from './TypeSectionReferralHero'
import type { TypeSeoMetaFields } from './TypeSeoMeta'
import type { TypeUtmParamsFields } from './TypeUtmParams'

export interface TypeSocialPageParentTemplateFields {
  contentfulName?: EntryFields.Symbol
  slug: EntryFields.Symbol
  defaultLocale?: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR'
  availableLocales?: ('en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR')[]
  dynamicRibbon?: Entry<TypeDynamicRibbonFields>
  header?: Entry<TypeSectionHeaderFields>
  sections?: Entry<TypeSectionModuleFields | TypeSectionReferralHeroFields>[]
  footer?: Entry<TypeSectionFooterFields>
  seoMeta?: Entry<TypeSeoMetaFields>
  trackpointMeta?: EntryFields.Object
  school?: Entry<TypeSchoolFields>
  cookieBotId?: EntryFields.Symbol
  favicon?: Asset
  utmParams?: Entry<TypeUtmParamsFields>
  openGraphMeta?: Entry<TypeOpenGraphMetaFields>
  collapsedProgramCardsMobile?: EntryFields.Boolean
  ctaConfiguration?: 'primary' | 'reverse' | 'secondary'
  isReferralParamRequired?: EntryFields.Boolean
}

export type TypeSocialPageParentTemplate = Entry<TypeSocialPageParentTemplateFields>
