import cn from 'classnames'
import { useContext, useEffect, useMemo, useState, Dispatch, SetStateAction } from 'react'
import { useInView } from 'react-intersection-observer'
import { Hero as BlueprintHero } from '@emeritus-engineering/blueprint-core-modules/hero'
import { EmbededVideo as BlueprintEmbededVideo } from '@emeritus-engineering/blueprint-core-modules/embeded-video'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Section from 'pres/common/components/section'
import { parseToSectionId } from 'utils/common'
import { TypeSectionLandingHeroFields } from 'types/contentful-types'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SCREENS, SECTION_NAMES } from 'constants/trackpoint'
import { getAssetTypeContent } from 'utils/contentful'
import useMediaQueries from 'hooks/useMediaQueries'
import ThankYou from 'pres/common/components/success'
import { buildLandingPageTrackingData, buildTPClickEvent, triggerTrackPoint } from 'utils/trackpoint'
import EnterPriseB2bSuccess from 'pres/common/components/enterprise-b2b-success'
import styles from './hero.module.scss'

interface HeroLandingPagesProps extends TypeSectionLandingHeroFields {
  setIsHeroInView: Dispatch<SetStateAction<boolean>>
}

function HeroLandingPages({
  title,
  subHeadlineText,
  tagline,
  imageBackground,
  videoLink,
  videoTitle,
  videoThumbnail,
  seoVideoThumbnail,
  ratings,
  ratingsSubtext,
  bullets,
  subtitle,
  desktopImage,
  mobileImage,
  foregroundColor,
  setIsHeroInView,
  contentfulName
}: HeroLandingPagesProps) {
  const { leadFormFields, program, programCourseRun, thankYouFields, b2bThankYouFields, navigatedOnThankYouPage } =
    useContext(PageLayoutContext)
  const [popOverState, setPopOverState] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { query } = useRouter()
  const { isMobile } = useMediaQueries()
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const { ref, inView } = useInView({ threshold: 0 })

  useEffect(() => {
    setIsHeroInView(inView)
  }, [inView, setIsHeroInView])

  useEffect(() => {
    setMounted(true)
  }, [])

  const closeOverlay = () => {
    setPopOverState(false)
    triggerTrackPoint(
      'click',
      buildLandingPageTrackingData(
        EVENT_NAME.VIDEO,
        EVENT_SOURCE.CLIENT,
        SECTION_NAMES.HERO,
        ACTION_TYPES.MODAL,
        ACTION_VALUES.CLOSE,
        '',
        videoTitle,
        program,
        SCREENS.LANDING_PAGE
      )
    )
  }

  const isImageFocussed = imageBackground === 'image-focussed'
  const backgroundClassName = imageBackground ? `bg-${isImageFocussed ? 'image-gradient' : imageBackground}` : 'bg-primary'
  const backgroundImage = mounted && isMobile ? mobileImage : desktopImage
  const backgroundImageClass = backgroundImage ? `${backgroundClassName}${isImageFocussed ? '' : '--hero-opacity'}` : backgroundClassName

  return (
    <Section
      id={`hero-${sectionId}`}
      className={cn('overflow-hidden heroWrapper', styles.heroWrapper, backgroundImageClass)}
      style={{
        backgroundImage: backgroundImage && !isImageFocussed ? `url(${getAssetTypeContent(backgroundImage)})` : undefined,
        color: foregroundColor
      }}
    >
      <Head>
        <link type="image/webp" rel="preload" as="image" href={getAssetTypeContent(backgroundImage)} />
      </Head>
      {isImageFocussed && (
        <div
          className="hero-image"
          style={{
            backgroundImage: backgroundImage ? `url(${getAssetTypeContent(backgroundImage)})` : undefined,
            color: foregroundColor
          }}
        ></div>
      )}
      <div className="wrapper">
        <div ref={ref} className="container position-relative">
          <div className={cn('row', isImageFocussed ? 'items--flex-end' : 'align-items-center')}>
            <div className="col-12 col-lg-7 left-col content-wrapper">
              <BlueprintHero
                title={title}
                subHeadlineText={subHeadlineText}
                subtitle={subtitle}
                tagline={tagline}
                ratings={ratings}
                ratingsSubtext={ratingsSubtext}
                videoLink={videoLink}
                videoTitle={videoTitle}
                videoThumbnail={videoThumbnail}
                seoVideoThumbnail={seoVideoThumbnail}
                bullets={bullets}
                onClick={() => setPopOverState(true)}
                eventData={buildTPClickEvent(
                  buildLandingPageTrackingData(
                    EVENT_NAME.VIDEO,
                    EVENT_SOURCE.CLIENT,
                    SECTION_NAMES.HERO,
                    ACTION_TYPES.MODAL,
                    ACTION_VALUES.OPEN,
                    '',
                    videoTitle,
                    program,
                    SCREENS.LANDING_PAGE
                  )
                )}
              />
              {popOverState && (
                <div className="video-modal-container">
                  <BluePrintModal closeOverlay={closeOverlay} modalSize="large" closeOnBackgroudClick isFluidLayout>
                    <BlueprintEmbededVideo
                      videoId={`yt-video-${parseToSectionId(title || contentfulName)}`}
                      videoLink={`${videoLink}?enablejsapi=1` || ''}
                      videoTitle={videoTitle}
                    />
                  </BluePrintModal>
                </div>
              )}
            </div>
            <div className="col-12 col-lg-5 right-col m-t-30 m-t-lg-0">
              <div className={cn('lead-form', styles.leadForm)}>
                {query?.b2b_thank_you || query?.b2c_thank_you ? (
                  <EnterPriseB2bSuccess program={program} isB2C={!!query?.b2c_thank_you} />
                ) : navigatedOnThankYouPage || (query?.thank_you && (thankYouFields || b2bThankYouFields)) ? (
                  <ThankYou
                    b2cThankYouFields={thankYouFields}
                    b2bThankYouFields={b2bThankYouFields}
                    programCourseRun={programCourseRun}
                    program={program}
                  />
                ) : (
                  <LeadFormSection
                    program={program}
                    leadFormFields={leadFormFields}
                    formTitle={leadFormFields?.fields?.formTitle}
                    sectionDetails={{ sectionName: SECTION_NAMES.HERO }}
                    inquiringId={`hero-${sectionId}`}
                    forceB2C={!!query?.b2c_form}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default HeroLandingPages
