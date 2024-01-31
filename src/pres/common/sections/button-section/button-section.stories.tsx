import React from 'react'

import { buttonSection } from '__test__/mocks/partnerPage/sections/modules/buttonSection'
import { TypeComponentButton } from 'types/contentful-types'
import ButtonSection from './button-section'

export default {
  title: 'Button Section',
  component: ButtonSection
}

export const Primary = () => <ButtonSection content={buttonSection.fields.content as TypeComponentButton[]} />
