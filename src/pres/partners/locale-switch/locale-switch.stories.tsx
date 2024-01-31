import LocaleSwitch from './locale-switch'

export default {
  title: 'Example/Locale Switch',
  component: LocaleSwitch
}

export const Default = () => <LocaleSwitch defaultLocaleOption="en-US" localeSwitchOptions={['en-US', 'es-ES', 'pt-BR']} />
