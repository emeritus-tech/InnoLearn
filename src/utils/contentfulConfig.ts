import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { Asset, Entry } from 'contentful'
// import * as Sentry from '@sentry/nextjs'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, GetStaticPathsContext } from 'next'
import sJSONStringify from 'safe-json-stringify'
import ContentfulClients, { ContentfulClientsConfig } from '@emeritus-engineering/contentful-clients'
import { gaConsentAPI, consentAPI, ConsentResult } from '@emeritus-engineering/ee-api'
import * as Sentry from '@sentry/nextjs'
import { CollectionPagePropsType } from 'pages/collections/[school-slug]/[site-slug]'
import { SocialPagePropsType } from 'pages/social/[school-slug]/[site-slug]'
import {
  landingPageContentType,
  programMicrositePageContentType,
  referralPageContentType,
  COMMON_CONTENT_TYPES,
  eruditusPageContentType,
  eruditusSchoolStyle,
  collectionPageContentType
} from 'constants/contentful'
import { BlogDetailPropsType } from 'pages/microsites/[site-slug]/blog/[post-slug]'
import { B2BPropsType } from 'pages/enterprises/[site-slug]'
import { EruditusPropsType } from 'pages/eruditus'
import { LandingPagePropsType } from 'pages/landing-pages/[school-slug]/[site-slug]/[[...page-slug]]'
import { ProgramMicrositesPropsType } from 'pages/program-microsites/[school-slug]/[site-slug]/[page-slug]'
import { ProgramData } from 'types/api-response-types/ProgramData'
import { LocaleListType } from 'types/LocaleListType'
import {
  TypeLandingPageParentTemplateFields,
  TypeSectionFooterFields,
  TypeSectionLongFooterFields,
  TypeSectionModuleFields
} from 'types/contentful-types'
import * as i18n from '../../i18n'
import type { PartnerPropsType } from 'pages/partners/[site-slug]'
import type { MicrositesPropsType } from 'pages/microsites/[site-slug]/[page-slug]'
import { ENGLISH_LANG } from './langs'
import { removeKeys } from './contentful'

export const { previewClient, deliveryClient: client } = new ContentfulClients({
  defaultEnv: process.env.CONTENTFUL_ENVIRONMENT,
  deliveryToken: process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY,
  previewToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  previewHost: 'preview.contentful.com',
  space: process.env.CONTENTFUL_SPACE_ID
} as ContentfulClientsConfig)

export const { previewClient: gaPreviewClient, deliveryClient: gaClient } = new ContentfulClients({
  defaultEnv: process.env.CONTENTFUL_ENVIRONMENT,
  deliveryToken: process.env.GA_CONTENTFUL_CONTENT_DELIVERY_API_KEY,
  previewToken: process.env.GA_CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  previewHost: 'preview.contentful.com',
  space: process.env.GA_CONTENTFUL_SPACE
} as ContentfulClientsConfig)

export interface DefaultPageLayoutProps
  extends Omit<PartnerPropsType, 'site' | 'page' | 'preview' | 'locale' | 'favicon'>,
    Omit<MicrositesPropsType, 'site' | 'page' | 'preview' | 'schoolStyleName' | 'favicon' | 'trackpointMeta'>,
    Omit<B2BPropsType, 'site' | 'page' | 'preview' | 'locale' | 'favicon'>,
    Omit<
      LandingPagePropsType,
      'site' | 'page' | 'preview' | 'locale' | 'favicon' | 'sections' | 'school' | 'program' | 'dynamicProgramData' | 'availableLocales'
    >,
    Omit<CollectionPagePropsType, 'site' | 'page' | 'preview' | 'locale' | 'favicon' | 'sections' | 'trackpointMeta'>,
    Omit<ProgramMicrositesPropsType, 'site' | 'page' | 'preview' | 'locale' | 'favicon' | 'dynamicProgramData'>,
    Omit<SocialPagePropsType, 'site' | 'page' | 'preview' | 'locale' | 'favicon' | 'sections' | 'trackpointMeta'>,
    Omit<BlogDetailPropsType, 'site' | 'page' | 'preview' | 'favicon'>,
    Omit<EruditusPropsType, 'site' | 'page' | 'preview' | 'locale' | 'favicon' | 'availableLocales'> {
  favicon: Asset | string | undefined
  dynamicProgramData?: ProgramData
  page?: string
  footer?: Entry<TypeSectionFooterFields | TypeSectionLongFooterFields>
}

