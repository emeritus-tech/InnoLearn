import { NextApiRequest, NextApiResponse } from 'next'
import { leadsAPI } from '@emeritus-engineering/ee-api'
import * as Sentry from '@sentry/nextjs'

export default async function leadFormHandler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req
  const parsedBody = typeof body === 'object' ? body : JSON.parse(body)
  try {
    const response = await leadsAPI.submitLead(parsedBody.body, parsedBody.leadData || {}, req)
    if (response.error) {
      const errorData = { message: response.error.message, ...response.error.response.data }
      Sentry.captureException(
        `Lead submit failed ${errorData.message}, user uuid: ${(parsedBody.body?.user_uuid || parsedBody.user_uuid) ?? 'No user uuid'}`
      )
      // eslint-disable-next-line no-console
      console.log('Lead submit failure', errorData, parsedBody.programsData)
      return res.status(response.error.response.status).json(errorData)
    }
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').json(response)
  } catch (error) {
    Sentry.captureException(error)
    // eslint-disable-next-line no-console
    console.log('Lead submit failed', error)
    return res.json(error)
  }
}
