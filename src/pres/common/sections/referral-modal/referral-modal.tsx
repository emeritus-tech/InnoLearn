import { useContext, useState, useEffect } from 'react'
import { BluePrintButton } from '@emeritus-engineering/blueprint-core-components'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components'
import useTranslation from 'next-translate/useTranslation'
import { useURLutmParams } from 'hooks/useUTMQueryParams'
import { ACTION_TYPES, SECTION_NAMES, EVENT_SOURCE, EVENT_NAME, ACTION_VALUES, SECTION_TITLE } from 'constants/trackpoint'
import { buildLandingPageTrackingData, triggerTrackPoint } from 'utils/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { numberFormatter } from 'utils/numberFormatter'
interface referralModalProps {
  rewardAmount?: number
  currency?: string
}

const ReferralModal = (props: referralModalProps) => {
  const { rewardAmount = 0, currency = '' } = props
  const { customParams = '' } = useURLutmParams(undefined, 'coupon')
  const referralEmailCapture = '#referrals-email-capture-modal'
  const [emailCaptureModalOpen, setEmailCaptureModalOpen] = useState(false)
  const { program, screenName, programCourseRun } = useContext(PageLayoutContext)
  const { t } = useTranslation('common')
  const { number_formatting_localized_enabled } = programCourseRun || {}
  const friendRewardAmount =
    rewardAmount && currency
      ? numberFormatter({ number: rewardAmount, currency, style: 'currency', userLocaleEnabled: number_formatting_localized_enabled })
      : ''
  const highlights = Object.values(t('referralModal.listItems', {}, { returnObjects: true }))

  useEffect(() => {
    if (window.location.href.indexOf(referralEmailCapture) > -1) {
      setEmailCaptureModalOpen(true)
    }
  }, [])

  return (
    <>
      {emailCaptureModalOpen && (
        <BluePrintModal
          closeOverlay={() => {
            setEmailCaptureModalOpen(false)
            if (program) {
              triggerTrackPoint(
                'click',
                buildLandingPageTrackingData(
                  EVENT_NAME.REFERRAL,
                  EVENT_SOURCE.CLIENT,
                  SECTION_NAMES.SECTION,
                  ACTION_TYPES.MODAL,
                  ACTION_VALUES.CLOSE,
                  '',
                  SECTION_TITLE.INVITE_YOUR_COLLEAGUES,
                  program,
                  screenName
                )
              )
            }
          }}
          modalSize="small"
          heading={t('referralModal.title')}
          closeOnBackgroudClick
        >
          <div className="modal-referral">
            <div className="modal-sub-head">
              {t('referralModal.subtitle', { program_name: program?.fields?.description })} {t('referralModal.subtitleTwo')}
              <div className="text-center mt-4 mb-4">
                <BluePrintButton
                  type="button"
                  className="btn--mid button_button__primary btn--primary"
                  priority="none"
                  aria-label={t('referralModal.explorePrograms')}
                  onClick={() => {
                    setEmailCaptureModalOpen(false)
                    if (program) {
                      triggerTrackPoint(
                        'click',
                        buildLandingPageTrackingData(
                          EVENT_NAME.REFERRAL,
                          EVENT_SOURCE.CLIENT,
                          SECTION_NAMES.SECTION,
                          ACTION_TYPES.MODAL,
                          ACTION_VALUES.CLOSE,
                          '',
                          SECTION_TITLE.INVITE_YOUR_COLLEAGUES,
                          program,
                          screenName
                        )
                      )
                    }
                  }}
                >
                  {t('referralModal.explorePrograms')}
                </BluePrintButton>
              </div>
            </div>
            <p className="mt-3 mb-3">
              <strong>{t('referralModal.listTitle')}</strong>
            </p>
            <ol>
              {highlights.map((listItem, index) => (
                <li key={index}>
                  <div
                    className="referral-modal-list"
                    dangerouslySetInnerHTML={{
                      __html: listItem.replace('{{coupon}}', customParams).replace('{{friends_reward_amount}}', friendRewardAmount)
                    }}
                  ></div>
                </li>
              ))}
            </ol>
          </div>
        </BluePrintModal>
      )}
    </>
  )
}

export default ReferralModal
