import { Entry } from 'contentful'
import { ImageLoader } from 'next/image'
import { SCREENS } from 'constants/trackpoint'
import { SUCCESS_PAGE, THANK_YOU_PAGE_PARAM } from 'constants/contentful'
import { QueryParams } from 'pres/common/sections/program-card/program-card'
import { TypeBlogPageTemplateFields, TypeLanding_pages } from 'types/contentful-types'

export interface Query {
  [key: string]: string
}

export const localImageLoader: ImageLoader = ({ src }): string => {
  if (process.env.HEROKU_APP_NAME) {
    return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com${src}`
  }
  return src
}

export const parseToSectionId = (title: string | undefined) => title?.toLowerCase()?.replace(/ /g, '-') || ''

export const buildQueryString = (params: any) => {
  if (!params) {
    return ''
  }
  return Object.keys(params)
    .filter((param) => params[param])
    .map((param) => `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
    .join('&')
}

export const onlyUnique = (value: string | undefined, index: number, self: any[]): boolean => self.indexOf(value) === index

export const removeRelatedPosts = (posts: Entry<TypeBlogPageTemplateFields> | Entry<TypeBlogPageTemplateFields>[] | undefined) => {
  if (Array.isArray(posts)) {
    const postsFixed = posts.map((post) => {
      const postWithoutRelated = post
      delete postWithoutRelated.fields.relatedPosts
      return postWithoutRelated
    })
    return postsFixed
  }
  const postFixed = posts
  delete postFixed?.fields.relatedPosts
  return postFixed
}

export const eeLandingPageUrl = (
  landingPage: TypeLanding_pages | undefined,
  defaultUrl: string | undefined,
  utmParams: QueryParams,
  paymentForm: boolean | undefined
): string => {
  let fullURL = ''

  if (landingPage) {
    let hostName = ''
    if (landingPage?.fields.school?.fields?.host_name) {
      hostName = `https://${landingPage?.fields.school?.fields.host_name}`
    } else {
      hostName = `${process.env.NEXT_PUBLIC_EE_BASE_URL}/programs/${landingPage?.fields.school?.fields?.translation_key}`
    }
    fullURL = `${hostName}/${landingPage?.fields.slug}`
  } else {
    fullURL = defaultUrl || ''
  }

  fullURL = fullURL.split('?')[0]

  if (typeof paymentForm === 'boolean') {
    utmParams[paymentForm ? 'b2c_form' : 'b2b_form'] = true
    fullURL = `${fullURL}/enterprise`
  }

  const paramsString = buildQueryString(utmParams)

  fullURL = `${fullURL}?${paramsString}`

  return fullURL
}

export const filterEmptyValues = (obj: Record<string, unknown>): Record<string, unknown> => {
  return Object.keys(obj)
    .filter((key) => !!obj[key])
    .reduce(
      (result, key) => ({
        ...result,
        [key]: obj[key]
      }),
      {}
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const splitArrayIntoChunks = ({ arr = [], chunk }: { arr: any[]; chunk: number }): any[] => {
  const clonedArr = [...arr]
  const newArray = []
  while (clonedArr.length > 0) {
    newArray.push(clonedArr.splice(0, chunk))
  }
  return newArray
}

export const extractUtmParams = (query: Query = {}): Query => {
  const utmParams: Query = {}
  for (const key in query) {
    if (key.startsWith('utm_')) {
      utmParams[key] = query[key]
    }
  }
  return utmParams
}

/**
 * This Method replaces the last path with `newpath` param, also appends query params
 * input: http://localhost:3000/program-microsites/wharton-executive-education.emeritus.org1/program1/test
 * output: http://localhost:3000/program-microsites/wharton-executive-education.emeritus.org1/program1/<newpath>
 */
export const getPageRouteURL = (newPath: string, screenName?: string): string => {
  const { href, search } = window.location
  const urlWithoutSearchParams = href.replace(search, '')
  const homePath = href.match(/.*\/$/) ? href.concat('home') : urlWithoutSearchParams.concat('/home')
  const newScreenName =
    screenName === 'program_microsite_home_page' && !href.includes('/home')
      ? homePath.replace(/\/[^/]+$/, `/${newPath}`)
      : urlWithoutSearchParams.replace(/\/[^/]+$/, `/${newPath}`)
  return newScreenName.concat(search)
}

/**
 * Method concats the path param
 * input: http://localhost:3000/landing-pages/online-execed.wharton.upenn.edu/b2b_lead_integration
 * output: http://localhost:3000/landing-pages/online-execed.wharton.upenn.edu/b2b_lead_integration/path
 * output: http://localhost:3000/landing-pages/online-execed.wharton.upenn.edu/b2b_lead_integration/path?thank_you=true
 */
export const getThankyouPageURL = (path: string): string => {
  if (window.location.href.includes('?')) return window.location.href.replace(/[?][^/]+$/, `/${path}`)
  else return window.location.href.concat(`/${path}`)
}

type countryArray = {
  value: string
  label: string
}
export const getValueByLabel = (array: countryArray[], label: string): countryArray | undefined => {
  const foundObject = array.find((obj) => obj.label === label)
  return foundObject ? foundObject : undefined
}

/**
 * Method replace the line feed to br tag used for intro
 */
export const convertLineBreakToHtmlTag = (content = ''): string => {
  return content.split('\n').join('<br/>')
}

/* Derive the CTA Link */
export const getApplyUrl = ({
  url = '',
  utmParams = {},
  isB2B = false,
  number_of_participants = '',
  company = '',
  language = '',
  sfid = ''
}) => {
  const utmQueryString = buildQueryString({ ...utmParams })
  const completeUtmQuery = utmQueryString ? `&${utmQueryString}` : ''
  const isExternalLink = /^https?:\/\//.test(url)
  if (isB2B) {
    const applybaseUrl = `${url}?company=${company || ''}&number_of_participants=${number_of_participants || ''}&program_sfid=${sfid}`
    return `${applybaseUrl}${completeUtmQuery}`
  } else if (isExternalLink) {
    return `${url}?${completeUtmQuery}`
  } else {
    const applybaseUrl = `/?locale=${language}&program_sfid=${sfid}&source=applynowty`
    return `${applybaseUrl}${completeUtmQuery}`
  }
}

export const getScreenName = (queryString?: string, pageSlug?: string) => {
  return queryString?.includes(THANK_YOU_PAGE_PARAM) || pageSlug === SUCCESS_PAGE ? SCREENS.THANK_YOU_PAGE : SCREENS.LANDING_PAGE
}

export const getFromCookie = (cookieName?: string) => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split('=')[1]
}
