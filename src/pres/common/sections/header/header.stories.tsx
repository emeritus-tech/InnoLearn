import Navigation from 'pres/common/components/navigation'
import { logoAsset } from '__test__/mocks/partnerPage/sections/modules/components/assets'
import { headerLinks } from '__test__/mocks/partnerPage/sections/modules/components/componentLink'
import Header from './header'

export default {
  title: 'Example/Header',
  component: Header
}

export const Default = () => <Header logo={logoAsset} />

export const PartnerPage = () => <Header logo={logoAsset} />

export const Microsites = () => (
  <Header
    logo={logoAsset}
    logoLink="https://www.mit.edu"
    secondaryLogo={logoAsset}
    secondaryLogoLink="https://xpro.mit.edu"
    coBrandedMessage="In collaboration with Emeritus"
  >
    <Navigation navigationLinks={headerLinks} />
  </Header>
)
