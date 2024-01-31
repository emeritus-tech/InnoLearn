import { FunctionComponent } from 'react'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/700.css'
import localFont from '@next/font/local'
import ErrorBoundary from 'pres/common/error-boundary'
import '../styles/globals.scss'

const bluePrintIconFont = localFont({ src: '../fonts/blueprint.woff2' })

interface Props {
  Component: FunctionComponent
  pageProps: any
}

function MyApp({ Component, pageProps }: Props) {
  return (
    <>
      <ErrorBoundary>
        <style jsx global>{`
          .blueprint-icon {
            font-family: ${bluePrintIconFont.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
      </ErrorBoundary>
    </>
  )
}

export default MyApp
