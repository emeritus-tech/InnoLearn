import { SUPPORTED_LOCALES } from 'constants/contentful'

export const searchPath = (locale: string, schoolId?: number): string => {
  const host = process.env.NEXT_PUBLIC_APP_ENV !== 'production' ? process.env.NEXT_PUBLIC_SEARCH_APPLICATION_BASE_URL : ''

  let queryParams = 'page=1&per_page=12'
  if (schoolId) {
    queryParams += `&q[school_id_in][]=${schoolId}`
  }

  const result = `${host}/search/${SUPPORTED_LOCALES[locale as keyof typeof SUPPORTED_LOCALES]}?${queryParams}`

  return result
}
