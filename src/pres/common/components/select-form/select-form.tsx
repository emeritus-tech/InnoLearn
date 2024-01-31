import cn from 'classnames'
import { useEffect, useMemo, forwardRef, useContext, useState, useRef } from 'react'
import Select, { components, ControlProps, DropdownIndicatorProps } from 'react-select'
import axios from 'axios'
import { Document } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BluePrintModal } from '@emeritus-engineering/blueprint-core-components/blueprint-modal'
import { FieldError, FieldValues, Noop, UseFormSetValue, UseFormUnregister } from 'react-hook-form'
import { useRouter } from 'next/router'
import ChevronDown from 'pres/common/components/icons/chevron-down'
import { TypeFormFieldSelectFields, TypeFormSelectOptionsFields } from 'types/contentful-types'
import { INPUT_TYPES_SUPPORTED, SELECT_TYPES_SUPPORTED } from 'constants/contentful'
import useCountries from 'hooks/useCountries'
import { buildLandingPageTrackingData, triggerTrackPoint } from 'utils/trackpoint'
import { ACTION_TYPES, SECTION_NAMES, EVENT_NAME, EVENT_SOURCE, EVENT_TYPE } from 'constants/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import styles from './select-form.module.scss'

export type SelectFormOptions = Omit<TypeFormSelectOptionsFields, 'contentfulName'>

interface SelectFormProps extends Omit<TypeFormFieldSelectFields, 'contentfulName' | 'defaultValue' | 'optionList' | 'label' | 'required'> {
  defaultValue?: SelectFormOptions
  options: SelectFormOptions[]
  placeholder: string
  className?: string
  id?: string
  error?: FieldError
  horizontalView?: boolean
  onChange: (...event: any[]) => void
  onBlur: Noop
  value: SelectFormOptions
  setValue: UseFormSetValue<FieldValues>
  unregister: UseFormUnregister<FieldValues>
  formTitle?: string
  sectionDetails?: { sectionName?: string; sectionTitle?: string }
}

const DropdownIndicator = (props: DropdownIndicatorProps<SelectFormOptions, false>) => (
  <components.DropdownIndicator {...props}>
    <ChevronDown />
  </components.DropdownIndicator>
)

interface CustomControlProps extends ControlProps<SelectFormOptions, false> {
  placeholder: string
  error: boolean
}
const CustomControl = ({ placeholder, error, isFocused, hasValue, ...rest }: CustomControlProps) => {
  const isFloating = (isFocused || hasValue) && !error

  return (
    <>
      {isFloating && <span className={styles.floatingPlaceholder}/>}
      <components.Control isFocused={isFocused} hasValue={hasValue} {...rest} />
    </>
  )
}

