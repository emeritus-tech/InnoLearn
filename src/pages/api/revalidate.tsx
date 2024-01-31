import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  blogHomeContentType,
  blogPageContentType,
  childPageContentType,
  micrositeContentType,
  partnerPageContentType,
  b2bContentType
} from 'constants/contentful'

import { client } from 'utils/contentfulConfig'

interface ContentfulItemType {
  sys: {
    locale: string
    id: string
    contentType: any
  }
  fields: {
    program: any
    slug: string
    pages: any
    coursePages: any
  }
}

export interface ContentfulQueryType {
  items: Array<ContentfulItemType>
}

interface EntryType {
  pages: any
  coursePages: any
  blogHomePage: any
  slug: string
  heroPost: any
  featuredPosts: any
  posts: any
}

interface Pages {
  page: 'enterprises' | 'partners'
}
interface PurgeCacheRequest extends Pages {
  path: string
}

const hostUrls = {
  enterprises: '.enterprisepartner.emeritus.org',
  partners: '.partner.emeritus.org'
}

async function purgeCache({ page, path }: PurgeCacheRequest) {
  const hosts = `${path}${hostUrls[page]}`
  const data = JSON.stringify({
    hosts: [hosts]
  })
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.CLOUD_FLARE_API}${process.env.CLOUD_FLARE_ZONE_ID}/purge_cache`,
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Email': process.env.CLOUD_FLARE_EMAIL,
      'X-Auth-Key': process.env.CLOUD_FLARE_API_KEY
    },
    data
  }
  try {
    const response = await axios(config)
    if (response?.data?.success) {
      // eslint-disable-next-line no-console
      console.log(`Cloudflare Purge Success - Host: ${hosts} | Response: ${JSON.stringify(response.data)}`)
    } else {
      console.error(`Cloudflare Purge Failure - Host: ${hosts} | Response: ${JSON.stringify(response.data)}`)
    }
  } catch (error) {
    console.error(`Cloudflare Purge Catch Error - Host: ${hosts} | Response: ${error}`)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.json({ message: 'Method not allowed' })
  const partners = 'partners',
    enterprises = 'enterprises'
  const body = JSON.parse(req.body)
  const revalidatePage = (page: 'enterprises' | 'partners') => {
    Object.entries(body.fields.slug).forEach(async (slug, index) => {
      const locale = slug[0]
      const path = slug[1] as string
      await res.revalidate(`/${locale}/${page}/${path}`)
      if (index === 0 && process.env.NEXT_PUBLIC_APP_ENV === 'production' && process.env.ENABLE_CLOUD_FLARE_PURGE) {
        await purgeCache({ page, path })
      }
    })
  }

  const revalidateMicrositeParentPage = async () => {
    Object.entries(body.fields.slug).forEach(async (slug) => {
      const path = slug[1]
      const { items = [] } = await client.getEntries<EntryType>({
        content_type: micrositeContentType,
        'fields.slug': path
      })
      items.forEach(async (item) => {
        item.fields.pages.forEach(async (page: any) => {
          await res.revalidate(`/${item.sys.locale}/microsites/${item.fields.slug}/${page.fields.slug}`)
        })
        item.fields.coursePages.forEach(async (page: any) => {
          await res.revalidate(`/${item.sys.locale}/microsites/${item.fields.slug}/courses/${page.fields.slug}`)
        })
        const heroPost = item.fields?.blogHomePage?.fields?.heroPost ?? []
        const featuredPosts = item.fields?.blogHomePage?.fields?.featuredPosts ?? []
        const posts = item.fields?.blogHomePage?.fields?.posts ?? []
        await res.revalidate(`/${item?.sys?.locale}/microsites/${item?.fields?.slug}/blog`)
        posts.concat(heroPost, featuredPosts).forEach(async (post: any) => {
          await res.revalidate(`/${item.sys.locale}/microsites/${item.fields.slug}/blog/${post.fields.slug}`)
        })
      })
    })
  }

  const revalidateChildPage = async () => {
    const { items: childPageItems } = await client.getEntries<EntryType>({
      content_type: childPageContentType,
      'sys.id': body.sys.id
    })
    childPageItems.forEach(async (childPageItem) => {
      const { items: micrositeItems }: ContentfulQueryType = await client.getEntries({ links_to_entry: childPageItem.sys.id })
      micrositeItems.forEach(async (micrositePageItem) => {
        const page = micrositePageItem.fields.pages.find((page: any) => page.fields.slug === childPageItem.fields.slug)
        const coursePage = micrositePageItem.fields.coursePages.find((page: any) => page.fields.slug === childPageItem.fields.slug)
        if (page) {
          await res.revalidate(`/${micrositePageItem.sys.locale}/microsites/${micrositePageItem.fields.slug}/${childPageItem.fields.slug}`)
        } else if (coursePage) {
          await res.revalidate(
            `/${micrositePageItem.sys.locale}/microsites/${micrositePageItem.fields.slug}/courses/${childPageItem.fields.slug}`
          )
        }
      })
    })
  }

  const revalidateBlogPage = async () => {
    const blogPost = await client.getEntry<EntryType>(body.sys.id)

    const { items: blogHomeItems }: ContentfulQueryType = await client.getEntries({ links_to_entry: blogPost.sys.id })
    blogHomeItems.forEach(async (item) => {
      const { items: micrositeItems }: ContentfulQueryType = await client.getEntries({ links_to_entry: item.sys.id })
      const micrositePage = micrositeItems.find((item) => item.sys.contentType.sys.id === micrositeContentType)
      if (micrositePage) {
        await res.revalidate(`/${micrositePage?.sys?.locale}/microsites/${micrositePage?.fields?.slug}/blog`)
        await res.revalidate(`/${micrositePage?.sys?.locale}/microsites/${micrositePage?.fields?.slug}/blog/${blogPost?.fields?.slug}`)
      }
    })
  }

  const revalidateBlogHome = async () => {
    const blogHome = await client.getEntry<EntryType>(body.sys.id)
    const { items: micrositeItems }: ContentfulQueryType = await client.getEntries({ links_to_entry: blogHome.sys.id })
    micrositeItems.forEach(async (micrositePage) => {
      const heroPost = blogHome.fields?.heroPost ?? []
      const featuredPosts = blogHome.fields?.featuredPosts ?? []
      const posts = blogHome.fields?.posts ?? []
      await res.revalidate(`/${micrositePage?.sys?.locale}/microsites/${micrositePage?.fields?.slug}/blog`)
      posts.concat(heroPost, featuredPosts).forEach(async (post: any) => {
        await res.revalidate(`/${micrositePage?.sys?.locale}/microsites/${micrositePage?.fields?.slug}/blog/${post?.fields?.slug}`)
      })
    })
  }

  const revalidateGeneric = () => {
    console.warn('revalidate Generic')
  }

  switch (body.sys?.contentType?.sys?.id) {
    case partnerPageContentType:
      revalidatePage(partners)
      break
    case micrositeContentType:
      revalidateMicrositeParentPage()
      break
    case childPageContentType:
      revalidateChildPage()
      break
    case blogPageContentType:
      revalidateBlogPage()
      break
    case blogHomeContentType:
      revalidateBlogHome()
      break
    case b2bContentType:
      revalidatePage(enterprises)
      break
    default:
      revalidateGeneric()
      break
  }

  return res.json({ revalidated: true })
}
