interface LanguageTag {
  langTag: string
  prefix: string
}
declare global {
  interface Window {
    Navigator: { langugae: string }
  }
}

interface LanguageTags {
  [key: string]: LanguageTag
}

const languageTags: LanguageTags = {
  USD: {
    langTag: 'en-US',
    prefix: 'US'
  },
  INR: {
    langTag: 'en-IN',
    prefix: ''
  },
  CAD: {
    langTag: 'en-CA',
    prefix: 'C'
  },
  EUR: {
    langTag: 'en-US',
    prefix: ''
  }
}

interface NumberFormatterOptions {
  number: number
  currency: string
  style?: 'currency' | 'decimal'
  minDecimal?: number
  maxDecimal?: number
  userLocaleEnabled?: boolean
}

export const numberFormatter = ({
  number,
  currency = '',
  style = 'decimal',
  minDecimal = 0,
  maxDecimal = 0,
  userLocaleEnabled = false
}: NumberFormatterOptions): string => {
  const maximumFractionDigits = maxDecimal < minDecimal ? minDecimal : maxDecimal
  const currencyInfo = languageTags[currency.toUpperCase()]
  const langTag = currencyInfo?.langTag || 'en-US'
  const isCurrency = style.toLowerCase() === 'currency'
  let options: Intl.NumberFormatOptions = { style: 'decimal', minimumFractionDigits: minDecimal, maximumFractionDigits }
  if (isCurrency) {
    options = { style: 'currency', currency, minimumFractionDigits: minDecimal, maximumFractionDigits }
  }
  let formatter = new Intl.NumberFormat(langTag, options).format(number)
  let useLocale = langTag
  const currencyPrefix = currencyInfo?.prefix
  //Change to support Latm currency format
  if (userLocaleEnabled && typeof window !== 'undefined') {
    useLocale = window?.navigator.language
    const userLocaleOption: Intl.NumberFormatOptions = { useGrouping: true }
    const currencySymbol = new Intl.NumberFormat(useLocale, options).formatToParts(1).find((x) => x.type === 'currency')?.value || ''
    const currencyValue = new Intl.NumberFormat(useLocale, userLocaleOption).format(number)
    if (currencyInfo?.langTag !== useLocale) {
      formatter = `${currencySymbol}${currencyValue}`
    }
  }
  return userLocaleEnabled && currencyInfo?.langTag !== useLocale
    ? formatter
    : `${currencyPrefix && isCurrency ? currencyPrefix : ''}${formatter}`
}
