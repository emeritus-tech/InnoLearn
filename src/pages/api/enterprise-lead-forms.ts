import { NextApiRequest, NextApiResponse } from 'next'
import { enterpriseLeadsAPI } from '@emeritus-engineering/ee-api'
import * as Sentry from '@sentry/nextjs'

export default async function leadFormHandler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req
  const parsedBody = typeof body === 'object' ? body : JSON.parse(body)
  try {
    const response = await enterpriseLeadsAPI.submitEnterpriseLead(parsedBody.body, req)
    if (response.error) {
      const errorData = { message: response.error.message, ...response.error.response.data }
      // eslint-disable-next-line no-console
      console.log('Enterprise Lead submit failure', errorData, parsedBody.programsData)
      return res.status(response.error.response.status).json(errorData)
    }
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').json(response)
  } catch (error) {
    Sentry.captureException(error)
    // eslint-disable-next-line no-console
    console.log('Enterprise Lead submit failed', error)
    return res.json(error)
  }
}
