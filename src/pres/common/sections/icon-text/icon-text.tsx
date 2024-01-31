import { Entry, EntryFields } from 'contentful'
import { useMemo, useContext, useState, useEffect } from 'react'
import cn from 'classnames'
import { BluePrintIconTextModule } from '@emeritus-engineering/blueprint-core-modules/icon-text'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import useTranslation from 'next-translate/useTranslation'
import { TypeComponentIconWithTextDescription } from 'types/contentful-types/TypeComponentIconWithTextDescription'
import { TypeComponentButtonFields, TypeComponentModalLinkTypeFields, TypeProgram } from 'types/contentful-types'
import { TypeUtmParamsFields } from 'types/contentful-types'
import { buildQueryString, parseToSectionId } from 'utils/common'
import Section from 'pres/common/components/section'
import useMediaQueries from 'hooks/useMediaQueries'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { buildLandingPageTrackingData, buildTPClickEvent, triggerTrackPoint } from 'utils/trackpoint'
import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { currentResolution } from 'utils/resolution'
import { useURLutmParams } from 'hooks/useUTMQueryParams'
import B2BLeadForm from 'pres/common/components/b2b-lead-form'
import FlexiPayment from 'pres/common/components/flexi-payment'
import { ENTRY_LINK_TYPES } from 'constants/contentful'
import { getSectionColorClassName } from 'utils/contentful'

export interface QueryParams extends TypeUtmParamsFields {
  utm_campaign?: string
  utm_term?: string
}
interface MediaComponentProps {
  title: string
  content: Array<TypeComponentIconWithTextDescription>
  className?: string
  backgroundColor?: string
  foregroundColor?: string
  cta?: Entry<TypeComponentButtonFields>
  disclaimer?: EntryFields.RichText
  introText?: string
  utmParams?: QueryParams
  introCopyAlignment?: EntryFields.Boolean
  disclaimerCopyAlignment?: EntryFields.Boolean
}

const closeHandler = (
  event: string,
  actionType: (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES] | '',
  sectionTitle: string | undefined,
  componentTitle: string | undefined,
  program: TypeProgram | undefined,
  screenName?: string
) => {
  const trackDetails = buildLandingPageTrackingData(
    event,
    EVENT_SOURCE.CLIENT,
    SECTION_NAMES.SECTION,
    actionType,
    ACTION_VALUES.CLOSE,
    sectionTitle,
    componentTitle,
    program,
    screenName
  )
  triggerTrackPoint('click', trackDetails)
}

export default function IconText({
  title,
  content = [],
  className,
  backgroundColor,
  foregroundColor,
  introText,
  disclaimer,
  cta,
  utmParams,
  introCopyAlignment,
  disclaimerCopyAlignment
}: MediaComponentProps) {
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [b2bLeadFormOpen, setB2bLeadFormOpen] = useState({ open: false, description: '', componentTitle: '' })
  const [flexiPayModalOpen, setFlexiPayModalOpen] = useState({ open: false, description: '', componentTitle: '' })
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const { isTabletActive, isMobileScreen, isTabletLandscape, isWiderDesktop, isLargerDevice } = useMediaQueries()
  const { leadFormFields, program, screenName } = useContext(PageLayoutContext)
  const utmURLParams = useURLutmParams(utmParams)
  const { t } = useTranslation('common')

  useEffect(() => {
    setMounted(true)
  }, [])

  function setLinkModalOpen(entryFields: TypeComponentModalLinkTypeFields, componentTitle: string) {
    if (entryFields.linkType) {
      switch (entryFields.linkType) {
        case ENTRY_LINK_TYPES.PAYMENT:
          setFlexiPayModalOpen({ description: entryFields.modalSubtext || '', open: true, componentTitle })
          break
        case ENTRY_LINK_TYPES.B2B_LEAD_FORM:
          setB2bLeadFormOpen({ ...b2bLeadFormOpen, open: true, componentTitle })
          break
      }
    }
  }

  return (
    <Section
      id={`icons-text-${sectionId}`}
      pY={true}
      className={cn(className, backgroundColor && getSectionColorClassName(backgroundColor))}
    >
      <div className="container">
        <BluePrintIconTextModule
          content={content}
          cta={cta}
          title={title}
          disclaimer={disclaimer}
          introText={introText}
          introCopyAlignment={introCopyAlignment}
          disclaimerCopyAlignment={disclaimerCopyAlignment}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
          utmParams={`${Object.keys(utmURLParams).length > 0 ? `?${buildQueryString(utmURLParams)}` : ''}`}
          currentResolution={
            mounted ? currentResolution(isTabletActive, isMobileScreen, isTabletLandscape, isWiderDesktop, isLargerDevice) : 'isDesktop'
          }
          handleClick={() => {
            setLeadFormOpen(true)
            triggerTrackPoint(
              'click',
              buildLandingPageTrackingData(
                EVENT_NAME.EXTERNAL_LINK,
                EVENT_SOURCE.CLIENT,
                SECTION_NAMES.SECTION,
                ACTION_TYPES.URL,
                cta?.fields?.link || '',
                sectionId,
                cta?.fields?.text,
                program,
                screenName
              )
            )
          }}
          dataTrack={buildTPClickEvent(
            buildLandingPageTrackingData(
              EVENT_NAME.EXTERNAL_LINK,
              EVENT_SOURCE.CLIENT,
              SECTION_NAMES.SECTION,
              ACTION_TYPES.URL,
              cta?.fields?.link || '',
              sectionId,
              cta?.fields?.text,
              program,
              screenName
            )
          )}
          handleModalLinkClick={(entryFields: TypeComponentModalLinkTypeFields, componentTitle: string) =>
            setLinkModalOpen(entryFields, componentTitle)
          }
        />
      </div>
      {leadFormOpen && leadFormFields && (
        <div className="lead-form-modal lead-form-cntr">
          <BluePrintModal
            modalSize="small"
            closeOverlay={() => {
              setLeadFormOpen(false)
              closeHandler(cta?.fields?.eventType || EVENT_NAME.LEAD_POP_UP, '', title, cta?.fields?.text, program, screenName)
            }}
            heading={leadFormFields.fields?.formTitle}
            closeOnBackgroudClick
          >
            <LeadFormSection
              program={program}
              leadFormFields={leadFormFields}
              sectionDetails={{ sectionTitle: title }}
              inquiringId={parseToSectionId(cta?.fields.contentfulName)}
            />
          </BluePrintModal>
        </div>
      )}
      {flexiPayModalOpen.open && (
        <BluePrintModal
          closeOverlay={() => {
            setFlexiPayModalOpen({ ...flexiPayModalOpen, open: false })
            closeHandler(EVENT_NAME.PAYMENT, ACTION_TYPES.MODAL, title, flexiPayModalOpen.componentTitle, program, screenName)
          }}
          modalSize="large"
          heading={t('flexiPay.title')}
          closeOnBackgroudClick
        >
          <FlexiPayment modalSubtext={flexiPayModalOpen.description} />
        </BluePrintModal>
      )}
      {b2bLeadFormOpen.open && (
        <div className="lead-form-modal b2b-form-modal">
          <BluePrintModal
            closeOverlay={() => {
              setB2bLeadFormOpen({ ...b2bLeadFormOpen, open: false })
              closeHandler(EVENT_NAME.TEAM_GROUP, ACTION_TYPES.MODAL, title, b2bLeadFormOpen.componentTitle, program, screenName)
            }}
            isFluidLayout
            modalSize="large"
            closeOnBackgroudClick
          >
            <B2BLeadForm />
          </BluePrintModal>
        </div>
      )}
    </Section>
  )
}
