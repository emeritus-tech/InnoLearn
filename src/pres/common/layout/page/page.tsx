import { ReactNode } from 'react'
// import * as Sentry from '@sentry/nextjs'
import { Asset, EntryFields } from 'contentful'
import { I18nDictionary } from 'next-translate'
import I18nProvider from 'next-translate/I18nProvider'
import useTranslation from 'next-translate/useTranslation'

import commonEN_US from 'locales/en-US/common.json'
import commonES_ES from 'locales/es-ES/common.json'
import commonPT_BR from 'locales/pt-BR/common.json'
import commonFR_FR from 'locales/fr-FR/common.json'
import commonEN_IN from 'locales/en-IN/common.json'

import countriesEN_US from 'locales/en-US/countries.json'
import countriesES_ES from 'locales/es-ES/countries.json'
import countriesPT_BR from 'locales/pt-BR/countries.json'
import countriesFR_FR from 'locales/fr-FR/countries.json'
import countriesEN_IN from 'locales/en-IN/countries.json'

import leadFormEN_US from 'locales/en-US/leadForm.json'
import leadFormES_ES from 'locales/es-ES/leadForm.json'
import leadFormPT_BR from 'locales/pt-BR/leadForm.json'
import leadFormFR_FR from 'locales/fr-FR/leadForm.json'
import leadFormEN_IN from 'locales/en-IN/leadForm.json'

import dynamic from 'next/dynamic'
import { PageLayoutContext, usePageLayoutContext, LandingPageContext } from 'hooks/usePageLayoutContext'
import useTrackpoint from 'hooks/useTrackpoint'
import PreviewMode from 'pres/common/components/preview-mode'
import Favicon from 'pres/common/sections/favicon'
import Footer from 'pres/common/sections/footer'
import { FooterProps } from 'pres/common/sections/footer/footer'
import Ribbon from 'pres/common/sections/ribbon'
import { RibbonProps } from 'pres/common/sections/ribbon/ribbon'
import SeoMeta from 'pres/common/sections/seo-meta'
import { TypeSeoMeta } from 'types/contentful-types'
import Header from 'pres/common/sections/header'
import { HeaderProps } from 'pres/common/sections/header/header'
import Renderer from 'pres/common/components/renderer'
import { RendererProps } from 'pres/common/components/renderer/renderer'
import { TypeOpenGraphMeta } from 'types/contentful-types/TypeOpenGraphMeta'
import OpenGraphMeta from 'pres/common/sections/open-graph-meta'

import i18n from '../../../../../i18n'

const GTMHead = dynamic(() => import('pres/common/components/gtm/gtm-head'))
const SpeedCurveHead = dynamic(() => import('pres/common/components/speed-curve/speed-curve'))
const GTMNoScript = dynamic(() => import('pres/common/components/gtm/gtm-noscript'))
const ClarityHead = dynamic(() => import('pres/common/components/clarity/clarity-head'))
const CookieBotHead = dynamic(() => import('pres/common/sections/cookie-bot/cookie-bot-head'))
const SeoSchemaHead = dynamic(() => import('pres/common/components/seo-schema/seo-schema'))
const UserCentricDetails = dynamic(() => import('pres/common/sections/user-centrics'))

interface PageLayoutProps {
  schoolStyleName?: string
  favicon?: Asset | string
  cookieBotId?: string
  seoMeta?: TypeSeoMeta
  preview: boolean
  defaultLocale?: string
  children: ReactNode
  trackpointMeta: EntryFields.Object
  value?: LandingPageContext
  gtmID?: string
  openGraphMeta?: TypeOpenGraphMeta
  speedCurveLabel: string
  usercentricSettingId?: string
  seoSchema?: EntryFields.Object
  faviconPath?: string
}

const commonDictionary: { [key: string]: I18nDictionary } = {
  'en-US': commonEN_US,
  'es-ES': commonES_ES,
  'pt-BR': commonPT_BR,
  'fr-FR': commonFR_FR,
  'en-IN': commonEN_IN
}

const countriesDictionary: { [key: string]: I18nDictionary } = {
  'en-US': countriesEN_US,
  'es-ES': countriesES_ES,
  'pt-BR': countriesPT_BR,
  'fr-FR': countriesFR_FR,
  'en-IN': countriesEN_IN
}

const leadFormDictionary: { [key: string]: I18nDictionary } = {
  'en-US': leadFormEN_US,
  'es-ES': leadFormES_ES,
  'pt-BR': leadFormPT_BR,
  'fr-FR': leadFormFR_FR,
  'en-IN': leadFormEN_IN
}

function PageLayout({
  schoolStyleName,
  favicon,
  faviconPath,
  cookieBotId,
  seoMeta,
  preview,
  defaultLocale,
  trackpointMeta,
  children,
  value = {},
  gtmID,
  openGraphMeta,
  speedCurveLabel,
  usercentricSettingId,
  seoSchema
}: PageLayoutProps) {
  useTrackpoint(trackpointMeta, value?.program, value?.screenName, value?.school_name, 'Y', value.isMicrositePage)
  const { lang } = useTranslation()
  const locale = lang === 'default' ? defaultLocale || i18n.defaultLocale : lang

  try {
    return (
      <I18nProvider
        lang={defaultLocale || locale}
        namespaces={{
          common: commonDictionary[defaultLocale || locale],
          countries: countriesDictionary[defaultLocale || locale],
          leadForm: leadFormDictionary[defaultLocale || locale]
        }}
      >
        <PageLayoutContext.Provider value={value}>
          <SpeedCurveHead />
          <GTMHead gtmID={gtmID} speedCurveLabel={speedCurveLabel} />
          <GTMNoScript gtmID={gtmID} />
          {process.env.NEXT_PUBLIC_ENABLE_CLARITY && <ClarityHead />}
          {schoolStyleName && <link href={`${process.env.NEXT_PUBLIC_SCHOOL_STYLES_API}${schoolStyleName}.css`} rel="stylesheet" />}
          {<Favicon favicon={favicon || ''} faviconPath={faviconPath} />}
          {cookieBotId && <CookieBotHead cookieBotId={cookieBotId} />}
          {usercentricSettingId && <UserCentricDetails usercentricSettingId={usercentricSettingId} />}
          {seoSchema && <SeoSchemaHead seoSchema={seoSchema} />}
          {seoMeta && <SeoMeta seoMeta={seoMeta.fields} />}
          {openGraphMeta && <OpenGraphMeta openGraphMeta={openGraphMeta.fields} />}
          {children}
          {preview && <PreviewMode />}
        </PageLayoutContext.Provider>
      </I18nProvider>
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    // Sentry.captureException(error)
    return null
  }
}

// HOC to give scope through using context
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContextScope({ Component, props }: { Component: any; props?: any }) {
  usePageLayoutContext()
  return <Component {...props} />
}

PageLayout.Header = (props: HeaderProps) => <ContextScope props={props} Component={Header} />
PageLayout.Ribbon = (props: RibbonProps) => <ContextScope props={props} Component={Ribbon} />
PageLayout.Footer = (props: FooterProps) => <ContextScope props={props} Component={Footer} />
PageLayout.Renderer = (props: RendererProps) => <ContextScope props={props} Component={Renderer} />

export default PageLayout
