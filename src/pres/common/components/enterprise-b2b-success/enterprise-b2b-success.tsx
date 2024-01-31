import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { TypeProgram } from 'types/contentful-types'
import { EVENT_NAME, EVENT_SOURCE, SECTION_NAMES, ACTION_TYPES, SCREENS } from 'constants/trackpoint'
import { buildTPClickEvent, buildLandingPageTrackingData } from 'utils/trackpoint'
import { getApplyUrl } from 'utils/common'

export interface enterpriseThankYouProps {
  program?: TypeProgram
  isB2C?: boolean
}

function EnterPriseB2bSuccess({ program, isB2C }: enterpriseThankYouProps) {
  const { t } = useTranslation('common')
  const { query } = useRouter()

  const utmParams = {
    utm_source: query?.utm_source,
    utm_medium: query?.utm_medium,
    utm_campaign: query?.utm_campaign,
    utm_content: query?.utm_content,
    utm_term: query?.utm_term
  }
  const isB2B = true

  const ctaButton = (
    <div className="ty-button-cntr m-t-24">
      <a
        className="ty-button btn btn--primary"
        href={getApplyUrl({
          url: '/',
          utmParams,
          isB2B,
          language: program?.fields.language,
          sfid: program?.fields?.sfid,
          number_of_participants: query?.number_of_participants as string,
          company: query?.company as string
        })}
        target="_self"
        rel="noreferrer"
        data-track={buildTPClickEvent(
          buildLandingPageTrackingData(
            EVENT_NAME.APPLY_NOW,
            EVENT_SOURCE.CLIENT,
            SECTION_NAMES.HERO,
            ACTION_TYPES.CTA,
            '',
            'b2b_title',
            'Apply',
            program,
            SCREENS.THANK_YOU_PAGE
          )
        )}
      >
        {t('applyNow')}
      </a>
    </div>
  )

  return (
    <div className="ty-cntr">
      <div className="tick-icon">
        <span className="blueprint-icon icon-success text-primary"></span>
      </div>
      <div className="title-msg">{t('enterpriseB2b.title')}</div>
      <div className="sub-msg">{t('enterpriseB2b.greetingTxt')}</div>
      <div className="ty-items-cntr">
        <div className="ty-item">
          <div className="ty-item__icon">
            <span className="blueprint-icon text-primary icon-email"></span>
          </div>
          <div className="ty-item__info">
            <div className="ty-item__info-title">
              <span>{t('enterpriseB2b.email')}</span>
            </div>
            <div>{t('enterpriseB2b.emailContactDetails')}</div>
          </div>
        </div>
        <div className="ty-item">
          <div className="ty-item__icon">
            <span className="blueprint-icon text-primary icon-info"></span>
          </div>
          <div className="ty-item__info">
            <div className="ty-item__info-title">
              <span>{t('enterpriseB2b.policy')}</span>
            </div>
            <div>{t('enterpriseB2b.policyContactDetails')}</div>
          </div>
        </div>
      </div>
      {isB2C && ctaButton}
    </div>
  )
}

export default EnterPriseB2bSuccess
