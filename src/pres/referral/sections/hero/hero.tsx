import cn from 'classnames'
import { useForm } from 'react-hook-form'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { TypeSectionReferralHeroFields } from 'types/contentful-types'
import Button from 'pres/common/components/button'
import InputForm from 'pres/common/components/input-form'
import Section from 'pres/common/components/section'
import { parseToSectionId } from 'utils/common'
import useMediaQueries from 'hooks/useMediaQueries'
import { getAssetTypeContent } from 'utils/contentful'
import { numberFormatter } from 'utils/numberFormatter'
import { buildLandingPageTrackingData, buildTPClickEvent, triggerTrackPoint } from 'utils/trackpoint'
import { ACTION_TYPES, ACTION_VALUES, COMPONENT_TITLE, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES, SECTION_TITLE } from 'constants/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import styles from './referral-hero.module.scss'

function HeroReferralPages({
  desktopImage,
  mobileImage,
  title,
  subTitle,
  formFieldInput,
  cta,
  isSmall,
  imageBackground,
  ctaBranding
}: TypeSectionReferralHeroFields) {
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [sentModalOpen, setSentModalOpen] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors }
  } = useForm()

  const { t } = useTranslation('common')
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const enterYourEmail = useMemo(() => parseToSectionId(formFieldInput?.fields?.placeholder), [formFieldInput?.fields?.placeholder])
  const advocate_email = watch('email')

  const {
    register: registerShareForm,
    formState: { errors: errorsShareForm },
    handleSubmit: handleSubmitShareForm,
    setValue: setValueShareForm
  } = useForm()

  const { program, screenName, programCourseRun, program_sfid } = useContext(PageLayoutContext)
  const { current_enrollable_course_run, friend_reward_amount } = programCourseRun || {}
  const router = useRouter()
  const { source } = router.query

  const getReferralAmount = (heroSubtitle: string) => {
    const currency = current_enrollable_course_run?.currency
    const amount =
      friend_reward_amount && currency
        ? numberFormatter({
            number: friend_reward_amount,
            currency,
            style: 'currency'
          })
        : ''
    return heroSubtitle.replaceAll('{{referral_amount}}%', `${amount}`)
  }

  const onSubmit = async (params: any) => {
    try {
      program &&
        triggerTrackPoint(
          'click',
          buildLandingPageTrackingData(
            EVENT_NAME.INCENTIVISED_REFERRAL_LINK_GENERATE,
            EVENT_SOURCE.CLIENT,
            bannerSectionName,
            ACTION_TYPES.CTA,
            '',
            '',
            COMPONENT_TITLE.GENERATE_UNIQE_LINK,
            program,
            screenName
          )
        )
      const hostName = process.env.NEXT_PUBLIC_HOST_NAME || ''
      const sfid = program?.fields?.sfid || program_sfid
      const result = await axios.post(`${hostName}/api/submit-referral?program_sfid=${sfid}${source ? `&source=${source}` : ''}`, params, {
        headers: { 'Content-Type': 'text/plain' }
      })
      if (result.status === 200) {
        setShareLink(result.data.personal_url)
        setValueShareForm('email', '')
        setCopied(false)
        setShareModalOpen(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onSendInvites = async (params: any) => {
    try {
      program &&
        triggerTrackPoint(
          'click',
          buildLandingPageTrackingData(
            EVENT_NAME.INCENTIVISED_REFERRALS_EMAIL_INVITATION,
            EVENT_SOURCE.CLIENT,
            SECTION_NAMES.REFERRAL_TOP_BANNER,
            ACTION_TYPES.CTA,
            '1',
            SECTION_TITLE.INVITE_SENT,
            COMPONENT_TITLE.SEND_INVITATION,
            program,
            screenName
          )
        )
      const hostName = process.env.NEXT_PUBLIC_HOST_NAME || ''
      params.personal_url = shareLink
      params.advocate_email = advocate_email
      const sfid = program?.fields?.sfid || program_sfid
      const result = await axios.post(`${hostName}/api/send-invites?program_sfid=${sfid}`, params, {
        headers: { 'Content-Type': 'text/plain' }
      })
      if (result.status === 200) {
        setShareModalOpen(false)
        setSentModalOpen(true)
        setValueShareForm('email', '')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onSendInvitesFromSent = async (params: any) => {
    try {
      program &&
        triggerTrackPoint(
          'click',
          buildLandingPageTrackingData(
            EVENT_NAME.INCENTIVISED_REFERRALS_EMAIL_INVITATION,
            EVENT_SOURCE.CLIENT,
            SECTION_NAMES.REFERRAL_TOP_BANNER,
            ACTION_TYPES.CTA,
            '2',
            SECTION_TITLE.INVITE_SENT,
            COMPONENT_TITLE.SEND_INVITATION,
            program,
            screenName
          )
        )
      const hostName = process.env.NEXT_PUBLIC_HOST_NAME || ''
      params.personal_url = shareLink
      params.advocate_email = advocate_email
      const sfid = program?.fields?.sfid || program_sfid
      const result = await axios.post(`${hostName}/api/send-invites?program_sfid=${sfid}`, params, {
        headers: { 'Content-Type': 'text/plain' }
      })
      if (result.status === 200) {
        setShareModalOpen(false)
        setSentModalOpen(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onErrors = (errors: unknown) => {
    console.error(errors)
  }

  const copyLink = useCallback(async () => {
    if (isMobile && typeof navigator.share === 'function') {
      await navigator.share({
        title,
        url: shareLink
      })
    } else {
      navigator.clipboard.writeText(shareLink)
      setCopied(true)
    }
  }, [shareLink])

  const handleSentModalClose = () => {
    setShareModalOpen(false)
    triggerTrackPoint(
      'click',
      buildLandingPageTrackingData(
        EVENT_NAME.INCENTIVISED_REFERRAL_LINK_GENERATE,
        EVENT_SOURCE.CLIENT,
        SECTION_NAMES.REFERRAL_TOP_BANNER,
        ACTION_TYPES.MODAL,
        ACTION_VALUES.CLOSE,
        SECTION_TITLE.INVITE_SENT,
        '',
        program,
        screenName
      )
    )
  }

  const { isMobile } = useMediaQueries()
  const backgroundImage = isMobile ? mobileImage : desktopImage
  const selectedHeroVariationClass = imageBackground ? `bg-${imageBackground}` : ''
  const ctaBrandingClass = ctaBranding ? `btn--${ctaBranding}` : 'btn--reverse'
  const gradientClass = /bg-(primary|secondary|accent|black)-gradient/.test(selectedHeroVariationClass)
  const backgroundImageClass =
    mounted && backgroundImage && !gradientClass ? `${selectedHeroVariationClass}--hero-opacity` : selectedHeroVariationClass

  const validationRulesEmailList = {
    value: /^[\w.-]+@\w+\.\w+(,\s*[\w.-]+@\w+\.\w+)*$/,
    message: 'Invalid email list format'
  }

  const validationRulesAdvocateEmail = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format'
  }

  const bannerSectionName = isSmall ? SECTION_NAMES.REFERRAL_BOTTOM_BANNER : SECTION_NAMES.REFERRAL_TOP_BANNER

  useEffect(() => setMounted(true), [])

  return (
    <Section
      id={`hero-${sectionId}`}
      className={cn('heroWrapper', backgroundImageClass)}
      style={{
        backgroundImage: backgroundImage ? `url(${getAssetTypeContent(backgroundImage)})` : undefined,
        backgroundRepeat: backgroundImage ? 'no-repeat' : undefined,
        backgroundPosition: backgroundImage ? 'center center' : undefined,
        backgroundSize: mounted && backgroundImage ? 'cover' : undefined
      }}
    >
      <div className={cn('container position-relative', styles.referralWrapper)}>
        <div className={cn('m-auto', styles.info, { [styles.smallInfo]: isSmall })}>
          <h1 className={cn('mt-0 hero-referral-title large-text-2', styles.title, { [styles.smallTitle]: isSmall })}>{title}</h1>
          {subTitle && (
            <h4 className={cn({ 'mb-0': formFieldInput && cta }, { [styles.smallSubtitle]: isSmall }, styles.heroSubtitle)}>
              {mounted && getReferralAmount(subTitle)}
            </h4>
          )}
          {formFieldInput && cta && (
            <form key={1} onSubmit={handleSubmit(onSubmit, onErrors)}>
              <div className={cn('flex-column flex-md-row', styles.formContainer)}>
                {formFieldInput && (
                  <InputForm
                    className={styles.inputContainer}
                    inputClassName={styles.input}
                    setValue={setValue}
                    getValues={getValues}
                    register={register}
                    errors={errors}
                    pattern={validationRulesAdvocateEmail}
                    autoComplete="on"
                    {...formFieldInput.fields}
                    fieldType={'email'}
                    required={true}
                    data-track={
                      program
                        ? buildTPClickEvent({
                            type: 'focus',
                            ...buildLandingPageTrackingData(
                              EVENT_NAME.INCENTIVISED_REFERRAL_LINK_GENERATE,
                              EVENT_SOURCE.CLIENT,
                              bannerSectionName,
                              ACTION_TYPES.FIELD,
                              ACTION_VALUES.EMAIL,
                              '',
                              enterYourEmail,
                              program,
                              screenName
                            )
                          })
                        : undefined
                    }
                  />
                )}
                <div className={styles.buttonContainer}>
                  {cta && (
                    <Button
                      type="submit"
                      className={cn('ms-md-3 m-t-xs-10 m-t-sm-0 btn', ctaBrandingClass, styles.button, styles.mainButton)}
                      data-track=""
                    >
                      {t('generateLink')}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      {shareModalOpen && (
        <BluePrintModal modalSize="small" closeOverlay={() => handleSentModalClose()} heading={t('shareModalTitle')} closeOnBackgroudClick>
          <hr />
          <h6 className="text-b1 text-weight-semibold">{t('shareLinkTitle')}</h6>
          <p className="text-b2 mt-2">{t('copyLinkParagraph')}</p>
          <div className={styles.shareFormContainer}>
            <div className={styles.linkContainer}>
              <p className={styles.shareLink}>{shareLink}</p>
            </div>
            <div className={cn(styles.buttonContainer)}>
              <Button
                type="submit"
                data-testid="copy-link"
                onClick={copyLink}
                className={cn('ms-3 btn', ctaBrandingClass, styles.shareButtonMobile)}
                data-track={
                  program
                    ? buildTPClickEvent({
                        ...buildLandingPageTrackingData(
                          EVENT_NAME.INCENTIVISED_REFERRALS_PURL_COPY,
                          EVENT_SOURCE.CLIENT,
                          SECTION_NAMES.REFERRAL_TOP_BANNER,
                          ACTION_TYPES.CTA,
                          '1',
                          SECTION_TITLE.INVITE_YOUR_COLLEAGUES,
                          COMPONENT_TITLE.COPY_LINK,
                          program,
                          screenName
                        )
                      })
                    : undefined
                }
              >
                {isMobile ? t('share') : copied ? t('copiedButton') : t('copyLinkButton')}
              </Button>
            </div>
          </div>
          <hr />
          <h6 className="text-b1 text-weight-semibold">{t('shareViaEmail')}</h6>
          <p className="text-b2 mt-2">{t('shareViaEmailParagraph')}</p>
          <form key={2} onSubmit={handleSubmitShareForm(onSendInvites, onErrors)}>
            <div className={styles.shareFormContainer}>
              <InputForm
                autoComplete="on"
                inputClassName={styles.emailInput}
                attributeName={'email'}
                register={registerShareForm}
                placeholder="To:"
                required={true}
                pattern={validationRulesEmailList}
                setValue={setValueShareForm}
                getValues={getValues}
                errors={errorsShareForm}
                label={''}
                fieldType={'generic'}
                data-track=""
              />
              <div className={cn(styles.buttonContainer)}>
                <Button type="submit" className={cn('ms-3 m-t-xs-10 m-t-sm-0 btn', ctaBrandingClass, styles.button)}>
                  {t('sendInvitationCopy')}
                </Button>
              </div>
            </div>
          </form>
        </BluePrintModal>
      )}
      {sentModalOpen && (
        <BluePrintModal modalSize="small" closeOverlay={() => setSentModalOpen(false)} heading={t('sentModalTitle')} closeOnBackgroudClick>
          <hr />
          <p className="text-b1 text-weight-semibold">{t('inviteSentTitle')}</p>
          <p className="text-b1 text-weight-semibold">{t('inviteSentSubtitle')}</p>
          <p>{t('shareYourLink')}</p>
          <div className={styles.shareFormContainer}>
            <div className={styles.linkContainer}>
              <p className={styles.shareLink}>{shareLink}</p>
            </div>
            <div className={cn(styles.buttonContainer)}>
              <Button
                type="submit"
                onClick={copyLink}
                className={cn('ms-3 btn', ctaBrandingClass, styles.shareButtonMobile)}
                data-track={
                  program
                    ? buildTPClickEvent({
                        ...buildLandingPageTrackingData(
                          EVENT_NAME.INCENTIVISED_REFERRALS_PURL_COPY,
                          EVENT_SOURCE.CLIENT,
                          SECTION_NAMES.REFERRAL_TOP_BANNER,
                          ACTION_TYPES.CTA,
                          '2',
                          SECTION_TITLE.INVITE_YOUR_COLLEAGUES,
                          COMPONENT_TITLE.COPY_LINK,
                          program,
                          screenName
                        )
                      })
                    : undefined
                }
              >
                {isMobile ? t('share') : copied ? t('copiedButton') : t('copyLinkButton')}
              </Button>
            </div>
          </div>
          <hr />
          <p>{t('sendAdditionalEmails')}</p>
          <form key={2} onSubmit={handleSubmitShareForm(onSendInvitesFromSent, onErrors)}>
            <div className={styles.shareFormContainer}>
              <InputForm
                inputClassName={styles.emailInput}
                attributeName={'email'}
                register={registerShareForm}
                autoComplete="on"
                placeholder="To:"
                required={true}
                pattern={validationRulesEmailList}
                setValue={setValue}
                getValues={getValues}
                errors={errorsShareForm}
                label={''}
                fieldType={'generic'}
                data-track=""
              />
              <div className={cn(styles.buttonContainer)}>
                <Button type="submit" className={cn('ms-3 btn m-t-xs-10 m-t-sm-0', ctaBrandingClass, styles.button)}>
                  {t('sendInvitationCopy')}
                </Button>
              </div>
            </div>
          </form>
        </BluePrintModal>
      )}
    </Section>
  )
}

export default HeroReferralPages
