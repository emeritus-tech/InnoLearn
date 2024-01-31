import { Entry } from 'contentful'
import { TypeBlogPageTemplateFields } from 'types/contentful-types'
import ProgramCard from '../program-card'

interface Props {
  items: Entry<TypeBlogPageTemplateFields>[]
}

function RelatedPosts({ items }: Props) {
  return (
    <div className="row g-3">
      {items?.map((post, index) =>
        post.fields?.heroImage ? (
          <ProgramCard
            key={`related-post-${index}`}
            category={post.fields?.category}
            imageicon={post.fields?.heroImage}
            schoolName=""
            url={post.fields?.slug || ''}
            title={post.fields?.title}
            subtitle=""
            contentfulName=""
            courseName=""
            programSfid=""
            landingPageId={0}
          />
        ) : null
      )}
    </div>
  )
}

export default RelatedPosts
