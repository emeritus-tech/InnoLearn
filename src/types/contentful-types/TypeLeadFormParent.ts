import type { Entry, EntryFields } from 'contentful'
import type { TypeCallToActionFields } from './TypeCallToAction'
import type { TypeFormFieldInputFields } from './TypeFormFieldInput'
import type { TypeFormFieldSelectFields } from './TypeFormFieldSelect'
import type { TypeFormGroupRadioFields } from './TypeFormGroupRadio'

export interface TypeLeadFormParentFields {
  contentfulName?: EntryFields.Symbol
  formTitle?: EntryFields.Symbol
  description?: EntryFields.Text
  fieldList: Entry<TypeFormFieldInputFields | TypeFormFieldSelectFields | TypeFormGroupRadioFields>[]
  successRedirectUrl?: EntryFields.Symbol
  errorRedirectUrl: EntryFields.Symbol
  implicitConsent?: EntryFields.Boolean
  submitCta: Entry<TypeCallToActionFields>
  implicitConsentTextOverride?: EntryFields.Symbol
  explicitConsentTextOverride?: EntryFields.Symbol
  privacyPolicyLink?: EntryFields.Symbol
  backgroundVariant?:
    | 'background-primary_cta-reverse'
    | 'background-primary_cta-secondary'
    | 'background-reverse_cta-primary'
    | 'background-reverse_cta-secondary'
    | 'background-secondary_cta-primary'
    | 'background-secondary_cta-reverse'
    | 'background-white_cta-primary'
    | 'background-white_cta-secondary'
    | 'background-white_cta-reverse'
}

export type TypeLeadFormParent = Entry<TypeLeadFormParentFields>
