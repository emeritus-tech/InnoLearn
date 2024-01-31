import { ConsentResult } from '@emeritus-engineering/ee-api'
import { useEffect, useState } from 'react'
import { programConsent } from 'utils/consentData'

const useConsentData = (sfid: string) => {
  const [consentFromAPI, setConsentFromAPI] = useState<ConsentResult | undefined>()

  useEffect(() => {
    async function fetchConsentData() {
      try {
        const programConsentResponse = await programConsent(sfid)
        setConsentFromAPI(programConsentResponse)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error while fetching program data', err)
      }
    }
    fetchConsentData()
  }, [sfid])
  return consentFromAPI
}

export default useConsentData
