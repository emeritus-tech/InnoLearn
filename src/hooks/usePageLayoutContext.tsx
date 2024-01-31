import { Dispatch, SetStateAction, createContext, useContext } from 'react'
import { ConsentResult } from '@emeritus-engineering/ee-api'
import { ProgramData } from 'types/api-response-types/ProgramData'
import { TypeLeadFormParent, TypeProgram, TypeSchool, TypeThankYouParent } from '../types/contentful-types'

export type SelectedProgramDetailType = Record<
  string,
  {
    successRedirectUrl: string
    errorRedirectUrl: string
    consentData: ConsentResult
  }
>
export interface LandingPageContext extends PartnerContext {
  leadFormFields?: TypeLeadFormParent
  programCourseRun?: ProgramData
  program?: TypeProgram
  school?: TypeSchool
  thankYouFields?: TypeThankYouParent
  b2bThankYouFields?: TypeThankYouParent
  readOnlyProgramCards?: boolean
  screenName?: string
  school_name?: string
  collapsedProgramCardsMobile?: boolean
  ctaConfiguration?: 'primary' | 'reverse' | 'secondary'
  isReferralParamRequired?: boolean
  isGaPage?: boolean
  isMicrositeThankyouPage?: boolean
  isMicrositePage?: boolean
  defaultLocale?: 'en-IN' | 'en-US' | 'es-ES' | 'fr-FR' | 'pt-BR' | undefined
  isLandingThankYouPageconfigured?: boolean
  navigatedOnThankYouPage?: boolean
  program_sfid?: string
  setSfid?: Dispatch<SetStateAction<string>>
  selectedProgramDetails?: SelectedProgramDetailType
}

export type PartnerContext = {
  contextValue?: { stickyPills: boolean }
  setContextValue?: Dispatch<
    SetStateAction<{
      stickyPills: boolean
    }>
  >
}

export const PageLayoutContext = createContext<Record<string, never> | LandingPageContext>({})

export function usePageLayoutContext() {
  const context = useContext(PageLayoutContext)

  if (!context) {
    throw new Error('Child components of Page Layout cannot be rendered outside the PageLayout component!')
  }

  return context
}
