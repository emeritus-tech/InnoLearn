import { useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { SECTION_NAMES } from 'constants/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import LeadFormSection from 'pres/common/components/lead-form-section'
import Section from 'pres/common/components/section'
import ThankYou from 'pres/common/components/success'
import { parseToSectionId } from 'utils/common'
import { COLOR_MAP } from 'constants/contentful'

interface MicroSiteLeadFormProps {
  horizontalView?: boolean
}
function MicroSiteLeadForm({ horizontalView }: MicroSiteLeadFormProps) {
  const title = 'BottomLeadForm'
  const { query } = useRouter()
  const { leadFormFields, program, programCourseRun, thankYouFields, b2bThankYouFields, isMicrositeThankyouPage, screenName } =
    useContext(PageLayoutContext)
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const horizontalClass = isMicrositeThankyouPage ? 'ty-cntr-white-horizontal' : horizontalView ? 'ty-cntr-primary-horizontal' : ''
  const horizontalParentClass = horizontalView
    ? query?.thank_you && (thankYouFields || b2bThankYouFields)
      ? 'col-xl-10 col-lg-12 col-12 right-col m-t-lg-0 p-l-sm-0 p-r-sm-0 m-auto overflow-hidden'
      : 'col-xl-8 col-lg-10 col-md-12 right-col m-t-30 m-t-lg-0 m-auto'
    : 'col-12 col-lg-5 right-col m-t-30 m-t-lg-0'

  const backgroundClass = isMicrositeThankyouPage
    ? 'ty-cntr-white-horizontal'
    : COLOR_MAP[leadFormFields?.fields.backgroundVariant || 'background-primary_cta-secondary']
  return (
    <div className="lp-colored--list">
      <Section id={`${sectionId}`} className={cn('section_section-container__commonPY', backgroundClass)}>
        <div className="container position-relative">
          <div className={horizontalParentClass}>
            <div className={cn('lead-form', horizontalClass)}>
              {!((query?.thank_you || isMicrositeThankyouPage) && (thankYouFields || b2bThankYouFields)) ? (
                <LeadFormSection
                  program={program}
                  leadFormFields={leadFormFields}
                  formTitle={leadFormFields?.fields?.formTitle}
                  sectionDetails={{ sectionName: SECTION_NAMES.HERO }}
                  inquiringId={`${sectionId}`}
                  horizontalView={horizontalView}
                />
              ) : null}
              {(query?.thank_you || isMicrositeThankyouPage) && (thankYouFields || b2bThankYouFields) ? (
                <ThankYou
                  b2cThankYouFields={thankYouFields}
                  b2bThankYouFields={b2bThankYouFields}
                  programCourseRun={programCourseRun}
                  program={program}
                  isMicrositeThankyouPage={isMicrositeThankyouPage}
                  screenName={screenName}
                />
              ) : null}
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default MicroSiteLeadForm
