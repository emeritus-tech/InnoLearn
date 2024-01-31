import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SCREENS, SECTION_NAMES, trackpointScriptId } from 'constants/trackpoint'
import { TypeProgram } from 'types/contentful-types'

export const createTrackpointScript = () => {
  const trackpointScript = document.createElement('script')
  trackpointScript.type = 'text/javascript'
  trackpointScript.src = process.env.NEXT_PUBLIC_TRACKPOINT_URL ?? ''
  trackpointScript.id = trackpointScriptId

  return trackpointScript
}

export const buildTPClickEvent = ({ ...params }) =>
  JSON.stringify({
    type: params.type || 'click',
    environment: process.env.NEXT_PUBLIC_APP_ENV,
    ...params
  })

export const triggerTrackPoint = (type: string, trackDetails: object) =>
  window.trackPoint.trigger(JSON.parse(buildTPClickEvent({ type, ...trackDetails })))

type Course = {
  program_name: string
  school_name: string
  sfid: string
}

export const buildLandingPageTrackingData = (
  event: (typeof EVENT_NAME)[keyof typeof EVENT_NAME] | string,
  source: (typeof EVENT_SOURCE)[keyof typeof EVENT_SOURCE],
  sectionName: (typeof SECTION_NAMES)[keyof typeof SECTION_NAMES] | string,
  actionType: (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES] | '',
  actionValue: (typeof ACTION_VALUES)[keyof typeof ACTION_VALUES] | string,
  sectionTitle = '',
  componentTitle = '',
  program?: TypeProgram | Course,
  screen?: (typeof SCREENS)[keyof typeof SCREENS] | string,
  countryData?: { code: string; source: string }
) => {
  return {
    event_source: source || EVENT_SOURCE.CLIENT,
    screen: screen || SCREENS.LANDING_PAGE,
    event,
    action: { type: actionType, value: actionValue },
    section_name: sectionName,
    ...(countryData && { country_code: countryData.code, country_source: countryData.source }),
    course: {
      program_name: (program as TypeProgram)?.fields?.name || (program as Course)?.program_name,
      school_name: (program as TypeProgram)?.fields?.school?.fields?.name || (program as Course)?.school_name,
      sfid: (program as TypeProgram)?.fields?.sfid || (program as Course)?.sfid
    },
    content_data: {
      section_title: sectionTitle,
      component_title: componentTitle
    }
  }
}
