import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentProgramTestimonialFields {
  contentfulName?: EntryFields.Symbol
  name: EntryFields.Symbol
  designation: EntryFields.Symbol
  company?: EntryFields.Symbol
  testimonialBody: EntryFields.Text
  image?: Asset
  seoImage?: Entry<TypeSeoImageFields>
}

export type TypeComponentProgramTestimonial = Entry<TypeComponentProgramTestimonialFields>
