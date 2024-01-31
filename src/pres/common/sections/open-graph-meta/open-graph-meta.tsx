import Head from 'next/head'
import { TypeOpenGraphMetaFields } from 'types/contentful-types/TypeOpenGraphMeta'

export interface OpenGraphMetaProps {
  openGraphMeta: TypeOpenGraphMetaFields
}

/*
The refernce links for OG documentation:
For facebook: https://developers.facebook.com/docs/sharing/webmasters/
For linkedIn: https://www.linkedin.com/help/linkedin/answer/a521928/make-your-website-shareable-on-linkedin?lang=en
https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
*/

function OpenGraphMeta({ openGraphMeta: { ogTitle, ogDescription, ogUrl, ogImage, ogType, additionalOg } }: OpenGraphMetaProps) {
  return (
    <Head>
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogImage && <meta property="og:image" content={ogImage?.fields?.file?.url} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      {ogType && <meta property="og:type" content={ogType} />}
      {additionalOg &&
        additionalOg?.map((item, index) => <meta property={item.fields.fieldName} content={item.fields.fieldValue} key={index} />)}
    </Head>
  )
}

export default OpenGraphMeta
