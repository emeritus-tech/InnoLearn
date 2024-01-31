import Script from 'next/script'
import { EntryFields } from 'contentful'

export interface SeoSchemaProps {
  seoSchema: EntryFields.Object
}
function SeoSchemaHead({ seoSchema = {} }: SeoSchemaProps) {
  const validateJSONSchema = (jsonData: EntryFields.Object) => {
    try {
      JSON.parse(JSON.stringify(jsonData))
    } catch (e) {
      return false
    }
    return true
  }

  return (
    <>
      {validateJSONSchema(seoSchema) && (
        <Script id="seo-schema" strategy="lazyOnload" type="application/ld+json">
          {` ${JSON.stringify(seoSchema)}`}
        </Script>
      )}
    </>
  )
}

export default SeoSchemaHead
