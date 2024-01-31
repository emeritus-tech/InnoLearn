import cn from 'classnames'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Button, { BUTTON_STYLES } from 'pres/common/components/button'
import CrossIcon, { CROSS_ICON_COLORS } from 'pres/common/components/icons/cross-icon'
import { buildTPClickEvent } from 'utils/trackpoint'
import MenuIcon from 'pres/common/components/icons/menu-icon'
import { TypeComponentLink, TypeComponentLinkExternal } from 'types/contentful-types'
import styles from './navigation.module.scss'

interface NavigationProps {
  navigationLinks?: Array<TypeComponentLink | TypeComponentLinkExternal>
  foregroundColor?: string
}

function Navigation({ navigationLinks, foregroundColor }: NavigationProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const bodyRef = document.getElementsByTagName('body')[0]

    if (openMenu) {
      bodyRef.style.overflow = 'hidden'
    } else {
      bodyRef.style.overflow = 'auto'
    }
  }, [openMenu])

  const links = useMemo(
    () =>
      navigationLinks?.map(({ fields, sys }) => {
        let url = ''
        let slug = ''
        if ('url' in fields) {
          url = fields.url
        } else {
          slug =
            process.env.NEXT_PUBLIC_APP_ENV === 'development'
              ? `/microsites/${router.query['site-slug']}/${fields?.slug}`
              : `/${fields?.slug}`
        }

        return (
          <li key={slug || url} className="my-0 mx-0 mx-md-2">
            <a
              className="text-weight-medium text-b2 w-100 d-block px-0 py-3 py-md-0 link"
              style={{ color: foregroundColor }}
              href={slug || url}
              rel="noreferrer"
              target={url ? '_blank' : ''}
              data-track={buildTPClickEvent({
                event: fields?.eventName,
                event_properties: {
                  content_data: {
                    componentContentTypeID: sys.contentType?.sys.id
                  }
                }
              })}
            >
              {fields?.title}
            </a>
          </li>
        )
      }),
    [navigationLinks, foregroundColor, router?.query]
  )

  return (
    <>
      <Button
        className={cn('d-flex align-items-center d-md-none', styles.menuIcon)}
        styleType={BUTTON_STYLES.LINK}
        onClick={() => setOpenMenu(!openMenu)}
      >
        {openMenu ? (
          <CrossIcon color={CROSS_ICON_COLORS.BLACK} />
        ) : (
          <>
            <MenuIcon />
            <span className="text-b2">Menu</span>
          </>
        )}
      </Button>
      <nav className={cn('d-md-block', styles.navigation, openMenu ? 'd-block' : 'd-none')}>
        <ul className="d-flex flex-md-row flex-column p-0 m-0 w-100">{links}</ul>
      </nav>
    </>
  )
}

export default Navigation
