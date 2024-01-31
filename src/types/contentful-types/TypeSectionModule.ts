import type { Entry, EntryFields } from 'contentful'
import type { TypeBlogPageTemplateFields } from './TypeBlogPageTemplate'
import type { TypeComponentButtonFields } from './TypeComponentButton'
import type { TypeComponentComparisonTableRowFields } from './TypeComponentComparisonTableRow'
import type { TypeComponentCtaModalFields } from './TypeComponentCtaModal'
import type { TypeComponentExploreProgramCardFields } from './TypeComponentExploreProgramCard'
import type { TypeComponentFaqFields } from './TypeComponentFaq'
import type { TypeComponentIconWithTextDescriptionFields } from './TypeComponentIconWithTextDescription'
import type { TypeComponentImageAndTextColumnFields } from './TypeComponentImageAndTextColumn'
import type { TypeComponentImageBlockFields } from './TypeComponentImageBlock'
import type { TypeComponentLargeProgramCardFields } from './TypeComponentLargeProgramCard'
import type { TypeComponentPartnerLogoFields } from './TypeComponentPartnerLogo'
import type { TypeComponentProgramCardFields } from './TypeComponentProgramCard'
import type { TypeComponentProgramFacultyFields } from './TypeComponentProgramFaculty'
import type { TypeComponentProgramTestimonialFields } from './TypeComponentProgramTestimonial'
import type { TypeComponentQuoteFields } from './TypeComponentQuote'
import type { TypeComponentStatsFields } from './TypeComponentStats'
import type { TypeComponentTextAndIconFields } from './TypeComponentTextAndIcon'
import type { TypeComponentTextAndImageFields } from './TypeComponentTextAndImage'
import type { TypeComponentTextBlockFields } from './TypeComponentTextBlock'
import type { TypeComponentVideoFields } from './TypeComponentVideo'

export interface TypeSectionModuleFields {
  contentfulName: EntryFields.Symbol
  sectionName?: EntryFields.Symbol
  tagline?: EntryFields.Symbol
  title?: EntryFields.Symbol
  introText?: EntryFields.Text
  introCopyAlignment?: EntryFields.Boolean
  content: Entry<
    | TypeBlogPageTemplateFields
    | TypeComponentButtonFields
    | TypeComponentComparisonTableRowFields
    | TypeComponentExploreProgramCardFields
    | TypeComponentFaqFields
    | TypeComponentIconWithTextDescriptionFields
    | TypeComponentImageAndTextColumnFields
    | TypeComponentImageBlockFields
    | TypeComponentLargeProgramCardFields
    | TypeComponentPartnerLogoFields
    | TypeComponentProgramCardFields
    | TypeComponentProgramFacultyFields
    | TypeComponentProgramTestimonialFields
    | TypeComponentQuoteFields
    | TypeComponentStatsFields
    | TypeComponentTextAndIconFields
    | TypeComponentTextAndImageFields
    | TypeComponentTextBlockFields
    | TypeComponentVideoFields
  >[]
  backgroundColor?:
    | 'background'
    | 'background-primary_cta-reverse'
    | 'background-primary_cta-secondary'
    | 'background-reverse_cta-primary'
    | 'background-reverse_cta-secondary'
    | 'background-secondary_cta-primary'
    | 'background-secondary_cta-reverse'
  cta?: Entry<TypeComponentButtonFields | TypeComponentCtaModalFields>
  disclaimer?: EntryFields.RichText
  disclaimerCopyAlignment?: EntryFields.Boolean
  variant?: 'Variant-1' | 'Variant-2' | 'Variant-3' | 'Variant-4'
}

export type TypeSectionModule = Entry<TypeSectionModuleFields>
