/* eslint-disable no-console */
import { Controller, useForm } from 'react-hook-form'
import SelectForm from './select-form'

export default {
  title: 'Select Form',
  component: SelectForm
}

export const Default = () => {
  const { control, setValue, handleSubmit, unregister } = useForm()
  const options = [
    { value: 'US', label: 'United States' },
    { value: 'AR', label: 'Argentina' }
  ]

  return (
    <form
      onSubmit={handleSubmit(
        (data) => console.log(data),
        (e) => console.log(e)
      )}
    >
      <Controller
        key="attributeName"
        name="work_experience"
        control={control}
        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error } }) => (
          <SelectForm
            fieldType="generic"
            attributeName={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            ref={ref}
            setValue={setValue}
            error={error}
            placeholder="Label"
            options={options}
            defaultValue={options[0]}
            unregister={unregister}
          />
        )}
      />
      <input type="submit" />
    </form>
  )
}

export const Required = () => {
  const { control, setValue, handleSubmit, unregister } = useForm()
  const options = [
    { value: 'US', label: 'United States' },
    { value: 'AR', label: 'Argentina' }
  ]

  return (
    <form
      onSubmit={handleSubmit(
        (data) => console.log(data),
        (e) => console.log(e)
      )}
    >
      <Controller
        key="attributeName"
        name="work_experience"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error } }) => (
          <SelectForm
            fieldType="generic"
            attributeName={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            ref={ref}
            setValue={setValue}
            error={error}
            placeholder="Label"
            options={options}
            unregister={unregister}
          />
        )}
      />
      <input type="submit" />
    </form>
  )
}

export const Country = () => {
  const { control, setValue, handleSubmit, unregister } = useForm()
  const options = [
    { value: 'US', label: 'United States' },
    { value: 'AR', label: 'Argentina' }
  ]

  return (
    <form
      onSubmit={handleSubmit(
        (data) => console.log(data),
        (e) => console.log(e)
      )}
    >
      <Controller
        key="country"
        name="country"
        control={control}
        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error } }) => (
          <SelectForm
            className="pb-3"
            fieldType="country"
            attributeName={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            ref={ref}
            placeholder="Label"
            error={error}
            options={options}
            setValue={setValue}
            unregister={unregister}
          />
        )}
      />
      <input type="submit" />
    </form>
  )
}
