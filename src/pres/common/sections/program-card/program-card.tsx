import cn from 'classnames'
import { useRouter } from 'next/router'
import { useContext, useMemo } from 'react'
import useMediaQueries from 'hooks/useMediaQueries'
import ContentfulImage from 'pres/common/components/contentful-image'
import { TypeComponentProgramCardFields, TypeUtmParamsFields } from 'types/contentful-types'
import { eeLandingPageUrl } from 'utils/common'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import styles from './programs-card.module.scss'

export interface QueryParams extends TypeUtmParamsFields {
  b2c_form?: boolean
  b2b_form?: boolean
  utm_campaign?: string
  utm_term?: string
}

export interface ProgramCardProps extends TypeComponentProgramCardFields {
  'data-track'?: string
  utmParams?: QueryParams
  paymentForm?: boolean
  category?: string
}

function ProgramCard({
  mobileImage,
  seoMobileImage,
  imageicon,
  seoImageIcon,
  title,
  subtitle,
  schoolLogo,
  seoSchoolLogo,
  url,
  'data-track': dataTrack,
  utmParams,
  category,
  paymentForm,
  landingPage
}: ProgramCardProps) {
  const { query } = useRouter()
  const { isMobile } = useMediaQueries()
  const URLutmParams = useMemo(() => {
    const {
      utm_source = utmParams?.utm_source,
      utm_medium = utmParams?.utm_medium,
      utm_campaign = utmParams?.utm_campaign,
      utm_content = utmParams?.utm_content,
      utm_term = utmParams?.utm_term
    } = query

    return {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term
    } as QueryParams
  }, [query, utmParams])

  const fullURL = eeLandingPageUrl(landingPage, url, URLutmParams, paymentForm)
  const { readOnlyProgramCards } = useContext(PageLayoutContext)
  const { image: mobileImageSrc, imageAltText, imageTitleText } = seoMobileImage?.fields || {}
  const { image: imageiconSrc, imageAltText: iconAltText, imageTitleText: iconTitleText } = seoImageIcon?.fields || {}

  const cardContent = useMemo(() => {
    return (
      <div className={cn(styles.card, 'border border-1 rounded-1 overflow-hidden position-relative')}>
        <ContentfulImage
          width="280"
          height="150"
          className={cn(styles.cardImage, 'mb-3')}
          src={
            (isMobile && (mobileImageSrc || mobileImage) ? mobileImageSrc || mobileImage : imageiconSrc || imageicon) ||
            landingPage?.fields.hero_image_mobile
          }
          alt={(isMobile && imageAltText ? imageAltText : iconAltText || title) || landingPage?.fields.program?.fields.description || ''}
          title={(isMobile && imageTitleText ? imageTitleText || title : iconTitleText || title) || landingPage?.fields?.course_title}
        />
        <div className={cn(styles.cardBody, 'px-3 px-md-4 pb-4 mb-5 mb-lg-0')}>
          <p className={cn('text-b2 mb-1 text-uppercase', styles.categoryText)}>{category}</p>
          <p className="fw-semibold mb-1">{title || landingPage?.fields.program?.fields.description}</p>
          <div className={styles.cardText}>
            <span className="text-b2">
              {subtitle || (landingPage?.fields.program?.fields?.current_batch_duration && landingPage?.fields.program.fields?.workload)}
            </span>
          </div>
        </div>
        <div className={cn(styles.schoolLogoContainer, 'd-flex justify-content-between position-absolute w-100 m-3 mx-md-4 mt-5 mb-3')}>
          {(seoSchoolLogo || schoolLogo || landingPage?.fields.school?.fields?.logo_web) && (
            <ContentfulImage
              unoptimized
              fill
              className={styles.schoolLogo}
              src={seoSchoolLogo?.fields?.image || schoolLogo || landingPage?.fields.school?.fields?.logo_web}
              alt={seoSchoolLogo?.fields?.imageAltText || 'Logo school'}
              title={seoSchoolLogo?.fields?.imageTitleText}
            />
          )}
        </div>
      </div>
    )
  }, [readOnlyProgramCards])

  return (
    <div className="col-12 col-md-6 col-lg-3" data-track={dataTrack} data-testid="program-card">
      {readOnlyProgramCards ? (
        <div>{cardContent}</div>
      ) : (
        <a target="_blank" href={fullURL} rel="noreferrer">
          {cardContent}
        </a>
      )}
    </div>
  )
}

export default ProgramCard
