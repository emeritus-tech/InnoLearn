import cn from 'classnames'
import ContentfulImage from 'pres/common/components/contentful-image'
import { TypeLanding_pagesFields, TypeSectionHeroFields } from 'types/contentful-types'
import styles from './hero.module.scss'

interface HeroProps extends TypeSectionHeroFields {
  landingPage: TypeLanding_pagesFields
}

function Hero({ heroImage, seoHeroImage, title, subTitle }: HeroProps) {
  const { imageTitleText: imgTitle, imageAltText: altText, image: imageSrc } = seoHeroImage?.fields || {}
  return (
    <div className={cn('w-100 position-relative', styles.container)}>
      <ContentfulImage fill className={styles.heroImage} title={imgTitle || ''} alt={altText || title || ''} src={imageSrc || heroImage} />
      <div className={cn('ms-5 bg-secondary position-relative', styles.info)}>
        <h1 className={cn('mt-0 mb-3', styles.title)}>{title}</h1>
        <h4 className={cn('text-b1', styles.heroSubtitle)}>{subTitle}</h4>
      </div>
    </div>
  )
}

export default Hero
