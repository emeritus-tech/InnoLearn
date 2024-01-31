import cn from 'classnames'
import { Document, Block, Inline } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { useCallback, useEffect, useState } from 'react'
import CrossIcon from 'pres/common/components/icons/cross-icon'
import useMediaQueries from 'hooks/useMediaQueries'
import Button, { BUTTON_STYLES } from 'pres/common/components/button'
import { buildTPClickEvent } from 'utils/trackpoint'
import { programsEvents } from 'constants/trackpoint'
import styles, { mobileHeight, desktopHeight } from './ribbon.module.scss'

export interface RibbonProps {
  ribbonText: Block | Inline
  className?: string
  sectionName?: string
  sticky?: boolean
}

function Ribbon({ ribbonText, className, sectionName = '', sticky = true }: RibbonProps) {
  const { isMobile } = useMediaQueries()
  const [isRibbonVisible, setIsRibbonVisible] = useState(true)
  const handleCloseModal = useCallback(() => setIsRibbonVisible(false), [setIsRibbonVisible])

  useEffect(() => {
    const bodyRef = document.getElementsByTagName('body')[0]

    if (sticky) {
      bodyRef.style.marginTop = isMobile ? mobileHeight : desktopHeight
    }

    if (!isRibbonVisible || !sticky) {
      bodyRef.style.marginTop = '0'
    }
  }, [isMobile, ribbonText, isRibbonVisible, sticky])

  if (!ribbonText || !isRibbonVisible) return null

  return (
    <div
      className={cn(
        styles.ribbon,
        'px-5 px-md-0 d-flex justify-content-center align-items-center text-center text-white',
        sticky && 'position-fixed',
        'w-100',
        className
      )}
      data-testid="ribbon"
    >
      {documentToReactComponents(ribbonText as Document)}
      <Button
        data-track={buildTPClickEvent({
          event: programsEvents.closeRibbon,
          event_properties: {
            content_data: {
              sectionName
            }
          }
        })}
        className="d-flex position-absolute p-0"
        styleType={BUTTON_STYLES.LINK}
        onClick={handleCloseModal}
      >
        <CrossIcon />
      </Button>
    </div>
  )
}

export default Ribbon
