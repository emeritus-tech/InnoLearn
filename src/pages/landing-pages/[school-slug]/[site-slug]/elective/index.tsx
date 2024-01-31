import { useState } from 'react'
import { landingPageContentType, sectionsContentTypes, genericSectionTypes } from 'constants/contentful'
import { buildGetStaticPaths, buildGetStaticProps } from 'utils/contentfulConfig'
import { TypeLandingPageParentTemplateFields } from 'types/contentful-types'
import PageLayout from 'pres/common/layout/page/page'
import { ProgramData } from 'types/api-response-types/ProgramData'
import { LocaleListType } from 'types/LocaleListType'
import { SCREENS } from 'constants/trackpoint'

export interface LandingPagePropsType extends Omit<TypeLandingPageParentTemplateFields, 'contentfulName' | 'slug'> {
  preview: boolean
  site: string
  locale: string
  dynamicProgramData: ProgramData
  inlineCss?: string
  isGaPage?: boolean
}

export const getStaticPaths = buildGetStaticPaths<TypeLandingPageParentTemplateFields>({
  rootContentType: landingPageContentType,
  processPathParams: ({ items }) => {
    const paths: { 'site-slug': string; 'school-slug': string; availableLocales: LocaleListType }[] = []

    items.forEach(({ fields: { slug: siteSlug, program, availableLocales } }) => {
      const { host_name, vanity_host_name } = program?.fields?.school?.fields || {}
      if (host_name) {
        paths.push({ 'school-slug': host_name, 'site-slug': siteSlug, availableLocales })
      }
      if (vanity_host_name) {
        paths.push({ 'school-slug': vanity_host_name, 'site-slug': siteSlug, availableLocales })
      }
    })
    return paths
  }
})

export const getStaticProps = buildGetStaticProps<LandingPagePropsType, LandingPagePropsType>({
  slug: 'site-slug',
  rootContentType: landingPageContentType,
  processPage: ({ siteData, params }) => {
    const {
      fields: { sections, header, footer, seoMeta, cookieBotId, favicon, utmParams, defaultLocale, trackpointMeta, program, school }
    } = siteData
    const pageData =
      program?.fields?.school?.fields.host_name === params?.['school-slug'] ||
      program?.fields?.school?.fields.vanity_host_name === params?.['school-slug']

    if (!pageData) {
      // eslint-disable-next-line no-console
      console.log('Check invalid school slug in landing page')
    }
    const getElectiveTranslatedData = () => {
      sections?.forEach((section: any, index: number) => {
        if ([sectionsContentTypes.InfoBar, sectionsContentTypes.ApplicationDetails].includes(section?.sys?.contentType?.sys?.id)) {
          delete sections[index as number]
        } else if (
          section?.sys?.contentType?.sys?.id === sectionsContentTypes.GenericSection &&
          [genericSectionTypes.ButtonSection].includes(section.fields?.cta?.sys?.contentType?.sys?.id)
        ) {
          delete section.fields?.cta
        }
      })
    }
    getElectiveTranslatedData()
    return {
      sections,
      seoMeta,
      utmParams,
      header,
      footer,
      cookieBotId,
      favicon,
      defaultLocale,
      trackpointMeta,
      school
    }
  }
})

export default function ElectivePage({
  sections,
  header,
  footer,
  preview,
  seoMeta,
  favicon,
  cookieBotId,
  utmParams,
  program,
  trackpointMeta,
  defaultLocale,
  school,
  inlineCss = '',
  isGaPage
}: LandingPagePropsType) {
  const [isHeroInView, setIsHeroInView] = useState(true)
  return (
    <>
      <style jsx global data-name="school style">
        {inlineCss}
      </style>
      <PageLayout
        preview={preview}
        seoMeta={seoMeta}
        favicon={favicon}
        faviconPath={school?.fields?.translation_key}
        cookieBotId={cookieBotId}
        trackpointMeta={trackpointMeta}
        defaultLocale={defaultLocale}
        value={{
          program,
          school,
          screenName: SCREENS.ELECTIVE_PAGE,
          isGaPage
        }}
        speedCurveLabel="Contentful - Elective Pages"
      >
        {header && (
          <PageLayout.Header
            logo={header.fields.logo}
            seoLogo={header?.fields?.seoLogo}
            logoLink={header.fields.logoLink}
            secondaryLogo={header.fields.secondaryLogo}
            seoSecondaryLogo={header?.fields?.seoSecondaryLogo}
            secondaryLogoLink={header.fields.secondaryLogoLink}
            coBrandedMessage={header.fields.coBrandedMessage}
            backgroundColor={header.fields.backgroundColor}
            logoVariants={header.fields.logoVariants}
            className="bg-transparent lp-colored--header"
          />
        )}
        <PageLayout.Renderer
          pageSections={sections}
          utmParams={utmParams?.fields}
          className="lp-colored--list"
          setIsHeroInView={setIsHeroInView}
          isHeroInView={isHeroInView}
        />

        {footer && footer?.fields?.body && (
          <PageLayout.Footer
            contentfulName={footer.fields.contentfulName}
            body={footer.fields.body}
            backgroundColor={footer.fields?.backgroundColor}
            logo={footer.fields?.logo}
          />
        )}
      </PageLayout>
    </>
  )
}
