import { socialMedia } from '__test__/mocks/blogPostPage/socialMedia'
import SocialMedia from './social-media'

export default {
  title: 'Example/SocialMedia',
  component: SocialMedia
}

export const Default = () => <SocialMedia items={socialMedia} />
