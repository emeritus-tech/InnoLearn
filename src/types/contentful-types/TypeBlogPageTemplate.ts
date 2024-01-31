import { Block, Inline } from '@contentful/rich-text-types'
import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeImageAndLinkFields } from './TypeImageAndLink'
import type { TypeSeoImageFields } from './TypeSeoImage'
import type { TypeSeoMetaFields } from './TypeSeoMeta'

export interface TypeBlogPageTemplateFields {
  contentfulName?: EntryFields.Symbol
  slug?: EntryFields.Symbol
  breadcrumb?: EntryFields.Symbol
  heroImage?: Asset
  seoHeroImage?: Entry<TypeSeoImageFields>
  title?: EntryFields.Symbol
  date?: EntryFields.Date
  category?: EntryFields.Symbol
  socialMedia?: Entry<TypeImageAndLinkFields>[]
  body?: Block | Inline
  relatedPosts?: Entry<TypeBlogPageTemplateFields>[]
  seoMeta?: Entry<TypeSeoMetaFields>
  trackpointMeta: EntryFields.Object
}

export type TypeBlogPageTemplate = Entry<TypeBlogPageTemplateFields>
