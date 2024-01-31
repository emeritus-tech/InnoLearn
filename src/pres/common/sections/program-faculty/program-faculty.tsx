import { useEffect, useState, useMemo, useContext } from 'react'
import { BluePrintSlider } from '@emeritus-engineering/blueprint-core-components/blueprint-slider'
import { ProgramFaculty as BlueprintFacultyModule } from '@emeritus-engineering/blueprint-core-modules/program-faculty'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import DisclaimerText from '@emeritus-engineering/blueprint-core-modules/utils/disclaimer-text'
import IntroText from '@emeritus-engineering/blueprint-core-modules/utils/intro-text'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import classNames from 'classnames'
import { EntryFields } from 'contentful'
import Section from 'pres/common/components/section'
import useMediaQueries from 'hooks/useMediaQueries'
import { TypeComponentProgramFaculty } from 'types/contentful-types'
import { parseToSectionId } from 'utils/common'
import { buildLandingPageTrackingData, buildTPClickEvent, triggerTrackPoint } from 'utils/trackpoint'
import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { getSectionColorClassName } from 'utils/contentful'
import { COMPONENT_VARIANTS } from 'constants/contentful'

interface ProgramFacultyComponentProps {
  content: Array<TypeComponentProgramFaculty>
  title?: string
  variant?: string
  backgroundColor?: string
  introText?: string
  introCopyAlignment?: EntryFields.Boolean
  disclaimer?: EntryFields.RichText
  disclaimerCopyAlignment?: EntryFields.Boolean
}

const chunksMap: { [key: string]: number } = {
  'variant-1': 3,
  'variant-2': 4,
  'variant-3': 0,
  'variant-4': 2
}

