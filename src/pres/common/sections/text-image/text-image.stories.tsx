import { textAndImage } from '__test__/mocks/partnerPage/sections/modules/components/textAndImage'
import { ctaButton } from '__test__/mocks/partnerPage/sections/modules/buttonSection'
import TextImage from './text-image'

export default {
  title: 'Example/TextImage',
  component: TextImage
}

export const Default = () => <TextImage content={[textAndImage]} />

export const WithCTA = () => <TextImage content={[textAndImage]} cta={ctaButton} />
