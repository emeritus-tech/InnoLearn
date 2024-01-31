// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as Sentry from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { referralsAPI } from '@emeritus-engineering/ee-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const result = await referralsAPI.submitReferral(req.body)
      return res.status(result?.error?.response?.status || 200).json(result)
    }
    return res.status(404)
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)
    return res.status(500).json(error)
  }
}
