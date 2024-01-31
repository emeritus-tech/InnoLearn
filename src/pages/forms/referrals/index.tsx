import axios from 'axios'
import { useMemo } from 'react'
import { programsAPI, Program, Referral } from '@emeritus-engineering/ee-api'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useTranslation from 'next-translate/useTranslation'
import cn from 'classnames'
import useCountries from 'hooks/useCountries'
import styles from './referrals.module.scss'

export interface ReferralsFormPropsType {
  programs: Program[]
}

export const getStaticProps = async () => {
  const allPrograms = await programsAPI.getAllPrograms(true)
  const programs = allPrograms.filter((p) => p.india_referrals)

  return {
    props: {
      programs
    },
    revalidate: 600 // 10 minutes
  }
}

export default function ReferralsForm({ programs }: ReferralsFormPropsType) {
  const countriesOptions = useCountries()
  const { t } = useTranslation('common')
  const { register, handleSubmit, formState, reset } = useForm<Referral>({ mode: 'onChange' })
  const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
  const phoneRegex = /\d+/

  const onSubmit = async (params: Referral) => {
    try {
      const result = await axios.post('/api/submitReferral', params)
      if (result.status === 200) {
        reset()
        toast.success('Referral Submitted')
      } else {
        toast.error('An Error Ocurred')
      }
    } catch (error) {
      toast.error('An Error Ocurred')
    }
  }

  const onError = () => {
    toast.error('An Error Ocurred')
  }

  const countryOptions = countriesOptions.map(({ label, value }) => (
    <option value={value} key={label}>
      {label}
    </option>
  ))

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <img alt="Emeritus" src="/emeritus-footer-logo.png" />
      </div>
      <form className={cn('col-md-4', styles.formContainer)} onSubmit={handleSubmit(onSubmit, onError)}>
        <SectionHeading title={t('referralsForm.fillInTheDetails')} textAlignment={cn(styles.formTitle)} />
        <div className={styles.formSection}>
          <p className={styles.formSectionTitle}>{t('referralsForm.addFriendDetail')}</p>
          <input
            className={styles.formInput}
            placeholder={t('referralsForm.friendFirstName')}
            {...register('program_advisor_referral.friend.first_name', { required: true })}
          />
          <input
            className={styles.formInput}
            placeholder={t('referralsForm.friendLastName')}
            {...register('program_advisor_referral.friend.last_name', { required: true })}
          />
          <div className={styles.formInput}>
            <input
              className={styles.inputWithError}
              placeholder={t('referralsForm.friendEmail')}
              {...register('program_advisor_referral.friend.email', { required: true, pattern: emailRegex })}
            />
            <div className={styles.errorMessage}>
              {formState.errors.program_advisor_referral?.friend?.email?.type === 'pattern' && t('referralsForm.errors.emailPattern')}
            </div>
          </div>
          <div className={styles.formInput}>
            <input
              className={styles.inputWithError}
              placeholder={t('referralsForm.friendPhone')}
              {...register('program_advisor_referral.friend.phone', { required: true, pattern: phoneRegex })}
            />
            <div className={styles.errorMessage}>
              {formState.errors.program_advisor_referral?.friend?.phone?.type === 'pattern' && t('referralsForm.errors.phonePattern')}
            </div>
          </div>
          <select className={styles.formSelect} {...register('program_advisor_referral.friend.country', { required: true })}>
            <option value="" key="empty" aria-label="empty">
              {t('referralsForm.friendCountry')}
            </option>
            {countryOptions}
          </select>
        </div>
        <div className={styles.formSection}>
          <p className={styles.formSectionTitle}>{t('referralsForm.addAdvocateDetails')}</p>
          <input
            className={styles.formInput}
            placeholder={t('referralsForm.advocateName')}
            {...register('program_advisor_referral.advocate.name', { required: true })}
          />
          <div className={styles.formInput}>
            <input
              className={styles.inputWithError}
              placeholder={t('referralsForm.advocateEmail')}
              {...register('program_advisor_referral.advocate.email', { required: true, pattern: emailRegex })}
            />
            <div className={styles.errorMessage}>
              {formState.errors.program_advisor_referral?.advocate?.email?.type === 'pattern' && t('referralsForm.errors.emailPattern')}
            </div>
          </div>
          <div className={styles.formInput}>
            <input
              className={styles.inputWithError}
              placeholder={t('referralsForm.advocatePhone')}
              {...register('program_advisor_referral.advocate.phone', { required: true, pattern: phoneRegex })}
            />
            <div className={styles.errorMessage}>
              {formState.errors.program_advisor_referral?.advocate?.phone?.type === 'pattern' && t('referralsForm.errors.phonePattern')}
            </div>
          </div>
          <select className={styles.formSelect} {...register('program_advisor_referral.advocate.country', { required: true })}>
            <option value="" key="empty" aria-label="empty">
              {t('referralsForm.advocateCountry')}
            </option>
            {countryOptions}
          </select>
        </div>
        <div className={styles.formSection}>
          <p className={styles.formSectionTitle}>{t('referralsForm.chooseProgram')}</p>
          <select className={styles.formSelect} {...register('program_advisor_referral.program_sfid', { required: true })}>
            <option value="" key="empty" aria-label="empty">
              {t('referralsForm.programInterestedIn')}
            </option>
            {programs.map((p) => (
              <option value={p.sfid} key={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formSection}>
          <p className={styles.formSectionTitle}>{t('referralsForm.enterYourDetails')}</p>
          <div className={styles.formInput}>
            <input
              className={styles.inputWithError}
              placeholder={t('referralsForm.employeeEmailID')}
              {...register('program_advisor_referral.program_advisor_email', { required: true, pattern: emailRegex })}
            />
            <div className={styles.errorMessage}>
              {formState.errors.program_advisor_referral?.program_advisor_email?.type === 'pattern' &&
                t('referralsForm.errors.emailPattern')}
            </div>
          </div>
        </div>
        <p className={styles.formFooter}>{t('referralsForm.copyBottom')}</p>
        <button className={styles.formSubmit} disabled={!formState.isValid || formState.isSubmitting} type="submit">
          {formState.isSubmitting ? <div className={styles.ldsDualRing} /> : t('referralsForm.submit')}
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}
