import { useState } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import {
  ENTERPRISE_B2B_PAGE,
  ENTERPRISE_B2B_THANK_YOU_PAGE,
  ENTERPRISE_B2C_PAGE,
  ENTERPRISE_B2C_THANK_YOU_PAGE,
  LIQUID_VARIABLE_INVALID_TEXT,
  genericSectionTypes,
  landingPageContentType,
  sectionsContentTypes
} from 'constants/contentful'
import { buildGetStaticPaths, buildGetStaticProps } from 'utils/contentfulConfig'
import { TypeLandingPageParentTemplateFields } from 'types/contentful-types'
import PageLayout from 'pres/common/layout/page/page'
import { ProgramData } from 'types/api-response-types/ProgramData'
import StickyBrochure from 'pres/common/sections/sticky-brochure'
import { LocaleListType } from 'types/LocaleListType'
import { leadFormModel, optionData } from 'constants/enterpriseContentModel'
import { marketingModule, isValidLiquidVariable } from 'utils/marketingModule'
import { numberFormatter } from 'utils/numberFormatter'
import { getScreenName } from 'utils/common'
import useProgramRoundDiscount from 'hooks/useProgramRoundDiscount'
import useProgramDuration from 'hooks/useProgramDuration'
import useProgramStartDate from 'hooks/useProgramStartDate'
import ReferralModal from 'pres/common/sections/referral-modal'
import EnterpriseB2bSection from 'pres/common/sections/enterprise-b2b-info'
import DynamicRibbon from 'pres/common/sections/dynamic-ribbon'

export interface LandingPagePropsType extends Omit<TypeLandingPageParentTemplateFields, 'contentfulName' | 'slug'> {
  preview: boolean
  site: string
  locale: string
  dynamicProgramData: ProgramData
  inlineCss?: string
  isGaPage?: boolean
}

const getEnterpriseB2bTranslatedData = (sections: any, stickyBrochure: any, t: any, queryString?: string) => {
  sections?.forEach((section: any) => {
    if ([sectionsContentTypes.InfoBar].includes(section?.sys?.contentType?.sys?.id)) {
      // delete sections[index as number]
      delete section.fields?.programMoreInfoSection
      delete section.fields?.programFeeLink?.fields?.label
    } else if (
      section?.sys?.contentType?.sys?.id === sectionsContentTypes.GenericSection &&
      [genericSectionTypes.ButtonSection].includes(section.fields?.cta?.sys?.contentType?.sys?.id)
    ) {
      const sectionCta = section.fields?.cta
      if (sectionCta !== undefined) sectionCta.fields!.text = t('leadForm:enterpriseCta')
    }
  })
  // Sticky brocher CTA update
  if (queryString?.includes(ENTERPRISE_B2B_THANK_YOU_PAGE) && stickyBrochure) {
    delete stickyBrochure?.fields?.cta
  } else if (stickyBrochure) {
    stickyBrochure.fields.cta.fields.text = t('leadForm:enterpriseCta')
  }
}

const getEnterpriseB2cTranslatedData = (sections: any, queryString?: string, stickyBrochure?: any) => {
  sections?.forEach((section: any) => {
    if ([sectionsContentTypes.InfoBar].includes(section?.sys?.contentType?.sys?.id)) {
      // delete sections[index as number]
      delete section.fields?.programMoreInfoSection
      delete section.fields?.programFeeLink?.fields?.label
    }
    if (queryString?.includes(ENTERPRISE_B2C_THANK_YOU_PAGE) && stickyBrochure) {
      delete stickyBrochure?.fields?.cta
    }
  })
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
      fields: {
        sections,
        header,
        footer,
        seoMeta,
        cookieBotId,
        favicon,
        utmParams,
        defaultLocale,
        trackpointMeta,
        program,
        leadForm,
        dynamicRibbon,
        dynamicProgramData,
        applyNow,
        school,
        thankYou,
        b2bThankYouConfig,
        stickyBrochure
      }
    } = siteData
    const pageData =
      program?.fields?.school?.fields.host_name === params?.['school-slug'] ||
      program?.fields?.school?.fields.vanity_host_name === params?.['school-slug']

    if (!pageData) {
      // eslint-disable-next-line no-console
      console.log('Check invalid school slug in landing page')
    }

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
      program,
      leadForm,
      dynamicRibbon,
      dynamicProgramData,
      applyNow,
      school,
      thankYou,
      b2bThankYouConfig,
      stickyBrochure
    }
  }
})

