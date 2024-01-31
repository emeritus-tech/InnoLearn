import { Entry } from 'contentful'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components'
import { useContext, useState } from 'react'
import { Document } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { TypeProgram } from 'types/contentful-types'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { triggerTrackPoint } from 'utils/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { TypeComponentCtaModalFields } from 'types/contentful-types/TypeComponentCtaModal'
import Button from '../components/button'

export interface CTAModalProps {
  cta: Entry<TypeComponentCtaModalFields> | undefined
  program?: TypeProgram
  sectionTitle?: string
  sectionName?: string
  classNames?: string
}

const CTAModal = ({ cta, program, sectionName, sectionTitle, classNames }: CTAModalProps) => {
  const [genericModalOpen, setGenericModalOpen] = useState(false)
  const { screenName } = useContext(PageLayoutContext)

  const closeHandler = (event: string, sectionTitle: string | undefined, componentTitle: string | undefined) => {
    const trackDetails = buildLandingPageTrackingData(
      event,
      EVENT_SOURCE.CLIENT,
      SECTION_NAMES.SECTION,
      ACTION_TYPES.CTA_MODAL,
      ACTION_VALUES.CLOSE,
      sectionTitle,
      componentTitle,
      program,
      screenName
    )
    triggerTrackPoint('click', trackDetails)
  }

  const handleCTAClick = () => {
    setGenericModalOpen(true)
  }

  return (
    <div className={classNames ? '' : 'mt-3 d-flex justify-content-center'}>
      <Button
        onClick={handleCTAClick}
        data-track={buildTPClickEvent(
          buildLandingPageTrackingData(
            cta?.fields.eventType || EVENT_NAME.GENERIC,
            EVENT_SOURCE.CLIENT,
            sectionName || SECTION_NAMES.SECTION,
            ACTION_TYPES.CTA_MODAL,
            ACTION_VALUES.OPEN,
            sectionTitle,
            cta?.fields.text,
            program,
            screenName
          )
        )}
        className={classNames || 'col-xl-4 col-lg-6 col-12 btn--primary fw-bold height-control'}
        styleType="none"
      >
        {cta?.fields.text}
      </Button>
      {genericModalOpen && (
        <BluePrintModal
          closeOverlay={() => {
            setGenericModalOpen(false)
            closeHandler(EVENT_NAME.GENERIC, sectionTitle, cta?.fields.text)
          }}
          modalSize="large"
          heading={cta?.fields?.title}
          closeOnBackgroudClick
        >
          {cta?.fields?.description && <div>{documentToReactComponents(cta?.fields?.description as Document)}</div>}
        </BluePrintModal>
      )}
    </div>
  )
}

export default CTAModal
