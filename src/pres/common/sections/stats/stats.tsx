import { Stats as BlueprintStatsModule } from '@emeritus-engineering/blueprint-core-modules/stats'
import { EntryFields } from 'contentful'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import useMediaQueries from 'hooks/useMediaQueries'
import Section from 'pres/common/components/section'
import { TypeComponentStats } from 'types/contentful-types/TypeComponentStats'
import { parseToSectionId } from 'utils/common'
import { currentResolution } from 'utils/resolution'
import { getSectionColorClassName } from 'utils/contentful'

interface StatsProps {
  title?: string
  sectionName?: string
  introText?: string
  introCopyAlignment?: EntryFields.Boolean
  disclaimer?: EntryFields.RichText
  disclaimerCopyAlignment?: EntryFields.Boolean
  className?: string
  content?: Array<TypeComponentStats>
  backgroundColor?: string
}

function Stats({
  title,
  introText,
  introCopyAlignment,
  disclaimer,
  disclaimerCopyAlignment,
  className,
  content,
  backgroundColor
}: StatsProps) {
  const { isTabletActive, isMobileScreen, isTabletLandscape, isWiderDesktop, isLargerDevice } = useMediaQueries()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const bgColor = backgroundColor && getSectionColorClassName(backgroundColor)

  return mounted ? (
    <Section id={`stats-${parseToSectionId(title)}`} pY={true} className={cn(className, bgColor)}>
      <div className="container">
        <BlueprintStatsModule
          title={title || ''}
          content={content || []}
          introText={introText}
          introCopyAlignment={introCopyAlignment}
          disclaimer={disclaimer}
          disclaimerCopyAlignment={disclaimerCopyAlignment}
          currentResolution={currentResolution(isTabletActive, isMobileScreen, isTabletLandscape, isWiderDesktop, isLargerDevice)}
        />
      </div>
    </Section>
  ) : null
}

export default Stats
