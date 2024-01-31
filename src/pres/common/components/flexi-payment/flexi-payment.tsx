import { useContext, useMemo } from 'react'
import cn from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { numberFormatter } from 'utils/numberFormatter'
import { sortArrayOfObjects } from 'utils/sortArrayOfObjects'
import Table from '../table'
import { calculatePercentage, generatePayments, getRoundDiscount } from './flexi-pay-util'
import styles from './flexi-payment.module.scss'

interface FlexiPaymentProps {
  modalSubtext?: string
  programFeeLabel?: string
}

function FlexiPayment({ modalSubtext, programFeeLabel }: FlexiPaymentProps) {
  const { program, programCourseRun, defaultLocale } = useContext(PageLayoutContext)
  const endTime = program?.fields?.end_time?.split('T')[1] || ''
  const {
    show_original_price: isStrikeThrough = false,
    current_enrollable_course_run: currentCourse,
    number_formatting_localized_enabled
  } = programCourseRun || {}
  const {
    price_in_program_currency_for_admin: adminPrice = 0,
    payment_plans: srcPaymentPlans = [],
    currency = '',
    rounds = [],
    start_date__c: startDate = ''
  } = currentCourse || {}
  const { t } = useTranslation('common')
  const sortedPaymentPlans = useMemo(() => {
    return sortArrayOfObjects({ array: srcPaymentPlans, sortByKey: 'number_of_installments', sortType: 'asc' })
  }, [srcPaymentPlans])
  const sortedRounds = useMemo(() => {
    return sortArrayOfObjects({ array: rounds, sortByKey: 'relative_end_day_from_batch_start', sortType: 'desc' })
  }, [rounds])
  const roundDiscount = getRoundDiscount({ sortedRounds, startDate, endTime })
  const showProgramFee = !!(isStrikeThrough && roundDiscount.discountVal)
  const textImmediat = t('flexiPay.immediately')
  const currencySymbol = srcPaymentPlans?.[0]?.installments?.[0]?.currency_symbol || ''
  const schoolName = program?.fields?.school?.fields?.translation_key
  const paymentPlans = useMemo(
    () =>
      generatePayments({
        paymentPlans: sortedPaymentPlans,
        isStrikeThrough,
        roundDiscount,
        currency,
        textImmediat,
        currencySymbol,
        schoolName,
        defaultLocale,
        userLocaleEnabled: number_formatting_localized_enabled
      }),
    [
      currency,
      currencySymbol,
      isStrikeThrough,
      roundDiscount,
      sortedPaymentPlans,
      textImmediat,
      schoolName,
      defaultLocale,
      number_formatting_localized_enabled
    ]
  )

  const tableHeading = ['paymentDate', ...(showProgramFee ? ['theadProgramFee'] : []), 'amountDue'].map((string) => t(`flexiPay.${string}`))
  const amountDue =
    adminPrice -
    (roundDiscount.discountType === 'percentage'
      ? calculatePercentage({
          percentage: roundDiscount.discountVal,
          value: adminPrice
        })
      : roundDiscount.discountVal)
  const payFull = [
    {
      paymentDate: textImmediat,
      ...(showProgramFee
        ? {
            paymentFee: `${currencySymbol}${numberFormatter({
              number: adminPrice,
              currency,
              userLocaleEnabled: number_formatting_localized_enabled
            })}`
          }
        : {}),
      amountDue: `${currencySymbol}${numberFormatter({
        number: showProgramFee ? amountDue : adminPrice,
        currency,
        userLocaleEnabled: number_formatting_localized_enabled
      })}`
    }
  ]

  return (
    <div
      className={cn(
        'text-color',
        styles.flexiPaymentContainer,
        showProgramFee ? [styles.tableColStrike, styles.threeColumn] : styles.twoColumn
      )}
    >
      <div className={cn('text-accent text-uppercase', styles.programFeeLabel)}>{programFeeLabel || t('flexiPay.programFee')}</div>
      <div className={styles.adminPrice}>{`${currencySymbol}${numberFormatter({
        number: adminPrice,
        currency,
        userLocaleEnabled: number_formatting_localized_enabled
      })}`}</div>
      <div className={styles.discountText}>{modalSubtext || t('flexiPay.discounts')}</div>
      <div className={styles.tableWrapper}>
        <h6>{t('flexiPay.payFull')}</h6>
        <Table tableHeading={tableHeading} tableBody={payFull} />
      </div>
      {paymentPlans.map((installment, index) => {
        return (
          <div key={index} className={styles.tableWrapper}>
            <h6>{t('flexiPay.payInInstallments', { installments: sortedPaymentPlans?.[index]?.number_of_installments || '' })}</h6>
            <Table tableHeading={tableHeading} tableBody={installment} />
          </div>
        )
      })}
    </div>
  )
}

export default FlexiPayment
