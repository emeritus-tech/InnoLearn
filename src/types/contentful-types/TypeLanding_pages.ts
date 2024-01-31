import type { Entry, EntryFields } from 'contentful'

export interface TypeLanding_pagesFields {
  school?: Entry<Record<string, any>>
  id?: EntryFields.Number
  program?: Entry<Record<string, any>>
  course_title?: EntryFields.Symbol
  name?: EntryFields.Symbol
  slug?: EntryFields.Symbol
  hero_image?: EntryFields.Symbol
  hero_image_mobile?: EntryFields.Symbol
  published?: EntryFields.Boolean
}

export type TypeLanding_pages = Entry<TypeLanding_pagesFields>
