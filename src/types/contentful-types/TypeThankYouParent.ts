import type { Entry, EntryFields } from 'contentful'
import type { TypeComponentButtonFields } from './TypeComponentButton'
import type { TypeComponentThankYouFields } from './TypeComponentThankYou'

export interface TypeThankYouParentFields {
  contentfulName?: EntryFields.Symbol
  title?: EntryFields.Symbol
  greetingText?: EntryFields.Symbol
  iconList?: Entry<TypeComponentThankYouFields>[]
  cta?: Entry<TypeComponentButtonFields>
}

export type TypeThankYouParent = Entry<TypeThankYouParentFields>
