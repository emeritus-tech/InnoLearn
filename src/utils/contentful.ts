import { Asset, Entry } from 'contentful'

import { ImageLoader } from 'next/image'
import { COLOR_MAP, sectionsContentTypes } from 'constants/contentful'
import { TypeOpenGraphMetaFields, TypeSchoolFields, TypeSeoMetaFields } from 'types/contentful-types'

const addDomainToUrl = (url: string) => `https:${url}`

export const imageLoader: ImageLoader = ({ src }): string => src

const getMultipleProgramsPayload = (queryStringWithSFIdList: string, isGA?: boolean) =>
  fetch(
    `${isGA ? process.env.NEXT_PUBLIC_GA_PROGRAMS_API : process.env.NEXT_PUBLIC_PROGRAMS_API}programs?all_programs=true&per_page=${
      queryStringWithSFIdList?.length
    }&${queryStringWithSFIdList}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': ' application/json',
        'HTTP-EE-RESOURCES-API-KEY': `${isGA ? process.env.NEXT_PUBLIC_GA_PROGRAMS_SECRET : process.env.NEXT_PUBLIC_PROGRAMS_SECRET}`
      }
    }
  )

export async function getMultipleProgramData(listOfPrograms: string[]) {
  let multipleProgramData

  const queryStringWithSFIdList = listOfPrograms.map((id: string) => `q[sfid_in][]=${id}`).join('&')
  multipleProgramData = await getMultipleProgramsPayload(queryStringWithSFIdList)

  if (!multipleProgramData) {
    multipleProgramData = await getMultipleProgramsPayload(queryStringWithSFIdList, true)
  }

  return await multipleProgramData?.json()
}

export const getAssetTypeContent = (rawContent: Asset | string | undefined) => {
  if (typeof rawContent === 'string') {
    return rawContent
  }
  return rawContent?.fields?.file?.url ? `${addDomainToUrl(rawContent?.fields?.file?.url)}` : ''
}

export const getSchoolTranslationKey = (schoolName = '') => {
  return schoolName?.toLocaleLowerCase().replace(/\s/g, '_')
}

export function getSectionColorClassName(backgroundColor: keyof typeof COLOR_MAP | string, allowBrandingColorApplication?: boolean) {
  return backgroundColor === 'background' || backgroundColor.includes('#')
    ? COLOR_MAP.background
    : allowBrandingColorApplication
    ? COLOR_MAP[backgroundColor as keyof typeof COLOR_MAP]
    : ''
}

export const removeKeys = (obj: any, keys: any): any => {
  if (Array.isArray(obj)) return obj.map((item: any) => removeKeys(item, keys))

  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((previousValue: any, key: any) => {
      return keys.includes(key) ? previousValue : { ...previousValue, [key]: removeKeys(obj[key], keys) }
    }, {})
  }

  return obj
}

export const getHeroSection = (sections: any) =>
  sections?.find(
    (section: { sys: { contentType: { sys: { id: string } } } }) =>
      section?.sys.contentType.sys.id === sectionsContentTypes.HeroLandingPages ||
      section?.sys.contentType.sys.id === sectionsContentTypes.HeroReferral ||
      section?.sys.contentType.sys.id === sectionsContentTypes.ProgamMicrositesHero
  )

export const getOpenMetaGraphDetails = (
  openGraphMeta: Entry<TypeOpenGraphMetaFields>,
  seoMeta?: Entry<TypeSeoMetaFields>,
  heroTitle?: string,
  subTitle?: string,
  image?: Asset
) => ({
  ...openGraphMeta,
  fields: {
    ...openGraphMeta.fields,
    ogTitle: openGraphMeta.fields?.ogTitle ?? seoMeta?.fields?.title ?? heroTitle,
    ogDescription: openGraphMeta.fields?.ogDescription ?? seoMeta?.fields?.description ?? subTitle,
    ogImage: openGraphMeta.fields?.ogImage ?? image
  }
})

export const ogFallBackDetails = (
  openGraphMeta: Entry<TypeOpenGraphMetaFields>,
  seoMeta?: Entry<TypeSeoMetaFields>,
  heroTitle?: string,
  subTitle?: string,
  image?: Asset,
  school?: Entry<TypeSchoolFields>
) => ({
  ...openGraphMeta,
  fields: {
    ...openGraphMeta?.fields,
    ogTitle: seoMeta?.fields?.title || heroTitle,
    ogDescription: seoMeta?.fields?.description || subTitle,
    ogImage: school ? { fields: { file: { url: school?.fields?.logo_web } } } : image
  }
})
