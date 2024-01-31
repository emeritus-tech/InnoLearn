import { heroImage } from '__test__/mocks/partnerPage/sections/modules/components/assets'
import Hero from './hero'

export default {
  title: 'Microsites/Hero',
  component: Hero
}

const title = 'MIT Course'
const subtitle = 'MIT University'

const HeroJSX = <Hero landingPage={{}} contentfulName="" title={title} subTitle={subtitle} heroImage={heroImage} />

export const Short = () => HeroJSX

export const Long = () => HeroJSX
