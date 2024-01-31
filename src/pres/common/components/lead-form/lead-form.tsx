import cn from 'classnames'
import { useForm } from 'react-hook-form'
import { useCookies } from 'react-cookie'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import { Lead } from '@emeritus-engineering/ee-api'
import useTranslation from 'next-translate/useTranslation'
import axios from 'axios'
import { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ProgramConsent } from '@emeritus-engineering/ee-api/dist/types'
import { initialRequiredData } from 'constants/trackpoint'
import { getFromCookie } from 'utils/common'
import { TypeFormGroupRadioFields } from 'types/contentful-types/TypeFormGroupRadio'
import {
  dynamicFieldsContentTypes,
  SELECT_TYPES_SUPPORTED,
  GROUP_INQUIRY_TYPES,
  RADIO_GROUP_TYPES_SUPPORTED,
  UTM_SOURCE,
  INPUT_ATTRIBUTE_SUPPORTED,
  THANK_YOU_PAGE,
  SUCCESS_PAGE
} from 'constants/contentful'
import { TypeLeadFormParentFields } from 'types/contentful-types'
import Button from 'pres/common/components/button'
import { buildLandingPageTrackingData, buildTPClickEvent, triggerTrackPoint } from 'utils/trackpoint'
import useImplicitConsent from 'hooks/useImplicitConsent'
import { filterEmptyValues, buildQueryString, getValueByLabel, getPageRouteURL, getThankyouPageURL } from 'utils/common'
import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { SALES_FORCE_PROP_NAME, SF_FIELD_NAMES } from 'constants/salesforce'
import useCountries from 'hooks/useCountries'
import { getSectionColorClassName } from 'utils/contentful'
import { SelectFormOptions } from '../select-form/select-form'
import styles from './lead-form.module.scss'
import FieldsFactory from './fields-factory'

