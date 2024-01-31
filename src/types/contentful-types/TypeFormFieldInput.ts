import type { Entry, EntryFields } from 'contentful'

export interface TypeFormFieldInputFields {
  contentfulName?: EntryFields.Symbol
  label: EntryFields.Symbol
  attributeName: 'city' | 'company' | 'email' | 'first_name' | 'last_name' | 'phone'
  fieldType: 'city' | 'email' | 'generic' | 'phone'
  placeholder?: EntryFields.Symbol
  defaultValue?: EntryFields.Symbol
  required: EntryFields.Boolean
}

export type TypeFormFieldInput = Entry<TypeFormFieldInputFields>
