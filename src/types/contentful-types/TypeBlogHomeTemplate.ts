import type { Entry, EntryFields } from 'contentful'
import type { TypeBlogPageTemplateFields } from './TypeBlogPageTemplate'
import type { TypeSeoMetaFields } from './TypeSeoMeta'

export interface TypeBlogHomeTemplateFields {
  contentfulName?: EntryFields.Symbol
  slug: EntryFields.Symbol
  heroPost?: Entry<TypeBlogPageTemplateFields>
  featuredPosts?: Entry<TypeBlogPageTemplateFields>[]
  posts?: Entry<TypeBlogPageTemplateFields>[]
  seoMeta?: Entry<TypeSeoMetaFields>
  trackpointMeta: EntryFields.Object
}

export type TypeBlogHomeTemplate = Entry<TypeBlogHomeTemplateFields>
