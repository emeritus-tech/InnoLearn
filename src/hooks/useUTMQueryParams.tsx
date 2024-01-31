import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { TypeUtmParamsFields } from 'types/contentful-types'
export interface QueryParams extends TypeUtmParamsFields {
  b2c_form?: boolean
  b2b_form?: boolean
  utm_campaign?: string
  utm_term?: string
  customParams?: string
}

/**
 * This hook gets the UTM params from the Contentful Config and overrides it with the UTM params from the query, if present
 * @param utmParams UTM params configured in Contenful for a page
 * @param customKey Custom string we want to parse from URL, eg: Coupon
 * @returns Object with all the parsed params or empty object
 */
export const useURLutmParams = (utmParams?: QueryParams, customKey?: string) => {
  const { query, isReady } = useRouter()
  return useMemo(() => {
    const {
      utm_source = utmParams?.utm_source,
      utm_medium = utmParams?.utm_medium,
      utm_campaign = utmParams?.utm_campaign,
      utm_content = utmParams?.utm_content,
      utm_term = utmParams?.utm_term
    } = (isReady && query) || {}
    const customParams = customKey && query[customKey]

    const allParams = [utm_source, utm_medium, utm_campaign, utm_content, utm_term, customParams]
    return allParams.filter((param) => param).length > 0
      ? ({
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          utm_term,
          customParams
        } as QueryParams)
      : {}
  }, [query, utmParams, customKey, isReady])
}
