import Button, { BUTTON_STYLES } from '../src/pres/common/components/button'

export default {
  title: 'Example/Button',
  component: Button
}

export const Default = () => (
  <Button styleType={BUTTON_STYLES.PRIMARY} onClick={console.log}>
    Test Button
  </Button>
)

export const Link = () => (
  <Button styleType={BUTTON_STYLES.LINK} onClick={console.log}>
    Test Button
  </Button>
)
