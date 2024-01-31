import { dateFormatter, shouldRoundbeVisible } from 'utils/dateTimeFormatter'
import { numberFormatter } from 'utils/numberFormatter'

interface generatePaymentsArg {
  paymentPlans: PaymentPlan[]
  isStrikeThrough: boolean
  roundDiscount: Discounts
  currency: string
  textImmediat: string
  currencySymbol: string
  schoolName: string
  defaultLocale: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR' | undefined
  userLocaleEnabled: boolean | undefined
}

interface PaymentPlan {
  id: number
  number_of_installments: number
  fee_percentage: string
  installments: Installment[]
}

interface Installment {
  date: string
  price: number
  price_without_discount: number
  currency: string
  currency_symbol: string
}

interface Payment {
  [key: string]: unknown
  paymentDate: string
  programFee?: string
  amountDue: string
}

interface CalculationParams {
  percentage: number
  value: number
}

interface Round {
  relative_end_day_from_batch_start: number
  tuition_discount: string
  tuition_discount_type: string
}

interface Discounts {
  discountVal: number
  discountType: string
}

export interface SortedRounds {
  sortedRounds: Round[]
  startDate: string
  endTime: string
}

export const calculatePercentage = ({ percentage, value }: CalculationParams): number => {
  return (percentage / 100) * value
}

export const getRoundDiscount = ({ sortedRounds, startDate, endTime }: SortedRounds): Discounts => {
  let discounts: Discounts = {
    discountVal: 0,
    discountType: 'flat'
  }

  for (const round of sortedRounds) {
    if (shouldRoundbeVisible(round.relative_end_day_from_batch_start, startDate, endTime)) {
      discounts = {
        discountVal: round.tuition_discount ? parseFloat(round.tuition_discount) : 0,
        discountType: round.tuition_discount_type
      }
      break
    }
  }
  return discounts
}

export const generatePayments = ({
  paymentPlans,
  isStrikeThrough,
  roundDiscount,
  currency,
  currencySymbol,
  textImmediat,
  schoolName,
  defaultLocale,
  userLocaleEnabled: number_formatting_localized_enabled
}: generatePaymentsArg): Payment[][] => {
  const payments: Payment[][] = paymentPlans.map((paymentPlan) => {
    const { installments } = paymentPlan
    const planPayments: Payment[] = installments.map((installment, i) => {
      const { date, price, price_without_discount: priceWithoutDiscount } = installment
      const formattedDate = dateFormatter(date, schoolName, defaultLocale)
      const paymentDate = i === 0 ? textImmediat : formattedDate

      if (isStrikeThrough && roundDiscount.discountVal) {
        return {
          paymentDate,
          programFee: `${currencySymbol}${numberFormatter({
            number: priceWithoutDiscount,
            currency,
            userLocaleEnabled: number_formatting_localized_enabled
          })}`,
          amountDue: `${currencySymbol}${numberFormatter({
            number: price,
            currency,
            userLocaleEnabled: number_formatting_localized_enabled
          })}`
        }
      } else {
        return {
          paymentDate,
          amountDue: `${currencySymbol}${numberFormatter({
            number: priceWithoutDiscount,
            currency,
            userLocaleEnabled: number_formatting_localized_enabled
          })}`
        }
      }
    })

    return planPayments
  })

  return payments
}
