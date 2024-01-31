import { NextApiRequest, NextApiResponse } from 'next'
import {
  b2bPageContentType,
  childPageContentType,
  programMicroSiteChildPageContentType,
  collectionPageContentType,
  landingPageContentType,
  partnerPageContentType,
  referralPageContentType
} from 'constants/contentful'
import { previewClient, gaPreviewClient } from 'utils/contentfulConfig'
import { ContentfulQueryType } from './revalidate'

interface Page {
  [x: string]: any
  slug: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let page
    if (req.query.space === 'ga') {
      page = await gaPreviewClient.getEntry<Page>(req.query.id as string)
    } else {
      page = await previewClient.getEntry<Page>(req.query.id as string)
    }

    if (req.query.contentType === partnerPageContentType) {
      res.setPreviewData({})
      res.redirect(`/partners/${page.fields.slug}`)
    } else if (req.query.contentType === b2bPageContentType) {
      res.setPreviewData({})
      res.redirect(`/enterprises/${page.fields.slug}`)
    } else if (req.query.contentType === landingPageContentType) {
      res.setPreviewData({})
      res.redirect(
        `/landing-pages/${
          page.fields.program?.fields?.school?.fields?.host_name || page.fields.program?.fields?.school?.fields?.vanity_host_name
        }/${page.fields.slug}`
      )
    } else if (req.query.contentType === collectionPageContentType) {
      res.setPreviewData({})
      res.redirect(`/collections/${page.fields?.school?.fields?.translation_key}/${page.fields.slug}`)
    } else if (req.query.contentType === referralPageContentType) {
      res.setPreviewData({})
      res.redirect(`/referral/${page.fields.program?.fields?.school?.fields?.translation_key}/${page.fields.slug}`)
    } else if (req.query.contentType === childPageContentType) {
      const { items }: ContentfulQueryType = await previewClient.getEntries({ links_to_entry: page.sys.id })
      if (items.length > 0) {
        res.setPreviewData({})
        res.redirect(`/microsites/${items[0].fields.slug}/${page.fields.slug}`)
      } else {
        res.end()
      }
    } else if (req.query.contentType === programMicroSiteChildPageContentType) {
      const { items }: ContentfulQueryType = await previewClient.getEntries({ links_to_entry: page.sys.id })
      if (items.length > 0) {
        res.setPreviewData({})
        res.redirect(
          `/program-microsites/${items[0].fields.program?.fields?.school?.fields?.host_name}/${items[0].fields.slug}/${page.fields.slug}`
        )
      } else {
        res.end()
      }
    } else {
      res.end()
    }
    //return res.json({ message: 'preview mode on' })
  } catch (error) {
    return res.json({ ...req.query })
  }
}
