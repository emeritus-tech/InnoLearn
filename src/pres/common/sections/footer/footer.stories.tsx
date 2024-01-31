import React from 'react'

import { footer } from '__test__/mocks/partnerPage/footer'
import Footer from './footer'

export default {
  title: 'Footer',
  component: Footer
}

export const Primary = () => (
  <div>{footer && footer.fields.body && <Footer contentfulName={footer.fields.contentfulName} body={footer.fields.body} />}</div>
)
