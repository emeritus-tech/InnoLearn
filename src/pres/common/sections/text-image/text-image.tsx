import cn from 'classnames'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, Document, Node } from '@contentful/rich-text-types'
import { Entry } from 'contentful'
import { useContext, useState } from 'react'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import ContentfulImage from 'pres/common/components/contentful-image'
import Section from 'pres/common/components/section'
import TextTruncator from 'pres/common/components/text-truncator'
import { TypeComponentButtonFields, TypeComponentTextAndImage } from 'types/contentful-types'
import { parseToSectionId } from 'utils/common'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import ButtonOrLinkCTA from 'pres/common/cta/cta'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { SECTION_NAMES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE } from 'constants/trackpoint'
import { buildLandingPageTrackingData, triggerTrackPoint } from 'utils/trackpoint'
import { ATTRIBUTE_CTA_MODAL, UTM_SOURCE } from 'constants/contentful'
import CTAModal from 'pres/common/cta/cta-modal'
import { getSectionColorClassName } from 'utils/contentful'

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: ({ data }: Node) => {
      const { target } = data
      return (
        <ContentfulImage
          alt=""
          src={target}
          width={700}
          height={475}
          sizes="(min-width: 1em) 33vw,
          (min-width: 48em) 50vw,
          100vw"
        />
      )
    }
  }
}
interface TextImageProps {
  content: Array<TypeComponentTextAndImage>
  className?: string
  disclaimer?: Document
  cta?: Entry<TypeComponentButtonFields>
  backgroundColor?: string
}

function TextImage({ content = [], className, cta, disclaimer, backgroundColor }: TextImageProps) {
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const { leadFormFields, program, screenName, isGaPage } = useContext(PageLayoutContext)
  const { query } = useRouter()
  const { t } = useTranslation()
  const bgColor = backgroundColor && getSectionColorClassName(backgroundColor)

  function handleCTAClick() {
    setLeadFormOpen(!leadFormOpen)
  }

  return (
    <div className="text-image-cntr">
      {content.map(({ fields: { title, description, descriptionNew, truncateAtLine, image, seoImage, reversePosition } }, index) => {
        const { imageTitleText: imgTitle, imageAltText: altText, image: imgSrc } = seoImage?.fields || {}
        return (
          <Section
            id={`${parseToSectionId(title)}-${index}`}
            className={cn('commonPY', className, bgColor)}
            key={`${title}-${index}`}
            pT={!index}
            pB={index === content.length - 1}
          >
            <div className={cn('container', reversePosition ? 'reverse-order' : '')} data-testid="text-image-container">
              <div className="row d-flex justify-content-between align-items-center">
                <div
                  className={cn('col-xl-5 col-lg-6 d-flex align-items-center image-cntr', reversePosition ? 'justify-content-center' : '')}
                >
                  <ContentfulImage src={imgSrc || image} title={imgTitle} alt={altText || title || ''} fill />
                </div>
                <div className="col justify-content-center d-flex flex-column">
                  {title && <SectionHeading title={title} textAlignment="text-lg-left text-center" />}
                  <div className="text-cntr para--two">
                    <TextTruncator numberOfLines={`${truncateAtLine}`}>
                      {descriptionNew ? documentToReactComponents(descriptionNew as Document, options) : description}
                    </TextTruncator>
                  </div>
                  {disclaimer && (
                    <div className="outro-txt para--four disclaimer-txt">{documentToReactComponents(disclaimer as Document)}</div>
                  )}
                  {cta && (
                    <div id={parseToSectionId(cta?.fields.contentfulName)} className={cn('text-image-btn', className)}>
                      {cta?.fields.link === ATTRIBUTE_CTA_MODAL ? (
                        <CTAModal cta={cta} program={program} sectionTitle={title} />
                      ) : (
                        ButtonOrLinkCTA(
                          cta,
                          handleCTAClick,
                          program,
                          title,
                          undefined,
                          '',
                          screenName,
                          query,
                          t('common:applyNow'),
                          isGaPage
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>
        )
      })}
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
                    content[0]?.fields.title,
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
    </div>
  )
}

export default TextImage
