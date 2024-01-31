import { FieldErrors, FieldValues, UseFormRegister, UseFormSetValue, UseFormTrigger, UseFormGetValues } from 'react-hook-form'
import cn from 'classnames'
import { InputHTMLAttributes, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { TypeFormFieldInputFields } from 'types/contentful-types'
import { countries } from 'constants/countries'
import { INPUT_TYPES_SUPPORTED } from 'constants/contentful'
import { buildLandingPageTrackingData, buildTPClickEvent } from 'utils/trackpoint'
import { ACTION_TYPES, SECTION_NAMES, EVENT_NAME, EVENT_SOURCE } from 'constants/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import { SelectFormOptions } from '../select-form/select-form'
import styles from './input-form.module.scss'

interface InputFieldProps
  extends Omit<TypeFormFieldInputFields, 'contentfulName'>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'required' | 'placeholder' | 'pattern'> {
  id?: string
  register: UseFormRegister<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  getValues: UseFormGetValues<FieldValues>
  trigger?: UseFormTrigger<FieldValues>
  errors?: FieldErrors<FieldValues>
  className?: string
  autoComplete?: string
  inputClassName?: string
  countryCode?: SelectFormOptions
  formTitle?: string
  sectionDetails?: { sectionName?: string; sectionTitle?: string }
  pattern?: { value: RegExp; message: string }
  horizontalView?: boolean
  isGaPage?: boolean
}

const InputForm = ({
  register,
  setValue,
  getValues,
  trigger,
  id,
  errors = {},
  fieldType,
  label,
  placeholder,
  attributeName,
  required,
  autoComplete = 'off',
  className,
  inputClassName,
  countryCode,
  sectionDetails,
  formTitle,
  pattern,
  horizontalView,
  isGaPage,
  ...rest
}: InputFieldProps) => {
  const { t } = useTranslation('leadForm')
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const { program, screenName } = useContext(PageLayoutContext)
  const isCityField = fieldType === INPUT_TYPES_SUPPORTED.city
  const isPhoneField = fieldType === INPUT_TYPES_SUPPORTED.phone
  const phoneFieldIndiaValidation = {
    required: true,
    pattern: {
      value: /^(?:\+91 )?\d{10}$/,
      message: t('phoneErrorTxt')
    }
  }
  const validationRules =
    !isGaPage && isPhoneField && countryCode?.value === 'IN'
      ? phoneFieldIndiaValidation
      : {
          required,
          ...(pattern && { pattern })
        }
  const { onChange, onBlur, name, ref } = register(attributeName, validationRules as Record<string, unknown>)
  const [suggestions, setSuggestions] = useState([])
  // NOTE: This line is commented bacause we are waiting for dialcode feature definition
  // const [dialCode, setDialCode] = useState<string | undefined>()

  const currentCountry = useMemo(() => {
    return countries.find((country) => country.code === countryCode?.value)
  }, [countryCode])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const getCities = useCallback(async () => {
    let cities = []
    if (countryCode?.value === 'IN') {
      const response = await fetch('https://dxgkvabyzb3mr.cloudfront.net/india-cities.json')
      const responseJson = await response?.json()
      cities = responseJson?.cities.map((city: string) => city)
    }
    return cities
  }, [countryCode?.value])

  useEffect(() => {
    async function initCities() {
      const cities = await getCities()
      setSuggestions(cities)
      setShowSuggestions(!!cities?.length)
    }
    if (isCityField && countryCode) {
      initCities()
    }
    // NOTE: This is commented bacause we are waiting for dialcode feature definition
    // if (isPhoneField && countryCode) {
    //   setDialCode(currentCountry?.dial_code)
    //   setValue(attributeName, currentCountry?.dial_code)
    // }
    if (isPhoneField) {
      const phoneValue = getValues(attributeName)?.split(' ')[1]?.length > 0
      setValue(
        attributeName,
        getValues(attributeName)?.indexOf('+') > -1 && phoneValue
          ? `${getValues(attributeName)}`
          : currentCountry
          ? `${currentCountry?.display_dial_code} `
          : ''
      )
    }
  }, [
    attributeName,
    countryCode,
    currentCountry,
    currentCountry?.display_dial_code,
    fieldType,
    getCities,
    getValues,
    isCityField,
    isPhoneField,
    setValue
  ])

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const userInput = e.currentTarget.value
    const inputLength = userInput.length

    if (!inputLength) {
      setFilteredSuggestions([])
    } else {
      const tempSuggestions = suggestions.filter(
        (suggestion: string) => suggestion.toLowerCase().slice(0, inputLength) === userInput.toLowerCase()
      )
      setFilteredSuggestions(tempSuggestions)
      setShowSuggestions(true)
    }
    setValue(attributeName, userInput)
  }

  const handleFocus = () => null

  const handleOnBlur = () => {
    setShowSuggestions(true)
    // onBlur(e)
  }

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setValue(attributeName, e.currentTarget.innerText)
    setFilteredSuggestions([])
  }

  // NOTE: This is commented bacause we are waiting for dialcode feature definition
  // const handleOnChangeDialCode = (event: ChangeEvent<HTMLSelectElement>) => {
  //   if(isPhoneField){
  //     setDialCode(event.target.value)
  //     setValue(attributeName, event.target.value)
  //   }
  // }

  return (
    <div className={cn('form-group', className, styles.formGroup)} data-testid="input-form">
      <div className={styles.inputContainer}>
        {/*   // NOTE: This is commented bacause we are waiting for dialcode feature definition */}
        {/* {isPhoneField ?
          <select className={styles.selectDialCode} value={dialCode} onChange={handleOnChangeDialCode}>
            {countries.map((country) =>
              <option
                key={country.name}
                value={country.dial_code}>
                  {country.emoji} {country.dial_code}
              </option>)
            }
          </select>
        : null} */}
        <input
          onChange={isCityField ? handleOnChange : onChange}
          onBlur={(event) => {
            trigger && trigger(attributeName)
            isCityField ? handleOnBlur() : onBlur(event)
          }}
          onFocus={handleFocus}
          name={attributeName}
          aria-label={attributeName}
          ref={ref}
          type={isPhoneField ? 'tel' : fieldType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          id={id}
          className={cn(styles.inputField, inputClassName, { [styles.inputFieldInvalid]: errors[name] })}
          data-track={
            program
              ? buildTPClickEvent({
                  type: 'focus',
                  ...buildLandingPageTrackingData(
                    EVENT_NAME.LEAD_FORM,
                    EVENT_SOURCE.CLIENT,
                    sectionDetails?.sectionName || SECTION_NAMES.SECTION,
                    ACTION_TYPES.FIELD,
                    attributeName,
                    formTitle || sectionDetails?.sectionTitle,
                    label,
                    program,
                    screenName
                  )
                })
              : undefined
          }
          {...rest}
        />
        {showSuggestions ? (
          <ul className={filteredSuggestions.length ? styles.suggestions : 'd-none'}>
            {filteredSuggestions.map((suggestion) => {
              return (
                <li key={suggestion}>
                  <button onClick={handleOnClick} className={styles.suggestion}>
                    {suggestion}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}
        <label className={cn('text-weight-regular', styles.formControlLabel)} htmlFor={id}>
          {label}
        </label>
      </div>
      {errors[name] && (
        <span className={cn('text-b3', horizontalView ? 'text-error' : styles.labelRequired)}>
          <span className="blueprint-icon icon-warning error-icon"/>
          {errors[name]?.type === 'required' ? t('required') : errors[name]?.message?.toString()}
        </span>
      )}
    </div>
  )
}

export default InputForm
