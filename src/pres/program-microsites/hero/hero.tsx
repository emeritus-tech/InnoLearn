import cn from 'classnames'
import { useContext, useMemo, useState } from 'react'
import { MicroSiteHero } from '@emeritus-engineering/blueprint-core-modules/hero'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import Section from 'pres/common/components/section'
import { parseToSectionId } from 'utils/common'
import { TypeSectionHeroProgramMicroSitesFields } from 'types/contentful-types'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { getAssetTypeContent } from 'utils/contentful'
import { buildLandingPageTrackingData, buildTPClickEvent, triggerTrackPoint } from 'utils/trackpoint'
import useProgramStartDate from 'hooks/useProgramStartDate'
import { startDateLabelHandler } from 'utils/dateTimeFormatter'
import { numberFormatter } from 'utils/numberFormatter'
import { getApplyUrl } from 'utils/common'

function HeroProgramMicroSitesPages({
  contentfulName,
  title,
  subTitle,
  paragraphText,
  heroImage,
  cta,
  startDateLabel = '',
  lastDateToEnrolLabel,
  durationLabel = '',
  tuitionFeeLabel = '',
  backgroundVariants = 'primary-secondary'
}: TypeSectionHeroProgramMicroSitesFields) {
  const { leadFormFields, program, programCourseRun, isMicrositeThankyouPage, screenName } = useContext(PageLayoutContext)
  const [popOverState, setPopOverState] = useState(false)
  const { query } = useRouter()
  const { t } = useTranslation('common')
  const isB2B = query?.thank_you && query?.group ? true : false
  const isB2C = query?.thank_you
  const utmParams = {
    utm_source: query?.utm_source,
    utm_medium: query?.utm_medium,
    utm_campaign: query?.utm_campaign,
    utm_content: query?.utm_content,
    utm_term: query?.utm_term
  }

  const applyObj = {
    label: t('applyNow'),
    url: getApplyUrl({
      url: '/',
      utmParams,
      isB2B,
      language: program?.fields.language,
      sfid: program?.fields?.sfid,
      number_of_participants: query?.number_of_participants as string,
      company: query?.company as string
    })
  }
  const {
    price_in_program_currency_for_admin = 0,
    start_date__c: startDate = '',
    currency = ''
  } = programCourseRun?.current_enrollable_course_run || {}

  const {
    current_batch_duration: batchDuration,
    default_deadline_extension_days: deadlineExtenionDays = 0,
    default_deadline_days: deadlineDays = 0
  } = program?.fields || {}
  const endTime = program?.fields?.end_time?.split('T')[1] || ''

  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const programStartDate = useProgramStartDate(startDate, false, false, program)

  const programFeatures = (startDateLabel || durationLabel || tuitionFeeLabel) && [
    {
      label:
        startDateLabelHandler(startDate, startDateLabel, lastDateToEnrolLabel || '', deadlineDays, false, deadlineExtenionDays, endTime)
          ?.label || '',
      value: programStartDate,
      icon: 'icon-calendar'
    },
    { label: durationLabel, value: batchDuration || '', icon: 'icon-duration' },
    {
      label: tuitionFeeLabel,
      value: currency
        ? numberFormatter({
            number: price_in_program_currency_for_admin,
            currency,
            style: 'currency',
            userLocaleEnabled: programCourseRun?.number_formatting_localized_enabled
          })
        : price_in_program_currency_for_admin.toString(),
      icon: 'icon-dollar'
    }
  ]

  const closeOverlay = () => {
    setPopOverState(false)
    triggerTrackPoint(
      'click',
      buildLandingPageTrackingData(
        EVENT_NAME.LEAD_POP_UP,
        EVENT_SOURCE.CLIENT,
        SECTION_NAMES.HERO,
        '',
        ACTION_VALUES.CLOSE,
        title,
        cta?.fields?.text,
        program,
        screenName
      )
    )
  }

  const backgroundClassName = isMicrositeThankyouPage ? `branding-${backgroundVariants}` : `branding-${backgroundVariants}-gradient`

  return (
    <>
      <Section
        id={`hero-${sectionId}`}
        className={cn('heroWrapper', backgroundClassName, 'heroWrapper cmn-hero')}
        style={{
          backgroundImage: heroImage ? `url(${getAssetTypeContent(heroImage)})` : undefined
        }}
      >
        <div className="container position-relative">
          <MicroSiteHero
            contentfulName={contentfulName}
            title={title}
            subTitle={subTitle}
            features={Array.isArray(programFeatures) ? programFeatures : undefined}
            paragraphText={paragraphText}
            heroImage={heroImage}
            handleClick={() => setPopOverState(true)}
            isMicrositeThankyouPage={isMicrositeThankyouPage}
            eventData={buildTPClickEvent(
              buildLandingPageTrackingData(
                EVENT_NAME.LEAD_POP_UP,
                EVENT_SOURCE.CLIENT,
                SECTION_NAMES.HERO,
                ACTION_TYPES.CTA,
                '',
                title,
                cta?.fields?.text,
                program,
                screenName
              )
            )}
            cta={!(isB2B || isB2C) ? cta : undefined}
            apply={isB2B || isB2C ? applyObj : undefined}
          />
        </div>
      </Section>
      {popOverState && (
        <div className="lead-form-modal lead-form-cntr">
          <BluePrintModal closeOverlay={closeOverlay} modalSize="small" closeOnBackgroudClick heading={leadFormFields?.fields?.formTitle}>
            <LeadFormSection
              program={program}
              leadFormFields={leadFormFields}
              sectionDetails={{ sectionName: SECTION_NAMES.HERO }}
              inquiringId={`hero-${sectionId}`}
            />
          </BluePrintModal>
        </div>
      )}
    </>
  )
}

export default HeroProgramMicroSitesPages
