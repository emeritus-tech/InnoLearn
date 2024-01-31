import React from 'react'

import { iconOne, iconTwo, iconThree, iconFour } from '__test__/mocks/partnerPage/sections/modules/components/textAndIcon'
import { ctaButton } from '__test__/mocks/partnerPage/sections/modules/buttonSection'
import FeatureIcons from './featured-icons'

export default {
  title: 'Feature Icons',
  component: FeatureIcons
}

export const Primary = () => <FeatureIcons title="Why learn through Emeritus?" content={[iconOne, iconTwo, iconThree, iconFour]} />

export const WithCTA = () => (
  <FeatureIcons title="Why learn through Emeritus?" content={[iconOne, iconTwo, iconThree, iconFour]} cta={ctaButton} />
)
