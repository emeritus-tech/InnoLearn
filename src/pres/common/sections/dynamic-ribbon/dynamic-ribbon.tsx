import { useContext } from 'react'
import { DynamicRibbon as BlueprintDynamicRibbon } from '@emeritus-engineering/blueprint-core-modules/dynamic-ribbon'
import useTranslation from 'next-translate/useTranslation'
import { ACTION_TYPES, SECTION_NAMES, EVENT_SOURCE } from 'constants/trackpoint'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { numberFormatter } from 'utils/numberFormatter'
import { getScreenName } from 'utils/common'
import { getSectionColorClassName } from 'utils/contentful'
import { TypeDynamicRibbonFields } from 'types/contentful-types'


interface dynamicRibbonProps extends TypeDynamicRibbonFields {
  invalidRibbonText?: boolean
  ribbonMarketingText: string
  currency?: string
  rewardAmount?: number
  referralsEnabled?: boolean
  pageSlug?: string
  relativeDaysBatchStartDate: number
}

const DynamicRibbon = (props: dynamicRibbonProps) => {
  const {
    invalidRibbonText,
    ribbonMarketingText,
    currency = '',
    rewardAmount = 0,
    referralsEnabled,
    pageSlug,
    relativeDaysBatchStartDate,
    mainCopy,
    cta,
    contentfulName,
    landingPageTemplateIds,
    eventType,
    background
  } = props
  const { program, programCourseRun } = useContext(PageLayoutContext)
  const { number_formatting_localized_enabled } = programCourseRun || {}
  const { t } = useTranslation('common')
  const bgColor = (background && getSectionColorClassName(background, true))
  const advocateRewardAmount =
    rewardAmount && currency
      ? numberFormatter({ number: rewardAmount, currency, style: 'currency', userLocaleEnabled: number_formatting_localized_enabled })
      : ''

  return (
    <BlueprintDynamicRibbon
      mainCopy={!invalidRibbonText ? ribbonMarketingText : t('dynamicRibbonFallbackReferral.inviteColleagues') + ' ' + advocateRewardAmount}
      cta={!invalidRibbonText ? cta : undefined}
      backgroundColor={bgColor}
      buttonElement={
        invalidRibbonText && referralsEnabled
          ? {
              fields: {
                contentfulName: 'Referral Ribbon Link',
                buttonText: t('dynamicRibbonFallbackReferral.inviteNow'),
                link: `/en/refer/${program?.fields?.sfid}?source=ribbon`,
                eventName: 'Referral Ribbon',
                openInANewTab: true
              }
            }
          : undefined
      }
      showCloseIcon={false}
      contentfulName={contentfulName}
      landingPageTemplateIds={landingPageTemplateIds}
      relativeDaysBatchStartDate={relativeDaysBatchStartDate}
      eventType={eventType}
      dataTrack={buildTPClickEvent(
        buildLandingPageTrackingData(
          eventType,
          EVENT_SOURCE.CLIENT,
          SECTION_NAMES.RIBBON,
          ACTION_TYPES.CTA,
          '',
          !invalidRibbonText ? mainCopy : t('dynamicRibbonFallbackReferral.inviteColleagues'),
          !invalidRibbonText ? cta?.fields?.buttonText : t('dynamicRibbonFallbackReferral.inviteNow'),
          program,
          getScreenName('', pageSlug)
        )
      )}
    />
  )
}

export default DynamicRibbon
