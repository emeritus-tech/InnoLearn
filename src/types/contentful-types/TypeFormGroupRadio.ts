import type { Entry, EntryFields } from 'contentful'
import type { TypeFormGroupRadioOptionFields } from './TypeFormGroupRadioOption'

export interface TypeFormGroupRadioFields {
  contentfulName?: EntryFields.Symbol
  label: EntryFields.Symbol
  attributeName: 'inquiring_for'
  groupOptions: Entry<TypeFormGroupRadioOptionFields>[]
  defaultValue?: Entry<TypeFormGroupRadioOptionFields>
  required?: EntryFields.Boolean
}

export type TypeFormGroupRadio = Entry<TypeFormGroupRadioFields>
