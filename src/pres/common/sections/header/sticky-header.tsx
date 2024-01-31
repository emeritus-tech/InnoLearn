import { Header as BluePrintHeader } from '@emeritus-engineering/blueprint-core-modules/header'
import { Entry } from 'contentful'
import { useContext, useEffect, useState } from 'react'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import { THANK_YOU_PAGE_PARAM } from 'constants/contentful'
import { getPageRouteURL, parseToSectionId } from 'utils/common'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import useMediaQueries from 'hooks/useMediaQueries'
import { TypeComponentButtonFields, TypeSectionHeaderFields } from 'types/contentful-types'
import { program } from '__test__/mocks/landingPage/program'
import { EVENT_NAME, EVENT_SOURCE, SECTION_NAMES, ACTION_VALUES, ACTION_TYPES } from 'constants/trackpoint'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { triggerTrackPoint, buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'

interface StickyHeaderProps {
  isHeaderInView?: boolean
  stickyHeaderProps: Entry<TypeSectionHeaderFields>
  activePageLink: string
  isMicrositeThankyouPage: boolean
  isMicrositePage: boolean
  onStickyMenuLinkClick: (slug: string) => void
  cta?: Entry<TypeComponentButtonFields>
}

export function StickyHeader({
  isHeaderInView,
  stickyHeaderProps,
  activePageLink,
  isMicrositeThankyouPage,
  onStickyMenuLinkClick,
  cta
}: StickyHeaderProps) {
  const { screenName, leadFormFields } = useContext(PageLayoutContext)
  const [mounted, setMounted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { isMobile } = useMediaQueries()

  useEffect(() => {
    setMounted(true)
  }, [])

  return !isHeaderInView ? (
    <>
      <BluePrintHeader
        logo={stickyHeaderProps.fields?.logo}
        logoLink={stickyHeaderProps.fields?.logoLink}
        coBrandedMessage={stickyHeaderProps.fields?.coBrandedMessage}
        logoVariants={stickyHeaderProps.fields?.logoVariants}
        screen={screenName}
        navigationLinks={stickyHeaderProps.fields?.tabReferences}
        getPageRouteBasePath={mounted ? (newPath) => getPageRouteURL(newPath, screenName) : undefined}
        activePageLink={activePageLink}
        isMicrositeThankyouPage={isMicrositeThankyouPage}
        THANK_YOU_PAGE_PARAM={THANK_YOU_PAGE_PARAM}
        isMobile={mounted && isMobile}
        isHeaderSticky
        onStickyMenuLinkClick={onStickyMenuLinkClick}
        onCtaClick={() => setModalOpen(true)}
        cta={cta}
        ctaTrackingData={buildTPClickEvent(
          buildLandingPageTrackingData(
            cta?.fields?.eventType || EVENT_NAME.LEAD_POP_UP,
            EVENT_SOURCE.CLIENT,
            SECTION_NAMES.HEADER,
            ACTION_TYPES.CTA,
            '',
            '',
            cta?.fields?.text,
            program,
            screenName
          )
        )}
      />
      {modalOpen && leadFormFields && (
        <div className="lp-colored--list">
          <div className="lead-form-modal lead-form-cntr">
            <BluePrintModal
              modalSize="small"
              closeOverlay={() => {
                setModalOpen(false)
                if (program) {
                  triggerTrackPoint(
                    'click',
                    buildLandingPageTrackingData(
                      cta?.fields?.eventType || EVENT_NAME.LEAD_POP_UP,
                      EVENT_SOURCE.CLIENT,
                      SECTION_NAMES.HEADER,
                      '',
                      ACTION_VALUES.CLOSE,
                      '',
                      cta?.fields?.text,
                      program,
                      screenName
                    )
                  )
                }
              }}
              heading={leadFormFields.fields?.formTitle}
              closeOnBackgroudClick
            >
              <LeadFormSection
                program={program}
                leadFormFields={leadFormFields}
                sectionDetails={{ sectionName: SECTION_NAMES.HEADER, sectionTitle: '' }}
                inquiringId={parseToSectionId(cta?.fields.contentfulName)}
              />
            </BluePrintModal>
          </div>
        </div>
      )}
    </>
  ) : null
}
