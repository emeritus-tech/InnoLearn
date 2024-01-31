import { useMemo } from 'react'
import cn from 'classnames'
import { Entry } from 'contentful'
import SectionHeading from '@emeritus-engineering/blueprint-core-modules/utils/section-heading'
import ContentfulImage from 'pres/common/components/contentful-image'
import Section from 'pres/common/components/section'
import ButtonComponent from 'pres/common/sections/button-section/button-component'
import { TypeComponentButtonFields, TypeComponentTextAndIcon } from 'types/contentful-types'
import { parseToSectionId } from 'utils/common'
import { DEFAULT_BACKGROUND, DEFAULT_FOREGROUND } from 'constants/colors'
import styles from './featured-icons.module.scss'

interface FeatureIconsProps {
  title: string
  content: Array<TypeComponentTextAndIcon>
  className?: string
  backgroundColor?: string
  foregroundColor?: string
  cta?: Entry<TypeComponentButtonFields>
}

const MINIMUM_ICON_LIST_LENGTH_BOUNDARY = 2

function FeatureIcons({ title, content = [], className, backgroundColor, foregroundColor, cta }: FeatureIconsProps) {
  const sectionId = useMemo(() => parseToSectionId(title), [title])
  const iconsList = useMemo(
    () =>
      content.map(({ fields: { image, seoImage, title, description } }, index) => {
        const { image: imgSrc, imageAltText, imageTitleText } = seoImage?.fields || {}
        return (
          <div className="col-12 col-md-3" key={index} data-testid="featured-icon">
            <ContentfulImage
              width={45}
              height={45}
              alt={imageAltText || title || ''}
              src={imgSrc || image}
              title={imageTitleText || ''}
              className={styles.featureIcon}
            />
            <p className="m-0 mt-2 fw-semibold">{title}</p>
            <p className="m-0 fw-light">{description}</p>
          </div>
        )
      }),
    [content]
  )

  return (
    <Section
      id={`featured-icons-${sectionId}`}
      className={className}
      style={{ background: backgroundColor ?? DEFAULT_BACKGROUND, color: foregroundColor ?? DEFAULT_FOREGROUND }}
    >
      <div className="container py-5">
        {title && (
          <div className="row">
            <div className="col-12">
              <SectionHeading title={title} textAlignment="mb-5 text-center text-h2 fw-bold" />
            </div>
          </div>
        )}
        <div
          className={cn(
            'row g-3',
            iconsList.length <= MINIMUM_ICON_LIST_LENGTH_BOUNDARY ? 'justify-content-center' : 'justify-content-between'
          )}
        >
          {iconsList}
        </div>
        {cta ? (
          <div className="mt-3 d-flex justify-content-center">
            <ButtonComponent
              text={cta.fields.text}
              link={cta.fields.link}
              openInNewTab={cta.fields.openInNewTab}
              eventName={cta.fields.eventName}
              className="px-3 py-2 text-b2 cta-section-module"
              eventType={cta.fields.eventType}
              title={title}
            />
          </div>
        ) : null}
      </div>
    </Section>
  )
}

export default FeatureIcons
