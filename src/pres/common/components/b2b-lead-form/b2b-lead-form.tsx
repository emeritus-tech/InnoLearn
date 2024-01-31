import { useContext } from 'react'
import cn from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import Member from 'pres/common/components/icons/member'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { SECTION_NAMES } from 'constants/trackpoint'
import styles from './b2b-lead-form.module.scss'

function B2BLeadForm() {
  const { leadFormFields, program } = useContext(PageLayoutContext)
  const { t } = useTranslation('common')
  const { t: translate } = useTranslation('leadForm')

  return (
    <div className="row g-0">
      <div className="col-lg-6 ">
        <div className={cn(styles.leftSideCntr, 'd-flex justify-content-center align-items-center')}>
          <LeadFormSection
            program={program}
            leadFormFields={leadFormFields}
            formTitle={translate('b2bFormTitle')}
            forceB2B
            sectionDetails={{ sectionName: SECTION_NAMES.STATIC_BAR }}
          />
        </div>
      </div>
      <div className="col-lg-6 d-none d-lg-block d-xl-block">
        <div className={cn(styles.rightSideCntr, 'd-flex justify-content-center align-items-center bg-primary')}>
          <div className={styles.testimonialCntr}>
            <div className={styles.quoteIcon}>
              <span className="blueprint-icon icon-quote text-reverse"></span>
            </div>
            <div className={styles.quoteText}>{t('learningWithFriendsBenefits')}</div>
            <div className={styles.quotePicture}>
              <Member />
            </div>
            <div className={styles.quotePersonName}>Courtlyn</div>
            <div className={styles.quotePersonCompany}>{t('promotionAndEvents')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default B2BLeadForm
