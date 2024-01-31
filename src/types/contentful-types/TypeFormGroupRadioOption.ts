import type { Entry, EntryFields } from 'contentful'
import type { TypeFormFieldInputFields } from './TypeFormFieldInput'
import type { TypeFormFieldSelectFields } from './TypeFormFieldSelect'

export interface TypeFormGroupRadioOptionFields {
  contentfulName?: EntryFields.Symbol
  label: EntryFields.Symbol
  fieldList: Entry<TypeFormFieldInputFields | TypeFormFieldSelectFields>[]
  value?: EntryFields.Symbol
}

export type TypeFormGroupRadioOption = Entry<TypeFormGroupRadioOptionFields>