export default function LandingPage({
  sections,
  dynamicRibbon,
  header,
  footer,
  preview,
  seoMeta,
  favicon,
  cookieBotId,
  utmParams,
  program,
  leadForm,
  trackpointMeta,
  dynamicProgramData,
  defaultLocale,
  school,
  inlineCss = '',
  thankYou,
  b2bThankYouConfig,
  stickyBrochure,
  isGaPage
}: LandingPagePropsType) {
  const [isHeroInView, setIsHeroInView] = useState(true)
  const { asPath } = useRouter()
  const { t } = useTranslation()
  const queryString = asPath.split('?')[1]
  const b2bPage = queryString?.includes(ENTERPRISE_B2B_PAGE) || queryString?.includes(ENTERPRISE_B2B_THANK_YOU_PAGE)
  const b2cPage = queryString?.includes(ENTERPRISE_B2C_PAGE) || queryString?.includes(ENTERPRISE_B2C_THANK_YOU_PAGE)

  /* B2B flow changes*/
  if (b2bPage) {
    // update the Lead form model for b2b form
    if (leadForm) {
      leadForm.fields.fieldList = leadFormModel as any
      leadForm.fields.formTitle = t('leadForm:enterpriseTitle')
      getEnterpriseB2bTranslatedData(sections, stickyBrochure, t, queryString)
    }
    // Round info should not show for b2b flow
    delete dynamicProgramData?.current_enrollable_course_run?.rounds
  } else if (b2cPage) {
    getEnterpriseB2cTranslatedData(sections, queryString, stickyBrochure)
    // Round info should not show for b2c flow
    delete dynamicProgramData?.current_enrollable_course_run?.rounds
  }
  const {
    start_date__c: startDate = '',
    rounds,
    currency = '',
    price_in_program_currency_for_admin: adminPrice = 0,
    application_fee_in_program_currency: appFee = 0
  } = dynamicProgramData?.current_enrollable_course_run || {}
  const endTime = program?.fields?.end_time?.split('T')[1] || ''
  const programStartDate = useProgramStartDate(startDate, false, true)
  const schoolTranslationKey = program?.fields?.school?.fields?.translation_key
  const programDiscount = useProgramRoundDiscount(rounds || [], startDate, endTime, currency, adminPrice, appFee, schoolTranslationKey)
  const programDuration = useProgramDuration(startDate, endTime)
  const ribbonText = dynamicRibbon?.fields?.mainCopy || ''
  let ribbonMarketingText = ribbonText
  const defaultProgramFee = currency
    ? numberFormatter({
        number: adminPrice,
        currency,
        style: 'currency',
        userLocaleEnabled: dynamicProgramData?.number_formatting_localized_enabled
      })
    : '0'
  if (isValidLiquidVariable(ribbonText)) {
    ribbonMarketingText = marketingModule(ribbonText, programStartDate, programDiscount, programDuration, t, defaultProgramFee)
  }

  if (b2bPage) {
    const optionList = [] as any
    if (dynamicProgramData) {
      dynamicProgramData?.enrollable_courses?.forEach((batch: any) => {
        const newOption = { ...optionData }
        newOption.fields.contentfulName = `Lead Form ${batch.start_date__c}`
        newOption.fields.label = batch.start_date__c
        newOption.fields.value = batch.name
        optionList.push(newOption)
      })
    }
    leadFormModel.forEach((item) => {
      if (item.fields.attributeName === 'batch_name') {
        item.fields.optionList = optionList
      }
    })
  }
  const invalidRibbonText = ribbonMarketingText.includes(LIQUID_VARIABLE_INVALID_TEXT)
  return (
    <>
      <style jsx global data-name="school style">
        {inlineCss}
      </style>
      <PageLayout
        preview={preview}
        seoMeta={seoMeta}
        favicon={favicon}
        faviconPath={schoolTranslationKey}
        cookieBotId={cookieBotId}
        trackpointMeta={trackpointMeta}
        defaultLocale={defaultLocale}
        value={{
          leadFormFields: leadForm,
          programCourseRun: dynamicProgramData,
          program,
          school,
          thankYouFields: thankYou,
          b2bThankYouFields: b2bThankYouConfig,
          screenName: getScreenName(queryString),
          isGaPage
        }}
        gtmID={dynamicProgramData.gtm_tag_id}
        speedCurveLabel="Contentful - Landing Pages"
      >
        <ReferralModal currency={currency} rewardAmount={dynamicProgramData?.friend_reward_amount} />
        {dynamicRibbon?.fields &&
          (!invalidRibbonText ||
          (dynamicProgramData?.incentivized_referrals_enabled && dynamicProgramData?.current_enrollable_course_run) ? (
            <DynamicRibbon
              invalidRibbonText={invalidRibbonText}
              ribbonMarketingText={ribbonMarketingText}
              currency={currency}
              rewardAmount={dynamicProgramData.advocate_reward_amount}
              referralsEnabled={dynamicProgramData?.incentivized_referrals_enabled}
              relativeDaysBatchStartDate={dynamicRibbon.fields.relativeDaysBatchStartDate}
              mainCopy={ribbonText}
              cta={dynamicRibbon?.fields?.cta}
              contentfulName={dynamicRibbon.fields.contentfulName}
              landingPageTemplateIds={dynamicRibbon.fields.landingPageTemplateIds}
              eventType={dynamicRibbon?.fields?.eventType}
            />
          ) : null)}
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
          stickyBrochure={stickyBrochure}
        />
        {(b2bPage || b2cPage) && <EnterpriseB2bSection />}
        {footer && footer?.fields?.body && (
          <PageLayout.Footer
            contentfulName={footer.fields.contentfulName}
            body={footer.fields.body}
            backgroundColor={footer.fields?.backgroundColor}
            logo={footer.fields?.logo}
            seoLogo={footer.fields?.seoLogo}
          />
        )}
        {stickyBrochure?.fields && (
          <StickyBrochure
            contentfulName={stickyBrochure.fields.contentfulName}
            cta={stickyBrochure.fields.cta}
            device={stickyBrochure.fields.device}
            isHeroInView={isHeroInView}
            backgroundColor={stickyBrochure.fields.backgroundColor}
          />
        )}
      </PageLayout>
    </>
  )
}
