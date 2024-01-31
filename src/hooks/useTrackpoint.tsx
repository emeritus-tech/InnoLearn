import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { v4 as uuidv4 } from 'uuid'
import { EntryFields } from 'contentful'
import { trackpointScriptId, initialRequiredData, EVENT_SOURCE } from 'constants/trackpoint'
import { createTrackpointScript } from 'utils/trackpoint'
import { TypeProgram } from 'types/contentful-types'

declare global {
  interface Window {
    trackPoint: { trigger(data: JSON): string }
  }
}

type UseTrackpoint = (
  args_0: EntryFields.Object,
  args_1?: TypeProgram | undefined,
  args_2?: string | undefined,
  args_3?: string | undefined,
  args_4?: 'Y' | 'N' | undefined,
  args_5?: boolean
) => void

const useTrackpoint: UseTrackpoint = (
  trackpointMeta: EntryFields.Object,
  programData?: TypeProgram | undefined,
  screenName?: string | undefined,
  school_name?: string | undefined,
  mergeWithPageMeta?: 'Y' | 'N' | undefined,
  isMicrositePage?: boolean
) => {
  const [, setCookie] = useCookies([initialRequiredData.userUUID, initialRequiredData.requestUUID])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    !mounted && setMounted(true)
    let userUUID
    const requestUUID = uuidv4()
    if (!mounted && document) {
      userUUID = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${initialRequiredData.userUUID}=`))
        ?.split('=')[1]

      // For every request UUID will change
      setCookie(initialRequiredData.requestUUID, requestUUID)
      // This cookie value is used as event id to pass to facebook to track FB pixel events
      setCookie(initialRequiredData.trackEventUUID, requestUUID)

      if (!userUUID) {
        userUUID = uuidv4()
        setCookie(initialRequiredData.userUUID, userUUID)
      }
    }

    if (isMicrositePage || (!document.getElementById(trackpointScriptId) && !window.trackPoint)) {
      if (!mounted) {
        document.head.setAttribute(
          initialRequiredData.requestIDs,
          JSON.stringify({
            [initialRequiredData.requestUUID]: requestUUID,
            [initialRequiredData.userUUID]: userUUID
          })
        )
        if (mergeWithPageMeta === 'Y') {
          document.head.setAttribute(initialRequiredData.mergeWithPageMeta, 'Y')
        }
        document.head.appendChild(createTrackpointScript())
      }
      let additionalAttributes = {}
      if (programData || school_name || trackpointMeta) {
        additionalAttributes = {
          course: {
            program_name: programData?.fields?.name || trackpointMeta?.course?.program_name,
            school_name: programData?.fields?.school?.fields?.name || school_name,
            sfid: programData?.fields?.sfid || trackpointMeta?.course?.sfid
          },
          type: isMicrositePage ? 'page_view' : undefined
        }
      }

      const trackingData = {
        ...trackpointMeta,
        environment: process.env.NEXT_PUBLIC_APP_ENV,
        event_source: EVENT_SOURCE.CLIENT,
        screen: screenName,
        ...additionalAttributes
      }
      document.head.setAttribute(initialRequiredData.dataTrackpointMeta, JSON.stringify(trackingData))
      isMicrositePage && window.trackPoint && window.trackPoint.trigger(trackingData)
    }
    //Adding CCPAOptout as false by default.
    document.head.setAttribute(initialRequiredData.ccpaOptOut, 'false')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenName])
}
export default useTrackpoint
