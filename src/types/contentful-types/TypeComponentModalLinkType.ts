import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentModalLinkTypeFields {
  contentfulName?: EntryFields.Symbol
  label?: EntryFields.Symbol
  linkType: 'B2BLeadForm' | 'Faculty' | 'LeadForm' | 'Payment' | 'Referral' | 'TextModal'
  modalSubtext?: EntryFields.Symbol
  title?: EntryFields.Symbol
  description?: EntryFields.RichText
}

export type TypeComponentModalLinkType = Entry<TypeComponentModalLinkTypeFields>
