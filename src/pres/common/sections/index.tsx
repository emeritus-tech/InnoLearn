import { FunctionComponent } from 'react'
import { genericSectionTypes, sectionsContentTypes } from 'constants/contentful'

import PartnerLogos from 'pres/partners/partner-logos'
import TextImage from 'pres/common/sections/text-image'
import HeroPartners from 'pres/partners/hero'
import HeroMicrosites from 'pres/microsites/sections/hero'
import HeroLandingPages from 'pres/landing-pages/sections/hero'
import ProgramFaculty from 'pres/common/sections/program-faculty'
import ProgramTestimonial from 'pres/common/sections/program-testimonial'
import HeroReferral from 'pres/referral/sections/hero'
import HeroProgramMicroSitesPages from 'pres/program-microsites/hero/hero'
import StickyBrochure from './sticky-brochure'
import FeaturedIcons from './featured-icons'
import ProgramsList from './programs-list'
import WYSIWYG from './wysiwyg'
import Faq from './faq'
import ExplorePrograms from './explore-programs'
import ButtonSection from './button-section'
import ApplicationDetails from './application-details'
import InfoBar from './info-bar'
import Stats from './stats/stats'
import Table from './table'
import IconText from './icon-text/icon-text'
import { ImageAndTextColumn } from './image-text-column/image-text-column'
import ReferralProgramList from './referral-program-card'
import { Video } from './video/video'
import { Quote } from './quote/quote'
import ImageBlock from './image-block'

export interface PageSection {
  fields: any
  sys: {
    contentType: {
      sys: {
        id: string
      }
    }
  }
}
interface SectionsTypes {
  [key: string]: FunctionComponent<any>
}

const Sections: SectionsTypes = {
  [sectionsContentTypes.Hero]: HeroMicrosites,
  [sectionsContentTypes.HeroPartners]: HeroPartners,
  [sectionsContentTypes.HeroLandingPages]: HeroLandingPages,
  [sectionsContentTypes.HeroReferral]: HeroReferral,
  [sectionsContentTypes.ProgamMicrositesHero]: HeroProgramMicroSitesPages,
  [sectionsContentTypes.InfoBar]: InfoBar,
  [sectionsContentTypes.ApplicationDetails]: ApplicationDetails,
  [sectionsContentTypes.StickyBrochure]: StickyBrochure
} as const

const GenericSections: SectionsTypes = {
  [genericSectionTypes.FeaturedIcons]: FeaturedIcons,
  [genericSectionTypes.Faq]: Faq,
  [genericSectionTypes.ProgramsList]: ProgramsList,
  [genericSectionTypes.ExplorePrograms]: ExplorePrograms,
  [genericSectionTypes.PartnerLogos]: PartnerLogos,
  [genericSectionTypes.TextImage]: TextImage,
  [genericSectionTypes.TextBlock]: WYSIWYG,
  [genericSectionTypes.ButtonSection]: ButtonSection,
  [genericSectionTypes.ProgramFaculty]: ProgramFaculty,
  [genericSectionTypes.ProgramTestimonial]: ProgramTestimonial,
  [genericSectionTypes.IconText]: IconText,
  [genericSectionTypes.ImageAndTextColumn]: ImageAndTextColumn,
  [genericSectionTypes.Stats]: Stats,
  [genericSectionTypes.ReferralProgramCard]: ReferralProgramList,
  [genericSectionTypes.Video]: Video,
  [genericSectionTypes.Table]: Table,
  [genericSectionTypes.Quote]: Quote,
  [genericSectionTypes.ImageBlock]: ImageBlock
} as const

const getSectionModule = (pageSection: PageSection): FunctionComponent => {
  const contentType = pageSection?.sys?.contentType?.sys?.id

  if (contentType === sectionsContentTypes.GenericSection && pageSection?.fields.content) {
    const [sampleContent] = pageSection.fields.content

    if (sampleContent) {
      return GenericSections[sampleContent.sys.contentType?.sys.id]
    }

    return () => null
  }

  return Sections[contentType]
}

export default getSectionModule
