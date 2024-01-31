import PartnerLogos from './partner-logos'

export default {
  title: 'Section/Partner Logos',
  component: PartnerLogos,
  argTypes: {
    title: { type: 'string' }
  }
}

const partners = [
  {
    fields: {
      logo: {
        fields: {
          file: { url: '//images.ctfassets.net/wkud0epjdpn7/6p9xSiWBTXSXcYXgwVvOGX/473fef091d88aa1f0535570c2c2c9738/columbia.png' }
        }
      }
    }
  },
  {
    fields: {
      logo: {
        fields: { file: { url: '//images.ctfassets.net/wkud0epjdpn7/2GYBmAYynWcCrxBOKiX73Y/b3766ce4c098fb14590d2e246a9665a4/kellogg.png' } }
      }
    }
  },
  {
    fields: {
      logo: {
        fields: { file: { url: '//images.ctfassets.net/wkud0epjdpn7/4iAjChvUlT5ERmcQEE8LYl/32b3eb0f93fb6641a3b50b9f5c730297/incae.png' } }
      }
    }
  },
  {
    fields: {
      logo: {
        fields: { file: { url: '//images.ctfassets.net/wkud0epjdpn7/EQeXWNpzpkGAd0dUchxiG/a10ad851ef6527aeeff24ea6fbc43c6a/carnegie.png' } }
      }
    }
  },
  {
    fields: {
      logo: {
        fields: { file: { url: '//images.ctfassets.net/wkud0epjdpn7/MFamZ9MEnUatItoQXVIUV/15a6a93e99dd7e4a32f876484bb97fe8/mit.png' } }
      }
    }
  }
]

export const Default = (args: any) => <PartnerLogos {...args} content={partners} />

Default.args = {
  title: ''
}
