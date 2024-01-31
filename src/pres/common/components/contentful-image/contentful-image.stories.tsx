import { iconAsset } from '__test__/mocks/partnerPage/sections/modules/components/assets'
import ContentfulImage from './contentful-image'

export default {
  title: 'Component/Contentful Image',
  component: ContentfulImage
}

export const Default = () => <ContentfulImage alt="some image" height={45} width={45} src={iconAsset} />
