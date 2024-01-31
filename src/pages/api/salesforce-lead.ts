import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as Sentry from '@sentry/nextjs'

export async function generateOAuthToken() {
  const tokenEndpoint = process.env.SF_ACCESS_TOKEN_URL || ''
  const clientId = process.env.SF_CLIENT_ID
  const clientSecret = process.env.SF_CLIENT_SECRET
  const username = process.env.SF_USERNAME
  const password = process.env.SF_PASSWORD

  try {
    const response = await axios.post(tokenEndpoint, null, {
      params: {
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username,
        password
      },
      headers: {
        'X-PrettyPrint': '1'
      }
    })

    const { access_token: accessToken, instance_url: instanceUrl } = response.data
    return { accessToken, instanceUrl }
  } catch (error) {
    Sentry.captureException(error)
    console.error('Error generating OAuth token:', error)
    throw new Error('Failed to generate OAuth token')
  }
}

export default async function fetchSalesforceRecord(req: NextApiRequest, res: NextApiResponse) {
  const { externalId } = req.query
  try {
    const { accessToken, instanceUrl } = await generateOAuthToken()
    const salesforceEndpoint = `${instanceUrl}/services/data/v58.0/sobjects/Lead/${externalId}`
    const response = await axios.get(salesforceEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    })
    const record = response.data
    res.status(200).setHeader('Access-Control-Allow-Origin', '*').json(record)
  } catch (error: any) {
    Sentry.captureException(error)
    console.error('Error fetching Salesforce record:', error?.response?.data || error)
    res.status(500).json({ error: 'Failed to fetch Salesforce record' })
  }
}
