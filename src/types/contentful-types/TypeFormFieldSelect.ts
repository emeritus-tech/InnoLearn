import type { Entry, EntryFields } from 'contentful'
import type { TypeFormSelectOptionsFields } from './TypeFormSelectOptions'

export interface TypeFormFieldSelectFields {
  contentfulName?: EntryFields.Symbol
  label: EntryFields.Symbol
  attributeName: 'country' | 'number_of_participants' | 'qualification' | 'work_experience'
  fieldType?: 'country' | 'generic' | 'qualification' | 'workExperience'
  defaultValue?: Entry<TypeFormSelectOptionsFields>
  required: EntryFields.Boolean
  optionList?: Entry<TypeFormSelectOptionsFields>[]
  infoModal?: EntryFields.RichText
}

export type TypeFormFieldSelect = Entry<TypeFormFieldSelectFields>
