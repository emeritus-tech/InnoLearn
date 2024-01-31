import cn from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { BluePrintSlider } from '@emeritus-engineering/blueprint-core-components/blueprint-slider'
import DisclaimerText from '@emeritus-engineering/blueprint-core-modules/utils/disclaimer-text'
import IntroText from '@emeritus-engineering/blueprint-core-modules/utils/intro-text'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import dynamic from 'next/dynamic'
import { EntryFields } from 'contentful'
import ContentfulImage from 'pres/common/components/contentful-image'
import Section from 'pres/common/components/section'
import { partnerLogosEvents } from 'constants/trackpoint'
import { parseToSectionId } from 'utils/common'
import { searchPath } from 'utils/search'
import { buildTPClickEvent } from 'utils/trackpoint'
import { TypeComponentPartnerLogo } from 'types/contentful-types'
import useMediaQueries from 'hooks/useMediaQueries'

const DynamicIconList = dynamic(() => import('./icon-list'), { ssr: false })

interface Props {
  title?: string
  content: Array<TypeComponentPartnerLogo>
  introText: string
  introCopyAlignment?: EntryFields.Boolean
  disclaimer: EntryFields.RichText
  disclaimerCopyAlignment?: EntryFields.Boolean
}

function PartnerLogos({ content = [], title, introText, introCopyAlignment, disclaimer, disclaimerCopyAlignment }: Props) {
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const { lang } = useTranslation()
  const { isExtraSmallDevice, isMobileScreen, isTabletAndDesktop, isMediumDevice } = useMediaQueries()
  const [sliderChunk, setSliderChunk] = useState(2)
  const logos = useMemo(
    () => ({
      logoElements: content.map((partner, index) => {
        const { imageTitleText, image, imageAltText } = partner?.fields?.seoLogo?.fields || {}
        const logo = partner?.fields?.logo
        return (
          <a
            style={{ pointerEvents: partner.fields?.school?.fields?.id ? 'auto' : 'none' }}
            href={searchPath(lang, partner.fields?.school?.fields?.id)}
            className="logo-parent display-block"
            key={`partner-logos-${index}`}
            data-track={buildTPClickEvent({
              event: partnerLogosEvents.click,
              event_properties: {
                partner_name: partner.fields?.contentfulName
              }
            })}
          >
            <ContentfulImage
              className="logo"
              fill
              title={imageTitleText || ''}
              alt={imageAltText || logo?.fields?.title}
              src={partner?.fields?.school?.fields?.logo_web || image || logo}
            />
          </a>
        )
      }),
      shouldAutoScroll: content.every((partner) => !!partner?.fields?.school?.fields?.id)
    }),
    [content, lang]
  )

  useEffect(() => {
    let chunks = 5
    if (isTabletAndDesktop) chunks = 3
    if (isMobileScreen || isMediumDevice) chunks = 2
    if (isExtraSmallDevice) chunks = 1
    setSliderChunk(chunks)
  }, [setSliderChunk, isExtraSmallDevice, isMobileScreen, isTabletAndDesktop, isMediumDevice])

  const shouldRenderSlider = logos?.logoElements.length > 5
  const shouldAutoScroll = !logos?.shouldAutoScroll
  return (
    <Section id={`partner-logos-${sectionId}`} className={cn({ 'partner-logos--cntr': !!title })} pY>
      <div className={`common-slider ${shouldRenderSlider && !shouldAutoScroll ? 'manual-slider' : ''}`}>
        <div className="container">
          {title && (
            <div className="m-x-xs-12 m-x-lg-0">
              <SectionHeading title={title} textAlignment="text-center" />
            </div>
          )}
          {introText && (
            <div className="m-x-xs-12 m-x-lg-0">
              <IntroText introCopyAlignment={introCopyAlignment} introText={introText} />
            </div>
          )}
          {shouldRenderSlider ? (
            <div className="display--flex logo-wrapper">
              <BluePrintSlider
                slides={logos?.logoElements}
                chunks={sliderChunk}
                autoSlide={shouldAutoScroll}
                isinfinite={shouldAutoScroll}
                componentTitle={sectionId || 'partner-logos-slider'}
              />
            </div>
          ) : (
            <div className="logo-container">
              <DynamicIconList
                logos={logos?.logoElements}
                isExtraSmallDevice={isExtraSmallDevice}
                isMobileScreen={isMobileScreen}
                isTabletAndDesktop={isTabletAndDesktop}
                isMediumDevice={isMediumDevice}
              />
            </div>
          )}
          {disclaimer && <DisclaimerText disclaimer={disclaimer} disclaimerCopyAlignment={disclaimerCopyAlignment} />}
        </div>
      </div>
    </Section>
  )
}

export default PartnerLogos