declare global {
  interface Window {
    dataLayer: { event: string; courseName: string; coursePrice: number }[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LUX: any
  }
}
export interface LeadFormProps extends TypeLeadFormParentFields {
  schoolName: string
  programLanguage: string | undefined
  programId: number
  gdprType: string
  schoolCountry: string
  nonGdprMoreCautiousType: string
  nonGdprLessCautiousType: string
  countryCode?: string
  forceB2B?: boolean
  sectionDetails?: { sectionName?: string; sectionTitle?: string }
  inquiringId?: string
  privacyPolicyLink: string
  programSfid: string
  horizontalView?: boolean
  forceB2C?: boolean
}

function LeadForm({
  formTitle,
  submitCta,
  errorRedirectUrl,
  fieldList,
  successRedirectUrl,
  programLanguage,
  programId,
  gdprType,
  schoolCountry,
  nonGdprMoreCautiousType,
  nonGdprLessCautiousType,
  countryCode,
  forceB2B = false,
  sectionDetails,
  inquiringId,
  programSfid,
  horizontalView,
  description,
  forceB2C = false,
  backgroundVariant
}: LeadFormProps) {
  const {
    programCourseRun,
    program,
    isGaPage,
    isMicrositePage,
    screenName,
    isLandingThankYouPageconfigured,
    defaultLocale,
    selectedProgramDetails,
    setSfid
  } = useContext(PageLayoutContext)
  const [isConsentChecked, setIsConsentChecked] = useState(false)
  const [leadSubmitted, setIsLeadSubmitted] = useState<boolean | undefined>()
  const { price_in_program_currency_for_admin: adminPrice = 0 } = programCourseRun?.current_enrollable_course_run || {}
  const countriesOptions = useCountries()
  const { query, isReady } = useRouter()
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    watch,
    formState: { errors },
    getValues,
    unregister
  } = useForm()
  const { t } = useTranslation('leadForm')
  const trackingSectionName = sectionDetails?.sectionName || SECTION_NAMES.SECTION
  const trackingSectionTitle = formTitle || sectionDetails?.sectionTitle
  const [cookies] = useCookies()
  const formValues = getValues()

  useEffect(() => {
    if (formValues.program_name?.value) {
      setSfid?.(formValues.program_name?.value)
    }
  }, [formValues?.program_name])

  const implicitConsent: boolean = useImplicitConsent(
    countryCode || watch(SELECT_TYPES_SUPPORTED.country)?.value,
    gdprType,
    nonGdprLessCautiousType,
    nonGdprMoreCautiousType,
    programId,
    programLanguage || '',
    schoolCountry
  )

  const isEnterpriseB2B = query?.b2b_form
  const isEnterpriseB2C = query?.b2c_form
  const isEnterpriseFlow = isEnterpriseB2B || isEnterpriseB2C
  const onFormSubmit = async (data: unknown) => {
    const {
      country,
      city = '',
      email,
      first_name,
      last_name,
      work_experience,
      qualification,
      job_title = '',
      job_title_b2b = '',
      manager = '',
      phone,
      number_of_participants = '',
      inquiring_for = '',
      batch_name = '',
      company = '',
      title = '',
      webinar_registration_date = '',
      program_name: programName
    } = data as Lead

    setIsLeadSubmitted(true)
    const creationTime = Math.round(new Date().getTime() / 1000)
    const lead = {
      agree: !isConsentChecked && !implicitConsent ? undefined : 1,
      country: (country as unknown as SelectFormOptions)?.value,
      city,
      email,
      first_name,
      last_name,
      phone,
      number_of_participants: (number_of_participants as unknown as SelectFormOptions)?.value,
      work_experience: (work_experience as unknown as SelectFormOptions)?.value,
      qualification: (qualification as unknown as SelectFormOptions)?.value,
      job_title,
      job_title_b2b,
      manager,
      batch_name: isEnterpriseB2B ? (batch_name as unknown as SelectFormOptions)?.value : undefined,
      company_b2b: isEnterpriseB2B ? query?.utm_campaign : undefined,
      inquiring_for,
      utm_source: isEnterpriseFlow ? 'b2b' : query?.utm_source,
      utm_medium: query?.utm_medium,
      utm_campaign: query?.utm_campaign,
      utm_content: query?.utm_content,
      utm_term: query?.utm_term,
      utm_adset_id: query?.utm_adset_id,
      utm_ad_id: query?.utm_ad_id,
      utm_placement: query?.utm_placement,
      utm_campaign_id: query?.utm_campaign_id,
      utm_location: query?.utm_location,
      gclid: query?.gclid,
      program_sfid: programName?.value || programSfid,
      company,
      title,
      webinar_registration_date,
      user_uuid: cookies[initialRequiredData.userUUID],
      fbp: getFromCookie('_fbp'),
      fbc: getFromCookie('_fbc') || `fb.1.${creationTime}.${query?.fbclid}`
    } as Lead

    const inquiringForToggleValue = getValues(RADIO_GROUP_TYPES_SUPPORTED.inquiring_for)
    const leadFormSubmitActionValue = inquiringForToggleValue?.includes(GROUP_INQUIRY_TYPES.b2b)
      ? ACTION_VALUES.TEAM_GROUP_INQUIRY
      : inquiringForToggleValue?.includes(GROUP_INQUIRY_TYPES.b2c)
      ? ACTION_VALUES.INDIVIDUAL_INQUIRY
      : ''
    program &&
      triggerTrackPoint(
        'click',
        buildLandingPageTrackingData(
          EVENT_NAME.LEAD_INITIATED,
          EVENT_SOURCE.CLIENT,
          trackingSectionName,
          ACTION_TYPES.CTA,
          leadFormSubmitActionValue,
          trackingSectionTitle,
          submitCta.fields.buttonText,
          program,
          screenName
        )
      )
    const body = filterEmptyValues(lead as unknown as Record<string, unknown>)
    const leadEndpoint = () => {
      if (isGaPage) {
        return `${hostName}/api/ga-lead-forms`
      } else if (isEnterpriseB2B) {
        return `${hostName}/api/enterprise-lead-forms`
      } else {
        return `${hostName}/api/lead-forms`
      }
    }
    const getQueryString = () => {
      return new URL(window.location.href)?.search?.split('?')[1]
    }
    //Needed this fix for reverese proxy for SLP
    const hostName = process.env.NEXT_PUBLIC_HOST_NAME || ''

    const response = axios.post(
      leadEndpoint(),
      program
        ? {
            body,
            programsData: {
              program_name: programName?.label || program?.fields?.name,
              school_name: programName?.schoolName || program?.fields?.school?.fields?.name,
              sfid: programName?.value || program?.fields?.sfid
            },
            leadData: {
              referer: document.referrer,
              queyString: getQueryString()
            }
          }
        : { body },
      { headers: { 'Content-Type': 'text/plain' } }
    )

    response
      .then((leadResponse) => {
        window.dataLayer = window.dataLayer || []
        const leadFormSubmitData = {
          event: 'lead-form-submit-lead',
          courseName: program?.fields?.name || '',
          coursePrice: adminPrice,
          userEmail: email ? email : ''
        }
        window.dataLayer.push(leadFormSubmitData)
        if (window.LUX) {
          window.LUX.addData('lead.submitted', 1)
        }

        const successUrl = isMicrositePage
          ? getPageRouteURL(THANK_YOU_PAGE, screenName)
          : isLandingThankYouPageconfigured
          ? getThankyouPageURL(SUCCESS_PAGE)
          : (programName?.value ? selectedProgramDetails?.[programName?.value]?.successRedirectUrl : successRedirectUrl) ||
            window.location.origin + window.location.pathname

        // Tracking lead success
        program &&
          triggerTrackPoint(
            'click',
            buildLandingPageTrackingData(
              EVENT_NAME.LEAD_SUBMITTED,
              EVENT_SOURCE.CLIENT,
              trackingSectionName,
              ACTION_TYPES.CTA,
              leadFormSubmitActionValue,
              trackingSectionTitle,
              submitCta.fields.buttonText,
              program,
              screenName
            )
          )

        let successUrlWithQueryParams = ''
        const existingQueryParams = window.location.search
        if (forceB2B || watch(RADIO_GROUP_TYPES_SUPPORTED.inquiring_for) === GROUP_INQUIRY_TYPES.b2b) {
          successUrlWithQueryParams = `${successUrl}${existingQueryParams}${existingQueryParams ? '&' : '?'}${buildQueryString({
            thank_you: isMicrositePage ? undefined : true,
            group: true,
            company: leadResponse?.data?.company || company,
            number_of_participants: (number_of_participants as unknown as SelectFormOptions)?.value
          })}`
        } else if (isEnterpriseB2B) {
          successUrlWithQueryParams = `${successUrl}${existingQueryParams}${existingQueryParams ? '&' : '?'}${buildQueryString({
            b2b_thank_you: true,
            company: leadResponse?.data?.company || company,
            number_of_participants: (number_of_participants as unknown as SelectFormOptions)?.value
          })}`
        } else if (isEnterpriseB2C) {
          const queryString = buildQueryString({ b2c_thank_you: true })
          successUrlWithQueryParams = `${successUrl}${existingQueryParams}${
            existingQueryParams ? `${queryString && `&${queryString}`}` : `${queryString && `?${queryString}`}`
          }`
        } else {
          const queryString = buildQueryString({ thank_you: isMicrositePage ? undefined : true })
          successUrlWithQueryParams = `${successUrl}${existingQueryParams}${
            existingQueryParams ? `${queryString && `&${queryString}`}` : `${queryString && `?${queryString}`}`
          }`
        }

        window.location.href = successUrlWithQueryParams
      })
      .catch(() => {
        program &&
          triggerTrackPoint(
            'click',
            buildLandingPageTrackingData(
              EVENT_NAME.LEAD_ERROR,
              EVENT_SOURCE.CLIENT,
              trackingSectionName,
              ACTION_TYPES.SERVER_FAILURE,
              '',
              trackingSectionTitle,
              submitCta.fields.buttonText,
              program,
              screenName
            )
          )
        window.location.href =
          (programName?.value ? selectedProgramDetails?.[programName?.value]?.errorRedirectUrl : errorRedirectUrl) || ''
      })
      .finally(() => setIsLeadSubmitted(false))
  }
  const emailValidationRule = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: t('emailErrorTxt')
  }

  const firstNameValidationRule = {
    value: /^(?=\s*\S).{1,40}$/,
    message: t('firstNameErrorTxt')
  }

  const lastNameValidationRule = {
    value: /^(?=\s*\S).{1,80}$/,
    message: t('lastNameErrorTxt')
  }

  const phoneValidationRule = {
    value: isGaPage ? /\+\d{1,3}[ ]?\d{7,}/ : /\+\d{1,3}[ ]?\d{5,}/,
    message: t('phoneErrorTxt')
  }
  const emptyFieldValidationRule = {
    value: /.*\S.*/,
    message: t('emptyErrorTxt')
  }

  const getFieldPattern = (attributeName?: string) => {
    switch (attributeName) {
      case INPUT_ATTRIBUTE_SUPPORTED.firstName:
        return firstNameValidationRule
      case INPUT_ATTRIBUTE_SUPPORTED.lastName:
        return lastNameValidationRule
      case INPUT_ATTRIBUTE_SUPPORTED.email:
        return emailValidationRule
      case INPUT_ATTRIBUTE_SUPPORTED.phone:
        return phoneValidationRule
      case INPUT_ATTRIBUTE_SUPPORTED.jobTitle:
      case INPUT_ATTRIBUTE_SUPPORTED.company:
        return emptyFieldValidationRule
      default:
        undefined
    }
  }

  const locale = defaultLocale?.split('-')[0] || ('en' as string)
  const consentLocaleText =
    programCourseRun?.programConsent?.data && (programCourseRun?.programConsent?.data[locale as keyof ProgramConsent] as any)
  const b2b = forceB2B || watch(RADIO_GROUP_TYPES_SUPPORTED.inquiring_for) === GROUP_INQUIRY_TYPES.b2b

  const implicitText = b2b
    ? consentLocaleText?.consent_texts.b2b_implicit_consent_label
    : consentLocaleText?.consent_texts.b2c_implicit_consent_label
  const explicitText = b2b
    ? consentLocaleText?.consent_texts.b2b_explicit_consent_label
    : consentLocaleText?.consent_texts.b2c_explicit_consent_label

  const onErrors = (errors: unknown) => {
    if (program) {
      triggerTrackPoint(
        'click',
        buildLandingPageTrackingData(
          EVENT_NAME.LEAD_ERROR,
          EVENT_SOURCE.CLIENT,
          trackingSectionName,
          ACTION_TYPES.INCOMPLETE_FILL,
          '',
          trackingSectionTitle,
          submitCta.fields.buttonText,
          program,
          screenName
        )
      )
    }
    console.error(errors)
  }
  const horizontalClass = horizontalView ? 'lead-form-horizontal' : ''
  const leadFormTitle = query.utm_source === UTM_SOURCE.referral && formTitle ? t('referralLeadFormTitle') : formTitle
  const horizontalTitle = horizontalView ? (
    <SectionHeading title={leadFormTitle} textAlignment="text-center text-white" />
  ) : (
    <SectionHeading title={leadFormTitle} textAlignment="modal__title text-color" />
  )

  const shiftInquiringForFirst = (arr: string[]) => {
    const inquiringForIndex = arr.indexOf('inquiring_for')
    if (inquiringForIndex > 0) {
      ;[arr[0], arr[inquiringForIndex]] = [arr[inquiringForIndex], arr[0]]
    }
    return arr
  }

  const getCtaLabel = () => {
    let ctaLabel = submitCta.fields.buttonText
    if (query?.utm_source === UTM_SOURCE.referral) {
      ctaLabel = t('referralCta')
    } else if (isEnterpriseB2B) {
      ctaLabel = t('enterpriseCta')
    }
    return ctaLabel
  }

  const fetchExistingLeadData = useCallback(async () => {
    const startTime = performance.now()
    try {
      const externalId = query?.sfid
      if (!externalId) return
      const { country, phone, myself, Agree__c, work_experience, qualification, number_of_participants } = SF_FIELD_NAMES
      const hostName = process.env.NEXT_PUBLIC_HOST_NAME || ''
      const { data, statusText } = await axios.get(`${hostName}/api/salesforce-lead`, { params: { externalId } })
      if (!data) {
        console.error(`Salesforce Lead API - error response: ${statusText}`)
        return false
      }
      if (data) {
        const values = getValues()
        const elementNames = shiftInquiringForFirst(Object.keys(values))
        for (const name of elementNames) {
          const updates: { [key: string]: any } = {}
          const responseFieldName = SALES_FORCE_PROP_NAME[name]
          if (!responseFieldName) {
            updates[name] = myself
          } else if (name === phone) {
            updates[name] = data[responseFieldName]?.replace(/\D/g, '')
          } else if ([work_experience, number_of_participants, qualification].indexOf(name) > -1) {
            updates[name] = { label: data[responseFieldName], value: data[responseFieldName] }
          } else if (responseFieldName && name !== country) {
            updates[name] = data[responseFieldName]
          } else if (name === country) {
            const countryShortCode = getValueByLabel(countriesOptions, data[responseFieldName])
            updates[name] = countryShortCode
          }
          setValue(name, updates[name])
        }
        const consentValue = data[Agree__c] || ''
        if (consentValue.toLowerCase().includes('yes')) {
          setIsConsentChecked(true)
        }
      }
    } catch (error) {
      console.error('Salesforce Lead API - unexpected error occurred:', error)
    } finally {
      const endTime = performance.now()
      const elapsedTime = endTime - startTime
      // eslint-disable-next-line no-console
      console.log(`Response time: ${elapsedTime} milliseconds`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query?.sfid, countriesOptions])

  useEffect(() => {
    if (typeof window !== 'undefined' && isReady) {
      fetchExistingLeadData()
    }
  }, [fetchExistingLeadData, isReady])

  const brandingClassName = backgroundVariant?.includes('white') ? getSectionColorClassName(backgroundVariant, true) : ''

  const consentElement = (
    <p
      data-track={
        program
          ? buildTPClickEvent({
              type: 'click',
              ...buildLandingPageTrackingData(
                EVENT_NAME.EXTERNAL_LINK,
                EVENT_SOURCE.CLIENT,
                trackingSectionName,
                ACTION_TYPES.URL,
                b2b ? 'consent-b2b' : 'consent-b2c',
                trackingSectionTitle,
                '',
                program,
                screenName
              )
            })
          : undefined
      }
      dangerouslySetInnerHTML={{ __html: implicitConsent ? implicitText : explicitText }}
    />
  )

  return (
    <div id="brochure" className={cn(styles.leadFormCntr, 'lead-form-cntr', horizontalClass, brandingClassName)}>
      <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
        {horizontalTitle}
        {description && <p className="para--two description">{description}</p>}
        {forceB2B && (
          <>
            <div className={styles.leadFormSubtitle}>{t('takingProgramTogetherText')}</div>
            <div className={styles.leadFormSubtitle}>{t('pricingOfferText')}</div>
          </>
        )}

        <div className={styles.leadFormFieldsCntr}>
          {fieldList.map(({ sys, fields }) => {
            const contentTypeId = sys?.contentType?.sys?.id

            if (contentTypeId === dynamicFieldsContentTypes.groupRadio) {
              const { label, attributeName, groupOptions = [], defaultValue, required } = fields as TypeFormGroupRadioFields
              const { onBlur, onChange, ref, name } = register(attributeName, { value: defaultValue?.fields?.value, required })

              const defVal = watch(attributeName) || defaultValue?.fields?.value || groupOptions[0].fields.value
              const selectedGroupOption = groupOptions.find((item) =>
                !forceB2B ? item.fields.value === defVal : item.fields.value === GROUP_INQUIRY_TYPES.b2b
              )

              return (
                <Fragment key={label}>
                  {!(forceB2B || forceB2C) ? (
                    <div className={cn('mb-3 radio-control text-color', styles.radioContainer)}>
                      <span>{label}</span>
                      {groupOptions.map((option) => {
                        return (
                          <label htmlFor={`${inquiringId}_${option.fields.label}`} key={option.fields.label}>
                            <input
                              name={name}
                              onBlur={onBlur}
                              onChange={
                                program
                                  ? (e) => {
                                      onChange(e)
                                    }
                                  : undefined
                              }
                              ref={ref}
                              type="radio"
                              value={option.fields.value}
                              id={`${inquiringId}_${option.fields.label}`}
                              className={cn('me-3', styles.radioInput)}
                              data-track={buildTPClickEvent({
                                type: 'click',
                                ...buildLandingPageTrackingData(
                                  EVENT_NAME.LEAD_FORM,
                                  EVENT_SOURCE.CLIENT,
                                  trackingSectionName,
                                  ACTION_TYPES.FIELD,
                                  `${option.fields.value}_toggle}`,
                                  trackingSectionTitle,
                                  option.fields.label,
                                  program,
                                  screenName
                                )
                              })}
                            />
                            <span className="control-fnt radio-style">{option.fields.label}</span>
                          </label>
                        )
                      })}
                    </div>
                  ) : null}
                  <div
                    className={cn('form-row-group', {
                      'three-child': selectedGroupOption?.fields?.fieldList?.length === 3,
                      'four-child': selectedGroupOption?.fields?.fieldList?.length === 4
                    })}
                  >
                    {selectedGroupOption?.fields?.fieldList?.map((item) => {
                      return (
                        <FieldsFactory
                          key={`${item.fields.attributeName}${inquiringId}_${item.fields.label}`}
                          contentTypeId={item.sys?.contentType?.sys?.id}
                          fields={item.fields}
                          control={control}
                          setValue={setValue}
                          getValues={getValues}
                          register={register}
                          trigger={trigger}
                          unregister={unregister}
                          errors={errors}
                          watch={watch}
                          formTitle={formTitle}
                          sectionDetails={sectionDetails}
                          horizontalView={horizontalView}
                        />
                      )
                    })}
                  </div>
                </Fragment>
              )
            }
            return (
              <FieldsFactory
                key={fields.attributeName}
                contentTypeId={contentTypeId}
                fields={fields}
                control={control}
                setValue={setValue}
                register={register}
                trigger={trigger}
                unregister={unregister}
                errors={errors}
                watch={watch}
                autoComplete="on"
                formTitle={formTitle}
                sectionDetails={sectionDetails}
                pattern={getFieldPattern(fields.attributeName)}
                horizontalView={horizontalView}
                isGaPage={isGaPage}
                getValues={getValues}
              />
            )
          })}
        </div>

        <div className={cn(styles.formAgreeCntr, 'consent-parent text-color')}>
          {!implicitConsent && (
            <input
              id="consent-checkbox"
              checked={isConsentChecked}
              className="d-inline me-2"
              onChange={
                program
                  ? () => {
                      triggerTrackPoint(
                        'click',
                        buildLandingPageTrackingData(
                          EVENT_NAME.LEAD_FORM,
                          EVENT_SOURCE.CLIENT,
                          trackingSectionName,
                          ACTION_TYPES.FIELD,
                          ACTION_VALUES.CONSENT_CHECK,
                          trackingSectionTitle,
                          explicitText,
                          program,
                          screenName
                        )
                      )
                      setIsConsentChecked(!isConsentChecked)
                    }
                  : undefined
              }
              type="checkbox"
            />
          )}
          {!implicitConsent ? <label htmlFor="consent-checkbox">{consentElement}</label> : consentElement}
        </div>
        <div className={styles.formBtn}>
          <Button
            data-track={
              !program
                ? buildTPClickEvent({
                    event: submitCta?.fields?.eventName,
                    event_properties: {}
                  })
                : undefined
            }
            disabled={leadSubmitted}
            type="submit"
            className={cn('mt-3 btn btn--primary', leadSubmitted && 'loader-parent')}
          >
            {leadSubmitted && <span className="loader__circle border-primary" />}
            {leadSubmitted ? null : getCtaLabel()}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LeadForm
