import type { Entry, EntryFields } from 'contentful'

export interface TypePhoneNumberFields {
  phoneNumber: EntryFields.Symbol
  country: EntryFields.Symbol
  eventName: EntryFields.Symbol
}

export type TypePhoneNumber = Entry<TypePhoneNumberFields>
