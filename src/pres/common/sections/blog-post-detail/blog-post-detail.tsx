import cn from 'classnames'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, Document, Node } from '@contentful/rich-text-types'
import ContentfulImage from 'pres/common/components/contentful-image'
import { headerHeight } from 'pres/common/sections/header/header.module.scss'
import { TypeBlogPageTemplateFields } from 'types/contentful-types'
import SocialMedia from '../social-media'
import RelatedPosts from '../related-posts'
import styles from './blog.module.scss'

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: ({ data }: Node) => {
      const { target } = data
      return (
        <ContentfulImage
          alt=""
          src={target}
          width={700}
          height={475}
          sizes="(min-width: 1em) 33vw,
          (min-width: 48em) 50vw,
          100vw"
        />
      )
    }
  }
}

function BlogPostDetail({
  breadcrumb,
  heroImage,
  seoHeroImage,
  title,
  date,
  category,
  socialMedia,
  body,
  relatedPosts
}: TypeBlogPageTemplateFields) {
  const formatter = new Intl.DateTimeFormat('en', { day: '2-digit', month: 'long', year: 'numeric' })
  const { image, imageAltText, imageTitleText } = seoHeroImage?.fields || {}
  return (
    <div style={{ paddingTop: headerHeight }}>
      <div className={cn('m-lg-auto', styles.container)}>
        <p className={cn('mt-3 mx-4 mx-lg-0', styles.breadcrumb)}>{breadcrumb}</p>
        <ContentfulImage
          width="124"
          height="30"
          className={styles.heroImage}
          src={image || heroImage}
          alt={imageAltText || title || ''}
          style={{ zIndex: -1 }}
          title={imageTitleText || ''}
        />
        <div className={cn('p-4', styles.content)}>
          <h1 className={cn('mb-3 text-h3 text-lg-h2', styles.title)}>{title}</h1>
          <p className="mb-3 text-b2">{`${formatter.format(new Date(date || ''))} | ${category}`}</p>
          {socialMedia && <SocialMedia items={socialMedia} />}
          <div className="text-h5 mb-5">{documentToReactComponents(body as Document, options)}</div>
        </div>
        <div className="mb-5 container">
          {relatedPosts && relatedPosts?.length ? (
            <div className="row px-2">
              <hr />
              <h4 className="mb-3 px-0">Related Articles</h4>
            </div>
          ) : null}
          {relatedPosts && <RelatedPosts items={relatedPosts} />}
        </div>
      </div>
    </div>
  )
}

export default BlogPostDetail
