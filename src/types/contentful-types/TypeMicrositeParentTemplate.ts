import { LocaleListType } from 'types/LocaleListType'
import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeBlogHomeTemplateFields } from './TypeBlogHomeTemplate'
import type { TypeChildPageTemplateFields } from './TypeChildPageTemplate'
import type { TypeLanding_pagesFields } from './TypeLanding_pages'
import type { TypeSectionFooterFields } from './TypeSectionFooter'
import type { TypeSectionHeaderFields } from './TypeSectionHeader'
import type { TypeUtmParamsFields } from './TypeUtmParams'

export interface TypeMicrositeParentTemplateFields {
  contentfulName: EntryFields.Symbol
  landingPage?: Entry<TypeLanding_pagesFields>
  slug: EntryFields.Symbol
  defaultLocale?: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR'
  availableLocales?: LocaleListType
  header?: Entry<TypeSectionHeaderFields>
  footer?: Entry<TypeSectionFooterFields>
  pages: Entry<TypeChildPageTemplateFields>[]
  coursePages?: Entry<TypeChildPageTemplateFields>[]
  blogHomePage?: Entry<TypeBlogHomeTemplateFields>
  utmParams?: Entry<TypeUtmParamsFields>
  favicon?: Asset
  cookieBotId?: EntryFields.Symbol
  trackpointMeta: EntryFields.Object
  host?: EntryFields.Symbol
}

export type TypeMicrositeParentTemplate = Entry<TypeMicrositeParentTemplateFields>
