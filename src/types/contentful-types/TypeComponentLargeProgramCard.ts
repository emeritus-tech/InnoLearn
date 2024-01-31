import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeComponentButtonFields } from './TypeComponentButton'
import type { TypeLeadFormParentFields } from './TypeLeadFormParent'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentLargeProgramCardFields {
  contentfulName?: EntryFields.Symbol
  heading: EntryFields.Symbol
  image?: Asset
  seoImage?: Entry<TypeSeoImageFields>
  introText?: EntryFields.Symbol
  startsOnLabel?: EntryFields.Symbol
  startsOnValue?: EntryFields.Symbol
  durationLabel?: EntryFields.Symbol
  durationValue?: EntryFields.Symbol
  costLabel?: EntryFields.Symbol
  costValue?: EntryFields.Symbol
  costOption?: 'List Price' | 'Round Discounted Price'
  roundDetailsInfo?: EntryFields.RichText
  features?: EntryFields.RichText
  imagePosition?: 'Left' | 'Right'
  figureCaption?: EntryFields.Symbol
  cta?: Entry<TypeComponentButtonFields>
  collaborationText?: EntryFields.Symbol
  seoCollaborationImage?: Entry<TypeSeoImageFields>
  programs: Entry<Record<string, any>>
  trackpointMeta?: EntryFields.Object
  leadForm?: Entry<TypeLeadFormParentFields>
}

export type TypeComponentLargeProgramCard = Entry<TypeComponentLargeProgramCardFields>
