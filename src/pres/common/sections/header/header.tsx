import { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import cn from 'classnames'
import { Header as BluePrintHeader } from '@emeritus-engineering/blueprint-core-modules/header'
import { useInView } from 'react-intersection-observer'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { ACTION_TYPES, EVENT_NAME, EVENT_SOURCE, headerEvents, SECTION_NAMES } from 'constants/trackpoint'
import ContentfulImage from 'pres/common/components/contentful-image'
import { DEFAULT_BACKGROUND } from 'constants/colors'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { getPageRouteURL } from 'utils/common'
import { TypeSectionHeaderFields } from 'types/contentful-types'
import { THANK_YOU_PAGE_PARAM } from 'constants/contentful'
import useMediaQueries from 'hooks/useMediaQueries'
import styles from './header.module.scss'

export interface HeaderProps extends Omit<TypeSectionHeaderFields, 'contentfulName'> {
  className?: string
  children?: ReactNode
  activePageLink?: string
  isMicrositeThankyouPage?: boolean
  setHeaderInView?: Dispatch<SetStateAction<boolean>> | Dispatch<SetStateAction<undefined>>
  headerInView?: boolean
  stickyHeaderActiveLink?: string
  onStickyMenuLinkClick?: (slug: string) => void
}

function Header({
  logo,
  seoLogo,
  logoLink,
  secondaryLogo,
  seoSecondaryLogo,
  secondaryLogoLink,
  coBrandedMessage,
  rightMessage,
  backgroundColor,
  className,
  children,
  logoVariants,
  tabReferences,
  activePageLink,
  isMicrositeThankyouPage,
  setHeaderInView,
  headerInView,
  stickyHeaderActiveLink,
  onStickyMenuLinkClick
}: HeaderProps) {
  const { program, screenName } = useContext(PageLayoutContext)
  const [mounted, setMounted] = useState(false)
  const { isMobile } = useMediaQueries()

  const { ref, inView } = useInView({ threshold: 0 })
  const { image, imageAltText, imageTitleText } = seoLogo?.fields || {}
  const {
    image: secondaryLogoImg,
    imageAltText: secondaryLogoAltText,
    imageTitleText: secondaryLogoTitleText
  } = seoSecondaryLogo?.fields || {}

  useEffect(() => {
    !mounted && setMounted(true)
    mounted && !inView && setHeaderInView && (setHeaderInView as Dispatch<SetStateAction<boolean>>)(false)
    mounted && inView && headerInView === false && setHeaderInView && (setHeaderInView as Dispatch<SetStateAction<boolean>>)(true)
  }, [inView])

  return logoVariants && logoVariants !== 'Default' ? (
    <div ref={ref}>
      <BluePrintHeader
        logo={logo}
        seoLogo={seoLogo}
        logoLink={logoLink}
        secondaryLogo={secondaryLogo}
        seoSecondaryLogo={seoSecondaryLogo}
        secondaryLogoLink={secondaryLogoLink}
        coBrandedMessage={coBrandedMessage}
        logoVariants={logoVariants}
        screen={screenName}
        navigationLinks={tabReferences}
        dataTrack={buildTPClickEvent(
          buildLandingPageTrackingData(
            EVENT_NAME.INTERNAL_LINK,
            EVENT_SOURCE.CLIENT,
            SECTION_NAMES.HEADER,
            ACTION_TYPES.URL,
            '',
            '',
            '',
            program,
            screenName
          )
        )}
        getPageRouteBasePath={mounted ? (newPath) => getPageRouteURL(newPath, screenName) : undefined}
        activePageLink={activePageLink}
        isMicrositeThankyouPage={isMicrositeThankyouPage}
        THANK_YOU_PAGE_PARAM={THANK_YOU_PAGE_PARAM}
        isMobile={mounted && isMobile}
        stickyHeaderActiveLink={stickyHeaderActiveLink}
        onStickyMenuLinkClick={(slug) => onStickyMenuLinkClick && onStickyMenuLinkClick(slug)}
      />
    </div>
  ) : (
    <header
      id="header"
      style={{ backgroundColor: backgroundColor ?? DEFAULT_BACKGROUND }}
      className={cn('py-3 px-2 px-lg-4 w-100 d-flex align-items-center justify-content-between', className, styles.container)}
    >
      <div className="flex-grow-1 d-flex">
        <div className="d-flex flex-column align-items-center">
          <div className={cn('position-relative', styles.logos)}>
            <a
              href={logoLink}
              className={cn(logoLink && styles.pointer)}
              rel="noreferrer"
              target={logoLink ? '_blank' : '_self'}
              data-track={buildTPClickEvent(
                buildLandingPageTrackingData(
                  headerEvents.logo,
                  EVENT_SOURCE.CLIENT,
                  SECTION_NAMES.HEADER,
                  ACTION_TYPES.URL,
                  '',
                  '',
                  '',
                  undefined,
                  screenName
                )
              )}
            >
              <ContentfulImage
                fill
                className={styles.logo}
                alt={imageAltText || logo?.fields?.title || ''}
                src={image || logo}
                title={imageTitleText || ''}
                onClick={(e) => {
                  if (!logoLink) e.preventDefault()
                }}
              />
            </a>
            {(secondaryLogoImg || secondaryLogo) && (
              <>
                <div className={styles.separator} />
                <a
                  href={secondaryLogoLink}
                  rel="noreferrer"
                  className={cn(secondaryLogoLink && styles.pointer)}
                  target={secondaryLogoLink ? '_blank' : '_self'}
                  data-track={buildTPClickEvent(
                    buildLandingPageTrackingData(
                      headerEvents.secondaryLogo,
                      EVENT_SOURCE.CLIENT,
                      SECTION_NAMES.HEADER,
                      ACTION_TYPES.URL,
                      ''
                    )
                  )}
                >
                  <ContentfulImage
                    fill
                    className={styles.logo}
                    alt={secondaryLogoAltText || secondaryLogo?.fields?.title || ''}
                    src={secondaryLogoImg || secondaryLogo}
                    title={secondaryLogoTitleText}
                    onClick={(e) => {
                      if (!secondaryLogoLink) e.preventDefault()
                    }}
                  />
                </a>
              </>
            )}
          </div>
          {coBrandedMessage && <div className={cn(styles.coBrandedMessage, 'text-b4')}>{coBrandedMessage}</div>}
        </div>
        {rightMessage && <div className="p-2">{rightMessage}</div>}
      </div>
      {children}
    </header>
  )
}

export default Header
