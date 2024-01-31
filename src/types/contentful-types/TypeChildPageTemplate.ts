import type { Entry, EntryFields } from 'contentful'
import type { TypeSectionHeroFields } from './TypeSectionHero'
import type { TypeSectionModuleFields } from './TypeSectionModule'
import type { TypeSeoMetaFields } from './TypeSeoMeta'

export interface TypeChildPageTemplateFields {
  contentfulName: EntryFields.Symbol
  slug: EntryFields.Symbol
  pageSections: Entry<TypeSectionHeroFields | TypeSectionModuleFields>[]
  preventProgramsFromCollapsing?: EntryFields.Boolean
  seoMeta?: Entry<TypeSeoMetaFields>
  trackpointMeta: EntryFields.Object
}

export type TypeChildPageTemplate = Entry<TypeChildPageTemplateFields>
