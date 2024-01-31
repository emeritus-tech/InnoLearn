import Head from 'next/head'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { TypeSeoMetaFields } from 'types/contentful-types'

export interface SeoMetaProps {
  seoMeta: TypeSeoMetaFields
}

function SeoMeta({ seoMeta: { title, description, canonical, hrefLang, schemaFaq, follow } }: SeoMetaProps) {
  const { program } = useContext(PageLayoutContext)
  const { host_name, vanity_host_name } = program?.fields?.school?.fields || {}
  const { query } = useRouter()
  const slug = query['school-slug']
  const shouldIndex = (follow === 'Hostname' && slug === host_name) || (follow === 'Vanity hostname' && slug === vanity_host_name)

  return (
    <Head>
      <title>{title}</title>
      {description && <meta id="description" name="description" content={description} />}
      {canonical && <link id="canonical" rel="canonical" href={canonical} />}
      {hrefLang?.map((lang, index) => (
        <link key={`href-lang-${index}`} rel="alternate" href={lang.fields.href} hrefLang={lang.fields.hrefLang} />
      ))}
      {!shouldIndex && <meta name="robots" content="noindex,nofollow" />}
      {schemaFaq && <script type="application/ld+json">{JSON.stringify(schemaFaq)}</script>}
    </Head>
  )
}

export default SeoMeta
