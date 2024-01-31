import { schoolLocaleFormat } from 'constants/dateFormatLocale'
import { numberFormatter } from './numberFormatter'

/**
 * @param startDate
 * @returns {string}
 * For showing the date in month, day, year format for program info section e.g 2023-04-27 => April 27, 2023
 */
export const dateFormatter = (
  startDate: string,
  schoolName: string,
  defaultLocale: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR' | undefined
): string =>
  new Date(startDate).toLocaleDateString(
    schoolLocaleFormat[schoolName as keyof typeof schoolLocaleFormat] || defaultLocale || schoolLocaleFormat['default'],
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    }
  )

/**
 * @param startDate
 * @param extensionDays
 * @param end_time
 * @returns {string}
 * For showing the date-time when the label is LAST DAY TO ENROL e.g March 17, 2023 05:29 AM
 */
export const lastDayToEnrolDate = (
  startDate: string,
  extensionDays: number,
  endTime: string,
  schoolName: string,
  defaultLocale: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR' | undefined
) => {
  const programStartDate = new Date(startDate + ' ' + endTime)
  programStartDate.setDate(programStartDate.getDate() + extensionDays)
  const showTime = formatAMPM(programStartDate)
  return (
    programStartDate.toLocaleDateString(
      schoolLocaleFormat[schoolName as keyof typeof schoolLocaleFormat] || defaultLocale || schoolLocaleFormat['default'],
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    ) +
    ' ' +
    showTime
  )
}

/**
 * @param date
 * @returns {string}
 * For showing the time in hh:mm AM/PM format e.g December 24, 2023 at 06:55 PM
 */
export const formatAMPM = (date: Date) => {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  minutes = +(minutes < 10 ? '0' + minutes : minutes)
  return `${showHours(hours)}:${minutes}  ${ampm}`
}

/**
 * @param hours
 * @returns
 * For showing the hours in hh format e.g 5 => 05
 */
export const showHours = (hours: number) => {
  let updatedHours: number | string = hours
  if (hours.toString().length === 1) {
    updatedHours = '0' + hours
    return updatedHours
  }
  return updatedHours
}

/**
 * @param relativeEndDay
 * @param startDate
 * @param endTime
 * @returns {string}
 * For showing the pay by date-time for the rounds within application details section e.g Pay by April 25, 2023 at 05:29 AM
 */
export const payByDateHandler = (
  relativeEndDay: number,
  startDate: string,
  endTime: string,
  schoolName: string,
  defaultLocale: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR' | undefined,
  separator?: string
) => {
  const relativeEndTime = localizedTime(relativeEndDay, startDate, endTime)
  const showTime = formatAMPM(relativeEndTime)
  const showDate = localizedDate(relativeEndTime, schoolName, defaultLocale)
  return showDate + ` ${separator} ` + showTime
}

export const localizedTime = (relativeEndDay: number, startDate: string, endTime: string) => {
  const roundsDate = new Date(startDate + ' ' + endTime)
  roundsDate.setDate(roundsDate.getDate() - relativeEndDay)
  return roundsDate
}

export const localizedDate = (
  roundStartDate: Date,
  schoolName: string,
  defaultLocale: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR' | undefined
) =>
  roundStartDate.toLocaleDateString(
    schoolLocaleFormat[schoolName as keyof typeof schoolLocaleFormat] || defaultLocale || schoolLocaleFormat['default'],
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  )

export const roundDateTimeHandler = (
  relativeEndDay: number,
  startDate: string,
  endTime: string,
  schoolName: string,
  defaultLocale: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR' | undefined
) => {
  const roundStartDate = localizedTime(relativeEndDay, startDate, endTime)
  const roundEndTime = formatAMPM(roundStartDate)
  const roundStartDateFormat = localizedDate(roundStartDate, schoolName, defaultLocale)
  return { roundEndTime, roundStartDateFormat }
}