export type Slugs = {
  'site-slug': string
  'page-slug'?: string | string[]
  'post-slug'?: string
  'course-slug'?: string
  availableLocales?: LocaleListType
  'school-slug'?: string
}

type GetStaticPathsParams = GetStaticPaths<Slugs>

type GetStaticPropsParams = GetStaticPropsContext<Slugs>
interface buildGetStaticPathsParams<EntryType> {
  rootContentType: string
  processPathParams: (arg: { items: Entry<EntryType>[] }) => Slugs[]
}
interface buildGetStaticPropsParams<EntryType> {
  slug: string
  rootContentType: string
  processPage: (arg: { siteData: Entry<EntryType>; params: GetStaticPropsParams['params'] }) => DefaultPageLayoutProps | null
}

const resultArray = (list: any) => {
  const resultObject: { [key: string]: { [key: string]: string } } = {}
  list.forEach((item: Entry<TypeLandingPageParentTemplateFields>) => {
    const programKey: string = item.fields.slug || ''
    const { host_name: hostNameKey = '', vanity_host_name: vanityHostNameKey = '' } = item?.fields?.school?.fields || {}
    const entityHostNameKey: string = item.fields.program?.fields?.entity_host_name || ''
    const programType = entityHostNameKey.includes(process.env.GA_ENTITY_HOST_NAME as string) ? 'ga' : 'ee'
    if (hostNameKey) {
      resultObject[hostNameKey] = resultObject[hostNameKey] || {}
      resultObject[hostNameKey][programKey] = programType
    }
    if (vanityHostNameKey) {
      resultObject[vanityHostNameKey] = resultObject[vanityHostNameKey] || {}
      resultObject[vanityHostNameKey][programKey] = programType
    }
    if (!hostNameKey && !vanityHostNameKey) {
      const DEFAULT = 'default'
      resultObject[DEFAULT] = resultObject[DEFAULT] || {}
      resultObject[DEFAULT][programKey] = programType
    }
  })
  return resultObject
}

const writeItemsToJSONFile = (items: any) => {
  const jsonData = JSON.stringify(items, null, 2)
  const filePath = path.join(__dirname, 'items.json')
  // eslint-disable-next-line no-console
  console.log('Items to JSON path', jsonData, filePath)
  try {
    fs.writeFileSync(filePath, jsonData, { encoding: 'utf8' })
    // eslint-disable-next-line no-console
    console.log('Items to JSON file created successfully:', filePath)
  } catch (error) {
    console.error('Error creating Items to JSON file:', error)
  }
}

const readItemsFromJSONFile = () => {
  const filePath = path.join(__dirname, 'items.json')
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8')
    const items = JSON.parse(jsonData)
    return items
  } catch (error) {
    console.error('Error reading file:', error)
    return null
  }
}

export function buildGetStaticPaths<EntryType>({
  rootContentType,
  processPathParams
}: buildGetStaticPathsParams<EntryType>): GetStaticPathsParams {
  return (async ({ locales = [] }: GetStaticPathsContext) => {
    try {
      let gaItems, items: any
      const eeItems = await client.getEntries<EntryType>({
        content_type: rootContentType,
        include: 3
      })
      if (COMMON_CONTENT_TYPES.includes(rootContentType)) {
        gaItems = await gaClient.getEntries<EntryType>({
          content_type: rootContentType,
          include: 3
        })
        items = [...eeItems.items, ...(gaItems?.items || [])]
        const reqData = resultArray(items)
        writeItemsToJSONFile(reqData)
      } else {
        items = [...eeItems.items]
      }
      const pathParams = processPathParams({ items }) || []

      const paths = pathParams.reduce<Array<{ params: Slugs; locale?: string }>>((prevPaths, currentPath) => {
        const currentLocales = locales.filter((locale) => {
          if (locale == ENGLISH_LANG) {
            return true
          } else {
            return currentPath.availableLocales && currentPath.availableLocales.includes(locale as never)
          }
        })

        return [...prevPaths, ...currentLocales.map((locale) => ({ params: currentPath, locale }))]
      }, [])

      return {
        paths,
        fallback: 'blocking'
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      // Sentry.captureException(error)
      return {
        paths: [],
        fallback: 'blocking'
      }
    }
  }) as GetStaticPathsParams
}

export const getProgramData = async (apiEndpoint: string) => {
  try {
    const response = await axios.get(apiEndpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': ' application/json',
        'HTTP-EE-RESOURCES-API-KEY': `${process.env.PROGRAMS_SECRET}`
      }
    })
    return response.data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error fetching programs data', error)
  }
}

