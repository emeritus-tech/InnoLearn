import { useState } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { Entry } from 'contentful'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components'
import { landingPageContentType, LIQUID_VARIABLE_INVALID_TEXT, SUCCESS_PAGE, sectionsContentTypes } from 'constants/contentful'
import { buildGetStaticPaths, buildGetStaticProps } from 'utils/contentfulConfig'
import {
  TypeComponentProgramInfoLabelFields,
  TypeComponentProgramRoundsFields,
  TypeLandingPageParentTemplateFields,
  TypeOpenGraphMetaFields
} from 'types/contentful-types'
import PageLayout from 'pres/common/layout/page/page'
import { ProgramData } from 'types/api-response-types/ProgramData'
import Registration from 'pres/common/sections/registration'
import StickyBrochure from 'pres/common/sections/sticky-brochure'
import { LocaleListType } from 'types/LocaleListType'
import { marketingModule, isValidLiquidVariable } from 'utils/marketingModule'
import { numberFormatter } from 'utils/numberFormatter'
import { getScreenName } from 'utils/common'
import useProgramRoundDiscount from 'hooks/useProgramRoundDiscount'
import useProgramDuration from 'hooks/useProgramDuration'
import useProgramStartDate from 'hooks/useProgramStartDate'
import { getHeroSection, getOpenMetaGraphDetails, ogFallBackDetails } from 'utils/contentful'
import ReferralModal from 'pres/common/sections/referral-modal'
import DynamicRibbon from 'pres/common/sections/dynamic-ribbon'
import type { TypeSectionModuleFields } from 'types/contentful-types/TypeSectionModule'
import type { TypeSectionLandingHeroFields } from 'types/contentful-types/TypeSectionLandingHero'


export interface LandingPagePropsType extends Omit<TypeLandingPageParentTemplateFields, 'contentfulName' | 'slug'> {
  preview: boolean
  site: string
  locale: string
  dynamicProgramData: ProgramData
  inlineCss?: string
  isGaPage?: boolean
  isLandingThankYouPageconfigured?: boolean
  page?: string
  pageSlug?: string
}

