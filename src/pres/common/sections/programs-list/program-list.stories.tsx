import React from 'react'
import { Entry } from 'contentful'
import { businessAnalyticsCategory } from '__test__/mocks/partnerPage/sections/modules/categories'
import { TypeComponentProgramCardFields } from 'types/contentful-types'
import ProgramList from './programs-list'

export default {
  title: 'Program List',
  component: ProgramList
}

export const Primary = () => (
  <ProgramList content={businessAnalyticsCategory.fields.content as Entry<TypeComponentProgramCardFields>[]} title="Test program title" />
)
