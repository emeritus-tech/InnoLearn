import LeadForm from 'pres/common/components/lead-form'
import { TypeLeadFormParent, TypeProgram } from 'types/contentful-types'

interface LeadFormSectionProps {
  program?: TypeProgram
  leadFormFields?: TypeLeadFormParent
  formTitle?: string
  forceB2B?: boolean
  sectionDetails?: { sectionName?: string; sectionTitle?: string }
  inquiringId?: string
  horizontalView?: boolean
  forceB2C?: boolean
}

const LeadFormSection = (props: LeadFormSectionProps) => {
  const { program, leadFormFields, formTitle, forceB2B, inquiringId, sectionDetails, horizontalView, forceB2C } = props
  return leadFormFields ? (
    <LeadForm
      schoolName={program?.fields?.school?.fields?.name || ''}
      errorRedirectUrl={leadFormFields?.fields?.errorRedirectUrl || '/'}
      successRedirectUrl={leadFormFields?.fields?.successRedirectUrl}
      fieldList={leadFormFields.fields?.fieldList}
      submitCta={leadFormFields.fields?.submitCta}
      implicitConsent={leadFormFields.fields?.implicitConsent || true}
      schoolCountry={program?.fields?.school?.fields.country}
      programLanguage={program?.fields.language}
      formTitle={formTitle || ''}
      programId={program?.fields?.id || 0}
      programSfid={program?.fields?.sfid || ''}
      gdprType={program?.fields?.school?.fields.gdpr_type}
      nonGdprMoreCautiousType={program?.fields?.school?.fields.non_gdpr_more_cautious_type}
      nonGdprLessCautiousType={program?.fields?.school?.fields.non_gdpr_less_cautious_type}
      forceB2B={forceB2B}
      sectionDetails={sectionDetails}
      inquiringId={inquiringId}
      implicitConsentTextOverride={leadFormFields.fields.implicitConsentTextOverride}
      explicitConsentTextOverride={leadFormFields.fields.explicitConsentTextOverride}
      privacyPolicyLink={leadFormFields.fields?.privacyPolicyLink || ''}
      horizontalView={horizontalView}
      description={leadFormFields.fields?.description || ''}
      forceB2C={forceB2C}
      backgroundVariant={leadFormFields.fields?.backgroundVariant}
    />
  ) : null
}

export default LeadFormSection