const SelectForm = forwardRef<any, SelectFormProps>(
  (
    {
      className,
      options,
      defaultValue,
      placeholder,
      attributeName,
      error,
      id,
      fieldType,
      onChange,
      onBlur,
      value,
      unregister,
      setValue,
      formTitle,
      sectionDetails,
      infoModal,
      horizontalView
    }: SelectFormProps,
    ref
  ) => {
    const countriesOptions = useCountries()
    const { program, screenName } = useContext(PageLayoutContext)
    const [showPopupMessage, setShowPopupMessage] = useState(false)
    const [selectValue, setSelectValue] = useState(value)
    const selectRef = useRef<TypeFormSelectOptionsFields | null>(null)
    const { query, isReady } = useRouter()

    const handleChange = (attributeName: string) => {
      triggerTrackPoint(
        EVENT_TYPE.FOCUS,
        buildLandingPageTrackingData(
          EVENT_NAME.LEAD_FORM,
          EVENT_SOURCE.CLIENT,
          sectionDetails?.sectionName || SECTION_NAMES.SECTION,
          ACTION_TYPES.FIELD,
          attributeName,
          formTitle || sectionDetails?.sectionTitle,
          placeholder,
          program,
          screenName
        )
      )
    }

    const selectOptions: SelectFormOptions[] = useMemo(
      () => (fieldType === SELECT_TYPES_SUPPORTED.country ? countriesOptions : options),
      [fieldType, options, countriesOptions]
    )

    const controlWrapper = (props: ControlProps<SelectFormOptions, false>) => {
        const invalid = fieldType === 'workExperience' && error ? 'invalid': ''
        return <CustomControl className={`lp-select--height-control text-color ${invalid}`} placeholder={placeholder} error={!!error} {...props} />
    }

    const controlInput = (inputProps: any) => <components.Input {...inputProps} autoComplete="nope" />

    useEffect(() => {
      async function loadDefaultValue() {
        if (fieldType === SELECT_TYPES_SUPPORTED.country) {
          const { data: countryFromDataScienceAPI = { userCountry: {} } } = await axios.get(
            `${process.env.NEXT_PUBLIC_HOST_NAME || ''}/api/countries`
          )
          let userCountry:
            | {
                label: string
                value: string
              }
            | undefined
          if (!countryFromDataScienceAPI.userCountry?.value && !countryFromDataScienceAPI.userCountry?.label) {
            try {
              const { data = {} } = await axios.get('https://api.db-ip.com/v2/free/self')
              userCountry = countriesOptions.find((country) => country.value === data?.countryCode)
              setValue(attributeName, userCountry || defaultValue)
            } catch (e) {
              setValue(attributeName, defaultValue)
            }
          } else {
            setValue(attributeName, countryFromDataScienceAPI.userCountry)
          }
          setTimeout(
            () =>
              program &&
              window.trackPoint &&
              isReady &&
              !query?.thank_you &&
              triggerTrackPoint(
                EVENT_TYPE.AUTOFILL,
                buildLandingPageTrackingData(EVENT_NAME.AUTOFILL_COUNTRY, EVENT_SOURCE.CLIENT, '', '', '', '', '', program, screenName, {
                  code: countryFromDataScienceAPI.userCountry?.value || userCountry?.value || (defaultValue || countriesOptions[0]).value,
                  source: EVENT_SOURCE.IP
                })
              ),
            1000
          )
        } else {
          setValue(attributeName, defaultValue)
        }
      }
      loadDefaultValue()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      value && setSelectValue(value)
    }, [value])

    const handleSelectChange = (el: any) => {
      unregister(INPUT_TYPES_SUPPORTED.phone)
      el?.showInfoModal ? setShowPopupMessage(true) : (selectRef.current = { ...el })
      onChange(el)
    }
    const handleModalClose = () => {
      setShowPopupMessage(false)
      setValue(attributeName, selectRef.current)
    }
    return (
      <>
        <div className="select-form-error-fix">
          <Select<SelectFormOptions, false>
            ref={ref}
            className={className}
            onChange={handleSelectChange}
            onBlur={onBlur}
            onFocus={
              program
                ? () => {
                    !error && handleChange(attributeName)
                  }
                : undefined
            }
            defaultValue={defaultValue}
            isSearchable={fieldType === SELECT_TYPES_SUPPORTED.country}
            value={selectValue}
            id={id}
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator,
              Control: controlWrapper,
              Input: controlInput
            }}
            aria-label={attributeName}
            name={attributeName}
            placeholder={placeholder}
            options={selectOptions}
            isMulti={false}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                boxShadow: error ? 'none' : baseStyles.boxShadow,
                borderColor: error ? 'red' : baseStyles.borderColor,
                ':hover': {
                  borderColor: error ? 'red' : baseStyles[':hover']?.borderColor
                },
                width: 'inherit',
                height: '50px'
              }),
              placeholder: (baseStyles, state) => ({
                ...baseStyles,
                color: state.isFocused && !error ? 'transparent' : baseStyles.color
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                zIndex: 2
              })
            }}
          />
          {error && (
            <>
            <span role="alert" className={cn(horizontalView ? 'text-b3 text-error' : styles.error)}>
            <span className="blueprint-icon icon-warning error-icon"/>
              {error?.type as string}
            </span>
            </>
          )}
          {showPopupMessage && (
            <BluePrintModal modalSize="large" isFluidLayout closeOverlay={handleModalClose} closeOnBackgroudClick>
              <div className={styles.modalContentWrapper}>{infoModal && documentToReactComponents(infoModal as Document)}</div>
            </BluePrintModal>
          )}
        </div>
      </>
    )
  }
)

export default SelectForm
