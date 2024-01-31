import { useContext, useEffect, useMemo, useState } from 'react'
import { Entry } from 'contentful'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import Section from 'pres/common/components/section'
import { parseToSectionId } from 'utils/common'
import { TypeComponentLargeProgramCard } from 'types/contentful-types/TypeComponentLargeProgramCard'
import useMediaQueries from 'hooks/useMediaQueries'
import { TypeComponentButtonFields, TypeUtmParamsFields } from 'types/contentful-types'
import { currentScreenResolution } from 'utils/deviceType'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import ReferralItem from './referral-item'

interface OtherProgramProps {
  title?: string
  className?: string
  content?: Array<TypeComponentLargeProgramCard>
  cta?: Entry<TypeComponentButtonFields>
  utmParams?: TypeUtmParamsFields
}

const getProgramData = async (programId: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_COLLECTION_PROGRAM_WITH_BATCH_API}${programId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': ' application/json',
        'HTTP-EE-RESOURCES-API-KEY': `${process.env.NEXT_PUBLIC_COLLECTION_PROGRAMS_SECRET}`
      }
    })
    return response && (await response.json())
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error fetching programs data', error)
  }
}

function ReferralProgramList({ title, content, utmParams }: OtherProgramProps) {
  const { collapsedProgramCardsMobile } = useContext(PageLayoutContext)

  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const { isTabletActive, isMobileScreen, isTabletLandscape, isWiderDesktop, isLargerDevice, isExtraSmallDevice } = useMediaQueries()
  const deviceResolution = currentScreenResolution(
    isTabletActive,
    isMobileScreen,
    isTabletLandscape,
    isWiderDesktop,
    isLargerDevice,
    isExtraSmallDevice
  )
  const defaultExpanded = content?.length == 1 || !collapsedProgramCardsMobile
  const alignContentClass =
    deviceResolution === 'isMobile' || (!defaultExpanded && deviceResolution === 'isTablet') || deviceResolution === 'isExtraSmallDevice'
      ? 'accordion'
      : 'vertical'
  const gridClass = content?.length === 1 ? 'horizontal' : alignContentClass
  const [contentFromAPI, setContentFromAPI] = useState()

  useEffect(() => {
    const finalResponse: any = {}
    async function fetchProgramData() {
      const promisesArray: any[] = []
      content?.forEach(async (element) => {
        const programId = element?.fields?.programs?.fields?.id
        if (programId) {
          promisesArray.push(getProgramData(programId))
        }
      })
      try {
        const responseArray = await Promise.all(promisesArray)
        responseArray.forEach((response, index) => {
          const programId = content?.[index]?.fields?.programs?.fields?.id
          finalResponse[programId] = response?.data
        })
        setContentFromAPI(finalResponse)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error while fetching program data', err)
      }
    }
    fetchProgramData()
  }, [])

  return (
    <Section id={sectionId} pY={true}>
      <div className="container">
        {title && <SectionHeading title={title} textAlignment="mb-3 text-center text-lg-start fw-bold" />}
        <div className={`referral-cards--${gridClass}-cntr`}>
          {contentFromAPI &&
            content?.map((item, index) => (
              <ReferralItem
                key={index}
                index={index}
                content={item}
                dynamicProgramData={contentFromAPI}
                isDefaultExpanded={content?.length == 1 || !collapsedProgramCardsMobile}
                alignItem={content?.length === 1 ? 'horizontal' : 'vertical'}
                utmParams={utmParams}
              />
            ))}
        </div>
      </div>
    </Section>
  )
}

export default ReferralProgramList
