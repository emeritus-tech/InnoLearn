import cn from 'classnames'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import Button, { BUTTON_STYLES } from '../button'
import styles from './text-truncator.module.scss'

interface TextTruncatorProps {
  children: ReactNode
  numberOfLines?: string
  className?: string
}

function TextTruncator({ numberOfLines = '1', children, className = '' }: TextTruncatorProps) {
  const { t } = useTranslation('common')
  const [isShowMore, setIsShowMore] = useState(true)
  const [isShowMoreVisible, setIsShowMoreVisible] = useState(true)
  const [currentLines, setCurrentLines] = useState(numberOfLines)
  const ref = useRef<HTMLDivElement>(null)
  const handleReadMore = useCallback(() => {
    setIsShowMore(false)
    setCurrentLines('0')
  }, [setIsShowMore])

  useEffect(() => {
    if (ref.current && ref.current.offsetHeight !== ref.current.scrollHeight) {
      setIsShowMoreVisible(true)
    } else {
      setIsShowMoreVisible(false)
    }
  }, [ref])

  return (
    <div
      className={cn(
        'd-flex',
        {
          'flex-column align-items-baseline': currentLines !== '1',
          'align-items-center': currentLines === '1'
        },
        className
      )}
    >
      <div
        ref={ref}
        className={cn(styles.container, `${styles[`lineClamp${currentLines}`]}`, {
          [styles.closedContainer]: isShowMoreVisible && isShowMore
        })}
      >
        {children}
      </div>
      {isShowMoreVisible && isShowMore && (
        <Button className="text-nowrap px-0" styleType={BUTTON_STYLES.LINK} onClick={handleReadMore}>
          {t('readMore')}
        </Button>
      )}
    </div>
  )
}

export default TextTruncator
