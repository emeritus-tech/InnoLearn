import cn from 'classnames'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import useTranslation from 'next-translate/useTranslation'
import { useInView } from 'react-intersection-observer'
import { Entry } from 'contentful'
import { useRouter } from 'next/router'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Document } from '@contentful/rich-text-types'
import Section from 'pres/common/components/section'
import FlexiPayment from 'pres/common/components/flexi-payment'
import {
  TypeComponentModalLinkTypeFields,
  TypeComponentProgramInfoLabelFields,
  TypeSectionStickyBrochureFields
} from 'types/contentful-types'
import { parseToSectionId } from 'utils/common'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { startDateLabelHandler, shouldRoundbeVisible, priceAfterDiscount } from 'utils/dateTimeFormatter'
import { numberFormatter } from 'utils/numberFormatter'
import B2BLeadForm from 'pres/common/components/b2b-lead-form'
import useProgramStartDate from 'hooks/useProgramStartDate'
import { buildLandingPageTrackingData, buildTPClickEvent, triggerTrackPoint } from 'utils/trackpoint'
import { ACTION_TYPES, EVENT_NAME, SECTION_NAMES, ACTION_VALUES, EVENT_SOURCE } from 'constants/trackpoint'
import useMediaQueries from 'hooks/useMediaQueries'
import useApplicationFeeAmount from 'hooks/useApplicationFeeAmount'
import { ENTRY_LINK_TYPES, LIQUID_VARIABLE_INVALID_TEXT, TEXT_MODAL, UTM_SOURCE } from 'constants/contentful'
import LeadFormSection from 'pres/common/components/lead-form-section'
import ButtonOrLinkCTA from 'pres/common/cta/cta'
import useProgramRoundDiscount from 'hooks/useProgramRoundDiscount'
import stickStyles from '../sticky-brochure/sticky-brochure.module.scss'
import styles from './info-bar.module.scss'

interface ProgramInfoBarProps extends TypeComponentProgramInfoLabelFields {
  title?: string
  className?: string
  isHeroInView?: boolean
  stickyBrochure?: Entry<TypeSectionStickyBrochureFields>
}

