/* eslint-disable no-console */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import * as Sentry from '@sentry/nextjs'
import countryList from '../../../locales/en-US/countries.json'

const findMatchingCountry = (data: string) => {
  const { countries } = countryList
  return {
    value: data ? Object.keys(countries).find((country) => country === data) : '',
    label: data ? (countries as { [key: string]: string })[data] : ''
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userCountry = req.headers['cf-ipcountry'] as string
  const userIPAddress = req.socket.remoteAddress
  console.log('IP country from request:', userCountry, 'IP address:', userIPAddress, 'x-forwarded header:', req.headers['x-forwarded-for'])
  const xFFHeader = req.headers['x-forwarded-for']?.toString().includes(',')
    ? req.headers['x-forwarded-for'].toString().split(',')[0]
    : req.headers['x-forwarded-for']
  return userCountry
    ? res.status(200).json({ userCountry: findMatchingCountry(userCountry) })
    : axios
        .get(`https://emissary.emeritus-analytics.io/ip/v1/lookup/${xFFHeader || userIPAddress}`)
        .then(({ data }) => {
          console.log('Analytics api data', data)
          if (data?.iso) {
            return res
              .status(200)
              .setHeader('Access-Control-Allow-Origin', '*')
              .json({ userCountry: findMatchingCountry(data?.iso) })
          } else {
            throw Promise.reject('Unable to fetch from data science API')
          }
        })
        .catch((err) => {
          console.log('Unable to fetch country from Data Science API for the IP')
          Sentry.captureException('Unable to fetch country from IP', err)
          return res.status(200).json({ userCountry: findMatchingCountry('') })
        })
}
