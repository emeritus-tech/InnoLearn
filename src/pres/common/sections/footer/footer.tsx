import { Footer as BluePrintFooter } from '@emeritus-engineering/blueprint-core-modules/footer'
import cn from 'classnames'
import { useContext } from 'react'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { ACTION_TYPES, SECTION_NAMES, EVENT_SOURCE, EVENT_NAME } from 'constants/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { TypeSectionFooterFields } from 'types/contentful-types'

export interface FooterProps extends TypeSectionFooterFields {
  className?: string
}

function Footer({ contentfulName, body, className, backgroundColor, logo, seoLogo }: FooterProps) {
  const { program, screenName } = useContext(PageLayoutContext)

  return (
    <BluePrintFooter
      contentfulName={contentfulName}
      className={cn(className, 'p-y-20 p-y-lg-30')}
      backgroundColor={backgroundColor?.includes('#') ? '' : backgroundColor}
      logo={logo}
      body={body}
      seoLogo={seoLogo}
      dataTrack={buildTPClickEvent(
        buildLandingPageTrackingData(
          EVENT_NAME.EXTERNAL_LINK,
          EVENT_SOURCE.CLIENT,
          SECTION_NAMES.FOOTER,
          ACTION_TYPES.URL,
          '',
          '',
          '',
          program,
          screenName
        )
      )}
    />
  )
}

export default Footer
