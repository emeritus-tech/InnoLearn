import { useMemo, useContext } from 'react'
import { BluePrintVideoModule } from '@emeritus-engineering/blueprint-core-modules/video'
import cn from 'classnames'
import { EntryFields } from 'contentful'
import { TypeComponentVideoFields, TypeComponentVideo } from 'types/contentful-types/TypeComponentVideo'
import { parseToSectionId } from 'utils/common'
import Section from 'pres/common/components/section'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { getSectionColorClassName } from 'utils/contentful'
interface VideoComponentProps extends TypeComponentVideoFields {
  content?: Array<TypeComponentVideo>
  onClick?: () => void
  title?: string
  introText?: string
  introCopyAlignment?: EntryFields.Boolean
  disclaimer?: EntryFields.RichText
  backgroundColor?: string
  disclaimerCopyAlignment?: EntryFields.Boolean
}

export const Video = ({
  contentfulName,
  title,
  introText,
  disclaimer,
  introCopyAlignment,
  disclaimerCopyAlignment,
  content = [],
  onClick,
  backgroundColor
}: VideoComponentProps) => {
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const { program, screenName } = useContext(PageLayoutContext)
  const bgColor = backgroundColor && getSectionColorClassName(backgroundColor)

  return (
    <Section id={sectionId} pY className={bgColor}>
      {content.map(({ fields: { videoLink, videoThumbnail, seoVideoThumbnail, subHeading, highlights } }, index) => (
        <div className={cn(highlights ? 'video-cntr-lg' : 'video-cntr-md')} key={index}>
          <BluePrintVideoModule
            title={title}
            introText={introText}
            introCopyAlignment={introCopyAlignment}
            disclaimer={disclaimer}
            disclaimerCopyAlignment={disclaimerCopyAlignment}
            videoLink={videoLink}
            videoThumbnail={videoThumbnail}
            seoVideoThumbnail={seoVideoThumbnail}
            subHeading={subHeading}
            highlights={highlights}
            contentfulName={title || contentfulName}
            onClick={() => onClick}
            eventData={buildTPClickEvent(
              buildLandingPageTrackingData(
                EVENT_NAME.VIDEO,
                EVENT_SOURCE.CLIENT,
                SECTION_NAMES.VIDEO,
                ACTION_TYPES.VIDEO_PLAY,
                ACTION_VALUES.OPEN,
                '',
                title,
                program,
                screenName
              )
            )}
          />
        </div>
      ))}
    </Section>
  )
}
