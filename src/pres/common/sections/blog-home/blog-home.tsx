import { useCallback, useState } from 'react'
import cn from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { TypeBlogHomeTemplate } from 'types/contentful-types'
import ContentfulImage from 'pres/common/components/contentful-image'
import Button from 'pres/common/components/button'
import { onlyUnique } from 'utils/common'
import BlogPostCards from '../blog-post-cards'
import { DEFAULT_CARDS_PER_ROW } from '../blog-post-cards/blog-post-cards'
import styles from './blog-home.module.scss'

const ALL_CATEGORIES = 'ALL'

interface BlogHomeProps {
  site: string
  className?: string
  blogHomePage: TypeBlogHomeTemplate | undefined
}

function BlogHome({ blogHomePage, site, className }: BlogHomeProps) {
  const heroPost = blogHomePage?.fields?.heroPost
  const featuredPosts = blogHomePage?.fields?.featuredPosts
  const posts = blogHomePage?.fields?.posts

  const { t } = useTranslation('common')
  const categories = posts?.map((post) => post.fields?.category).filter(onlyUnique)
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES)
  const [areAllCardsVisible, setAreAllCardsVisible] = useState(false)
  const [showMoreButton, setShowMoreButton] = useState(true)

  const handleCagegoryChange = (category: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(category.target.value)
  }

  const showAllCards = useCallback(() => setAreAllCardsVisible(true), [setAreAllCardsVisible])

  const path = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? '/' : `/microsites/${site}/`
  const { image, imageAltText, imageTitleText } = heroPost?.fields?.seoHeroImage?.fields || {}

  return (
    <div className={cn('container', className)}>
      <Link href={`${path}blog/${heroPost?.fields?.slug}`}>
        <div className={cn('d-flex flex-md-row flex-column mt-5 mb-4', styles.mainCard)}>
          <div className={cn('position-relative', styles.imageContainer)}>
            <ContentfulImage
              fill
              className={styles.heroImage}
              src={image || heroPost?.fields?.heroImage}
              alt={imageAltText || heroPost?.fields?.title || ''}
              title={imageTitleText || ''}
            />
          </div>
          <div className={cn('px-5 py-4', styles.mainCardTexts)}>
            <p className="text-b2 text-uppercase">{heroPost?.fields?.category}</p>
            <p className="text-h3">{heroPost?.fields?.title}</p>
          </div>
        </div>
      </Link>
      <div className="row mb-4 d-flex">
        {featuredPosts?.map(({ fields: { heroImage, seoHeroImage, title, category, slug } }, index) => {
          const { image, imageAltText, imageTitleText } = seoHeroImage?.fields || {}
          return (
            <div key={`second-posts-${index}`} className={cn('col-lg-6 col-sm-12', styles.secondaryPosts)}>
              <Link href={`${path}blog/${slug}`}>
                <div className={cn('d-flex flex-md-row flex-column mb-4', styles.secondPostCard)}>
                  <div className={cn('position-relative', styles.secondPostImageContainer)}>
                    <ContentfulImage
                      className={styles.featuredPostImage}
                      src={image || heroImage}
                      fill
                      alt={imageAltText || title || ''}
                      title={imageTitleText}
                    />
                  </div>
                  <div className="px-4 py-4">
                    <p className="text-b2 text-uppercase">{category}</p>
                    <p className="text-b1 text-weight-semibold">{title}</p>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
      {posts && posts?.length ? (
        <div className={cn('row mb-4 d-flex flex-sm-row flex-column', styles.titleWrapper)}>
          <h2 className="col-9 mb-3 text-h2 text-weight-medium">Explore by Category</h2>
          <div className="col-12 col-md-3 pe-0">
            <select className={styles.categorySelector} onChange={handleCagegoryChange}>
              <option value={ALL_CATEGORIES}>All</option>
              {categories?.map((category, index) => (
                <option key={`category-index-${index}`} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
      {posts && posts?.length ? (
        <BlogPostCards
          path={path}
          setShowMoreButton={setShowMoreButton}
          areAllCardsVisible={areAllCardsVisible}
          posts={posts}
          selectedCategory={selectedCategory}
        />
      ) : null}
      {!areAllCardsVisible && posts && posts?.length && posts?.length > DEFAULT_CARDS_PER_ROW && showMoreButton ? (
        <div className="d-flex mb-5 justify-content-center">
          <Button className="mt-3 text-b2 px-5 py-1 btn btn--primary" onClick={showAllCards}>
            {t('readMore')}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default BlogHome
