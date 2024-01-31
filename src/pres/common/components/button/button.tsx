/* eslint-disable react/button-has-type */
import cn from 'classnames'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { BluePrintButton } from '@emeritus-engineering/blueprint-core-components/blueprint-button'
import styles from './button.module.scss'

export const BUTTON_STYLES = {
  PRIMARY: 'primary',
  LINK: 'link',
  NONE: 'none'
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  styleType?: (typeof BUTTON_STYLES)[keyof typeof BUTTON_STYLES]
  'data-track'?: string
}

function Button({
  children,
  className,
  onClick,
  styleType = BUTTON_STYLES.PRIMARY,
  'data-track': dataTrack,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  return (
    <BluePrintButton
      type={type}
      className={cn(
        {
          [styles.primary]: styleType === BUTTON_STYLES.PRIMARY,
          'border border-1 rounded-1': styleType === BUTTON_STYLES.PRIMARY,
          [styles.link]: styleType === BUTTON_STYLES.LINK
        },
        className
      )}
      disabled={disabled}
      onClick={onClick}
      data-track={dataTrack}
      priority="none"
    >
      {children}
    </BluePrintButton>
  )
}

export default Button