function ProgramFaculty({
  content = [],
  title,
  variant,
  introText,
  introCopyAlignment,
  disclaimer,
  disclaimerCopyAlignment,
  backgroundColor
}: ProgramFacultyComponentProps) {
  const { program, screenName } = useContext(PageLayoutContext)
  const [chunks, setChunks] = useState(1)
  const [isDesktopSlide, setIsDesktopSlide] = useState(false)
  const [isMobileSlide, setIsMobileSlide] = useState(false)
  const [popOverState, setPopOverState] = useState(false)
  const [activeFaculty, setActiveFaculty] = useState<number>()
  const { isTabletDevice } = useMediaQueries()

  function handleLoadMoreClick(index: number) {
    setPopOverState(!popOverState)
    setActiveFaculty(index)
  }

  function closeOverlay(facultyTitle: string) {
    const trackDetails = buildLandingPageTrackingData(
      EVENT_NAME.SPEAKER,
      EVENT_SOURCE.CLIENT,
      SECTION_NAMES.SECTION,
      ACTION_TYPES.MODAL,
      ACTION_VALUES.CLOSE,
      title,
      facultyTitle,
      program,
      screenName
    )
    triggerTrackPoint('click', trackDetails)
    setPopOverState(false)
  }
  const isSquareFacultyVariant = variant?.toLocaleLowerCase() === COMPONENT_VARIANTS.VARIANT_4

  const slides = useMemo(
    () =>
      content.map(({ fields: { facultyName, designation, image, seoImage, bio, moreInfoLabel } }, index) => (
        <BlueprintFacultyModule
          key={index}
          facultyName={facultyName}
          designation={designation}
          facultyImage={image}
          seoImage={seoImage}
          bio={bio}
          moreInfoLinkText={moreInfoLabel}
          onClick={() => handleLoadMoreClick(index)}
          showBio={(!variant || isSquareFacultyVariant) && ((chunks > 1 && content.length >= 1) || chunks < 2)}
          variant={!isSquareFacultyVariant ? variant : ''}
          dataTrack={buildTPClickEvent(
            buildLandingPageTrackingData(
              EVENT_NAME.SPEAKER,
              EVENT_SOURCE.CLIENT,
              SECTION_NAMES.SECTION,
              ACTION_TYPES.MODAL,
              ACTION_VALUES.OPEN,
              title,
              facultyName,
              program,
              screenName
            )
          )}
          facultyImageShape={isSquareFacultyVariant ? 'square' : undefined}
        />
      )),
    [chunks]
  )

  useEffect(() => {
    let slideChunks = 1
    if (isTabletDevice) {
      slideChunks = variant ? chunksMap[variant?.toLocaleLowerCase()] : 2
    }
    setChunks(slideChunks)
    setIsDesktopSlide(!!isTabletDevice && (variant ? content.length > slideChunks : content.length > 2))
    setIsMobileSlide(!isTabletDevice && content.length > 1)
  }, [isTabletDevice])

  const sectionId = parseToSectionId(title)
  return (
    <>
      <Section
        id={`program-faculty-${parseToSectionId(title)}`}
        pY
        className={classNames('faculty-section', backgroundColor && getSectionColorClassName(backgroundColor))}
      >
        <div className={classNames('container', variant && 'mw-sm-100')}>
          {/* For slider variants of faculty we are showing the section Title on top of slider */}
          {title && !(chunks > 0 && isDesktopSlide && variant && !isSquareFacultyVariant) && (
            <SectionHeading title={title} textAlignment={variant && !isSquareFacultyVariant ? 'text-left' : 'text-center'} />
          )}
          {introText &&
            !(chunks > 0 && isDesktopSlide && variant) &&
            (variant ? (
              <IntroText introCopyAlignment={true} introText={introText} />
            ) : (
              <IntroText introCopyAlignment={introCopyAlignment} introText={introText} />
            ))}
          <div
            className={classNames(
              'd-flex',
              `col-md-${variant && !isSquareFacultyVariant ? '12' : '10'}`,
              `col-sm-${variant && !isSquareFacultyVariant ? '12' : '8'}`,
              'col-12 m-auto'
            )}
          >
            {chunks > 0 && (isDesktopSlide || (isMobileSlide && (!variant || isSquareFacultyVariant))) ? (
              !variant || isSquareFacultyVariant ? (
                <BluePrintSlider
                  slides={slides}
                  chunks={chunks}
                  dots
                  isinfinite={true}
                  dataTrack={buildTPClickEvent(
                    buildLandingPageTrackingData(
                      EVENT_NAME.SPEAKER,
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
                  componentTitle={sectionId || 'program-faculty-slider'}
                />
              ) : (
                <div className="faculty-slider-variation">
                  <BluePrintSlider
                    slides={slides}
                    chunks={chunks}
                    navigationArrowsOnTop
                    slideRemainingSlidesOnly
                    sliderTitle={title}
                    dots={false}
                    dataTrack={buildTPClickEvent(
                      buildLandingPageTrackingData(
                        EVENT_NAME.SPEAKER,
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
                    componentTitle={sectionId || 'program-faculty-slider'}
                  />
                </div>
              )
            ) : (
              <div className="swipe">
                <div className={`faculty__items${variant ? '-variant' : ''}${variant?.includes('3') ? '-3' : ''}`}>{slides}</div>
              </div>
            )}
          </div>
          {disclaimer && <DisclaimerText disclaimer={disclaimer} disclaimerCopyAlignment={disclaimerCopyAlignment} />}
        </div>
      </Section>
      {activeFaculty !== undefined && popOverState && (
        <BluePrintModal
          closeOverlay={() => closeOverlay(content[activeFaculty]?.fields?.facultyName)}
          modalSize="large"
          closeOnBackgroudClick
        >
          <BlueprintFacultyModule
            facultyName={content[activeFaculty]?.fields?.facultyName}
            designation={content[activeFaculty]?.fields?.designation}
            facultyImage={content[activeFaculty]?.fields?.image}
            seoImage={content[activeFaculty]?.fields?.seoImage}
            bio={content[activeFaculty]?.fields?.bio}
            showFullBio={true}
            facultyImageShape={variant ? 'square' : undefined}
          />
        </BluePrintModal>
      )}
    </>
  )
}

export default ProgramFaculty
