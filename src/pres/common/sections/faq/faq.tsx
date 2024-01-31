import { useContext, useMemo, useState } from 'react'
import { Document } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import cn from 'classnames'
import { Entry, EntryFields } from 'contentful'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import { BluePrintAccordion } from '@emeritus-engineering/blueprint-core-components/blueprint-accordion'
import DisclaimerText from '@emeritus-engineering/blueprint-core-modules/utils/disclaimer-text'
import IntroText from '@emeritus-engineering/blueprint-core-modules/utils/intro-text'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { buildLandingPageTrackingData, buildTPClickEvent, triggerTrackPoint } from 'utils/trackpoint'
import Section from 'pres/common/components/section'
import { parseToSectionId } from 'utils/common'
import { ATTRIBUTE_CTA_MODAL, UTM_SOURCE } from 'constants/contentful'
import { TypeComponentButtonFields, TypeComponentFaq } from 'types/contentful-types'
import ButtonOrLinkCTA from 'pres/common/cta/cta'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { ACTION_VALUES, SECTION_NAMES, EVENT_NAME, EVENT_SOURCE, SCREENS } from 'constants/trackpoint'
import CTAModal from 'pres/common/cta/cta-modal'
import { getSectionColorClassName } from 'utils/contentful'

interface FaqProps {
  content: Array<TypeComponentFaq>
  title: string
  introText: string
  introCopyAlignment?: EntryFields.Boolean
  disclaimer: EntryFields.RichText
  disclaimerCopyAlignment?: EntryFields.Boolean
  className?: string
  sectionName?: string
  cta?: Entry<TypeComponentButtonFields>
  backgroundColor?: string
}

function Faq({
  content,
  title,
  introText,
  introCopyAlignment,
  className = '',
  cta,
  disclaimer,
  disclaimerCopyAlignment,
  backgroundColor
}: FaqProps) {
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const { leadFormFields, program, screenName, isGaPage } = useContext(PageLayoutContext)
  const { query } = useRouter()
  const { t } = useTranslation()

  function handleCTAClick() {
    setLeadFormOpen(!leadFormOpen)
  }

  const accordion = useMemo(
    () =>
      content.map(({ fields: { questionText, answerText } }, index) => {
        return (
          <BluePrintAccordion
            title={<div className="fw-bold small-text-1 m-0 text-color">{questionText}</div>}
            key={index}
            accordionClassNames={cn({ 'border-top': index === 0 })}
            counter={screenName === SCREENS.REFERRAL_PAGE ? undefined : index + 1}
            accordionItemClassNames="accordion__tab--large"
            content={<div className="para--two text-color">{documentToReactComponents(answerText as Document)}</div>}
            dataTrack={buildTPClickEvent(
              buildLandingPageTrackingData(
                EVENT_NAME.ACCORDION,
                EVENT_SOURCE.CLIENT,
                SECTION_NAMES.SECTION,
                '',
                ACTION_VALUES.EXPAND,
                title,
                questionText,
                program || undefined,
                screenName
              )
            )}
          />
        )
      }),
    [content, program, screenName, title]
  )

  return (
    <Section
      id={`faq-${sectionId}`}
      pY={true}
      className={cn('faqs--cntr lp-colored--list', className, backgroundColor && getSectionColorClassName(backgroundColor))}
    >
      <div className={'container'}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {title && <SectionHeading title={title} textAlignment="text-center" />}
            {introText && <IntroText introCopyAlignment={introCopyAlignment} introText={introText} />}
            {accordion}
            {disclaimer && <DisclaimerText disclaimer={disclaimer} disclaimerCopyAlignment={disclaimerCopyAlignment} />}
            {cta?.fields.link === ATTRIBUTE_CTA_MODAL ? (
              <CTAModal cta={cta} program={program} sectionTitle={title} />
            ) : (
              ButtonOrLinkCTA(cta, handleCTAClick, program, title, undefined, '', screenName, query, t('common:applyNow'), isGaPage)
            )}
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
                          program,
                          screenName
                        )
                      )
                    }
                  }}
                  heading={
                    query.utm_source === UTM_SOURCE.referral ? t('leadForm:referralLeadFormTitle') : leadFormFields.fields?.formTitle
                  }
                  closeOnBackgroudClick
                >
                  <LeadFormSection
                    program={program}
                    leadFormFields={leadFormFields}
                    sectionDetails={{ sectionTitle: title }}
                    inquiringId={sectionId}
                  />
                </BluePrintModal>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Faq
