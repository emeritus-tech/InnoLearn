import type { Entry, EntryFields } from 'contentful'

export interface TypeSchoolFields {
  id?: EntryFields.Number
  programs?: Entry<Record<string, any>>[]
  logo_web?: EntryFields.Symbol
  host_name?: EntryFields.Symbol
  vanity_host_name?: EntryFields.Symbol
  name?: EntryFields.Symbol
  translation_key?: EntryFields.Symbol
  favicon?: EntryFields.Symbol
  country?: EntryFields.Symbol
  gdpr_type?: EntryFields.Symbol
  non_gdpr_less_cautious_type?: EntryFields.Symbol
  non_gdpr_more_cautious_type?: EntryFields.Symbol
}

export type TypeSchool = Entry<TypeSchoolFields>
