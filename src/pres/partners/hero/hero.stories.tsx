import { heroFeatureAssets, heroImage } from '__test__/mocks/partnerPage/sections/modules/components/assets'
import { headerLinks } from '__test__/mocks/partnerPage/sections/modules/components/componentLink'
import Hero from './hero'

export default {
  title: 'Example/Hero',
  component: Hero
}

const title = 'Get access to world-class learning from top universities'
const subtitle = '15% Tuition Benefit for Dow Jones University Partners'

export const Default = () => <Hero title={title} subtitle={subtitle} links={headerLinks} features={heroFeatureAssets} image={heroImage} />
