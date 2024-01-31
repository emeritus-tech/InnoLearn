import { Entry } from 'contentful'
import cn from 'classnames'
import { ATTRIBUTE_CTA_LEADFORM_Modal } from 'constants/contentful'
import Button from 'pres/common/components/button'
import ButtonComponent from 'pres/common/sections/button-section/button-component'
import { TypeComponentButtonFields, TypeProgram } from 'types/contentful-types'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { getApplyUrl } from 'utils/common'
import { ACTION_TYPES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import type { ParsedUrlQuery } from 'querystring'
import styles from './cta.module.scss'

const ButtonOrLinkCTA = (
  cta: Entry<TypeComponentButtonFields> | undefined,
  handleCTAClick: () => void,
  program?: TypeProgram,
  sectionTitle?: string,
  sectionName?: string,
  classNames?: string,
  screenName?: string,
  query?: ParsedUrlQuery,
  applyTxt?: string,
  isGaPage?: boolean
) => {
  const isB2B = query?.thank_you && query?.group ? true : false
  const isB2C = query?.thank_you
  const isEnterpriseB2Bflow = query?.b2b_thank_you || query?.b2c_thank_you
  const utmParams = {
    utm_source: query?.utm_source,
    utm_medium: query?.utm_medium,
    utm_campaign: query?.utm_campaign,
    utm_content: query?.utm_content,
    utm_term: query?.utm_term
  }

  return cta ? (
    <div className={classNames ? '' : 'mt-3 d-flex justify-content-center'}>
      {cta.fields.link === ATTRIBUTE_CTA_LEADFORM_Modal && !(isB2B || isB2C || isEnterpriseB2Bflow) ? (
        <Button
          onClick={handleCTAClick}
          data-track={buildTPClickEvent(
            buildLandingPageTrackingData(
              cta.fields.eventType || EVENT_NAME.LEAD_POP_UP,
              EVENT_SOURCE.CLIENT,
              sectionName || SECTION_NAMES.SECTION,
              ACTION_TYPES.CTA,
              cta.fields.eventType === EVENT_NAME.SEARCH || cta.fields.eventType === EVENT_NAME.GENERIC ? cta.fields.link : '',
              sectionTitle,
              cta.fields.text,
              program,
              screenName
            )
          )}
          className={classNames || 'col-xl-4 col-lg-6 col-12 btn--primary fw-bold height-control'}
          styleType="none"
        >
          {cta.fields.text}
        </Button>
      ) : isB2B || isB2C || isEnterpriseB2Bflow ? (
        <ButtonComponent
          text={applyTxt || ''}
          link={getApplyUrl({
            url: '/',
            utmParams,
            isB2B,
            language: program?.fields.language,
            sfid: program?.fields?.sfid,
            number_of_participants: query?.number_of_participants as string,
            company: query?.company as string
          })}
          openInNewTab={cta.fields.openInNewTab}
          eventName={cta.fields.eventName}
          className={cn(
            styles.emeritusFontColor,
            isGaPage ? 'd-none' : 'btn col-12 info-bar--btn btn--primary btn--regular display--inline-block'
          )}
          eventType={cta.fields.eventType}
          title={sectionTitle}
        />
      ) : (
        <ButtonComponent
          text={cta.fields.text}
          link={cta.fields.link}
          openInNewTab={cta.fields.openInNewTab}
          eventName={cta.fields.eventName}
          className={cn(styles.emeritusFontColor, 'col-xl-4 col-lg-6 col-12 btn--primary fw-bold')}
          eventType={cta.fields.eventType}
          title={sectionTitle}
        />
      )}
    </div>
  ) : null
}

export default ButtonOrLinkCTA
