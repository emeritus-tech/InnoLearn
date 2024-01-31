import cn from 'classnames'
import { exploreCategoryEvents } from 'constants/trackpoint'
import ContentfulImage from 'pres/common/components/contentful-image'
import { TypeComponentExploreProgramCardFields } from 'types/contentful-types'
import { buildTPClickEvent } from 'utils/trackpoint'
import styles from './explore-programs.module.scss'

type ProgramCategoryProps = Omit<TypeComponentExploreProgramCardFields, 'contentfulName'>

function ProgramCategory({ image, seoImage, courseName, url }: ProgramCategoryProps) {
  const { image: imageSrc, imageAltText, imageTitleText } = seoImage?.fields || {}
  return (
    <div className="col-12 col-md-6 col-lg-4 position-relative" data-testid="program-category">
      <a
        href={url}
        rel="noreferrer"
        data-track={buildTPClickEvent({
          event: exploreCategoryEvents.click,
          event_properties: {
            content_data: {
              courseCategoryName: courseName
            }
          }
        })}
      >
        <div className={cn('rounded overflow-hidden mb-3', styles.imageContainer)}>
          <ContentfulImage
            width="376"
            height="182"
            className={cn('rounded', styles.cardImage)}
            src={imageSrc || image}
            alt={imageAltText || courseName}
            title={imageTitleText || ''}
          />
        </div>
        <p className={cn('position-absolute text-center', styles.courseName)}>{courseName}</p>
      </a>
    </div>
  )
}

export default ProgramCategory
