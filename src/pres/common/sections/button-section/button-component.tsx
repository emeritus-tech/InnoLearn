import cn from 'classnames'
import { useContext } from 'react'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { ACTION_TYPES, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'

interface ButtonProps {
  text: string
  link: string
  openInNewTab: boolean
  eventName: string
  className?: string
  eventType?: string
  title?: string
}

function ButtonComponent({ text, link, openInNewTab, eventName, className, eventType, title }: ButtonProps) {
  const { program, screenName } = useContext(PageLayoutContext)

  return (
    <a
      href={link}
      rel="noreferrer"
      target={openInNewTab ? '_blank' : '_self'}
      className={cn(
        className,
        `btn border border-1 rounded-1 mt-2 mb-2 text-center
        align-self-stretch align-self-md-center flex-column text-weight-bold text-dark`
      )}
      data-track={buildTPClickEvent(
        buildLandingPageTrackingData(
          eventType || '',
          EVENT_SOURCE.CLIENT,
          SECTION_NAMES.SECTION,
          ACTION_TYPES.CTA,
          link,
          title,
          text,
          program || undefined,
          screenName
        )
      )}
    >
      {text}
    </a>
  )
}

export default ButtonComponent
