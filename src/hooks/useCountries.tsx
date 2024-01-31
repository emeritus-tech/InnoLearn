import useTranslation from 'next-translate/useTranslation'
import { useMemo } from 'react'
import countryList from '../../locales/en-US/countries.json'

const useCountries = () => {
  const { t } = useTranslation('countries')
  const { countries } = countryList

  const countriesOptions = useMemo(() => Object.keys(countries).map((c) => ({ value: c, label: t(`countries.${c}`) })), [countries, t])

  return countriesOptions
}

export default useCountries
