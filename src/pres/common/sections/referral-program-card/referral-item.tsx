import { useContext, useEffect, useMemo, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Options } from '@contentful/rich-text-react-renderer'
import { ReferralCard as BlueprintReferralCard } from '@emeritus-engineering/blueprint-core-modules/referral-card'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components'
import { useRouter } from 'next/router'
import useConsentData from 'hooks/useConsentData'
import { TypeComponentLargeProgramCard } from 'types/contentful-types/TypeComponentLargeProgramCard'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { Query, buildQueryString, convertLineBreakToHtmlTag, extractUtmParams } from 'utils/common'
import { currentScreenResolution } from 'utils/deviceType'
import useMediaQueries from 'hooks/useMediaQueries'
import useProgramStartDate from 'hooks/useProgramStartDate'
import useProgramRoundDiscount from 'hooks/useProgramRoundDiscount'
import useProgramDuration from 'hooks/useProgramDuration'
import { numberFormatter } from 'utils/numberFormatter'
import { isValidLiquidVariable, marketingModule } from 'utils/marketingModule'
import { priceAfterDiscount, shouldRoundbeVisible } from 'utils/dateTimeFormatter'
import { ProgramData } from 'types/api-response-types/ProgramData'
import { ATTRIBUTE_CTA_LEADFORM_Modal, COST_OPTION, UTM_SOURCE } from 'constants/contentful'
import { TypeUtmParamsFields } from 'types/contentful-types'
import { useURLutmParams } from 'hooks/useUTMQueryParams'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { triggerTrackPoint, buildLandingPageTrackingData } from 'utils/trackpoint'

interface ProgarmApidata extends ProgramData {
  end_time?: string
  default_deadline_extension_days?: number
}

interface ReferralCardWrapperProps {
  content?: TypeComponentLargeProgramCard
  dynamicProgramData?: Array<ProgarmApidata>
  isDefaultExpanded?: boolean
  index: number
  alignItem?: string
  contentLength?: boolean
  isCardExpanded?: boolean
  utmParams?: TypeUtmParamsFields
}

interface ProgramDiscountProp {
  programDiscountVal?: string
  roundActivateDate?: string
}

interface ProgramDurationProp {
  days?: string
  hours?: string
}

const createParserOptions = (
  programStartDate?: string,
  programDiscount?: ProgramDiscountProp,
  defaultProgramFee?: string,
  programDuration?: ProgramDurationProp,
  t?: any
) =>
  ({
    renderText: (text) => {
      return isValidLiquidVariable(text)
        ? marketingModule(text, programStartDate, programDiscount, programDuration, t, defaultProgramFee)
        : text
    }
  } as Options)

