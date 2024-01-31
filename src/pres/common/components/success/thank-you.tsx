import cn from 'classnames'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import { TypeProgram, TypeThankYouParent } from 'types/contentful-types'
import { ProgramData } from 'types/api-response-types/ProgramData'
import { LEAD_SUCCESS_LINK_TYPES } from 'constants/contentful'
import { buildQueryString } from 'utils/common'
import useMediaQueries from 'hooks/useMediaQueries'
import { EVENT_NAME, EVENT_SOURCE, SECTION_NAMES, ACTION_TYPES, SCREENS } from 'constants/trackpoint'
import { buildTPClickEvent, buildLandingPageTrackingData } from 'utils/trackpoint'

export interface ThankYouProps {
  b2cThankYouFields?: TypeThankYouParent | undefined
  b2bThankYouFields?: TypeThankYouParent | undefined
  programCourseRun?: ProgramData
  program?: TypeProgram
  isMicrositeThankyouPage?: boolean
  screenName?: string
}

function ThankYou({
  b2cThankYouFields,
  b2bThankYouFields,
  programCourseRun,
  program,
  isMicrositeThankyouPage = false,
  screenName
}: ThankYouProps) {
  const { query } = useRouter()
  const { t } = useTranslation('common')
  const { isDesktop } = useMediaQueries()
  const [mounted, setMounted] = useState(false)
  const isB2B = query?.thank_you && query?.group
  const thankYouFields = isB2B ? b2bThankYouFields : b2cThankYouFields

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!thankYouFields) {
    return null
  }

  const { title, greetingText, iconList = [], cta } = thankYouFields?.fields || {}
  const utmParams = {
    utm_source: query?.utm_source,
    utm_medium: query?.utm_medium,
    utm_campaign: query?.utm_campaign,
    utm_content: query?.utm_content,
    utm_term: query?.utm_term
  }

  /* Method to derive icon class based on linktype through contentful.
        Referral link use $ dollar icon in blue print font which is exceptional */
  const getIconClass = (linkType?: string) => {
    if (linkType === LEAD_SUCCESS_LINK_TYPES.referral) {
      return 'dollar'
    } else if (linkType == LEAD_SUCCESS_LINK_TYPES.download) {
      return 'download'
    }
    return linkType
  }

  const getIconUrl = (linkType?: string, link?: string) => {
    if (linkType === LEAD_SUCCESS_LINK_TYPES.download) {
      return programCourseRun?.brochure + '?disposition=attachment'
    } else if (linkType === LEAD_SUCCESS_LINK_TYPES.referral) {
      const referralUrl = `https://${program?.fields?.school?.fields?.host_name}/en/refer/${program?.fields?.sfid}?source=thank_you`
      return `${referralUrl}&${buildQueryString({
        ...utmParams
      })}`
    } else if (linkType === LEAD_SUCCESS_LINK_TYPES.email) {
      return `mailto:${link} `
    }
    return link
  }

  /* Derive the CTA Link */
  const getApplyUrl = (url = '') => {
    const utmQueryString = buildQueryString({ ...utmParams })
    const completeUtmQuery = utmQueryString ? `&${utmQueryString}` : ''
    const isExternalLink = /^https?:\/\//.test(url)
    if (isB2B) {
      const applybaseUrl = `${url}?company=${query?.company || ''}&number_of_participants=${
        query?.number_of_participants || ''
      }&program_sfid=${program?.fields?.sfid}`
      return `${applybaseUrl}${completeUtmQuery}`
    } else if (isExternalLink) {
      return `${url}?${completeUtmQuery}`
    } else {
      const applybaseUrl = `/?locale=${program?.fields.language}&program_sfid=${program?.fields?.sfid}&source=applynowty`
      return `${applybaseUrl}${completeUtmQuery}`
    }
  }

  const openInNewTab = (openInNewTab?: boolean) => {
    return openInNewTab && isDesktop
  }

  const ctaButton = (
    <div className={`ty-button-cntr ${isB2B ? 'm-y-24' : 'm-t-24'}`}>
      <a
        className="ty-button btn btn--primary"
        href={getApplyUrl(cta?.fields.link)}
        target={cta?.fields.openInNewTab ? '_blank' : '_self'}
        rel="noreferrer"
        data-track={buildTPClickEvent(
          buildLandingPageTrackingData(
            EVENT_NAME.APPLY_NOW,
            EVENT_SOURCE.CLIENT,
            SECTION_NAMES.HERO,
            ACTION_TYPES.CTA,
            '',
            title,
            cta?.fields.text,
            program,
            screenName || SCREENS.THANK_YOU_PAGE
          )
        )}
      >
        {cta?.fields.text}
      </a>
    </div>
  )

  const referralCouponTxt = (
    <div className="ty-item">
      <div className="ty-item__icon">
        <span className="blueprint-icon text-primary icon-dollar"></span>
      </div>
      <div className="ty-item__info">
        <div className="ty-item__info-title">
          <span className="link text-accent">{t('applyCoupon')}</span>
        </div>
        <div>{t('couponCode', { coupon: query?.coupon })}</div>
      </div>
    </div>
  )

  return (
    <div className="ty-cntr">
      {!isMicrositeThankyouPage && (
        <div className="tick-icon">
          <span className="blueprint-icon icon-success text-primary"></span>
        </div>
      )}
      {!isMicrositeThankyouPage && <div className={cn('title-msg', { 'text-primary': isB2B })}>{title}</div>}
      <div className={cn('sub-msg', { 'text-center': isB2B })}>{greetingText}</div>
      {isB2B && cta && ctaButton}
      {iconList && (
        <div className="ty-items-cntr">
          {!isB2B && query?.coupon && referralCouponTxt}
          {iconList.map((icon) =>
            icon ? (
              <div key={icon.fields.linkType} className="ty-item">
                <div className="ty-item__icon">
                  <span className={cn('blueprint-icon text-primary', `icon-${getIconClass(icon.fields.linkType)} `)}></span>
                </div>
                <div className="ty-item__info">
                  <div className="ty-item__info-title">
                    <a
                      href={getIconUrl(icon.fields.linkType, icon.fields.link)}
                      target={mounted ? (openInNewTab(icon.fields.openInNewTab) ? '_blank' : '_self') : undefined}
                      className="link text-accent"
                      rel="noreferrer"
                      data-track={buildTPClickEvent(
                        buildLandingPageTrackingData(
                          icon.fields.linkType == LEAD_SUCCESS_LINK_TYPES.referral ? EVENT_NAME.REFERRAL : EVENT_NAME.EXTERNAL_LINK,
                          EVENT_SOURCE.CLIENT,
                          SECTION_NAMES.HERO,
                          icon.fields.linkType === LEAD_SUCCESS_LINK_TYPES.email ? ACTION_TYPES.EMAIL : ACTION_TYPES.URL,
                          icon.fields.linkType || '',
                          title,
                          icon.fields.title,
                          program,
                          screenName || SCREENS.THANK_YOU_PAGE
                        )
                      )}
                    >
                      {icon.fields.title}
                    </a>
                  </div>
                  <div>{icon.fields.subText}</div>
                  {icon.fields.linkType === LEAD_SUCCESS_LINK_TYPES.phone && programCourseRun?.inbound_phone_numbers && (
                    <div className="ty-item__info-bold">
                      {programCourseRun?.inbound_phone_numbers.map((number) => (
                        <div key={number.phone_number}>
                          <span>{`${number.region} `}</span>
                          <a
                            href={`tel:${number.phone_number}`}
                            className="link text-primary"
                            data-track={buildTPClickEvent(
                              buildLandingPageTrackingData(
                                EVENT_NAME.EXTERNAL_LINK,
                                EVENT_SOURCE.CLIENT,
                                SECTION_NAMES.HERO,
                                ACTION_TYPES.PHONE_NUMBER,
                                number.phone_number,
                                title,
                                number.region,
                                program,
                                screenName || SCREENS.THANK_YOU_PAGE
                              )
                            )}
                          >
                            {number.phone_number}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )
          )}
        </div>
      )}
      {!isB2B && cta && ctaButton}
    </div>
  )
}

export default ThankYou
