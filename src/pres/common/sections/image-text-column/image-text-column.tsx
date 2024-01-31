import { useContext, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import { BlueprintImageAndTextColumn, ImageAndTextColumnProps } from '@emeritus-engineering/blueprint-core-modules/image-text-column'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import Section from 'pres/common/components/section'
import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { parseToSectionId } from 'utils/common'
import useMediaQueries from 'hooks/useMediaQueries'
import { getSectionColorClassName } from 'utils/contentful'
import { COMPONENT_VARIANTS } from 'constants/contentful'

interface ImageAndTextColumnCustomProps extends ImageAndTextColumnProps {
  title?: string
  className?: string
}

export const ImageAndTextColumn = ({
  introText,
  title,
  content = [],
  disclaimer,
  introCopyAlignment,
  disclaimerCopyAlignment,
  className,
  backgroundColor,
  foregroundColor,
  variant
}: ImageAndTextColumnCustomProps) => {
  const { program, screenName } = useContext(PageLayoutContext)
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const [displaySlider, setDisplaySlider] = useState(false)
  const [draggable, setDraggable] = useState(false)
  const { isHandheldDevice = false, isTabletActive = false, isTabletDevice = false } = useMediaQueries()
  const { t } = useTranslation('common')

  useEffect(() => {
    setDisplaySlider(!isHandheldDevice && content?.length > 3 ? true : false)
    setDraggable(isTabletActive && !isTabletDevice ? content?.length > 3 : true)
  }, [isHandheldDevice, content?.length, isTabletActive, isTabletDevice])

  return (
    <Section
      id={sectionId}
      pY
      className={cn(
        'image-text-wrapper lp-colored--list',
        variant === 'Variant-1' ? COMPONENT_VARIANTS.VARIANT_1 : '',
        className,
        backgroundColor && getSectionColorClassName(backgroundColor)
      )}
    >
      <div className={cn(!(variant === 'Variant-1') ? 'common-slider' : '')}>
        <div className={cn('container')}>
          <BlueprintImageAndTextColumn
            styles={className}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
            slideRemainingSlidesOnly
            title={title}
            introText={introText}
            introCopyAlignment={introCopyAlignment}
            content={content}
            sliderChunk={3}
            displaySlider={displaySlider}
            draggable={draggable}
            disclaimer={disclaimer}
            disclaimerCopyAlignment={disclaimerCopyAlignment}
            variant={variant}
            showMoreText={t('showMore')}
            eventData={buildTPClickEvent(
              buildLandingPageTrackingData(
                EVENT_NAME.INTERNAL_LINK,
                EVENT_SOURCE.CLIENT,
                SECTION_NAMES.SECTION,
                ACTION_TYPES.CTA,
                ACTION_VALUES.EXPAND,
                title,
                t('showMore'),
                program,
                screenName
              )
            )}
          />
        </div>
      </div>
    </Section>
  )
}
