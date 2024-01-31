import useTranslation from 'next-translate/useTranslation'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Document } from '@contentful/rich-text-types'
import DisclaimerText from '@emeritus-engineering/blueprint-core-modules/utils/disclaimer-text'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import { Options, documentToReactComponents } from '@contentful/rich-text-react-renderer'
import cn from 'classnames'
import { EntryFields } from 'contentful'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import Section from 'pres/common/components/section'
import { parseToSectionId } from 'utils/common'
import {
  hasRoundStartDateArrived,
  payByDateHandler,
  priceAfterDiscount,
  roundDateTimeHandler,
  shouldRoundbeVisible,
  showTheSavedAmount
} from 'utils/dateTimeFormatter'
import { numberFormatter } from 'utils/numberFormatter'
import { TypeComponentProgramRoundsFields } from 'types/contentful-types'
import { isValidLiquidVariable, marketingModule, roundApplicationInfo } from 'utils/marketingModule'
import useProgramRoundDiscount from 'hooks/useProgramRoundDiscount'
import { LIQUID_VARIABLE_INVALID_TEXT } from 'constants/contentful'
import styles from './application-details.module.scss'

interface ApplicationDetailsProps extends TypeComponentProgramRoundsFields {
  title?: string
  className?: string
  introCopyAlignment?: EntryFields.Boolean
  disclaimerCopyAlignment?: EntryFields.Boolean
}

interface programDiscountProp {
  programDiscountVal?: string
  roundActivateDate?: string
}

const createParserOptions = (programDiscount?: programDiscountProp, defaultProgramFee?: string) =>
  ({
    renderText: (text) => {
      return isValidLiquidVariable(text) ? marketingModule(text, '', programDiscount, {}, '', defaultProgramFee) : text
    }
  } as Options)

