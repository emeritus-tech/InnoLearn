import { LocaleListType } from 'types/LocaleListType'
import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSectionFooterFields } from './TypeSectionFooter'
import type { TypeSectionHeaderFields } from './TypeSectionHeader'
import type { TypeSectionHeroPartnersFields } from './TypeSectionHeroPartners'
import type { TypeSectionModuleFields } from './TypeSectionModule'
import type { TypeSeoMetaFields } from './TypeSeoMeta'
import type { TypeUtmParamsFields } from './TypeUtmParams'

export interface TypeB2bParentTemplateFields {
  contentfulName: EntryFields.Symbol
  slug: EntryFields.Symbol
  defaultLocale?: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR'
  availableLocales?: LocaleListType
  header?: Entry<TypeSectionHeaderFields>
  sections?: Entry<TypeSectionHeroPartnersFields | TypeSectionModuleFields>[]
  footer?: Entry<TypeSectionFooterFields>
  seoMeta?: Entry<TypeSeoMetaFields>
  trackpointMeta: EntryFields.Object
  cookieBotId?: EntryFields.Symbol
  favicon?: Asset
  utmParams?: Entry<TypeUtmParamsFields>
  paymentForm?: EntryFields.Boolean
}

export type TypeB2bParentTemplate = Entry<TypeB2bParentTemplateFields>
