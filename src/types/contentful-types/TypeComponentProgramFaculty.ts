import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentProgramFacultyFields {
  contentfulName?: EntryFields.Symbol
  facultyName: EntryFields.Symbol
  designation?: EntryFields.Symbol
  image?: Asset
  seoImage?: Entry<TypeSeoImageFields>
  moreInfoLabel?: EntryFields.Symbol
  bio?: EntryFields.Text
}

export type TypeComponentProgramFaculty = Entry<TypeComponentProgramFacultyFields>
