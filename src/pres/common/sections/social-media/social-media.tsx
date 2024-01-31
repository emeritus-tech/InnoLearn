import { Entry } from 'contentful'
import ContentfulImage from 'pres/common/components/contentful-image'
import { TypeImageAndLinkFields } from 'types/contentful-types'

interface Props {
  items: Entry<TypeImageAndLinkFields>[]
}

function SocialMedia({ items }: Props) {
  return (
    <div className="d-flex mb-3" data-testid="social-media">
      {items?.map(({ fields: { image, seoImage, link } }, index) => {
        const { imageTitleText: title, imageAltText: altText, image: imgSrc } = seoImage?.fields || {}
        return (
          <div key={`social-media-${index}`} style={{ width: '24px', height: '24px', marginRight: '8px', cursor: 'pointer' }}>
            <a href={link}>
              <ContentfulImage width={24} height={24} src={imgSrc || image} title={title} alt={altText || link || ''} />
            </a>
          </div>
        )
      })}
    </div>
  )
}

export default SocialMedia
