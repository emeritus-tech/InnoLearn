import { Dispatch, ReactElement, SetStateAction } from 'react'
import { Entry } from 'contentful'
import getSectionModule, { PageSection } from 'pres/common/sections'
import { TypeLanding_pagesFields, TypeSectionStickyBrochureFields, TypeUtmParamsFields } from 'types/contentful-types'

export interface RendererProps {
  pageSections: Array<PageSection> | undefined
  utmParams: TypeUtmParamsFields | undefined
  paymentForm?: boolean
  className?: string
  preventProgramsFromCollapsing?: boolean
  landingPage?: TypeLanding_pagesFields
  setIsHeroInView?: Dispatch<SetStateAction<boolean>>
  isHeroInView?: boolean
  stickyBrochure?: Entry<TypeSectionStickyBrochureFields>
}

function Render({
  pageSections,
  utmParams,
  className,
  preventProgramsFromCollapsing,
  paymentForm,
  landingPage,
  setIsHeroInView,
  isHeroInView,
  stickyBrochure
}: RendererProps) {
  const sections: ReactElement[] = []
  // renders each field of the page as its own component
  pageSections?.forEach((pageSection, index) => {
    const Section = getSectionModule(pageSection)
    if (Section) {
      sections.push(
        <Section
          key={`${pageSection.sys?.contentType?.sys.id}${index}`}
          {...pageSection.fields}
          utmParams={utmParams}
          paymentForm={paymentForm}
          landingPage={landingPage}
          preventProgramsFromCollapsing={preventProgramsFromCollapsing}
          setIsHeroInView={setIsHeroInView}
          isHeroInView={isHeroInView}
          stickyBrochure={stickyBrochure}
        />
      )
    }
  })

  return (
    <div className={className}>
      {/* put the rendered nodes in the page */}
      {sections}
    </div>
  )
}

export default Render
