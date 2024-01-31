import cn from 'classnames'
import Link from 'next/link'
import styles from './preview-mode.module.scss'

function PreviewMode() {
  return (
    <div className={cn('d-flex w-100 align-items-center justify-content-center position-fixed bottom-0', styles.wrapper)}>
      <span>PREVIEW MODE ENABLED</span>
      <Link prefetch={false} href="/api/cancel-preview">
        <button type="button" className={styles.exitButton}>
          EXIT_PREVIEW_MODE
        </button>
      </Link>
    </div>
  )
}

export default PreviewMode
