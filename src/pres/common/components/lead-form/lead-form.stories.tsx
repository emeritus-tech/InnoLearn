import { defaultLeadFormProps } from '__test__/mocks/partnerPage/sections/lead-form'
import LeadForm, { LeadFormProps } from './lead-form'

export default {
  title: 'LeadForm',
  component: LeadForm
}

export const Default = () => <LeadForm {...(defaultLeadFormProps as any as LeadFormProps)} />

export const HorizontalHeroView = () => <LeadForm horizontalView={true} {...(defaultLeadFormProps as any as LeadFormProps)} />
