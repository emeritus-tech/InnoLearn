import type { Entry, EntryFields } from 'contentful'
import type { TypeSectionHeroProgramMicroSitesFields } from './TypeSectionHeroProgramMicroSites'
import type { TypeSectionModuleFields } from './TypeSectionModule'
import type { TypeSeoMetaFields } from './TypeSeoMeta'

export interface TypeProgramMicrositeChildTemplateFields {
  contentfulName?: EntryFields.Symbol
  slug?: EntryFields.Symbol
  pageSections?: Entry<TypeSectionHeroProgramMicroSitesFields | TypeSectionModuleFields>[]
  seoMeta?: Entry<TypeSeoMetaFields>
  trackpointMeta?: EntryFields.Object
  screenName?:
    | 'application_details_page'
    | 'curriculum_page'
    | 'faculty_page'
    | 'home_page'
    | 'information_session_page'
    | 'participants_page'
    | 'thank_you_page'
}

export type TypeProgramMicrositeChildTemplate = Entry<TypeProgramMicrositeChildTemplateFields>
