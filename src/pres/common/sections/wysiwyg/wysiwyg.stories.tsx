import React from 'react'
import { textBlock } from '__test__/mocks/partnerPage/sections/modules/components/textBlock'
import { ctaButton } from '__test__/mocks/partnerPage/sections/modules/buttonSection'
import WYSIWYG from './wysiwyg'

export default {
  title: 'Wysiwyg',
  component: WYSIWYG
}

export const Primary = () => <WYSIWYG title="test title" content={[textBlock]} introText="" />

export const WithCTA = () => <WYSIWYG title="test title" content={[textBlock]} cta={ctaButton} introText="" />
