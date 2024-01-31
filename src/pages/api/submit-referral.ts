// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as Sentry from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { referralsAPI } from '@emeritus-engineering/ee-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req
  const parsedBody = typeof body === 'object' ? body : JSON.parse(body)
  try {
    if (req.method === 'POST') {
      const { program_sfid, source } = req.query
      const params = { advocate_email: parsedBody.email, source }
      const result = await referralsAPI.personalUrl(params, program_sfid as string)
      return res
        .status(result?.error?.response?.status || 200)
        .setHeader('Access-Control-Allow-Origin', '*')
        .json(result)
    }
    return res.status(404)
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)
    return res.status(500).json(error)
  }
}
