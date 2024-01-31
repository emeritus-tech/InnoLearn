import Select, { components, DropdownIndicatorProps, OptionProps, SingleValueProps } from 'react-select'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import GlobeIcon from 'pres/common/components/icons/globe-icon'
import ChevronDown from 'pres/common/components/icons/chevron-down'
import { LocaleOption } from 'types/LocaleSwitchTypes'
import { SUPPORTED_LOCALES } from 'constants/contentful'
import i18n from '../../../../i18n'

interface LocaleSwitchParams {
  localeSwitchOptions: string[]
  defaultLocaleOption: string
}

const SingleValue = (props: SingleValueProps<LocaleOption>) => {
  const { t, lang } = useTranslation('common')

  return (
    <components.SingleValue {...props}>
      <GlobeIcon />
      <div style={{ marginLeft: '8px' }}>{t(`locales.${lang || i18n.defaultLocale}`)}</div>
    </components.SingleValue>
  )
}

const DropdownIndicator = (props: DropdownIndicatorProps<LocaleOption>) => (
  <components.DropdownIndicator {...props}>
    <ChevronDown />
  </components.DropdownIndicator>
)

const Option = ({ children, ...props }: OptionProps<LocaleOption>) => {
  const { t } = useTranslation('common')

  return <components.Option {...props}>{t(`locales.${children}`)}</components.Option>
}

const localeOptionGenerator = (value: string, label: string): LocaleOption => ({ value, label })

const LocaleSwitch = ({ localeSwitchOptions, defaultLocaleOption }: LocaleSwitchParams) => {
  const router = useRouter()

  const handleOnChange = (option: LocaleOption | null) => {
    router.push(`/${option?.value}`)
  }

  const options = useMemo(
    () => localeSwitchOptions.map((locale) => localeOptionGenerator(SUPPORTED_LOCALES[locale as keyof typeof SUPPORTED_LOCALES], locale)),
    [localeSwitchOptions]
  )

  return (
    <Select
      onChange={handleOnChange}
      defaultValue={localeOptionGenerator(SUPPORTED_LOCALES[defaultLocaleOption as keyof typeof SUPPORTED_LOCALES], defaultLocaleOption)}
      isSearchable={false}
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: '35px',
          backgroundColor: 'white'
        }),
        singleValue: (base) => ({
          ...base,
          color: 'black',
          display: 'flex',
          alignItems: 'center'
        })
      }}
      components={{
        SingleValue,
        IndicatorSeparator: () => null,
        DropdownIndicator,
        Option
      }}
      name="locale"
      options={options}
      isMulti={false}
    />
  )
}

export default LocaleSwitch