export const getProgramConsent = async (sfid: string, isGaPage: boolean) => {
  try {
    let response
    if (isGaPage) {
      response = await gaConsentAPI.programGaConsent(sfid)
    } else {
      response = await consentAPI.programConsent(sfid)
    }
    if (!response) {
      // eslint-disable-next-line no-console
      console.log('Consent Api error', sfid)
    }
    return response as ConsentResult
  } catch (error) {
    Sentry.captureException(error)
    // eslint-disable-next-line no-console
    console.log('Consent Api failure', error)
  }
}

export function buildGetStaticProps<T extends { [key: string]: any }, EntryType extends { [key: string]: any }>({
  slug,
  rootContentType,
  processPage
}: buildGetStaticPropsParams<EntryType>): GetStaticProps<T> {
  return (async ({ params, locale, preview = false }: GetStaticPropsParams) => {
    try {
      const site = params?.[slug as keyof Slugs]
      const schoolSlug = params?.['school-slug' as keyof Slugs]
      const eeContentfulClient = preview ? previewClient : client
      const gaContentfulClient = preview ? gaPreviewClient : gaClient
      const inDefaultLocale = locale === 'default'
      const schoolHostName = { 'fields.school.sys.contentType.sys.id': 'school', 'fields.school.fields.host_name': schoolSlug }
      const contentfulPayload = {
        content_type: rootContentType,
        include: 10,
        'fields.slug': site,
        locale: inDefaultLocale ? i18n.defaultLocale : locale
      }
      let contentfulHostPayload = { ...contentfulPayload }
      if (schoolSlug && (rootContentType === landingPageContentType || rootContentType === programMicrositePageContentType)) {
        contentfulHostPayload = { ...contentfulPayload, ...schoolHostName }
      }
      let isGaPage = false
      if (COMMON_CONTENT_TYPES.includes(rootContentType)) {
        const slugTypeMap = readItemsFromJSONFile()
        const slugType = slugTypeMap?.[schoolSlug as string]?.[site as string]
        isGaPage = slugType === 'ga'
        if (!slugType) {
          const {
            items: [gaSiteData]
          } = await gaContentfulClient.getEntries<EntryType>(contentfulHostPayload)
          isGaPage = !!gaSiteData
        }
      }
      const contentfulClient = isGaPage ? gaContentfulClient : eeContentfulClient
      let {
        items: [siteData]
      } = await contentfulClient.getEntries<EntryType>(contentfulHostPayload)

      const schoolVanityHostName = { 'fields.school.sys.contentType.sys.id': 'school', 'fields.school.fields.vanity_host_name': schoolSlug }
      let localeContentfulPayload = { ...contentfulPayload, ...{ locale: siteData?.fields?.defaultLocale } }

      if (!siteData && schoolSlug && (rootContentType === landingPageContentType || rootContentType === programMicrositePageContentType)) {
        localeContentfulPayload = { ...contentfulPayload, ...localeContentfulPayload, ...schoolVanityHostName }
      }
      if (
        (inDefaultLocale && siteData?.fields?.defaultLocale) ||
        (!siteData && schoolSlug && (rootContentType === landingPageContentType || rootContentType === programMicrositePageContentType))
      ) {
        ;({
          items: [siteData]
        } = await contentfulClient.getEntries<EntryType>(localeContentfulPayload))
      }

      if (!siteData) {
        return { notFound: true }
      }

      const pageData = processPage({ siteData, params })

      if (!pageData) {
        return { notFound: true }
      }

      const {
        breadcrumb,
        title,
        heroImage,
        body,
        date,
        category,
        socialMedia,
        availableLocales,
        pageSections = [],
        sections = [],
        seoMeta = null,
        seoSchema,
        cookieBotId = null,
        favicon = null,
        utmParams = null,
        preventProgramsFromCollapsing = false,
        ribbonText = null,
        relatedPosts = [],
        blogHomePage,
        paymentForm,
        trackpointMeta,
        program,
        dynamicRibbon,
        landingPage,
        school
      } = pageData

      let schoolName = program?.fields?.school?.fields?.translation_key || school?.fields?.translation_key || ''
      if (rootContentType === eruditusPageContentType) {
        schoolName = eruditusSchoolStyle
      }
      let inlineCss = ''
      if (schoolName) {
        const cssUrl = `${process.env.NEXT_PUBLIC_SCHOOL_STYLES_API}${schoolName}.css`
        const res = await fetch(cssUrl)
        const styleText = await res.text()
        // The regular expression below will remove the entire @font-face block if the font-family property is set to "Roboto" for any SLP
        inlineCss = styleText.replace(/@font-face\s*{([\s\S](.*?\s*font-family:\s*"Roboto";)[\s\S]*?)}/g, '')
      }

      const blogHomePageTemp = {
        ...blogHomePage,
        fields: {
          heroPost: blogHomePage?.fields.heroPost || null,
          featuredPosts: blogHomePage?.fields.featuredPosts || null,
          posts: blogHomePage?.fields.posts || null
        }
      }
      let programAPIData = {}

      if (rootContentType === landingPageContentType || rootContentType === programMicrositePageContentType) {
        const programId = program?.fields.id || 0
        const apiEndpoint = `${isGaPage ? process.env.GA_PROGRAM_WITH_BATCH_API : process.env.PROGRAM_WITH_BATCH_API}${programId}`
        const programApiResponse = await getProgramData(apiEndpoint)
        let gtmTagId = ''
        if (programApiResponse?.data?.gtm_tag_id) {
          gtmTagId = programApiResponse?.data?.gtm_tag_id
        } else if (!isGaPage) {
          gtmTagId = process.env.NEXT_PUBLIC_LANDING_PAGE_GTM_ID as string
        }
        const programConsentResponse = await getProgramConsent(program?.fields.sfid || '', isGaPage)
        programAPIData = {
          current_enrollable_course_run: programApiResponse?.data?.current_enrollable_course_run,
          show_original_price: programApiResponse?.data?.show_original_price,
          brochure: programApiResponse?.data?.brochure,
          inbound_phone_numbers: programApiResponse?.data?.inbound_phone_numbers || [],
          gtm_tag_id: gtmTagId,
          friend_reward_amount: programApiResponse?.data?.friend_reward_amount,
          enrollable_courses: programApiResponse?.data?.enrollable_courses,
          programConsent: programConsentResponse || {},
          number_formatting_localized_enabled: programApiResponse?.data?.number_formatting_localized_enabled,
          advocate_reward_amount: programApiResponse?.data?.advocate_reward_amount,
          incentivized_referrals_enabled: programApiResponse?.data?.incentivized_referrals_enabled
        }
      }
      const programConsentData = {}
      if (rootContentType === collectionPageContentType) {
        for (const section of sections || []) {
          for (const content of (section?.fields as TypeSectionModuleFields)?.content || []) {
            const cardsProgram = (content as any)?.fields?.programs
            const sfid = cardsProgram?.fields?.sfid
            if (sfid) {
              const response = await getProgramConsent(sfid, isGaPage)
              response?.data &&
                Object.assign(programConsentData, {
                  [sfid]: response
                })
            }
          }
        }
      }

      const props = {
        ...pageData,
        locale,
        site,
        title: title ?? null,
        breadcrumb: breadcrumb ?? null,
        heroImage: heroImage ?? null,
        body: body ?? null,
        category: category ?? null,
        date: date ?? null,
        socialMedia: socialMedia ?? null,
        availableLocales: availableLocales ?? null,
        pageSections,
        sections,
        seoMeta,
        seoSchema,
        cookieBotId,
        favicon,
        utmParams,
        preventProgramsFromCollapsing,
        preview,
        ribbonText,
        relatedPosts,
        blogHomePage: blogHomePageTemp ?? null,
        paymentForm: paymentForm ?? null,
        trackpointMeta,
        dynamicRibbon: dynamicRibbon ?? null,
        landingPage,
        ...((rootContentType === landingPageContentType || rootContentType === programMicrositePageContentType) && {
          program: removeKeys(program, 'programs'),
          leadForm: pageData.leadForm,
          dynamicProgramData: programAPIData ?? null,
          thankYou: pageData.thankYou,
          b2bThankYouConfig: pageData.b2bThankYouConfig
        }),
        school: removeKeys(school, 'programs'),
        ...(rootContentType === referralPageContentType && { program }),
        inlineCss,
        isGaPage,
        programConsentData
      }

      return {
        props: JSON.parse(sJSONStringify(props)),
        revalidate: 120
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      // Sentry.captureException(error)
      return { notFound: true }
    }
  }) as GetStaticProps<T>
}