export const getStaticPaths = buildGetStaticPaths<TypeLandingPageParentTemplateFields>({
  rootContentType: landingPageContentType,
  processPathParams: ({ items }) => {
    const paths: { 'site-slug': string; 'school-slug': string; 'page-slug'?: string[]; availableLocales: LocaleListType }[] = []

    items.forEach(({ fields: { slug: siteSlug, program, availableLocales, pages } }) => {
      const { host_name, vanity_host_name } = program?.fields?.school?.fields || {}
      pages?.forEach(({ fields: { slug: pageSlug } }) => {
        paths.push({ 'school-slug': host_name || 'default', 'site-slug': siteSlug, 'page-slug': [pageSlug || 'default'], availableLocales })
        paths.push({
          'school-slug': vanity_host_name || 'default',
          'site-slug': siteSlug,
          'page-slug': [pageSlug || 'default'],
          availableLocales
        })
      })
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
        seoSchema,
        favicon,
        utmParams,
        defaultLocale,
        trackpointMeta,
        program,
        leadForm,
        dynamicRibbon,
        applyNow,
        school,
        thankYou,
        b2bThankYouConfig,
        stickyBrochure,
        pages,
        openGraphMeta
      }
    } = siteData
    const pageData =
      program?.fields?.school?.fields.host_name === params?.['school-slug'] ||
      program?.fields?.school?.fields.vanity_host_name === params?.['school-slug']
    const thankyouPageData = pages?.find((pageInfo) => pageInfo.fields?.slug === params?.['page-slug']?.[0])
    const { slug: page } = pages?.[0]?.fields || {}
    const { pageSections, slug: pageSlug, dynamicRibbon: thankyouRibbon } = thankyouPageData?.fields || {}

    if (!pageData) {
      // eslint-disable-next-line no-console
      console.log('Check invalid school slug in landing page')
    }
    return {
      sections: pageSections ?? sections,
      seoMeta,
      utmParams,
      header,
      footer,
      cookieBotId,
      seoSchema,
      favicon,
      defaultLocale,
      trackpointMeta,
      program,
      leadForm,
      dynamicRibbon: pageSlug === SUCCESS_PAGE ? thankyouRibbon : dynamicRibbon,
      applyNow,
      school,
      thankYou,
      b2bThankYouConfig,
      stickyBrochure,
      page,
      pageSlug,
      openGraphMeta
    }
  }
})
// Override the show original price with round section configuration
const getOriginialPriceConfiguration = (
  sections?: Entry<
    TypeComponentProgramInfoLabelFields | TypeComponentProgramRoundsFields | TypeSectionLandingHeroFields | TypeSectionModuleFields
  >[]
) => {
  let hasRoundConfigured = false

  sections?.forEach(
    (
      section: Entry<
        TypeComponentProgramInfoLabelFields | TypeComponentProgramRoundsFields | TypeSectionLandingHeroFields | TypeSectionModuleFields
      >
    ) => {
      if (!hasRoundConfigured) {
        hasRoundConfigured = sectionsContentTypes.ApplicationDetails === section?.sys?.contentType?.sys?.id
      }
    }
  )
  return hasRoundConfigured
}

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
  seoSchema,
  dynamicProgramData,
  defaultLocale,
  school,
  applyNow,
  inlineCss = '',
  thankYou,
  b2bThankYouConfig,
  stickyBrochure,
  isGaPage,
  page,
  pageSlug,
  openGraphMeta
}: LandingPagePropsType) {
  const [isHeroInView, setIsHeroInView] = useState(true)
  dynamicProgramData.show_original_price = getOriginialPriceConfiguration(sections)
  const { asPath } = useRouter()
  const { t } = useTranslation()
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
  const queryString = asPath.split('?')[1]
  const invalidRibbonText = ribbonMarketingText.includes(LIQUID_VARIABLE_INVALID_TEXT)

  const heroSection = getHeroSection(sections)
  const { desktopImage, title: heroTitle, subtitle: subTitle } = heroSection?.fields || {}

  function closeOverlay(facultyName: any): void {
    throw new Error('Function not implemented.')
  }

const Quiz = () => {
<div className='form-wrapper'>
<div className="question">
  <span className="counter-number">1</span>
  <span>The full form of CSS is:</span>
</div>
<div className="form-radio-label-row">
<label className="form-radio-label form-label-sm" htmlFor="radio-5"
  ><input
    type="radio"
    id="radio-5"
    className="form-radio-input"
    aria-label="radio"
    name="radiogroup"
  />
  <span className="form-radio-label__text">Cybersecurity</span></label>
</div>
<div className="form-radio-label-row">
  <label className="form-radio-label form-label-sm" htmlFor="radio-6"
    ><input
      type="radio"
      id="radio-6"
      className="form-radio-input"
      aria-label="radio"
      name="radiogroup"/>
      <span className="form-radio-label__text">Data Science &amp; Analytics
      </span >
    </label>
</div>
<div className="form-radio-label-row">
  <label className="form-radio-label form-label-sm" htmlFor="radio-7"
    ><input
      type="radio"
      id="radio-7"
      className="form-radio-input"
      aria-label="radio"
      name="radiogroup"
    /><span className="form-radio-label__text">Digital Marketing</span>
    </label>
</div>
</div>
}
  return (
    <>
      <style jsx global data-name="school style">
        {inlineCss}
      </style>
      <PageLayout
        preview={preview}
        seoMeta={seoMeta}
        openGraphMeta={
          getOpenMetaGraphDetails(openGraphMeta || ({} as Entry<TypeOpenGraphMetaFields>), seoMeta, heroTitle, subTitle, desktopImage) ||
          ogFallBackDetails(openGraphMeta || ({} as Entry<TypeOpenGraphMetaFields>), seoMeta, heroTitle, subTitle, desktopImage, school)
        }
        favicon={favicon}
        faviconPath={schoolTranslationKey}
        cookieBotId={cookieBotId}
        trackpointMeta={trackpointMeta}
        seoSchema={seoSchema}
        defaultLocale={defaultLocale}
        value={{
          leadFormFields: leadForm,
          programCourseRun: dynamicProgramData,
          program,
          school,
          thankYouFields: thankYou,
          b2bThankYouFields: b2bThankYouConfig,
          screenName: getScreenName(queryString, pageSlug),
          isGaPage,
          defaultLocale,
          isLandingThankYouPageconfigured: page === SUCCESS_PAGE,
          navigatedOnThankYouPage: pageSlug === SUCCESS_PAGE
        }}
        gtmID={dynamicProgramData.gtm_tag_id}
        speedCurveLabel="Contentful - Landing Pages"
      >
        <ReferralModal currency={currency} rewardAmount={dynamicProgramData?.friend_reward_amount} />
        {/* Quiz Modal Starts */}
        <div className='quiz-modal-container'>
        <BluePrintModal
          closeOverlay={() => closeOverlay(dynamicProgramData?.friend_reward_amount)}
          modalSize="medium"
          heading='HEading'
          closeOnBackgroudClick
        >
        <div >
          {Quiz}
          <div className="modal__footer m-t-5">
                    <button
                      className="btn btn--mid btn--secondary"
                      aria-label="Close"
                      onClick={Quiz}
                    >
                  Next
                    </button>
          </div>
        </div>

        </BluePrintModal>
        </div>
        {/* Quiz Modal Ends */}
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
              background={dynamicRibbon?.fields?.background}
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
        {applyNow && (
          <Registration
            sectionName={applyNow?.fields?.sectionName}
            title={applyNow?.fields?.title}
            subTitle={applyNow?.fields?.subTitle}
            content={applyNow?.fields?.content}
            startDateLabel={applyNow?.fields?.startDateLabel}
            lastDayEnrollLabel={applyNow?.fields?.lastDayEnrollLabel}
            cta={applyNow?.fields?.cta}
            className="lp-colored--list"
            backgroundColor={applyNow?.fields?.backgroundColor}
          />
        )}
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
