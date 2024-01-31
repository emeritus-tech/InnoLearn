import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeLeadFormParentFields } from './TypeLeadFormParent'
import type { TypeOpenGraphMetaFields } from './TypeOpenGraphMeta'
import type { TypeProgramFields } from './TypeProgram'
import type { TypeProgramMicrositeChildTemplateFields } from './TypeProgramMicrositeChildTemplate'
import type { TypeSectionFooterFields } from './TypeSectionFooter'
import type { TypeSectionHeaderFields } from './TypeSectionHeader'
import type { TypeSectionStickyBrochureFields } from './TypeSectionStickyBrochure'
import type { TypeThankYouParentFields } from './TypeThankYouParent'
import type { TypeUtmParamsFields } from './TypeUtmParams'

export interface TypeProgramMicrositeParentTemplateFields {
  contentfulName?: EntryFields.Symbol
  slug?: EntryFields.Symbol
  defaultLocale?: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR'
  availableLocales?: ('en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR')[]
  header?: Entry<TypeSectionHeaderFields>
  stickyHeader?: Entry<TypeSectionStickyBrochureFields>
  pages?: Entry<TypeProgramMicrositeChildTemplateFields>[]
  footer?: Entry<TypeSectionFooterFields>
  leadForm?: Entry<TypeLeadFormParentFields>
  thankYou?: Entry<TypeThankYouParentFields>
  b2bThankYouConfig?: Entry<TypeThankYouParentFields>
  utmParams?: Entry<TypeUtmParamsFields>
  favicon?: Asset
  cookieBotId?: EntryFields.Symbol
  trackPointMeta?: EntryFields.Object
  program?: Entry<TypeProgramFields>
  openGraphMeta?: Entry<TypeOpenGraphMetaFields>
}

export type TypeProgramMicrositeParentTemplate = Entry<TypeProgramMicrositeParentTemplateFields>
