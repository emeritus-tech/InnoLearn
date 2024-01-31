import cn from 'classnames'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import useTranslation from 'next-translate/useTranslation'
import Section from 'pres/common/components/section'
import { parseToSectionId } from 'utils/common'

import styles from './enterprise-b2b-info.module.scss'
function B2bSection() {
  const sectionName = 'B2b Enterprise section'
  const { t } = useTranslation('common')
  return (
    <div className="lp-colored--list">
      <Section id={`registration-${parseToSectionId(sectionName)}`} className={cn('bg-primary py-5', styles.b2bInfoBanner)} pY>
        <div className="container">
          <div className="row d-flex justify-content-between text-center text-white">
            <SectionHeading title={t('enterpriseB2b.applyTitle')} textAlignment="text-center" />
            <p>
              <span className={styles.paymentOption}>{`${t('enterpriseB2b.apply')}: `}</span>
              <span dangerouslySetInnerHTML={{ __html: t('enterpriseB2b.applyContactDetails') }}></span>
            </p>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default B2bSection
