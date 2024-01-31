import React from 'react'

import { explorePrograms } from '__test__/mocks/partnerPage/sections/modules/explorePrograms'
import { TypeComponentExploreProgramCard } from 'types/contentful-types'
import ExplorePrograms from './explore-programs'

export default {
  title: 'Explore Programs',
  component: ExplorePrograms
}

export const Primary = () => (
  <ExplorePrograms content={explorePrograms.fields.content as TypeComponentExploreProgramCard[]} title="Explore Programs" />
)
