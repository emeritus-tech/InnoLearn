import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import Section from 'pres/common/components/section'
import Button from 'pres/common/components/button'
import LeadFormSection from 'pres/common/components/lead-form-section'
import { parseToSectionId } from 'utils/common'
import { buildLandingPageTrackingData, buildTPClickEvent, triggerTrackPoint } from 'utils/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { ACTION_TYPES, ACTION_VALUES, EVENT_NAME, EVENT_SOURCE, SECTION_NAMES } from 'constants/trackpoint'
import { TypeSectionStickyBrochureFields } from 'types/contentful-types/TypeSectionStickyBrochure'
import { UTM_SOURCE, ATTRIBUTE_CTA_LEADFORM_Modal, COLOR_MAP } from 'constants/contentful'
import useMediaQueries from 'hooks/useMediaQueries'

import styles from './sticky-brochure.module.scss'

interface StickyBrochureProps extends TypeSectionStickyBrochureFields {
  isHeroInView: boolean
}

function StickyBrochure({ contentfulName, cta, backgroundColor, device, isHeroInView }: StickyBrochureProps) {
  const [leadFormOpen, setLeadFormOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const sectionId = useMemo(() => parseToSectionId(contentfulName), [contentfulName])
  const { program, leadFormFields } = useContext(PageLayoutContext)
  const [containerHeight, setContainerHeight] = useState('auto')
  const { isTabletDevice } = useMediaQueries()
  const { query } = useRouter()
  const backgroundClass = COLOR_MAP[backgroundColor || 'background-primary_cta-reverse']

  useEffect(() => {
    const isThankYouPage = query?.thank_you
    if (isTabletDevice || isThankYouPage) {
      setIsVisible(false)
    }
  }, [isTabletDevice, device, query?.thank_you])
  useEffect(() => {
    const offsetHeight = ref?.current?.offsetHeight
    const height = offsetHeight ? `${offsetHeight}px` : 'auto'
    setContainerHeight(height)
  }, [ref, isVisible])

  if (isVisible) {
    return (
      <div className="lp-colored--list" style={{ height: containerHeight }}>
        <Section id={`registration-${sectionId}`} className={cn(styles.buildingBlockContainer, { [styles.sticky]: !isHeroInView })}>
          <div ref={ref} className={styles.btnGroupWrapper}>
            <div className={cn('d-flex justify-content-center align-items-center', styles.btnGroup, backgroundClass)}>
              {cta?.fields?.link === ATTRIBUTE_CTA_LEADFORM_Modal && (
                <Button
                  className="col-lg-3 col-md-6 col-12 btn rounded-1 text-center text-weight-semi-bold border border-1"
                  onClick={() => {
                    setLeadFormOpen(true)
                  }}
                  data-track={buildTPClickEvent(
                    buildLandingPageTrackingData(
                      cta.fields.eventType || EVENT_NAME.LEAD_POP_UP,
                      EVENT_SOURCE.CLIENT,
                      SECTION_NAMES.STICKY_BAR,
                      ACTION_TYPES.CTA,
                      '',
                      '',
                      cta.fields.text,
                      program
                    )
                  )}
                  styleType="none"
                >
                  {cta.fields.text}
                </Button>
              )}
            </div>
          </div>
          {leadFormOpen && leadFormFields && (
            <div className="lead-form-modal lead-form-cntr">
              <BluePrintModal
                modalSize="small"
                closeOverlay={() => {
                  setLeadFormOpen(false)
                  if (program) {
                    triggerTrackPoint(
                      'click',
                      buildLandingPageTrackingData(
                        cta?.fields?.eventType || EVENT_NAME.LEAD_POP_UP,
                        EVENT_SOURCE.CLIENT,
                        SECTION_NAMES.STICKY_BAR,
                        '',
                        ACTION_VALUES.CLOSE,
                        '',
                        cta?.fields?.text,
                        program
                      )
                    )
                  }
                }}
                heading={query.utm_source === UTM_SOURCE.referral ? t('leadForm:referralLeadFormTitle') : leadFormFields.fields?.formTitle}
                closeOnBackgroudClick
              >
                <LeadFormSection
                  program={program}
                  leadFormFields={leadFormFields}
                  sectionDetails={{ sectionTitle: contentfulName }}
                  inquiringId={sectionId}
                />
              </BluePrintModal>
            </div>
          )}
        </Section>
      </div>
    )
  } else {
    return null
  }
}

export default StickyBrochure