const ReferralItem = ({ content, dynamicProgramData, isDefaultExpanded, index, alignItem, utmParams }: ReferralCardWrapperProps) => {
  const contextData = useContext(PageLayoutContext)
  const { screenName, school_name, ctaConfiguration, isReferralParamRequired } = contextData
  const {
    fields: {
      heading,
      image,
      seoImage,
      introText,
      startsOnLabel,
      startsOnValue,
      durationLabel,
      durationValue,
      costLabel,
      costValue,
      costOption,
      roundDetailsInfo,
      features,
      imagePosition,
      cta,
      programs,
      figureCaption,
      trackpointMeta,
      collaborationText,
      seoCollaborationImage,
      leadForm
    }
  } = content as TypeComponentLargeProgramCard

  const { isTabletActive, isMobileScreen, isTabletLandscape, isWiderDesktop, isLargerDevice, isExtraSmallDevice } = useMediaQueries()
  const deviceResolution = currentScreenResolution(
    isTabletActive,
    isMobileScreen,
    isTabletLandscape,
    isWiderDesktop,
    isLargerDevice,
    isExtraSmallDevice
  )
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [defaultProgramFee, setDefaultProgramFee] = useState('')
  const { t } = useTranslation()

  const consentData = useConsentData(programs?.fields?.sfid)
  const { query } = useRouter()
  const templateUtm = useURLutmParams(utmParams)
  const modalParam = isReferralParamRequired ? '#referrals-email-capture-modal' : ''

  const learnMoreHandler = (url: string | undefined, newTab?: boolean | undefined) => {
    if (url === ATTRIBUTE_CTA_LEADFORM_Modal) {
      setLeadFormOpen(true)
    } else {
      const campaignUtm = extractUtmParams(query as Query)
      const urlstring = cta?.fields?.link.split('?')[1]
      const ctaUtm = Object.fromEntries(new URLSearchParams(urlstring as string))
      const updatedUtm = { ...templateUtm, ...campaignUtm, ...ctaUtm }
      const keys = ['site-slug', 'school-slug']
      const updatedKeys = keys.concat(Object.keys(updatedUtm))
      updatedKeys.forEach((key: string) => {
        if (Object.keys(query).includes(key)) {
          delete query?.[key]
        }
      })
      const updateUtmParam = Object.keys(updatedUtm)?.length > 0 ? `&${buildQueryString(updatedUtm)}` : ''
      const urlQueryString = Object.keys(query)?.length > 0 ? `?${buildQueryString(query)}` : updateUtmParam || modalParam ? '?' : ''
      let showInNewTab = '_self',
        updateUrl = url
      if (newTab) {
        showInNewTab = '_blank'
      }
      if (Object.keys(ctaUtm)?.length > 0) {
        updateUrl = url?.split('?')[0]
      }
      window.open(`${updateUrl}${urlQueryString}${updateUtmParam}${modalParam}`, showInNewTab)
    }
  }

  const trackVal = {
    environment: process.env.NEXT_PUBLIC_APP_ENV || '',
    event: EVENT_NAME.PROGRAM_CARD,
    event_source: EVENT_SOURCE.CLIENT,
    section_name: SECTION_NAMES.SECTION,
    screen: screenName || ''
  }

  const programId = programs?.fields?.id
  const programDataFromAPI = dynamicProgramData?.[programId]

  const {
    description,
    current_batch_duration: batchDuration,
    end_time,
    show_original_price: originalPrice,
    number_formatting_localized_enabled
  } = programDataFromAPI || {}
  const {
    currency = '',
    price_in_program_currency_for_admin: price = 0,
    start_date__c: startDate = '',
    rounds,
    application_fee_in_program_currency: applicationFee
  } = programDataFromAPI?.current_enrollable_course_run || {}
  const endTime = end_time?.split('T')[1] || ''
  const programStartDate = useProgramStartDate(startDate, undefined, undefined, programs)
  const programDiscount = useProgramRoundDiscount(
    rounds || [],
    startDate,
    endTime,
    currency,
    price,
    applicationFee,
    programs?.fields?.school?.fields?.translation_key
  )
  useEffect(() => {
    setDefaultProgramFee(
      currency
        ? numberFormatter({ number: price, currency, style: 'currency', userLocaleEnabled: number_formatting_localized_enabled })
        : '0'
    )
  }, [currency])
  const programDuration = useProgramDuration(startDate, endTime)
  const activeRoundDetails = useMemo(
    () => createParserOptions(programStartDate, programDiscount, defaultProgramFee, programDuration, t),
    [programStartDate, programDiscount, defaultProgramFee, programDuration, t]
  )
  const roundDetails = useMemo(
    () =>
      rounds?.sort(function (a: { relative_end_day_from_batch_start: number }, b: { relative_end_day_from_batch_start: number }) {
        return b.relative_end_day_from_batch_start - a.relative_end_day_from_batch_start
      }),
    [rounds]
  )
  const visibleRounds = roundDetails?.filter(({ relative_end_day_from_batch_start }) =>
    shouldRoundbeVisible(relative_end_day_from_batch_start, startDate, endTime)
  )

  const amountOffered = visibleRounds?.map(({ tuition_discount, tuition_discount_type }) =>
    priceAfterDiscount(number_formatting_localized_enabled, tuition_discount, price, tuition_discount_type)
  )

  let amount = ''
  if (costOption === COST_OPTION.round_discount_price || !costOption) {
    // costoption is not defined default should be round discount price
    if (amountOffered?.[0]) {
      amount = numberFormatter({
        number: +amountOffered?.[0],
        currency,
        style: 'currency',
        userLocaleEnabled: programDataFromAPI?.number_formatting_localized_enabled
      })
    } else if (price > 0 && originalPrice) {
      amount = numberFormatter({
        number: price,
        currency,
        style: 'currency',
        userLocaleEnabled: programDataFromAPI?.number_formatting_localized_enabled
      })
    }
  } else if (costOption === COST_OPTION.list_price && price > 0) {
    amount = numberFormatter({
      number: price,
      currency,
      style: 'currency',
      userLocaleEnabled: programDataFromAPI?.number_formatting_localized_enabled
    })
  }

  return (
    <>
      <BlueprintReferralCard
        key={index}
        heading={description || heading}
        image={image}
        seoImage={seoImage}
        introText={convertLineBreakToHtmlTag(introText)}
        startsOnLabel={startsOnLabel}
        startsOnValue={programs ? programStartDate : startsOnValue}
        durationLabel={durationLabel}
        durationValue={batchDuration || durationValue}
        costLabel={costLabel}
        costValue={amount || costValue}
        features={features}
        imagePosition={imagePosition}
        cta={cta}
        alignContent={alignItem}
        currentResolution={deviceResolution}
        isDefaultExpanded={isDefaultExpanded}
        schoolName={school_name}
        trackVal={trackVal}
        handleClick={() => {
          learnMoreHandler(cta?.fields?.link, cta?.fields?.openInNewTab)
        }}
        programs={programs}
        figureCaption={figureCaption}
        buttonType={ctaConfiguration}
        trackpointMeta={trackpointMeta}
        collaborationText={collaborationText}
        seoCollaborationImage={seoCollaborationImage}
        roundDetailsInfo={roundDetailsInfo}
        activeRoundDetails={activeRoundDetails}
      />
      {leadFormOpen && leadForm && (
        <div className="lead-form-modal lead-form-cntr">
          <BluePrintModal
            modalSize="small"
            closeOverlay={() => {
              setLeadFormOpen(false)
              if (programs) {
                triggerTrackPoint(
                  'click',
                  buildLandingPageTrackingData(
                    cta?.fields?.eventType || EVENT_NAME.LEAD_POP_UP,
                    EVENT_SOURCE.CLIENT,
                    description || heading,
                    '',
                    ACTION_VALUES.CLOSE,
                    'title',
                    cta?.fields?.text,
                    programs,
                    screenName
                  )
                )
              }
            }}
            heading={query.utm_source === UTM_SOURCE.referral ? t('leadForm:referralLeadFormTitle') : leadForm.fields?.formTitle}
            closeOnBackgroudClick
          >
            <PageLayoutContext.Provider
              value={{
                ...contextData,
                program: programs,
                programCourseRun: programDataFromAPI ? { ...programDataFromAPI, programConsent: consentData } : programDataFromAPI
              }}
            >
              <LeadFormSection
                program={programs}
                leadFormFields={leadForm}
                sectionDetails={{ sectionTitle: description || heading }}
                inquiringId={description || heading}
              />
            </PageLayoutContext.Provider>
          </BluePrintModal>
        </div>
      )}
    </>
  )
}

export default ReferralItem
