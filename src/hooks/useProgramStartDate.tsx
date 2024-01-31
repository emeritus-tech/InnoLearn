import { useContext, useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { dateFormatter, lastDayToEnrolDate } from 'utils/dateTimeFormatter'
import { TypeProgram } from 'types/contentful-types'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'

const useProgramStartDate = (startDate: string, noBatchActiveLabel?: boolean, returnEnrollDate?: boolean, programData?: TypeProgram) => {
  const [dateHandler, setDateHandler] = useState('')
  const endTime = programData?.fields?.end_time?.split('T')[1] || ''
  const default_deadline_extension_days = programData?.fields?.default_deadline_extension_days || 0
  const schoolName = programData?.fields?.school?.fields?.translation_key || ''
  const { t } = useTranslation('common')
  const { defaultLocale } = useContext(PageLayoutContext)

  useEffect(() => {
    const durationDateHandler = () => {
      const deadlineExtendedDuration = default_deadline_extension_days * 60 * 60 * 24 * 1000
      if (new Date(startDate).getTime() >= new Date().getTime()) {
        return dateFormatter(startDate, schoolName, defaultLocale)
      } else if (new Date().getTime() <= new Date(startDate + ' ' + endTime).getTime() + deadlineExtendedDuration) {
        return lastDayToEnrolDate(startDate, default_deadline_extension_days, endTime, schoolName, defaultLocale)
      }
      return t('tbd')
    }

    const returnLastDayEnrollDate = () => {
      return startDate && lastDayToEnrolDate(startDate, default_deadline_extension_days, endTime, schoolName, defaultLocale)
    }
    if (typeof window !== 'undefined') {
      const date = returnEnrollDate ? returnLastDayEnrollDate() : durationDateHandler()
      setDateHandler(date)
    }
  }, [default_deadline_extension_days, endTime, noBatchActiveLabel, returnEnrollDate, schoolName, startDate, t, defaultLocale])
  return dateHandler
}

export default useProgramStartDate
