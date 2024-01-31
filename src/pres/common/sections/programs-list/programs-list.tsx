import { useEffect, useMemo, useState, useContext } from 'react'
import cn from 'classnames'
import { LandingpageProgramCard } from '@emeritus-engineering/blueprint-core-modules/program-card'
import { BluePrintSlider } from '@emeritus-engineering/blueprint-core-components'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import useTranslation from 'next-translate/useTranslation'
import useMediaQueries from 'hooks/useMediaQueries'
import { ACTION_TYPES, EVENT_NAME, EVENT_SOURCE, programsEvents, SECTION_NAMES } from 'constants/trackpoint'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { convertLineBreakToHtmlTag, parseToSectionId } from 'utils/common'
import Section from 'pres/common/components/section'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { TypeComponentProgramCard, TypeComponentProgramCardFields, TypeUtmParamsFields } from 'types/contentful-types'
import useProgramStartDate from 'hooks/useProgramStartDate'
import { getMultipleProgramData, getSectionColorClassName } from 'utils/contentful'
import { startDateLabelHandler } from 'utils/dateTimeFormatter'
import { ProgramData } from 'types/api-response-types/ProgramData'
import styles from './programs-list.module.scss'

interface Props {
  content: Array<TypeComponentProgramCard>
  introText?: string
  title: string
  className?: string
  utmParams?: TypeUtmParamsFields
  paymentForm?: boolean
  tagline?: string
  backgroundColor?: string
}

type DynamicProgramData = TypeComponentProgramCardFields & {
  programStartDateValue: string
  default_deadline_extension_days: number
  default_deadline_days?: number
  end_time: string
  translation_key: string
  current_enrollable_course_run: { start_date__c: string }
}

function ProgramsList({ tagline, title, introText, content = [], className, utmParams, paymentForm, backgroundColor }: Props) {
  const { screenName, readOnlyProgramCards, program, isReferralParamRequired } = useContext(PageLayoutContext)
  const { isMobile, isHandheldDevice } = useMediaQueries()
  const [displaySlider, setDisplaySlider] = useState(false)
  const [dynamicProgramData, setDynamicProgramData] = useState()
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation('common')
  const bgColor = backgroundColor && getSectionColorClassName(backgroundColor)

  const programsList = useMemo(() => {
    const sfids: string[] = []
    const cards: JSX.Element[] = []
    content.forEach(({ fields }: TypeComponentProgramCard, index) => {
      const contentSfid = fields?.programSfid || fields?.landingPage?.fields?.program?.fields?.sfid || fields?.program?.fields.sfid || ''
      !(fields as DynamicProgramData)?.programStartDateValue && contentSfid && sfids.push(contentSfid)
      const deadlineData =
        dynamicProgramData && contentSfid
          ? Array.from(dynamicProgramData || []).find((program) => contentSfid === (program as ProgramData).sfid)
          : {
              default_deadline_extension_days: 0,
              default_deadline_days: 0,
              end_time: '',
              current_enrollable_course_run: { start_date__c: '' }
            }
      cards.push(
        <LandingpageProgramCard
          dataTrack={buildTPClickEvent(
            buildLandingPageTrackingData(
              programsEvents.programCard,
              EVENT_SOURCE.CLIENT,
              SECTION_NAMES.SECTION,
              ACTION_TYPES.URL,
              '',
              title,
              fields?.title,
              {
                program_name:
                  fields?.landingPage?.fields?.program?.fields?.name || fields?.courseName || fields?.program?.fields?.description,
                school_name:
                  fields?.landingPage?.fields?.school?.fields?.name || fields?.schoolName || fields?.program?.fields?.school?.fields?.name,
                sfid: fields?.landingPage?.fields?.program?.fields?.sfid || fields?.programSfid || fields?.program?.fields.sfid
              },
              screenName
            )
          )}
          key={`${fields?.landingPage?.fields?.program?.fields.description || fields?.title} ${index}`}
          {...fields}
          utmParams={utmParams}
          paymentForm={paymentForm}
          isMobile={isMobile}
          isUnclickable={readOnlyProgramCards}
          isReferralParamRequired={isReferralParamRequired}
          useProgramStartDate={useProgramStartDate}
          startDateLabelHandler={startDateLabelHandler}
          programStartDateLabel={fields?.startsOnLabel || t('startDateLabel')}
          lastDayToEnrollLabel={fields?.lastDayToEnrollLabel || t('lastDayToEnrollLabel')}
          programStartDateValue={
            (fields as DynamicProgramData)?.programStartDateValue ||
            (deadlineData as DynamicProgramData)?.current_enrollable_course_run?.start_date__c
          }
          defaultProgramDeadlineExtensionDays={
            (fields as DynamicProgramData)?.default_deadline_extension_days ||
            (deadlineData as DynamicProgramData)?.default_deadline_extension_days
          }
          defaultDeadlineDays={
            (fields as DynamicProgramData)?.default_deadline_days || (deadlineData as DynamicProgramData)?.default_deadline_days
          }
          programEndTime={
            (fields as DynamicProgramData)?.end_time || (deadlineData as DynamicProgramData)?.end_time || '2000-01-01T23:59:00Z'
          }
          schoolTranslationKey={(fields as DynamicProgramData)?.translation_key}
        />
      )
    })
    return { sfids, cards }
  }, [content, title, screenName, utmParams, paymentForm, isMobile, readOnlyProgramCards, isReferralParamRequired, dynamicProgramData])

  const sectionUrl = useMemo(() => parseToSectionId(title), [title])

  useEffect(() => {
    if (!mounted) {
      setMounted(true)
      setDisplaySlider(!isHandheldDevice && programsList?.cards.length > 3 ? true : false)
      return
    }
    programsList.sfids.length > 0 && programsList.sfids.length === programsList.cards.length
    getMultipleProgramData(programsList.sfids).then((res) => {
      setDynamicProgramData(res.data)
    })
  }, [isHandheldDevice, programsList?.cards.length, programsList?.sfids.length, mounted])

  return (
    <Section id={sectionUrl} className={cn('program-card--container', className, bgColor)} pY>
      <div className="common-slider">
        <div className="container">
          {tagline && (
            <p className={cn('para--two mb-0 text-primary', styles.programsListHeading)}>
              <strong>{tagline}</strong>
            </p>
          )}
          {title && <SectionHeading title={title} textAlignment={cn('programs-list-heading', styles.programsListHeading)} />}
          {introText && (
            <p
              className={cn('intro-txt para--two programs-list-intro', styles.programsIntro)}
              dangerouslySetInnerHTML={{ __html: convertLineBreakToHtmlTag(introText) }}
            />
          )}
          <div className={cn('d-flex', styles.programListWrapper)}>
            {displaySlider ? (
              <BluePrintSlider
                slides={programsList.cards}
                chunks={3}
                enableSwipe
                slideRemainingSlidesOnly={dynamicProgramData ? true : false}
                dataTrack={buildTPClickEvent({
                  ...buildLandingPageTrackingData(
                    EVENT_NAME.PROGRAM_CARD,
                    EVENT_SOURCE.CLIENT,
                    SECTION_NAMES.SECTION,
                    ACTION_TYPES.SLIDER,
                    '',
                    '',
                    '',
                    program,
                    screenName
                  )
                })}
                componentTitle={sectionUrl || 'program-list-slider'}
              />
            ) : (
              <div className="swipe">{programsList.cards}</div>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}

export default ProgramsList
