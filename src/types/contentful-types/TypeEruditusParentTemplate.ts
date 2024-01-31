import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeDynamicRibbonFields } from './TypeDynamicRibbon'
import type { TypeOpenGraphMetaFields } from './TypeOpenGraphMeta'
import type { TypeSectionHeaderFields } from './TypeSectionHeader'
import type { TypeSectionHeroPartnersFields } from './TypeSectionHeroPartners'
import type { TypeSectionLongFooterFields } from './TypeSectionLongFooter'
import type { TypeSectionModuleFields } from './TypeSectionModule'
import type { TypeSeoMetaFields } from './TypeSeoMeta'
import type { TypeUtmParamsFields } from './TypeUtmParams'

export interface TypeEruditusParentTemplateFields {
  contentfulName?: EntryFields.Symbol
  slug: EntryFields.Symbol
  defaultLocale?: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR'
  availableLocales: ('en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR')[]
  dynamicRibbon?: Entry<TypeDynamicRibbonFields>
  header?: Entry<TypeSectionHeaderFields>
  sections?: Entry<TypeSectionHeroPartnersFields | TypeSectionModuleFields>[]
  footer?: Entry<TypeSectionLongFooterFields>
  favicon?: Asset
  seoMeta?: Entry<TypeSeoMetaFields>
  trackpointMeta: EntryFields.Object
  usercentricSettingId?: EntryFields.Symbol
  utmParams?: Entry<TypeUtmParamsFields>
  openGraphMeta?: Entry<TypeOpenGraphMetaFields>
}

export type TypeEruditusParentTemplate = Entry<TypeEruditusParentTemplateFields>
