import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { Entry } from 'contentful'
import useMediaQueries from 'hooks/useMediaQueries'
import { TypeBlogPageTemplateFields } from 'types/contentful-types'
import ProgramCard from '../program-card'

export const DEFAULT_CARDS_PER_ROW = 8
const MOBILE_CARDS_PER_ROW = 4
const ALL_CATEGORIES = 'ALL'

interface BlogPostCardProps {
  areAllCardsVisible: boolean
  posts: Entry<TypeBlogPageTemplateFields>[]
  selectedCategory: string
  setShowMoreButton: Dispatch<SetStateAction<boolean>>
  path: string
}

function BlogPostCards({ areAllCardsVisible, posts, selectedCategory, setShowMoreButton, path }: BlogPostCardProps) {
  const { isMobile } = useMediaQueries()
  const [numberOfCardsVisible, setNumberOfCardsVisible] = useState(DEFAULT_CARDS_PER_ROW)

  useEffect(() => {
    setNumberOfCardsVisible(isMobile ? MOBILE_CARDS_PER_ROW : DEFAULT_CARDS_PER_ROW)
  }, [setNumberOfCardsVisible, isMobile])

  const blogCards = useMemo(() => {
    const filteredPosts = posts?.filter((post) => {
      if (selectedCategory === ALL_CATEGORIES) {
        setShowMoreButton(true)
        return true
      }
      setShowMoreButton(false)
      return post.fields?.category === selectedCategory
    })
    const content = areAllCardsVisible ? filteredPosts : filteredPosts?.slice(0, numberOfCardsVisible)
    return content?.map((post, index) =>
      post.fields?.heroImage ? (
        <ProgramCard
          key={`related-post-${index}`}
          category={post.fields?.category}
          imageicon={post.fields?.heroImage}
          schoolName=""
          url={`${path}blog/${post.fields?.slug}`}
          title={post.fields?.title}
          subtitle=""
          contentfulName=""
          courseName=""
          programSfid=""
          landingPageId={0}
        />
      ) : null
    )
  }, [posts, areAllCardsVisible, numberOfCardsVisible, selectedCategory, setShowMoreButton, path])

  return <div className="row g-3 mb-5">{blogCards}</div>
}

export default BlogPostCards