function InfoBar({
  title,
  className,
  startDateLabel = '',
  lastDayEnrollLabel = '',
  durationLabel,
  programFeeLabel,
  programFeeLink,
  programTextModal,
  programMoreInfoSection,
  startDateSubtext,
  programFeeSubText,
  isHeroInView,
  stickyBrochure,
  applicationFee
}: ProgramInfoBarProps) {
  const { program, leadFormFields, programCourseRun, screenName, isGaPage } = useContext(PageLayoutContext)
  const [b2bLeadFormOpen, setB2bLeadFormOpen] = useState(false)
  const [textModalOpen, setTextModalOpen] = useState(false)
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [flexiPayModalOpen, setFlexiPayModalOpen] = useState(false)
  const [activeTextModal, setActiveTextModal] = useState<TypeComponentModalLinkTypeFields>()
  const [popOverState, setPopOverState] = useState(false)
  const { t } = useTranslation('common')
  const { query } = useRouter()
  const { isTabletLandscape, isWiderDesktop, isLargerDevice } = useMediaQueries()
  const { current_enrollable_course_run, show_original_price, number_formatting_localized_enabled, advocate_reward_amount } =
    programCourseRun || {}
  const {
    price_in_program_currency_for_admin: adminPrice = 0,
    start_date__c: startDate = '',
    rounds,
    currency = '',
    payment_plans: paymentPlans = [],
    application_fee_in_program_currency: appFee = 0
  } = current_enrollable_course_run || {}
  const programStartDate = useProgramStartDate(startDate, false, false, program)
  const roundDetails = useMemo(
    () =>
      rounds?.sort(function (a: { relative_end_day_from_batch_start: number }, b: { relative_end_day_from_batch_start: number }) {
        return b.relative_end_day_from_batch_start - a.relative_end_day_from_batch_start
      }),
    [rounds]
  )

  const { ref, inView } = useInView({ threshold: 1 })

  const handleTextModal = (index: number) => {
    setPopOverState(!popOverState)
    const activeModal = programTextModal && index < programTextModal?.length ? programTextModal?.[index]?.fields : moreInfoLinkType?.fields
    setActiveTextModal(activeModal)
  }

  const handleTextModalCloseOverlay = (overlayTitle: string) => {
    const trackDetails = buildLandingPageTrackingData(
      EVENT_NAME.GENERIC,
      EVENT_SOURCE.CLIENT,
      SECTION_NAMES.SECTION,
      ACTION_TYPES.MODAL,
      ACTION_VALUES.CLOSE,
      title,
      overlayTitle,
      program,
      screenName
    )
    triggerTrackPoint('click', trackDetails)
    setPopOverState(false)
  }

  const advocateRewardAmount = (advocateAmount?: number) => {
    return advocateAmount && currency
      ? numberFormatter({
          number: advocateAmount,
          currency,
          style: 'currency',
          userLocaleEnabled: number_formatting_localized_enabled
        })
      : ''
  }

  const getReferralAmount = (referralText: string) =>
    referralText.replaceAll('{{advocate_reward_amount}}', advocateRewardAmount(advocate_reward_amount))

  const referralLink = `/en/refer/${program?.fields?.sfid}?source=pricing`

  useEffect(() => {
    if (!mounted) {
      setMounted(true)
    } else if (stickyBrochure) {
      !isFixed && !inView && window.scrollY > 0 && !isHeroInView && setIsFixed(true)
      isHeroInView && isFixed && setIsFixed(false)
    }
  }, [inView, isHeroInView, isFixed, stickyBrochure, mounted])

  const {
    workload,
    current_batch_duration: batchDuration,
    default_deadline_extension_days: deadlineExtenionDays = 0,
    default_deadline_days: deadlineDays = 0
  } = program?.fields || {}
  const { linkType, label, modalSubtext } = programFeeLink?.fields || {}
  const noBatchActiveLabel = false
  const showOriginalStrikedPrice = show_original_price
  const endTime = program?.fields?.end_time?.split('T')[1] || ''

  const visibleRounds = roundDetails?.filter(({ relative_end_day_from_batch_start }) =>
    shouldRoundbeVisible(relative_end_day_from_batch_start, startDate, endTime)
  )

  const amountOffered = visibleRounds?.map(({ tuition_discount, tuition_discount_type }) =>
    priceAfterDiscount(number_formatting_localized_enabled, tuition_discount, adminPrice, tuition_discount_type)
  )

  const activeRoundDiscountIsZero = visibleRounds?.[0]?.tuition_discount === '0.0' || visibleRounds?.[0]?.tuition_discount === undefined

  const dateLabelHandler = startDateLabelHandler(
    startDate,
    startDateLabel,
    lastDayEnrollLabel,
    deadlineDays,
    noBatchActiveLabel,
    deadlineExtenionDays,
    endTime
  )
  const isFlexiPayVisible = !dateLabelHandler.noBatchActiveLabel && !!adminPrice && paymentPlans?.length > 0 && linkType === 'Payment'

  const closeHandler = (event: string, sectionTitle: string | undefined, componentTitle: string | undefined) => {
    const trackDetails = buildLandingPageTrackingData(
      event,
      EVENT_SOURCE.CLIENT,
      SECTION_NAMES.STATIC_BAR,
      ACTION_TYPES.MODAL,
      ACTION_VALUES.CLOSE,
      sectionTitle,
      componentTitle,
      program,
      screenName
    )
    triggerTrackPoint('click', trackDetails)
  }

  const viewPaymentPlan = programFeeLink?.fields?.label
  const { label: forTeams, description, linkType: moreInfoLinkType, subText: moreInfoSubText } = programMoreInfoSection?.fields || {}
  const { linkType: linkTypeValue, title: modalTitle, description: modalContent, label: learnMore } = moreInfoLinkType?.fields || {}

  const programDiscount = useProgramRoundDiscount(
    rounds || [],
    startDate,
    endTime,
    currency,
    adminPrice,
    appFee,
    program?.fields?.school?.fields?.translation_key
  )
  //appFee is the common fee and is there for SEPO programs only
  const applicationFeeAmount = useApplicationFeeAmount(
    applicationFee || '',
    activeRoundDiscountIsZero,
    programDiscount,
    number_formatting_localized_enabled,
    appFee,
    currency
  )

  const clickHandler = (linkTypeValue: string) => {
    if (linkTypeValue === TEXT_MODAL) {
      setTextModalOpen(true)
    } else {
      setB2bLeadFormOpen(true)
    }
  }

  function renderListOfLinkTypes(programTextModal: Entry<TypeComponentModalLinkTypeFields>[], positionInLastColumn?: number) {
    return programTextModal.map(({ fields: { label, title: ModalTitle, linkType } }, index) =>
      linkType === ENTRY_LINK_TYPES.REFERRAL &&
      advocateRewardAmount(advocate_reward_amount) &&
      label?.includes('{{advocate_reward_amount}}') ? (
        <Link
          href={referralLink}
          key={positionInLastColumn || index}
          target="_blank"
          data-track={buildTPClickEvent(
            buildLandingPageTrackingData(
              EVENT_NAME.REFERRAL,
              EVENT_SOURCE.CLIENT,
              SECTION_NAMES.STATIC_BAR,
              ACTION_TYPES.CTA,
              '',
              label,
              linkType,
              program,
              screenName
            )
          )}
        >
          <div className="text-color info-bar_info-bar__feeLinkLabel">{getReferralAmount(label)}</div>
        </Link>
      ) : linkType === TEXT_MODAL ? (
        <button
          key={positionInLastColumn || index}
          className={cn('text-color', styles.feeLinkLabel)}
          onClick={() => handleTextModal(positionInLastColumn || index)}
          data-track={buildTPClickEvent(
            buildLandingPageTrackingData(
              EVENT_NAME.GENERIC,
              EVENT_SOURCE.CLIENT,
              SECTION_NAMES.STATIC_BAR,
              ACTION_TYPES.MODAL,
              ACTION_VALUES.OPEN,
              title,
              ModalTitle,
              program,
              screenName
            )
          )}
        >
          {label}
        </button>
      ) : linkType === 'B2BLeadForm' ? (
        <button
          className={cn('text-color', styles.feeLinkLabel)}
          onClick={() => clickHandler(linkType)}
          data-track={buildTPClickEvent(
            buildLandingPageTrackingData(
              EVENT_NAME.TEAM_GROUP,
              EVENT_SOURCE.CLIENT,
              isFixed ? SECTION_NAMES.STICKY_BAR : SECTION_NAMES.STATIC_BAR,
              ACTION_TYPES.MODAL,
              ACTION_VALUES.OPEN,
              forTeams,
              learnMore,
              program,
              screenName
            )
          )}
        >
          {label}
        </button>
      ) : null
    )
  }

  return (
    <>
      {mounted && (
        <Section
          id={`info-bar-${parseToSectionId(title)}`}
          className={cn(
            'bg-gray',
            className,
            styles.buildingBlockContainer,
            isFixed && 'p-0',
            stickyBrochure && isFixed && (isTabletLandscape || isWiderDesktop || isLargerDevice) && stickStyles.stickyInfoBar
          )}
        >
          <div ref={ref} className="container">
            <div
              className={
                programMoreInfoSection
                  ? styles.buildingBlockParent
                  : styles.buildingBlockParentThreeCol + ` ${isFixed ? styles.buildingBlock0 : ''}`
              }
            >
              <div className={styles.buildingBlock}>
                <p className={cn('text-color', styles.labelText)}>{dateLabelHandler?.label}</p>
                {startDate && <p className={cn('text-color', styles.duration)}>{programStartDate}</p>}
                {startDateSubtext && <p className={cn('text-color', styles.workLoad)}>{startDateSubtext}</p>}
              </div>
              <div className={styles.buildingBlock}>
                <p className={cn('text-color', styles.labelText)}>{durationLabel}</p>
                <p className={cn('text-color', styles.duration)}>{batchDuration}</p>
                <p className={cn('text-color', styles.workLoad)}>{workload}</p>
              </div>
              <div className={styles.buildingBlock}>
                <p className={cn('text-color', styles.labelText)}>{programFeeLabel}</p>
                {adminPrice && (
                  <p className={cn('text-color', styles.priceParent)}>
                    {showOriginalStrikedPrice && amountOffered?.[0] && !activeRoundDiscountIsZero && (
                      <span className={cn('text-color', styles.originalPrice)}>
                        {numberFormatter({
                          number: adminPrice,
                          currency,
                          style: 'currency',
                          userLocaleEnabled: number_formatting_localized_enabled
                        })}
                      </span>
                    )}
                    {showOriginalStrikedPrice && amountOffered?.[0] ? (
                      <span className={cn('text-color', styles.offeredPrice)}>
                        {numberFormatter({
                          number: +amountOffered?.[0],
                          currency,
                          style: 'currency',
                          userLocaleEnabled: number_formatting_localized_enabled
                        })}
                      </span>
                    ) : (
                      <span className={cn('text-color', styles.offeredPrice)}>
                        {numberFormatter({
                          number: adminPrice,
                          currency,
                          style: 'currency',
                          userLocaleEnabled: number_formatting_localized_enabled
                        })}
                      </span>
                    )}
                  </p>
                )}
                {applicationFee && !applicationFeeAmount.includes(LIQUID_VARIABLE_INVALID_TEXT) && (
                  <p className={cn('text-color', styles.workLoad)}>{applicationFeeAmount}</p>
                )}
                {programFeeSubText && <p className={cn('text-color', styles.workLoad)}>{programFeeSubText}</p>}
                {isFlexiPayVisible && (
                  <button
                    className={cn('text-color', styles.feeLinkLabel)}
                    onClick={() => setFlexiPayModalOpen(true)}
                    data-track={buildTPClickEvent(
                      buildLandingPageTrackingData(
                        EVENT_NAME.PAYMENT,
                        EVENT_SOURCE.CLIENT,
                        SECTION_NAMES.STATIC_BAR,
                        ACTION_TYPES.MODAL,
                        ACTION_VALUES.OPEN,
                        programFeeLabel,
                        viewPaymentPlan,
                        program,
                        screenName
                      )
                    )}
                  >
                    {label}
                  </button>
                )}
                {programTextModal && renderListOfLinkTypes(programTextModal)}
              </div>
              {programMoreInfoSection && (
                <div className={cn('text-color', styles.buildingBlock)}>
                  <p className={cn('text-color', styles.labelText)}>{forTeams}</p>
                  <p className={cn('text-color', styles.duration)}>{moreInfoSubText}</p>
                  {description && <p className={styles.workLoad}>{description}</p>}
                  {moreInfoLinkType && renderListOfLinkTypes([moreInfoLinkType], programTextModal?.length)}
                </div>
              )}
              {textModalOpen && linkTypeValue === TEXT_MODAL && (
                <BluePrintModal
                  closeOverlay={() => {
                    setTextModalOpen(false)
                    closeHandler(EVENT_NAME.TEAM_GROUP, forTeams, learnMore)
                  }}
                  modalSize="large"
                  closeOnBackgroudClick
                  heading={modalTitle}
                >
                  {modalContent && <div>{documentToReactComponents(modalContent as Document)}</div>}
                </BluePrintModal>
              )}
              {activeTextModal !== undefined && popOverState && (
                <BluePrintModal
                  closeOverlay={() => {
                    handleTextModalCloseOverlay(activeTextModal.title || '')
                  }}
                  modalSize="large"
                  closeOnBackgroudClick
                  heading={activeTextModal.title}
                >
                  <div>{documentToReactComponents(activeTextModal.description as Document)}</div>
                </BluePrintModal>
              )}
              {b2bLeadFormOpen && leadFormFields && (
                <div className="lead-form-modal b2b-form-modal">
                  <BluePrintModal
                    closeOverlay={() => {
                      setB2bLeadFormOpen(false)
                      closeHandler(EVENT_NAME.TEAM_GROUP, forTeams, learnMore)
                    }}
                    isFluidLayout
                    modalSize="large"
                    closeOnBackgroudClick
                  >
                    <B2BLeadForm />
                  </BluePrintModal>
                </div>
              )}
              {flexiPayModalOpen && (
                <BluePrintModal
                  closeOverlay={() => {
                    setFlexiPayModalOpen(false)
                    closeHandler(EVENT_NAME.PAYMENT, programFeeLabel, viewPaymentPlan)
                  }}
                  modalSize="large"
                  heading={t('flexiPay.title')}
                  closeOnBackgroudClick
                >
                  <FlexiPayment programFeeLabel={programFeeLabel} modalSubtext={modalSubtext} />
                </BluePrintModal>
              )}
              {isFixed && stickyBrochure?.fields && (isTabletLandscape || isWiderDesktop || isLargerDevice) && (
                <div className={`${styles.buildingBlock} ${isTabletLandscape ? 'm-0' : ''} justify--center`}>
                  {ButtonOrLinkCTA(
                    stickyBrochure.fields.cta,
                    () => setLeadFormOpen(true),
                    program,
                    '',
                    SECTION_NAMES.STICKY_BAR,
                    'col-12 info-bar--btn btn--primary border border-1',
                    screenName,
                    query,
                    t('applyNow'),
                    isGaPage
                  )}
                </div>
              )}
            </div>
            {leadFormOpen && leadFormFields && stickyBrochure && (
              <div className="lead-form-modal lead-form-cntr">
                <BluePrintModal
                  modalSize="small"
                  closeOverlay={() => {
                    setLeadFormOpen(false)
                    if (program) {
                      triggerTrackPoint(
                        'click',
                        buildLandingPageTrackingData(
                          EVENT_NAME.LEAD_POP_UP,
                          EVENT_SOURCE.CLIENT,
                          SECTION_NAMES.STICKY_BAR,
                          '',
                          ACTION_VALUES.CLOSE,
                          title,
                          stickyBrochure.fields.cta?.fields?.text,
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
                    sectionDetails={{ sectionName: SECTION_NAMES.STICKY_BAR, sectionTitle: title }}
                    inquiringId={parseToSectionId(title)}
                  />
                </BluePrintModal>
              </div>
            )}
          </div>
        </Section>
      )}
    </>
  )
}

export default InfoBar
