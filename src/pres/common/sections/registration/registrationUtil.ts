type constructApplyNowUrlArgs = {
  inputUrl: string
  sfid: string | undefined
  locale: string | undefined
}

const constructApplyNowUrl = ({ inputUrl, sfid = '', locale = '' }: constructApplyNowUrlArgs): string => {
  const parsedUrl = new URL(inputUrl)
  const outputSearchParams = new URLSearchParams()
  parsedUrl.searchParams.forEach((value, key) => {
    if (key.startsWith('utm_')) {
      outputSearchParams.append(key, value)
    }
  })
  const utmQueryString = outputSearchParams.toString()
  let outputUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`
  outputUrl += `?locale=${locale}&program_sfid=${sfid}&source=applynowlp`
  outputUrl += utmQueryString !== '' ? `&${utmQueryString}` : ''
  return outputUrl
}

export default constructApplyNowUrl
