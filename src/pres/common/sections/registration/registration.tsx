import { useEffect, useState, useContext } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import useTranslation from 'next-translate/useTranslation'
import Button from 'pres/common/components/button'
import CalendarIcon from 'pres/common/components/icons/calendar'
import Section from 'pres/common/components/section'
import { TypeSectionApplyNowBannerFields } from 'types/contentful-types'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { Query, buildQueryString, extractUtmParams, parseToSectionId } from 'utils/common'
import { startDateLabelHandler } from 'utils/dateTimeFormatter'
import { TypeComponentModalLinkTypeFields } from 'types/contentful-types/TypeComponentModalLinkType'
import useProgramStartDate from 'hooks/useProgramStartDate'
import B2BLeadForm from 'pres/common/components/b2b-lead-form'
import FlexiPayment from 'pres/common/components/flexi-payment'
import { buildLandingPageTrackingData, buildTPClickEvent, triggerTrackPoint } from 'utils/trackpoint'
import { ACTION_TYPES, EVENT_NAME, SECTION_NAMES, ACTION_VALUES, EVENT_SOURCE } from 'constants/trackpoint'
import { ATTRIBUTE_CTA_LEADFORM_Modal, UTM_SOURCE } from 'constants/contentful'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { getSectionColorClassName } from 'utils/contentful'
import constructApplyNowUrl from './registrationUtil'
import styles from './registration.module.scss'

interface RegistrationProps extends TypeSectionApplyNowBannerFields {
  className?: string
}

