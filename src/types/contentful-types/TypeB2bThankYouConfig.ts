import type { Entry } from 'contentful'
import type { TypeThankYouParentFields } from './TypeThankYouParent'

export interface TypeB2bThankYouConfigFields {
  b2bThankYouPage?: Entry<TypeThankYouParentFields>
}

export type TypeB2bThankYouConfig = Entry<TypeB2bThankYouConfigFields>
