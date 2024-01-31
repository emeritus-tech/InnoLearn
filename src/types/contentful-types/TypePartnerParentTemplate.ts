import * as Contentful from 'contentful'
import { LocaleListType } from 'types/LocaleListType'
import type { Block, Inline } from '@contentful/rich-text-types'
import type { Asset, Entry, EntryFields } from 'contentful'
import { TypeSchoolFields } from './TypeSchool'
import { TypeSectionFooterFields } from './TypeSectionFooter'
import { TypeSectionHeaderFields } from './TypeSectionHeader'
import { TypeSectionHeroPartnersFields } from './TypeSectionHeroPartners'
import { TypeSectionModuleFields } from './TypeSectionModule'
import { TypeSeoMetaFields } from './TypeSeoMeta'
import { TypeUtmParamsFields } from './TypeUtmParams'

export interface TypePartnerParentTemplateFields {
  contentfulName: Contentful.EntryFields.Symbol
  slug: Contentful.EntryFields.Symbol
  availableLocales?: LocaleListType
  defaultLocale?: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR'
  ribbonText?: Block | Inline
  header?: Entry<TypeSectionHeaderFields>
  sections?: Entry<TypeSectionHeroPartnersFields | TypeSectionModuleFields>[]
  footer?: Entry<TypeSectionFooterFields>
  seoMeta?: Entry<TypeSeoMetaFields>
  trackpointMeta: EntryFields.Object
  cookieBotId?: EntryFields.Symbol
  favicon?: Asset
  utmParams?: Entry<TypeUtmParamsFields>
  schools?: Entry<TypeSchoolFields>[]
}

export type TypePartnerParentTemplate = Entry<TypePartnerParentTemplateFields>
