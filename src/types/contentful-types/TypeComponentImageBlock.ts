import type { Asset, Entry, EntryFields } from 'contentful'
import type { TypeSeoImageFields } from './TypeSeoImage'

export interface TypeComponentImageBlockFields {
  contentfulName?: EntryFields.Symbol
  image?: Asset
  seoImage?: Entry<TypeSeoImageFields>
  mobileImage?: Asset
  seoMobileImage?: Entry<TypeSeoImageFields>
  imageBlockSize?: 'large' | 'medium' | 'small'
  body?: EntryFields.RichText
}

export type TypeComponentImageBlock = Entry<TypeComponentImageBlockFields>
