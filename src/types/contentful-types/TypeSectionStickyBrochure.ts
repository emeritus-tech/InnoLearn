import type { Entry, EntryFields } from 'contentful'
import type { TypeComponentButtonFields } from './TypeComponentButton'
import type { TypeSectionHeaderFields } from './TypeSectionHeader'

export interface TypeSectionStickyBrochureFields {
  contentfulName?: EntryFields.Symbol
  cta?: Entry<TypeComponentButtonFields>
  backgroundColor?:
    | 'background-primary_cta-reverse'
    | 'background-primary_cta-secondary'
    | 'background-reverse_cta-primary'
    | 'background-reverse_cta-secondary'
    | 'background-secondary_cta-primary'
    | 'background-secondary_cta-reverse'
  device?: 'Default' | 'Desktop' | 'Mobile/Tablet'
  headerComponent?: Entry<TypeSectionHeaderFields>
}

export type TypeSectionStickyBrochure = Entry<TypeSectionStickyBrochureFields>
