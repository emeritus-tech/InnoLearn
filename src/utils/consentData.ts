import { ConsentResult } from '@emeritus-engineering/ee-api'
import axios from 'axios'

export async function programConsent(sfid: string): Promise<ConsentResult | undefined> {
  try {
    const updatedEndpoint = process.env.NEXT_PUBLIC_COLLECTION_CONSENT_API?.replace('SFID', sfid)
    const { data } = await axios.get(`${updatedEndpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': ' application/json',
        'HTTP-EE-RESOURCES-API-KEY': `${process.env.NEXT_PUBLIC_COLLECTION_PROGRAMS_SECRET}`
      }
    })
    return data as ConsentResult
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return
  }
}