function Registration({
  sectionName,
  title,
  subTitle,
  content,
  cta = [],
  className,
  startDateLabel = '',
  lastDayEnrollLabel = '',
  backgroundColor
}: RegistrationProps) {
  const { query } = useRouter()
  const { label, modalSubtext, linkType } = (content?.[0]?.fields as TypeComponentModalLinkTypeFields) || ''
  const [applyNowURL, setApplyNowURL] = useState('')
  const { leadFormFields, program, programCourseRun, screenName } = useContext(PageLayoutContext)
  const {
    price_in_program_currency_for_admin: adminPrice = 0,
    start_date__c: startDate = '',
    payment_plans: paymentPlans = []
  } = programCourseRun?.current_enrollable_course_run || {}
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [b2bLeadFormOpen, setB2bLeadFormOpen] = useState(false)
  const [flexiPayModalOpen, setFlexiPayModalOpen] = useState(false)
  const {
    default_deadline_days: deadlineDays = 0,
    default_deadline_extension_days: deadlineExtenionDays = 0,
    end_time
  } = program?.fields || {}
  const endTime = end_time?.split('T')[1] || ''
  const programStartDate = useProgramStartDate(startDate, false, false, program)
  const dateLabelHandler = startDateLabelHandler(
    startDate,
    startDateLabel,
    lastDayEnrollLabel,
    deadlineDays,
    false,
    deadlineExtenionDays,
    endTime
  )

  const { t } = useTranslation('common')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sfid = program?.fields?.sfid
      const locale = program?.fields?.language
      const url = constructApplyNowUrl({ inputUrl: window.location?.href, sfid, locale })
      setApplyNowURL(url)
    }
  }, [program?.fields?.language, program?.fields?.sfid])
  const isFlexiPayVisible = !!adminPrice && !dateLabelHandler.noBatchActiveLabel && !!paymentPlans?.length && linkType === 'Payment'
  return (
    <div className="lp-colored--list">
      <Section
        id={`registration-${parseToSectionId(sectionName)}`}
        className={cn(
          !backgroundColor && 'bg-primary',
          'py-5',
          backgroundColor && getSectionColorClassName(backgroundColor, true),
          styles.registrationBanner,
          className
        )}
        pY
      >
        <div className="container">
          <div className={cn('row d-flex justify-content-between text-center', !backgroundColor && 'text-white')}>
            {title && <SectionHeading title={title} />}
            <p className={styles.paymentOption}>
              <span>{subTitle}</span>
              {isFlexiPayVisible && (
                <Button
                  className={cn('text-white bg-transparent', styles.learnMore)}
                  styleType="none"
                  onClick={() => setFlexiPayModalOpen(true)}
                  data-track={buildTPClickEvent(
                    buildLandingPageTrackingData(
                      EVENT_NAME.PAYMENT,
                      EVENT_SOURCE.CLIENT,
                      SECTION_NAMES.APPLY_SECTION,
                      ACTION_TYPES.MODAL,
                      ACTION_VALUES.OPEN,
                      title,
                      label,
                      program,
                      screenName
                    )
                  )}
                >
                  {label}
                </Button>
              )}
            </p>
            <p className={cn('duration-parent mb-0', styles.durationParent)}>
              <CalendarIcon />
              <span>
                {dateLabelHandler?.label + ' ' || ''}
                {startDate && programStartDate}
              </span>
            </p>
          </div>
          <div className={cn('d-flex justify-content-center align-items-center', styles.btnGroup)}>
            {cta.map((action) => {
              const utmQueryParam = extractUtmParams(query as Query)
              const utmQueryString = buildQueryString({ ...utmQueryParam })
              const completeUtmQuery = utmQueryString ? `?${utmQueryString}` : ''
              const applyNowLink = /^https?:\/\//.test(action.fields?.link)
              return action.fields?.link === 'applyid' || applyNowLink ? (
                <a
                  key={action.fields?.link}
                  href={applyNowLink ? `${action.fields?.link}${completeUtmQuery}` : applyNowURL}
                  target={action.fields.openInNewTab ? '_blank' : '_self'}
                  className={cn(
                    'col-lg-3 col-md-6 col-12 btn',
                    !backgroundColor && 'btn--reverse',
                    'rounded-1 text-center text-weight-semi-bold border border-1',
                    styles.applyButton
                  )}
                  rel="noreferrer"
                  data-track={buildTPClickEvent(
                    buildLandingPageTrackingData(
                      action.fields.eventType || EVENT_NAME.APPLY_NOW,
                      EVENT_SOURCE.CLIENT,
                      SECTION_NAMES.APPLY_SECTION,
                      ACTION_TYPES.CTA,
                      '',
                      title,
                      action.fields.text,
                      program,
                      screenName
                    )
                  )}
                >
                  {action.fields.text}
                </a>
              ) : action.fields?.link === ATTRIBUTE_CTA_LEADFORM_Modal ? (
                <Button
                  key={action.fields?.text}
                  className={cn(
                    'col-lg-3 col-md-6 col-12 border border-1 rounded-1 text-center btn',
                    !backgroundColor && 'btn--reverse-border'
                  )}
                  onClick={() => setLeadFormOpen(!leadFormOpen)}
                  styleType="none"
                  data-track={buildTPClickEvent(
                    buildLandingPageTrackingData(
                      EVENT_NAME.LEAD_POP_UP,
                      EVENT_SOURCE.CLIENT,
                      SECTION_NAMES.APPLY_SECTION,
                      ACTION_TYPES.MODAL,
                      ACTION_VALUES.OPEN,
                      title,
                      action.fields.text,
                      program,
                      screenName
                    )
                  )}
                >
                  {action.fields.text}
                </Button>
              ) : (
                <Button
                  key={action.fields?.text}
                  className={cn(
                    'col-lg-3 col-md-6 col-12 border border-1 rounded-1 text-center btn',
                    !backgroundColor && 'btn--reverse-border'
                  )}
                  onClick={() => setB2bLeadFormOpen(!b2bLeadFormOpen)}
                  styleType="none"
                  data-track={buildTPClickEvent(
                    buildLandingPageTrackingData(
                      EVENT_NAME.TEAM_GROUP,
                      EVENT_SOURCE.CLIENT,
                      SECTION_NAMES.APPLY_SECTION,
                      ACTION_TYPES.MODAL,
                      ACTION_VALUES.OPEN,
                      title,
                      action.fields?.text,
                      program,
                      screenName
                    )
                  )}
                >
                  {action.fields?.text}
                </Button>
              )
            })}
          </div>
        </div>
        {leadFormOpen && leadFormFields && (
          <div className="lead-form-modal">
            <BluePrintModal
              closeOverlay={() => {
                setLeadFormOpen(false)
                if (program) {
                  triggerTrackPoint(
                    'click',
                    buildLandingPageTrackingData(
                      EVENT_NAME.LEAD_POP_UP,
                      EVENT_SOURCE.CLIENT,
                      SECTION_NAMES.APPLY_SECTION,
                      '',
                      ACTION_VALUES.CLOSE,
                      title,
                      label,
                      program,
                      screenName
                    )
                  )
                }
              }}
              modalSize="small"
              closeOnBackgroudClick
              heading={query.utm_source === UTM_SOURCE.referral ? t('leadForm:referralLeadFormTitle') : leadFormFields.fields?.formTitle}
            >
              <LeadFormSection
                program={program}
                leadFormFields={leadFormFields}
                sectionDetails={{ sectionName: SECTION_NAMES.STICKY_BAR, sectionTitle: title }}
                inquiringId={parseToSectionId(title)}
              />
            </BluePrintModal>
          </div>
        )}
        {b2bLeadFormOpen && leadFormFields && (
          <div className="lead-form-modal b2b-form-modal">
            <BluePrintModal closeOverlay={() => setB2bLeadFormOpen(false)} isFluidLayout modalSize="large" closeOnBackgroudClick>
              <B2BLeadForm />
            </BluePrintModal>
          </div>
        )}
        {flexiPayModalOpen && (
          <div className="flexi-pay-modal">
            <BluePrintModal
              closeOverlay={() => setFlexiPayModalOpen(false)}
              modalSize="large"
              heading={t('flexiPay.title')}
              closeOnBackgroudClick
            >
              <FlexiPayment modalSubtext={modalSubtext} />
            </BluePrintModal>
          </div>
        )}
      </Section>
    </div>
  )
}

export default Registration
