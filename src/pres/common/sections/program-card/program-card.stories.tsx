import React from 'react'
import { iconAsset } from '__test__/mocks/partnerPage/sections/modules/components/assets'
import ProgramCard from './program-card'

export default {
  title: 'Program Card',
  component: ProgramCard
}

export const Primary = () => (
  <ProgramCard
    utmParams={undefined}
    contentfulName="ProgramCard"
    schoolName="Mit"
    courseName="Coding"
    programSfid="asdf"
    landingPageId={0}
    imageicon={iconAsset}
    url="https://example.com"
  />
)
