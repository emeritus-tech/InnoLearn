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

// const quiz = () => {
  
// }




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
          modalSize="large"
          heading='CSS MCQs'
          closeOnBackgroudClick
        >
        <div >
          {/* {Quiz} */}
          {/* Screen First Starts */}
          
          <div className='form-wrapper'>
            <div className="question">
              <span className="ques-number">1</span>
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
          {/* Screen First Ends */}


          {/* Result-Screen Starts */}
          {/* <div className='result-screen coupon-parent'>
            <div className='progress-bar-parent'>
              <div className="progress-bar coupon">
                <svg className='confetti' version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 800 800">
                  <g className="confetti-cone">
                    <path className="conf0" d="M131.5,172.6L196,343c2.3,6.1,11,6.1,13.4,0l65.5-170.7L131.5,172.6z" />
                    <path className="conf1" d="M131.5,172.6L196,343c2.3,6.1,11,6.1,13.4,0l6.7-17.5l-53.6-152.9L131.5,172.6z" />

                    <path className="conf2" d="M274.2,184.2c-1.8,1.8-4.2,2.9-7,2.9l-129.5,0.4c-5.4,0-9.8-4.4-9.8-9.8c0-5.4,4.4-9.8,9.9-9.9l129.5-0.4
                            c5.4,0,9.8,4.4,9.8,9.8C277,180,275.9,182.5,274.2,184.2z" />
                    <polygon className="conf3" points="231.5,285.4 174.2,285.5 143.8,205.1 262.7,204.7 			" />
                    <path className="conf4" d="M166.3,187.4l-28.6,0.1c-5.4,0-9.8-4.4-9.8-9.8c0-5.4,4.4-9.8,9.9-9.9l24.1-0.1c0,0-2.6,5-1.3,10.6
                            C161.8,183.7,166.3,187.4,166.3,187.4z" />
                    <ellipse transform="matrix(0.7071 -0.7071 0.7071 0.7071 -89.8523 231.0278)" className="conf2" cx="233.9" cy="224" rx="5.6" ry="5.6" />
                    <path className="conf5" d="M143.8,205.1l5.4,14.3c6.8-2.1,14.4-0.5,19.7,4.8c7.7,7.7,7.6,20.1-0.1,27.8c-1.7,1.7-3.7,3-5.8,4l11.1,29.4
                            l27.7,0l-28-80.5L143.8,205.1z" />
                    <path className="conf2" d="M169,224.2c-5.3-5.3-13-6.9-19.7-4.8l13.9,36.7c2.1-1,4.1-2.3,5.8-4C176.6,244.4,176.6,231.9,169,224.2z" />
                    <ellipse transform="matrix(0.7071 -0.7071 0.7071 0.7071 -119.0946 221.1253)" className="conf6" cx="207.4" cy="254.3" rx="11.3" ry="11.2" />
                  </g>

                  <rect x="113.7" y="135.7" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -99.5348 209.1582)" className="conf7" width="178" height="178" />
                  <line className="conf7" x1="76.8" y1="224.7" x2="328.6" y2="224.7" />
                  <polyline className="conf7" points="202.7,350.6 202.7,167.5 202.7,98.9 	" />


                  <circle className="conf2" id="b1" cx="195.2" cy="232.6" r="5.1" />
                  <circle className="conf0" id="b2" cx="230.8" cy="219.8" r="5.4" />
                  <circle className="conf0" id="c2" cx="178.9" cy="160.4" r="4.2" />
                  <circle className="conf6" id="d2" cx="132.8" cy="123.6" r="5.4" />
                  <circle className="conf0" id="d3" cx="151.9" cy="105.1" r="5.4" />

                  <path className="conf0" id="d1" d="M129.9,176.1l-5.7,1.3c-1.6,0.4-2.2,2.3-1.1,3.5l3.8,4.2c1.1,1.2,3.1,0.8,3.6-0.7l1.9-5.5
                          C132.9,177.3,131.5,175.7,129.9,176.1z" />
                  <path className="conf6" id="b5" d="M284.5,170.7l-5.4,1.2c-1.5,0.3-2.1,2.2-1,3.3l3.6,3.9c1,1.1,2.9,0.8,3.4-0.7l1.8-5.2
                          C287.4,171.9,286.1,170.4,284.5,170.7z" />
                  <circle className="conf6" id="c3" cx="206.7" cy="144.4" r="4.5" />
                  <path className="conf2" id="c1" d="M176.4,192.3h-3.2c-1.6,0-2.9-1.3-2.9-2.9v-3.2c0-1.6,1.3-2.9,2.9-2.9h3.2c1.6,0,2.9,1.3,2.9,2.9v3.2
                          C179.3,191,178,192.3,176.4,192.3z" />
                  <path className="conf2" id="b4" d="M263.7,197.4h-3.2c-1.6,0-2.9-1.3-2.9-2.9v-3.2c0-1.6,1.3-2.9,2.9-2.9h3.2c1.6,0,2.9,1.3,2.9,2.9v3.2
                          C266.5,196.1,265.2,197.4,263.7,197.4z" />
                  <path id="yellow-strip" d="M179.7,102.4c0,0,6.6,15.3-2.3,25c-8.9,9.7-24.5,9.7-29.7,15.6c-5.2,5.9-0.7,18.6,3.7,28.2
                          c4.5,9.7,2.2,23-10.4,28.2" />
                  <path className="conf8" id="yellow-strip" d="M252.2,156.1c0,0-16.9-3.5-28.8,2.4c-11.9,5.9-14.9,17.8-16.4,29c-1.5,11.1-4.3,28.8-31.5,33.4" />
                  <path className="conf0" id="a1" d="M277.5,254.8h-3.2c-1.6,0-2.9-1.3-2.9-2.9v-3.2c0-1.6,1.3-2.9,2.9-2.9h3.2c1.6,0,2.9,1.3,2.9,2.9v3.2
                          C280.4,253.5,279.1,254.8,277.5,254.8z" />
                  <path className="conf3" id="c4" d="M215.2,121.3L215.2,121.3c0.3,0.6,0.8,1,1.5,1.1l0,0c1.6,0.2,2.2,2.2,1.1,3.3l0,0c-0.5,0.4-0.7,1.1-0.6,1.7v0
                          c0.3,1.6-1.4,2.8-2.8,2l0,0c-0.6-0.3-1.2-0.3-1.8,0h0c-1.4,0.7-3.1-0.5-2.8-2v0c0.1-0.6-0.1-1.3-0.6-1.7l0,0
                          c-1.1-1.1-0.5-3.1,1.1-3.3l0,0c0.6-0.1,1.2-0.5,1.5-1.1v0C212.5,119.8,214.5,119.8,215.2,121.3z" />
                  <path className="conf3" id="b3" d="M224.5,191.7L224.5,191.7c0.3,0.6,0.8,1,1.5,1.1l0,0c1.6,0.2,2.2,2.2,1.1,3.3v0c-0.5,0.4-0.7,1.1-0.6,1.7l0,0
                          c0.3,1.6-1.4,2.8-2.8,2h0c-0.6-0.3-1.2-0.3-1.8,0l0,0c-1.4,0.7-3.1-0.5-2.8-2l0,0c0.1-0.6-0.1-1.3-0.6-1.7v0
                          c-1.1-1.1-0.5-3.1,1.1-3.3l0,0c0.6-0.1,1.2-0.5,1.5-1.1l0,0C221.7,190.2,223.8,190.2,224.5,191.7z" />
                  <path className="conf3" id="a2" d="M312.6,242.1L312.6,242.1c0.3,0.6,0.8,1,1.5,1.1l0,0c1.6,0.2,2.2,2.2,1.1,3.3l0,0c-0.5,0.4-0.7,1.1-0.6,1.7v0
                          c0.3,1.6-1.4,2.8-2.8,2l0,0c-0.6-0.3-1.2-0.3-1.8,0h0c-1.4,0.7-3.1-0.5-2.8-2v0c0.1-0.6-0.1-1.3-0.6-1.7l0,0
                          c-1.1-1.1-0.5-3.1,1.1-3.3l0,0c0.6-0.1,1.2-0.5,1.5-1.1v0C309.9,240.6,311.9,240.6,312.6,242.1z" />
                  <path className="conf8" id="yellow-strip" d="M290.7,215.4c0,0-14.4-3.4-22.6,2.7c-8.2,6.2-8.2,23.3-17.1,29.4c-8.9,6.2-19.8-2.7-32.2-4.1
                          c-12.3-1.4-19.2,5.5-20.5,10.9" />
                
                </svg>
                <div className='percent-parent'>
                  <span className='percent-num'>93</span>
                  <span className='percent'>%</span>
                </div>
                <p className="para--three m-b-0">14 of 15 correct</p>
              </div>
              <h4 className="medium-text-1">Congrats! You just earned a $250 coupon towards your next IIM Indore program.</h4>
              <p className="para--four">Expires 2/1/25. Credit will be applied at checkout.</p>
            </div>
            <div className='certificate-parent'>
              <h4 className="medium-text-1">Your Certificate</h4>
              <img src="https://i.ibb.co/JyTg9ZQ/image-225-1.png" alt="image-225"/>
              <button aria-label="Download" className="btn btn--mid btn--linkedin">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                <path d="M4.2916 16.5H0.777832V5.0812H4.2916V16.5ZM17.2223 16.5H13.7085V10.4145C13.7085 8.7735 13.076 8.02137 11.9516 8.02137C11.038 8.02137 10.4758 8.43162 10.1947 9.32051V16.5H6.68097C6.68097 16.5 6.68097 6.24359 6.68097 5.0812H9.42171L9.63253 7.33761H9.70281C10.4056 6.24359 11.6002 5.42308 13.1463 5.42308C14.341 5.42308 15.3248 5.76496 16.0979 6.58547C16.8006 7.40598 17.2223 8.5 17.2223 10.0726V16.5ZM4.36188 2.2094C4.36188 3.16667 3.58885 3.9188 2.53472 3.9188C1.48059 3.9188 0.777832 3.16667 0.777832 2.2094C0.777832 1.25214 1.55086 0.5 2.53472 0.5C3.51857 0.5 4.36188 1.32051 4.36188 2.2094Z" fill="white"></path>
                </svg>
                <span className='txt'>SHARE CERTIFICATE</span>
              </button>
              <button aria-label="Download" className="btn btn--mid btn--secondary">DOWNLOAD CERTIFICATE</button>
            </div>
          </div> */}
          {/* Result-Screen Ends */}

     

          <div className="modal__footer m-t-5">
           <div className="counter">
            <span className='current-question fw-bold'>1</span>/ 15
           </div>
           <div className='btn_wrapper'>
              <button
                type="button" 
                className="btn btn--mid btn--secondary-border" 
                aria-label="Back">Go Back
              </button>
              <button
                  className="btn btn--mid btn--secondary"
                  aria-label="Next"
                  // onClick={quiz}
                >
              Next
              </button>
            </div>
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
