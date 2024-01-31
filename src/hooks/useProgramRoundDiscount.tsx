import useTranslation from 'next-translate/useTranslation'
import { useEffect, useMemo, useState, useContext } from 'react'
import { shouldRoundbeVisible, showTheSavedAmount, payByDateHandler, priceAfterDiscount } from 'utils/dateTimeFormatter'
import { ProgramDiscountProp } from 'utils/marketingModule'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'

const useProgramRoundDiscount = (
  rounds: any[],
  startDate: string,
  endTime: string,
  currency: string,
  adminPrice = 0,
  appFee = 0,
  schoolName: string
) => {
  const { defaultLocale, programCourseRun } = useContext(PageLayoutContext)
  const { t } = useTranslation('common')
  const [programDiscountValue, setProgramDiscountValue] = useState<ProgramDiscountProp>({
    programDiscountVal: '',
    roundActivateDate: '',
    programDiscountAmount: '',
    applicationDiscountAmount: ''
  })
  const { number_formatting_localized_enabled } = programCourseRun || {}
  const roundDetails = useMemo(
    () =>
      [...rounds]?.sort(function (a: { relative_end_day_from_batch_start: number }, b: { relative_end_day_from_batch_start: number }) {
        return b.relative_end_day_from_batch_start - a.relative_end_day_from_batch_start
      }),
    [rounds]
  )

  useEffect(() => {
    const discount = {} as ProgramDiscountProp
    roundDetails?.map(
      ({ tuition_discount, relative_end_day_from_batch_start, tuition_discount_type, application_discount, application_discount_type }) => {
        if (shouldRoundbeVisible(relative_end_day_from_batch_start, startDate, endTime) && !discount.programDiscountVal) {
          discount.programDiscountVal = showTheSavedAmount(
            number_formatting_localized_enabled,
            tuition_discount,
            tuition_discount_type,
            currency
          )
          discount.programDiscountAmount = priceAfterDiscount(
            number_formatting_localized_enabled,
            tuition_discount,
            adminPrice,
            tuition_discount_type,
            currency,
            true
          ) as string
          discount.applicationDiscountAmount = priceAfterDiscount(
            number_formatting_localized_enabled,
            application_discount,
            appFee,
            application_discount_type,
            currency,
            true
          ) as string
          discount.roundActivateDate = payByDateHandler(
            relative_end_day_from_batch_start,
            startDate,
            endTime,
            schoolName,
            defaultLocale,
            t('at')
          )
        }
      }
    )
    setProgramDiscountValue(discount)
  }, [])

  return programDiscountValue
}

export default useProgramRoundDiscount
