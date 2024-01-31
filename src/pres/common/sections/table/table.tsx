import { Table as BlueprintTableModule } from '@emeritus-engineering/blueprint-core-modules/table'
import { EntryFields } from 'contentful'
import useTranslation from 'next-translate/useTranslation'
import { useContext } from 'react'
import cn from 'classnames'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import Section from 'pres/common/components/section'
import { TypeComponentComparisonTableRow } from 'types/contentful-types/TypeComponentComparisonTableRow'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { EVENT_NAME, EVENT_SOURCE, SECTION_NAMES, ACTION_TYPES, ACTION_VALUES } from 'constants/trackpoint'
import { parseToSectionId } from 'utils/common'
import { getSectionColorClassName } from 'utils/contentful'

interface TableProps {
  title?: string
  sectionName?: string
  introText?: string
  introCopyAlignment?: EntryFields.Boolean
  disclaimer?: EntryFields.RichText
  disclaimerCopyAlignment?: EntryFields.Boolean
  className?: string
  content?: Array<TypeComponentComparisonTableRow>
  variant?: 'Variant-1' | 'Variant-2' | 'Variant-3'
  backgroundColor?: string
}

function Table({
  title,
  className,
  content,
  variant,
  introText,
  introCopyAlignment,
  disclaimer,
  disclaimerCopyAlignment,
  backgroundColor
}: TableProps) {
  const { program, screenName } = useContext(PageLayoutContext)
  const { t } = useTranslation('common')
  const bgColor = backgroundColor && getSectionColorClassName(backgroundColor)

  return (
    <Section id={`table-${parseToSectionId(title)}`} pY={true} className={cn(className, bgColor)}>
      <div className="container">
        <BlueprintTableModule
          content={content || []}
          variant={variant}
          showMoreText={t('fullSchedule')}
          title={title}
          introText={introText}
          introCopyAlignment={introCopyAlignment}
          disclaimer={disclaimer}
          disclaimerCopyAlignment={disclaimerCopyAlignment}
          dataTrack={buildTPClickEvent(
            buildLandingPageTrackingData(
              EVENT_NAME.INTERNAL_LINK,
              EVENT_SOURCE.CLIENT,
              SECTION_NAMES.SECTION,
              ACTION_TYPES.URL,
              ACTION_VALUES.SHOW_MORE,
              title,
              t('fullSchedule'),
              program,
              screenName
            )
          )}
        />
      </div>
    </Section>
  )
}

export default Table
