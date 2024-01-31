import { BLOCKS, Document, INLINES, Node } from '@contentful/rich-text-types'
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer'
import { useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { Entry, EntryFields } from 'contentful'
import { useContext } from 'react'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import DisclaimerText from '@emeritus-engineering/blueprint-core-modules/utils/disclaimer-text'
import IntroText from '@emeritus-engineering/blueprint-core-modules/utils/intro-text'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { marketingModule, isValidLiquidVariable } from 'utils/marketingModule'

import {
  ATTRIBUTE_CTA_MODAL,
  LIQUID_VARIABLE_INVALID_TEXT,
  TEXT_BLOCK_ENTRY_HYPERLINKS,
  TEXT_BLOCK_ENTRY_TITLE,
  UTM_SOURCE
} from 'constants/contentful'
import ContentfulImage from 'pres/common/components/contentful-image'
import Section from 'pres/common/components/section'
import { TypeComponentButtonFields, TypeComponentTextBlock, TypeProgram } from 'types/contentful-types'
import { parseToSectionId } from 'utils/common'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import ButtonOrLinkCTA from 'pres/common/cta/cta'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { buildTPClickEvent, buildLandingPageTrackingData, triggerTrackPoint } from 'utils/trackpoint'
import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import useProgramStartDate from 'hooks/useProgramStartDate'
import useProgramRoundDiscount from 'hooks/useProgramRoundDiscount'
import useProgramDuration from 'hooks/useProgramDuration'
import { numberFormatter } from 'utils/numberFormatter'
import CTAModal from 'pres/common/cta/cta-modal'
import { getSectionColorClassName } from 'utils/contentful'
import styles from './wysiwyg.module.scss'

interface Props {
  title?: string
  content: Array<TypeComponentTextBlock>
  className?: string
  cta?: Entry<TypeComponentButtonFields>
  introText?: string
  introCopyAlignment?: EntryFields.Boolean
  disclaimer?: EntryFields.RichText
  disclaimerCopyAlignment?: EntryFields.Boolean
  backgroundColor?: string
}
interface programDiscountProp {
  programDiscountVal?: string
  roundActivateDate?: string
}

interface programDurationProp {
  days?: string
  hours?: string
}

const createParserOptions = (
  programStartDate: string,
  programDiscount: programDiscountProp,
  programDuration: programDurationProp,
  c: any,
  defaultProgramFee: string,
  screenName: string,
  sectionTitle: string,
  program?: TypeProgram
) =>
  ({
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
      },
      [INLINES.EMBEDDED_ENTRY]: ({ data }: Node) => {
        const entryFields = data.target.fields
        const entryType = data.target.sys.contentType?.sys.id
        let component = null
        if (Object.values(TEXT_BLOCK_ENTRY_TITLE).includes(entryType)) {
          switch (entryType) {
            case TEXT_BLOCK_ENTRY_TITLE.title:
              component = <div className="medium-text-2"> {entryFields.title}</div>
              break
            default:
              component = null
          }
        }
        return component
      },
      [INLINES.ENTRY_HYPERLINK]: ({ data }: Node) => {
        const entryFields = data.target.fields
        const entryType = data.target.sys.contentType?.sys.id
        let component = null
        if (Object.values(TEXT_BLOCK_ENTRY_HYPERLINKS).includes(entryType)) {
          switch (entryType) {
            case TEXT_BLOCK_ENTRY_HYPERLINKS.email:
              component = (
                <a
                  target="_self"
                  rel="noreferrer"
                  href={`mailto: ${entryFields.email}`}
                  data-track={JSON.stringify({
                    type: 'click',
                    event: entryFields.eventName
                  })}
                >
                  {entryFields.email}
                </a>
              )
              break
            case TEXT_BLOCK_ENTRY_HYPERLINKS.phoneNumber:
              component = (
                <a
                  target="_self"
                  rel="noreferrer"
                  href={`tel: ${entryFields.phoneNumber}`}
                  data-track={JSON.stringify({
                    type: 'click',
                    event: entryFields.eventName
                  })}
                >
                  {entryFields.phoneNumber}
                </a>
              )
              break
            default:
              component = null
          }
        }
        return component
      },
      [INLINES.HYPERLINK]: ({ data: { uri }, content }) => (
        <a
          className={program ? 'link' : ''}
          href={uri}
          target={uri?.includes('#') ? '_self' : '_blank'}
          rel="noreferrer"
          data-track={buildTPClickEvent(
            buildLandingPageTrackingData(
              EVENT_NAME.EXTERNAL_LINK,
              EVENT_SOURCE.CLIENT,
              SECTION_NAMES.SECTION,
              ACTION_TYPES.URL,
              uri,
              sectionTitle,
              content.map((text) => (text as any).value).join(' '),
              program,
              screenName
            )
          )}
        >
          {content.map((elem) => {
            if ('value' in elem) {
              return elem.value
            }
            return null
          })}
        </a>
      )
    },
    renderText: (text) => {
      return isValidLiquidVariable(text)
        ? marketingModule(text, programStartDate, programDiscount, programDuration, c, defaultProgramFee)
        : text
    }
  } as Options)

