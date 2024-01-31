import Hero from './hero'

export default {
  title: 'Referral/Hero',
  component: Hero
}

const title = 'MIT Course'
const subtitle = 'MIT University'

const HeroJSX = <Hero contentfulName="" title={title} subTitle={subtitle} />

export const Short = () => HeroJSX

export const Long = () => HeroJSX
