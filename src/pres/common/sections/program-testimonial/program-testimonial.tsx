import { useEffect, useState, useMemo, useContext } from 'react'
import cn from 'classnames'
import { BluePrintSlider } from '@emeritus-engineering/blueprint-core-components/blueprint-slider'
import { Testimonial as BlueprintTestimonialModule } from '@emeritus-engineering/blueprint-core-modules/testimonial'
import DisclaimerText from '@emeritus-engineering/blueprint-core-modules/utils/disclaimer-text'
import IntroText from '@emeritus-engineering/blueprint-core-modules/utils/intro-text'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import { EntryFields } from 'contentful'
import Section from 'pres/common/components/section'
import useMediaQueries from 'hooks/useMediaQueries'
import { TypeComponentProgramTestimonial, TypeSectionModuleFields } from 'types/contentful-types'
import { parseToSectionId } from 'utils/common'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { ACTION_TYPES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { COLOR_MAP } from 'constants/contentful'

interface ProgramTestimonialProps extends TypeSectionModuleFields {
  content: Array<TypeComponentProgramTestimonial>
  title?: string
  className?: string
  introText?: string
  introCopyAlignment?: EntryFields.Boolean
  disclaimer?: EntryFields.RichText
  disclaimerCopyAlignment?: EntryFields.Boolean
}

function ProgramTestimonial({
  content = [],
  title,
  className,
  introText,
  introCopyAlignment,
  disclaimer,
  disclaimerCopyAlignment,
  backgroundColor
}: ProgramTestimonialProps) {
  const { program, screenName } = useContext(PageLayoutContext)
  const [chunks, setChunks] = useState(1)
  const [isDesktopSlide, setIsDesktopSlide] = useState(false)
  const [isTabletSlide, setIsTabletSlide] = useState(false)
  const [isMobileSlide, setIsMobileSlide] = useState(false)
  const { isTabletDevice, isMobile, isTablet } = useMediaQueries()
  const backgroundClass = COLOR_MAP[backgroundColor || 'background-secondary_cta-primary']

  const slides = useMemo(
    () =>
      content.map(({ fields: { name, company = '', testimonialBody, image, seoImage, designation } }, index) => (
        <BlueprintTestimonialModule
          key={index}
          name={name}
          company={company}
          testimonialBody={testimonialBody}
          testimonialImage={image}
          seoImage={seoImage}
          designation={designation}
          backgroundColor={backgroundClass}
        />
      )),
    [content]
  )

  useEffect(() => {
    let slideChunks = 1
    if (isTabletDevice) {
      slideChunks = 3
    } else if (isTablet) {
      slideChunks = 2
    }
    setChunks(slideChunks)
    setIsDesktopSlide(!!isTabletDevice && content.length > 3)
    setIsTabletSlide(isTablet && !isTabletDevice && content.length > 2)
    setIsMobileSlide(isMobile && content.length > 1)
  }, [setChunks, setIsDesktopSlide, setIsMobileSlide, setIsTabletSlide, isTabletDevice, isMobile, isTablet])

  const sectionId = parseToSectionId(title)

  return (
    <Section id={`program-testimonial-${sectionId}`} pY={true} className={cn('testimonial--cards', className)}>
      <div className="container">
        {title && <SectionHeading title={title} textAlignment="text-center" />}
        {introText && <IntroText introCopyAlignment={introCopyAlignment} introText={introText} />}
        <div className={content.length === 1 ? 'd-flex col-md-8 col-12 m-auto' : 'd-flex col-xl-10 col-md-12 col-sm-8 col-12 m-auto'}>
          {isDesktopSlide || isTabletSlide || isMobileSlide ? (
            <BluePrintSlider
              slides={slides}
              chunks={chunks}
              isinfinite={true}
              dataTrack={buildTPClickEvent(
                buildLandingPageTrackingData(
                  EVENT_NAME.TESTIMONIAL,
                  EVENT_SOURCE.CLIENT,
                  SECTION_NAMES.SECTION,
                  ACTION_TYPES.SLIDER,
                  '',
                  title,
                  '',
                  program,
                  screenName
                )
              )}
              componentTitle={sectionId || 'program-testimonial-slider'}
            />
          ) : (
            slides
          )}
        </div>
        {disclaimer && <DisclaimerText disclaimer={disclaimer} disclaimerCopyAlignment={disclaimerCopyAlignment} />}
      </div>
    </Section>
  )
}

export default ProgramTestimonial