function ApplicationDetails({
  title,
  className,
  roundInfoText = '',
  introText,
  introCopyAlignment,
  disclaimer,
  disclaimerCopyAlignment,
  subText
}: ApplicationDetailsProps) {
  const { t } = useTranslation('common')
  const { program, programCourseRun, defaultLocale } = useContext(PageLayoutContext)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>()
  const [introContainerRef, setIntroContainerRef] = useState<HTMLDivElement | null>()
  const [isClient, setIsClient] = useState(false)
  const { current_enrollable_course_run, show_original_price, number_formatting_localized_enabled } = programCourseRun || {}
  const {
    price_in_program_currency_for_admin = 0,
    start_date__c = '',
    rounds,
    currency = '',
    application_fee_in_program_currency = 0
  } = current_enrollable_course_run || {}

  const roundDetails = useMemo(
    () =>
      rounds?.sort(function (a: { relative_end_day_from_batch_start: number }, b: { relative_end_day_from_batch_start: number }) {
        return b.relative_end_day_from_batch_start - a.relative_end_day_from_batch_start
      }),
    [rounds]
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true)
    }
  }, [])

  const showOriginalStrikedPrice = show_original_price
  const endTime = program?.fields?.end_time?.split('T')[1] || ''
  const hideSectionClass = containerRef?.children?.length === 0 ? 'd-none' : ''
  const roundInformationText = roundInfoText
  const programDiscount = useProgramRoundDiscount(
    rounds || [],
    start_date__c,
    endTime,
    currency,
    price_in_program_currency_for_admin,
    application_fee_in_program_currency,
    program?.fields?.school?.fields?.translation_key
  )
  const defaultProgramFee = currency
    ? numberFormatter({
        number: price_in_program_currency_for_admin,
        currency,
        style: 'currency',
        userLocaleEnabled: number_formatting_localized_enabled
      })
    : '0'

  const options = useMemo(() => createParserOptions(programDiscount, defaultProgramFee), [programDiscount, defaultProgramFee])
  const hideSection = introContainerRef?.innerHTML.includes(LIQUID_VARIABLE_INVALID_TEXT) ? 'd-none' : ''

  const showActiveRoundOnly = (round: { relative_end_day_from_batch_start: any }) =>
    shouldRoundbeVisible(round.relative_end_day_from_batch_start, start_date__c, endTime)

  return (
    <>
      {isClient && roundDetails?.length && price_in_program_currency_for_admin ? (
        <Section id={parseToSectionId(title)} pY={true} className={cn(hideSectionClass, className)}>
          <div className="container">
            {title && <SectionHeading title={title} textAlignment="text-center" />}
            <div className="row">
              <div className="col-sm-8 col-12 m-auto">
                {introText && (
                  <div
                    className={cn('para--two m-b-20', hideSection, introCopyAlignment ? 'text--left' : 'text--center')}
                    ref={(element) => setIntroContainerRef(element)}
                  >
                    {documentToReactComponents(introText as Document, options)}
                  </div>
                )}
                <div className={styles.cards} ref={(element) => setContainerRef(element)}>
                  {roundDetails
                    ?.filter((round) => showActiveRoundOnly(round))
                    ?.map(
                      (
                        {
                          tuition_discount,
                          relative_end_day_from_batch_start,
                          tuition_discount_type,
                          start_date,
                          application_discount,
                          application_discount_type
                        },
                        index
                      ) => {
                        if (index > 0) return
                        let isRoundVisible
                        let roundInfoCompText
                        if (start_date) {
                          isRoundVisible =
                            hasRoundStartDateArrived(start_date) &&
                            shouldRoundbeVisible(relative_end_day_from_batch_start, start_date__c, endTime)
                        } else {
                          isRoundVisible = shouldRoundbeVisible(relative_end_day_from_batch_start, start_date__c, endTime)
                        }
                        if (application_fee_in_program_currency && roundInformationText && roundApplicationInfo(roundInformationText)) {
                          roundInfoCompText = roundApplicationInfo(
                            roundInformationText,
                            roundDateTimeHandler(
                              relative_end_day_from_batch_start,
                              start_date__c,
                              endTime,
                              program?.fields?.school?.fields?.translation_key,
                              defaultLocale
                            ),
                            numberFormatter({
                              number: priceAfterDiscount(
                                number_formatting_localized_enabled,
                                application_discount,
                                application_fee_in_program_currency,
                                application_discount_type
                              ) as number,
                              currency,
                              style: 'currency',
                              userLocaleEnabled: number_formatting_localized_enabled
                            })
                          )
                        } else {
                          roundInfoCompText =
                            t('payBy') +
                            ' ' +
                            payByDateHandler(
                              relative_end_day_from_batch_start,
                              start_date__c,
                              endTime,
                              program?.fields?.school?.fields?.translation_key,
                              defaultLocale,
                              t('at')
                            )
                        }
                        return isRoundVisible && tuition_discount > 0 ? (
                          <div className={cn('bg-gray', styles.card)} key={tuition_discount}>
                            <div className={cn('bg-accent', styles.savingsParent)}>
                              <p className={cn('text-light medium-text-1', styles.savingsTitle)}>
                                {t('save', {
                                  value: showTheSavedAmount(
                                    number_formatting_localized_enabled,
                                    tuition_discount,
                                    tuition_discount_type,
                                    currency
                                  )
                                })}
                              </p>
                            </div>
                            <div className={styles.detailsParent}>
                              <div className={cn('text-secondary', styles.heading)}>{subText || t('programFee')}</div>
                              <div className={styles.priceParent}>
                                {showOriginalStrikedPrice && (
                                  <span className={styles.originalPrice}>
                                    {numberFormatter({
                                      number: price_in_program_currency_for_admin,
                                      currency,
                                      style: 'currency',
                                      userLocaleEnabled: number_formatting_localized_enabled
                                    })}
                                  </span>
                                )}
                                <span className={cn('large-text-3 text-h2', styles.offeredPrice)}>
                                  {numberFormatter({
                                    number: priceAfterDiscount(
                                      number_formatting_localized_enabled,
                                      tuition_discount,
                                      price_in_program_currency_for_admin,
                                      tuition_discount_type
                                    ) as number,
                                    currency,
                                    style: 'currency',
                                    userLocaleEnabled: number_formatting_localized_enabled
                                  })}
                                </span>
                              </div>
                              <div className={styles.dueDate}>{roundInfoCompText}</div>
                            </div>
                          </div>
                        ) : null
                      }
                    )}
                </div>
                {disclaimer && <DisclaimerText disclaimer={disclaimer} disclaimerCopyAlignment={disclaimerCopyAlignment} />}
              </div>
            </div>
          </div>
        </Section>
      ) : null}
    </>
  )
}

export default ApplicationDetails
