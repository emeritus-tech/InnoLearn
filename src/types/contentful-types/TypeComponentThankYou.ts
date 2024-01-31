import type { Entry, EntryFields } from 'contentful'

export interface TypeComponentThankYouFields {
  contentfulName?: EntryFields.Symbol
  title?: EntryFields.Symbol
  subText?: EntryFields.Symbol
  linkType?: 'download brochure' | 'email' | 'phone' | 'referral' | 'whatsapp'
  link?: EntryFields.Symbol
  openInNewTab?: EntryFields.Boolean
}

export type TypeComponentThankYou = Entry<TypeComponentThankYouFields>
