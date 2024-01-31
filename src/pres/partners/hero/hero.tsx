import cn from 'classnames'
import { useContext, useEffect, useMemo, useState } from 'react'
import { BluePrintChips, BluePrintSlider } from '@emeritus-engineering/blueprint-core-components'
import { getAssetTypeContent } from 'utils/contentful'
import ContentfulImage from 'pres/common/components/contentful-image'
import Section from 'pres/common/components/section'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { buildQueryString, parseToSectionId } from 'utils/common'
import { TypeSectionHeroPartnersFields } from 'types/contentful-types'
import { EVENT_NAME, EVENT_SOURCE, SECTION_NAMES, ACTION_TYPES } from 'constants/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import useMediaQueries from 'hooks/useMediaQueries'
import { useURLutmParams } from 'hooks/useUTMQueryParams'
import styles from './hero.module.scss'

function Hero({
  title,
  subtitle,
  subHeadlineText,
  links = [],
  features,
  image,
  foregroundColor,
  heroVariant
}: TypeSectionHeroPartnersFields) {
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const [showSlider, setShowSlider] = useState(false)
  // const [mounted, setMounted] = useState(false)
  const { contextValue, setContextValue, screenName } = useContext(PageLayoutContext)
  const utmParams = useURLutmParams()
  const { isExtraSmallDevice, isHandheldDevice } = useMediaQueries()

  const getPills = useMemo(
    () =>
      links?.map(({ fields }) => {
        let url = '',
          slug = ''
        if ('url' in fields) {
          url = fields.url + `${Object.keys(utmParams).length > 0 ? `?${buildQueryString(utmParams)}` : ''}`
        } else {
          slug = fields.slug
        }
        return (
          <BluePrintChips
            labelText={fields?.title}
            iconName=""
            key={fields?.title}
            backgroundColor=" "
            textColor=" "
            variant="anchor"
            link={url || `#${slug}`}
            external={!!url}
            data-track={buildTPClickEvent(
              buildLandingPageTrackingData(
                slug ? EVENT_NAME.INTERNAL_LINK : EVENT_NAME.EXTERNAL_LINK,
                EVENT_SOURCE.CLIENT,
                SECTION_NAMES.STATIC_BAR,
                ACTION_TYPES.URL,
                url || `#${slug}`,
                title,
                url ? fields?.title : slug,
                undefined,
                screenName
              )
            )}
          />
        )
      }),
    [links.length, title, subtitle, image, foregroundColor, screenName, utmParams]
  )

  useEffect(() => {
    setShowSlider(!isHandheldDevice && links?.length > 5)
  }, [isHandheldDevice, links?.length])

  useEffect(() => {
    links?.length > 0 && setContextValue && setContextValue({ stickyPills: true })
    // setMounted(true)
  }, [])

  return (
    <>
      <Section
        id={`hero${sectionId ? `-${sectionId}` : ''}`}
        className={cn(
          'overflow-hidden position-relative',
          {
            'dark-colors': heroVariant === 'Without Tint Black Font',
            'light-colors': heroVariant === 'Without Tint White Font',
            'common-hero text-white': heroVariant === 'Default' || !heroVariant
          },
          styles.wrapper
        )}
        style={{
          backgroundImage: image ? `url(${getAssetTypeContent(image)})` : undefined,
          color: foregroundColor
        }}
      >
        <div className={cn(styles.contentContainer, 'container position-relative')}>
          <div className="row">
            <div className="m-auto col-12">
              <h1 className="large-text-2 text-weight-semibold text-center m-auto">{title}</h1>
              <h4 className={cn('text-weight-semibold text-center')}>{subtitle}</h4>
              {subHeadlineText && <p className="para--two text-center m-t-10 m-b-0">{subHeadlineText}</p>}
            </div>
          </div>
          <div className={cn('row justify-content-center text-sm-center', styles.featureContainer)}>
            {features?.map((feature, index) => {
              const seoIcon = feature?.fields?.seoIcon?.fields
              const icon = feature?.fields?.icon
              return (
                <div
                  className={cn('col-12 col-sm-4 d-flex d-sm-block align-items-center', styles.featureItem)}
                  data-testid="hero-feature"
                  key={`feature-${index}`}
                >
                  <div className={cn('', styles.featureImageParent)}>
                    <ContentfulImage
                      height={22}
                      width={22}
                      title={seoIcon?.imageTitleText || ''}
                      src={seoIcon?.image || icon}
                      alt={seoIcon?.imageAltText || icon?.fields?.title}
                    />
                  </div>
                  <div className={cn('', styles.featureInfo)}>
                    <h5 className="text-weight-semibold mb-0">{feature?.fields?.description}</h5>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Section>
      {links?.length > 0 && (
        <Section
          className={cn('col-12 secondary-light-background-color', styles.wrapper, styles.pillsParent, contextValue && styles.sticky)}
          id={`hero-pills${sectionId ? `-${sectionId}` : ''}`}
        >
          <div className="m-auto">
            <div className="common-slider">
              <div className="container">
                <div className={cn('row justify-content-center text-sm-center slider-wrapper m-0')}>
                  <div className={cn('col-12 display--flex justify-content-center align-items-center slider-parent p-0')}>
                    {showSlider ? (
                      <BluePrintSlider
                        slides={getPills}
                        chunks={5}
                        hasVariableWidthContent
                        dots={false}
                        showSlider={(show: boolean) => setShowSlider(show)}
                        componentTitle={sectionId || 'partner-pills-slider'}
                      />
                    ) : (
                      <div className="swipe">{getPills}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}
    </>
  )
}

export default Hero