function WYSIWYG({
  title,
  introText,
  introCopyAlignment,
  content = [],
  className,
  cta,
  backgroundColor,
  disclaimer,
  disclaimerCopyAlignment
}: Props) {
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [hideSectionClass, setHideSectionClass] = useState('')
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>()
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const { leadFormFields, program, programCourseRun, screenName, isGaPage } = useContext(PageLayoutContext)
  const { query } = useRouter()
  const { t } = useTranslation()
  const [mounted, isMounted] = useState(false)
  const {
    start_date__c: startDate = '',
    rounds,
    currency = '',
    price_in_program_currency_for_admin: adminPrice = 0,
    application_fee_in_program_currency: appFee = 0
  } = programCourseRun?.current_enrollable_course_run || {}
  const endTime = program?.fields?.end_time?.split('T')[1] || ''
  const programStartDate = useProgramStartDate(startDate, false, true, program)
  const programDiscount = useProgramRoundDiscount(
    rounds || [],
    startDate,
    endTime,
    currency,
    adminPrice,
    appFee,
    program?.fields?.school?.fields?.translation_key
  )
  const programDuration = useProgramDuration(startDate, endTime)
  const nodeType = content?.[0]?.fields?.textBlock?.content?.[0]?.nodeType

  const hasBullets = content.some((content) => content.fields.textBlock?.content.map(({ nodeType }) => nodeType).includes(BLOCKS.UL_LIST))

  const defaultProgramFee =
    mounted && currency
      ? numberFormatter({
          number: adminPrice,
          currency,
          style: 'currency',
          userLocaleEnabled: programCourseRun?.number_formatting_localized_enabled
        })
      : '0'

  useEffect(() => {
    !mounted && isMounted(true)
    mounted && setHideSectionClass(containerRef?.innerHTML.includes(LIQUID_VARIABLE_INVALID_TEXT) ? 'd-none' : '')
  }, [mounted])

  const bgColor = backgroundColor && getSectionColorClassName(backgroundColor, true)
  const backgroundColorClass = !hasBullets && bgColor
  const gridClass = nodeType === 'heading-4' ? 'col-12' : 'col-lg-8'
  const headingThreeParentClass = nodeType === 'heading-3' ? 'p-y-30 p-x-12' : ''
  const divisionBackgroundClass = nodeType === 'heading-3' ? backgroundColorClass : ''
  const options = useMemo(
    () =>
      createParserOptions(programStartDate, programDiscount, programDuration, t, defaultProgramFee, screenName || '', title || '', program),
    [programStartDate, programDiscount, programDuration, defaultProgramFee, screenName, title, program]
  )
  const isTableAvailable = useMemo(
    () => content.filter((content) => content.fields.textBlock?.content.some((content) => content.nodeType === 'table')),
    [content]
  )

  function handleCTAClick() {
    setLeadFormOpen(true)
  }

  return (
    <Section
      id={sectionId}
      pY={true}
      className={cn(
        'lp-colored--list text-block-container py-5',
        hideSectionClass,
        className,
        nodeType === 'heading-4' || nodeType === 'heading-3' ? 'lp-wysiwyg' : '',
        !divisionBackgroundClass && backgroundColorClass
      )}
    >
      <div className="container">
        <div className="row display--flex justify-content-center">
          <div className={cn(gridClass, backgroundColor || isTableAvailable.length > 0 ? '' : '')}>
            {title && <SectionHeading title={title} textAlignment={cn('text--center', styles.title)} />}
            {introText && <IntroText introCopyAlignment={introCopyAlignment} introText={introText} />}
            <div
              data-testid="wysiwyg-content"
              className={cn('para--two m-a-0 content-wrapper', headingThreeParentClass, divisionBackgroundClass)}
              ref={(element) => setContainerRef(element)}
            >
              {content.map(({ fields }) => documentToReactComponents(fields.textBlock as Document, options))}
            </div>
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

export default WYSIWYG
