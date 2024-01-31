import { useContext, useMemo } from 'react'
import cn from 'classnames'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import Section from 'pres/common/components/section'
import { parseToSectionId } from 'utils/common'

function MicroSiteThankYouHero() {
  const { thankYouFields } = useContext(PageLayoutContext)
  const { title } = thankYouFields?.fields || {}
  const sectionId = useMemo(() => parseToSectionId(title), [title])

  const backgroundClass = `branding-secondary-primary`
  return (
    <div className="lp-colored--list">
      <Section id={`${sectionId}`} className={cn('section_section-container__commonPY', backgroundClass)}>
        <div className="container cmn-hero--wrapper position-relative">
          <div className="row justify-content-center text-sm-center m-b-30">
            <div className="col-12">
              <span className="blueprint-icon icon-success text-light icon-6x"></span>
            </div>
          </div>
          <div className="row">
            <div className="m-auto col-12">
              <h1 className="large-text-2 text-weight-semibold text-center col-xl-8 col-lg-10 col-md-8 m-auto">{title}</h1>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default MicroSiteThankYouHero
