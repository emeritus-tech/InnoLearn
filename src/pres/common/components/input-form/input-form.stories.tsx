import { useForm } from 'react-hook-form'
import InputForm from './input-form'

export default {
  title: 'InputForm',
  component: InputForm
}

export const CityField = () => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({ mode: 'onBlur' })

  return (
    <form>
      <InputForm
        setValue={setValue}
        getValues={getValues}
        countryCode={{ value: 'IN', label: 'India' }}
        register={register}
        errors={errors}
        id="test"
        placeholder="Test Label"
        attributeName="city"
        fieldType="city"
        label="Test Label"
        required
      />
    </form>
  )
}

export const EmailField = () => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({ mode: 'onBlur' })

  return (
    <form>
      <InputForm
        setValue={setValue}
        getValues={getValues}
        register={register}
        errors={errors}
        id="test"
        placeholder="Test Label"
        attributeName="email"
        fieldType="email"
        label="Test Label"
        required
      />
    </form>
  )
}

export const Phone = () => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({ mode: 'onBlur' })

  return (
    <form>
      <InputForm
        setValue={setValue}
        getValues={getValues}
        register={register}
        errors={errors}
        id="test"
        placeholder="Phone Number"
        attributeName="phone"
        fieldType="phone"
        label="Phone Number"
        required
      />
    </form>
  )
}
