import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormUnregister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormGetValues
} from 'react-hook-form'
import { useContext } from 'react'
import { dynamicFieldsContentTypes, SELECT_TYPES_SUPPORTED } from 'constants/contentful'
import { TypeFormFieldInputFields, TypeFormFieldSelectFields, TypeFormGroupRadioFields } from 'types/contentful-types'
import { EVENT_NAME, SECTION_NAMES, ACTION_TYPES, EVENT_SOURCE } from 'constants/trackpoint'
import { buildLandingPageTrackingData, triggerTrackPoint } from 'utils/trackpoint'
import { PageLayoutContext } from 'hooks/usePageLayoutContext'
import SelectForm from '../select-form'
import InputForm from '../input-form'

interface FieldsFactoryProps {
  contentTypeId: string
  fields: TypeFormFieldSelectFields | TypeFormFieldInputFields | TypeFormGroupRadioFields
  control: Control<FieldValues, any>
  setValue: UseFormSetValue<FieldValues>
  getValues: UseFormGetValues<FieldValues>
  register: UseFormRegister<FieldValues>
  trigger: UseFormTrigger<FieldValues>
  unregister: UseFormUnregister<FieldValues>
  errors: FieldErrors<FieldValues>
  watch: any
  autoComplete?: string
  formTitle?: string
  pattern?: { value: RegExp; message: string }
  sectionDetails?: { sectionName?: string; sectionTitle?: string }
  horizontalView?: boolean
  isGaPage?: boolean
}

function FieldsFactory({
  contentTypeId,
  fields,
  autoComplete,
  pattern,
  control,
  setValue,
  getValues,
  register,
  trigger,
  unregister,
  errors,
  watch,
  formTitle,
  sectionDetails,
  horizontalView,
  isGaPage
}: FieldsFactoryProps) {
  const { program, screenName } = useContext(PageLayoutContext)

  const handleChange = (attributeName: string, label: string) => {
    triggerTrackPoint(
      'click',
      buildLandingPageTrackingData(
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
    )
  }
  if (contentTypeId === dynamicFieldsContentTypes.select) {
    const { optionList = [], attributeName, defaultValue, fieldType, required, label, infoModal } = fields as TypeFormFieldSelectFields
    return (
      <Controller
        name={attributeName}
        control={control}
        rules={{ required }}
        render={({ field: { onChange, onBlur, name, ref }, fieldState: { error } }) => (
          <SelectForm
            className="mb-3 control-fnt cmn-dropdown"
            ref={ref}
            defaultValue={defaultValue?.fields}
            fieldType={fieldType}
            attributeName={name}
            onChange={(e) => {
              onChange(e)
              program && fieldType && handleChange(attributeName, label)
            }}
            onBlur={onBlur}
            value={watch(attributeName)}
            unregister={unregister}
            options={optionList.map(({ fields }) => fields)}
            placeholder={label}
            error={error}
            setValue={setValue}
            formTitle={formTitle}
            sectionDetails={sectionDetails}
            infoModal={infoModal}
            horizontalView={horizontalView}
          />
        )}
      />
    )
  }

  if (contentTypeId === dynamicFieldsContentTypes.input) {
    const { attributeName, label, required, fieldType, placeholder, defaultValue } = fields as TypeFormFieldInputFields
    return (
      <InputForm
        className="mb-3"
        autoComplete={autoComplete}
        attributeName={attributeName}
        register={register}
        fieldType={fieldType}
        required={required}
        label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
        setValue={setValue}
        getValues={getValues}
        trigger={trigger}
        errors={errors}
        countryCode={watch(SELECT_TYPES_SUPPORTED.country)}
        formTitle={formTitle}
        sectionDetails={sectionDetails}
        pattern={pattern}
        horizontalView={horizontalView}
        isGaPage={isGaPage}
      />
    )
  }

  return null
}

export default FieldsFactory
