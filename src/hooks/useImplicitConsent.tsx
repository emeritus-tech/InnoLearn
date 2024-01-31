import { useMemo } from 'react'
import { BRAZIL, GDPR_COUNTRIES, NON_GDPR_MORE_CAUTIOUS_COUNTRIES, UNITED_STATES } from 'constants/countries'

const EXPLICIT_CONSENT = 'explicit'
const DEFAULT_CONSENT = 'default'
const IMPLICIT_CONSENT = 'implicit'
const PORTUGUESE_PROGRAM_LANG = 'pt'

const useImplicitConsent = (
  currentCountryCode: string,
  gdprType: string,
  nonGdprLessCautiousType: string,
  nonGdprMoreCautiousType: string,
  programId: number,
  programLanguage: string,
  schoolCountry: string
) => {
  return useMemo(() => {
    if (currentCountryCode == BRAZIL && programLanguage == PORTUGUESE_PROGRAM_LANG) {
      return true
    } else if (GDPR_COUNTRIES.includes(currentCountryCode)) {
      // Need to show checkbox for the GDPR countries when the GDPR type is not implict
      return gdprType === IMPLICIT_CONSENT
    } else if (NON_GDPR_MORE_CAUTIOUS_COUNTRIES.includes(currentCountryCode)) {
      if (nonGdprMoreCautiousType === DEFAULT_CONSENT) {
        return schoolCountry === UNITED_STATES
      } else {
        return nonGdprMoreCautiousType !== EXPLICIT_CONSENT
      }
    } else if (process.env.GDPR_IMPLICIT_PROGRAMS?.split(';').includes(programId.toString())) {
      return true
    } else {
      return nonGdprLessCautiousType !== EXPLICIT_CONSENT
    }
  }, [currentCountryCode, gdprType, nonGdprLessCautiousType, nonGdprMoreCautiousType, programId, programLanguage, schoolCountry])
}

export default useImplicitConsent
