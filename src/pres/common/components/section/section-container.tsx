import { ReactNode, CSSProperties } from 'react'
import cn from 'classnames'
import styles from './section-container.module.scss'

interface Props {
  id: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  pT?: boolean
  pB?: boolean
  pY?: boolean
}

function Section({ children, id, className, style, pY, pT, pB }: Props) {
  return (
    <section
      id={id}
      data-section-id={id}
      style={style}
      className={cn(className, {
        [styles.commonPy]: pY,
        [styles.commonPb]: pB,
        [styles.commonPt]: pT
      })}
    >
      {children}
    </section>
  )
}

export default Section
