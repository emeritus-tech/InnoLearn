import type { Entry, EntryFields } from 'contentful'

export interface TypeProgramFields {
  id?: EntryFields.Number
  school?: Entry<Record<string, any>>
  description?: EntryFields.Symbol
  name?: EntryFields.Symbol
  sfid?: EntryFields.Symbol
  wrike_course_code?: EntryFields.Symbol
  current_batch_duration?: EntryFields.Symbol
  workload?: EntryFields.Symbol
  default_deadline_days?: EntryFields.Number
  default_deadline_extension_days?: EntryFields.Number
  end_time?: EntryFields.Symbol
  language?: EntryFields.Symbol
  show_original_price?: EntryFields.Boolean
  entity_host_name?: EntryFields.Symbol
}

export type TypeProgram = Entry<TypeProgramFields>