/**
 * @param days
 * @param startDate
 * @returns {number} time in milliseconds
 * For subtracting the number of days mentioned in the round from current day.
 */
export const roundDate = (days: number, startDate: string, endTime: string) => {
  const roundStartDate = new Date(startDate + ' ' + endTime).getTime()
  return roundStartDate - days * 60 * 60 * 24 * 1000
}

/**
 * @param days
 * @param startDate
 * @returns {boolean}
 * For checking if a given discount round should be visible or not. If the pay by date within the round is greater than
   current date that particular round will not be visible
 */
export const shouldRoundbeVisible = (days: number, startDate: string, endTime: string) =>
  new Date(roundDate(days, startDate, endTime)) > new Date()

/**
 * @param discount
 * @param price_in_program_currency_for_admin
 * @param tuition_discount_type
 * @param currency
 * @returns
 * for showing the price after the tution discount
 * Output samples:
 * priceAfterDiscount("17.0", 2000, "percentage") => 1660
 * priceAfterDiscount("17.0", 2000, "percentage", 'INR') => '₹1,660'
 * priceAfterDiscount("100", 20000, "percentage", 'INR', true) => ''
 * priceAfterDiscount("100", 20000, "percentage", 'INR') => '₹0'
 */
export const priceAfterDiscount = (
  userLocaleEnabled = false,
  discount: number,
  price_in_program_currency_for_admin: number,
  tuition_discount_type: string,
  currency?: string,
  zeroToEmpty = false
): string | number => {
  let discountedPrice: number
  if (tuition_discount_type === 'flat') {
    discountedPrice = price_in_program_currency_for_admin - discount
  } else {
    discountedPrice = price_in_program_currency_for_admin - (price_in_program_currency_for_admin * discount) / 100
  }
  if (currency) {
    return zeroToEmpty && !discountedPrice
      ? ''
      : numberFormatter({ number: discountedPrice, currency, style: 'currency', userLocaleEnabled })
  }
  return discountedPrice
}

/**
 * @param start_date__c
 * @param startDateLabel
 * @param lastDayEnrollLabel
 * @param default_deadline_days
 * @param noBatchActiveLabel
 * @param default_deadline_extension_days
 * @param end_time
 * @returns {object}
 * For showing the label STARTS ON and Last date to enrol on program info section
 */
export const startDateLabelHandler = (
  start_date__c: string,
  startDateLabel: string,
  lastDayEnrollLabel: string,
  default_deadline_days: number,
  noBatchActiveLabel: boolean,
  default_deadline_extension_days: number,
  end_time: string
) => {
  const currentDate = new Date().getTime()
  const startDate = new Date(start_date__c + ' ' + end_time).getTime()
  const deadlineDuration = default_deadline_days * 60 * 60 * 24 * 1000
  const deadlineExtendedDuration = default_deadline_extension_days * 60 * 60 * 24 * 1000
  if (startDate + deadlineDuration >= currentDate) {
    return { label: startDateLabel, noBatchActiveLabel }
  } else if (currentDate <= startDate + deadlineExtendedDuration) {
    return { label: lastDayEnrollLabel, noBatchActiveLabel }
  }
  return { label: startDateLabel, noBatchActiveLabel: true }
}

/**
 * @param discount
 * @param tuition_discount_type
 * @returns {string}
 * For showing the label for SAVE 30% or Save US$1 on rounds. Will update it using currency formatter.
 */
export const showTheSavedAmount = (userLocaleEnabled = false, discount: string, tuition_discount_type: string, currency: string) => {
  const discountedValue: number = +discount
  if (tuition_discount_type === 'flat') {
    return numberFormatter({
      number: Math.round(discountedValue),
      currency,
      style: 'currency',
      userLocaleEnabled
    })
  }
  return Math.round(discountedValue) + '%'
}

export const hasRoundStartDateArrived = (startDate: string) => {
  if (startDate) {
    return new Date(startDate).getTime() <= new Date().getTime()
  }
}
