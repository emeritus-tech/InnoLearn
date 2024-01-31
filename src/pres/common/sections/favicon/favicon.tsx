import { Asset } from 'contentful'
import Head from 'next/head'
import { getAssetTypeContent } from 'utils/contentful'

export interface FaviconProps {
  favicon: Asset | string
  faviconPath?: string
}

function SeoMeta({ favicon, faviconPath }: FaviconProps) {
  const faviconBasePath = faviconPath ? `/${faviconPath}/favicon.ico` : ''
  return <Head>{<link rel="icon" type="image/x-icon" href={getAssetTypeContent(favicon) || faviconBasePath} />}</Head>
}

export default SeoMeta
