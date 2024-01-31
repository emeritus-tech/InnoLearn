import { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components'
import { ImageBlock as BlueprintImageBlock } from '@emeritus-engineering/blueprint-core-modules/image-content'
import { TypeComponentButtonFields } from '@emeritus-engineering/blueprint-core-modules/types/contentful-types/TypeComponentButton'
import { Entry, EntryFields } from 'contentful'
import LeadFormSection from 'pres/common/components/lead-form-section'
import Section from 'pres/common/components/section'
import { TypeComponentImageBlock } from 'types/contentful-types/TypeComponentImageBlock'
import { parseToSectionId } from 'utils/common'
import useMediaQueries from 'hooks/useMediaQueries'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { buildLandingPageTrackingData, triggerTrackPoint } from 'utils/trackpoint'
import { ATTRIBUTE_CTA_LEADFORM_Modal, UTM_SOURCE } from 'constants/contentful'
import { EVENT_NAME, EVENT_SOURCE, SECTION_NAMES, ACTION_VALUES, ACTION_TYPES } from 'constants/trackpoint'

export interface ImageBlockComponentProps {
  content: Array<TypeComponentImageBlock>
  title: string
  cta?: Entry<TypeComponentButtonFields>
  introText?: string
  introCopyAlignment?: EntryFields.Boolean
  disclaimer?: EntryFields.RichText
  disclaimerCopyAlignment?: EntryFields.Boolean
}

const ImageBlock = ({
  title,
  introText,
  introCopyAlignment,
  content,
  cta,
  disclaimer,
  disclaimerCopyAlignment
}: ImageBlockComponentProps) => {
  useEffect(() => {
    setMounted(true)
  }, [])

  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const { leadFormFields, program, screenName } = useContext(PageLayoutContext)
  const { query } = useRouter()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const { isMobile } = useMediaQueries()
  const [leadFormOpen, setLeadFormOpen] = useState(false)

  const leadFormHandler = () => {
    if (cta?.fields?.link === ATTRIBUTE_CTA_LEADFORM_Modal) {
      setLeadFormOpen(!leadFormOpen)
    }
    triggerTrackPoint(
      'click',
      buildLandingPageTrackingData(
        cta?.fields?.eventType || EVENT_NAME.LEAD_POP_UP,
        EVENT_SOURCE.CLIENT,
        SECTION_NAMES.SECTION,
        ACTION_TYPES.CTA,
        ACTION_VALUES.OPEN,
        title,
        cta?.fields?.text,
        program,
        screenName
      )
    )
  }

  return (
    <Section pY={true} id={sectionId}>
      {content.map(({ fields: { body, imageBlockSize, mobileImage, image, seoImage, seoMobileImage } }, index) => (
        <BlueprintImageBlock
          key={index}
          title={title}
          introText={introText}
          introCopyAlignment={introCopyAlignment}
          disclaimer={disclaimer}
          disclaimerCopyAlignment={disclaimerCopyAlignment}
          cta={cta}
          body={body}
          image={mounted && isMobile && mobileImage ? mobileImage : image}
          seoImage={mounted && isMobile && seoMobileImage ? seoMobileImage : seoImage}
          imageBlockSize={imageBlockSize}
          handleClick={leadFormHandler}
        />
      ))}

      {leadFormOpen && leadFormFields && (
        <div className="lead-form-modal lead-form-cntr">
          <BluePrintModal
            modalSize="small"
            closeOverlay={() => {
              setLeadFormOpen(false)
              if (program) {
                triggerTrackPoint(
                  'click',
                  buildLandingPageTrackingData(
                    cta?.fields?.eventType || EVENT_NAME.LEAD_POP_UP,
                    EVENT_SOURCE.CLIENT,
                    SECTION_NAMES.SECTION,
                    '',
                    ACTION_VALUES.CLOSE,
                    title,
                    cta?.fields?.text,
                    program
                  )
                )
              }
            }}
            heading={query.utm_source === UTM_SOURCE.referral ? t('leadForm: referralLeadFormTitle') : leadFormFields.fields?.formTitle}
            closeOnBackgroudClick
          >
            <LeadFormSection
              program={program}
              leadFormFields={leadFormFields}
              sectionDetails={{ sectionTitle: '' }}
              inquiringId={parseToSectionId(cta?.fields.contentfulName)}
            />
          </BluePrintModal>
        </div>
      )}
    </Section>
  )
}
export default ImageBlock
