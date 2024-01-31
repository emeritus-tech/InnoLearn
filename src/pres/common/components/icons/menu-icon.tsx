interface Props {
  color?: string
}
export const MENU_ICON_COLORS = {
  WHITE: 'white',
  BLACK: 'black'
}

const MenuIcon = ({ color = MENU_ICON_COLORS.BLACK }: Props): JSX.Element => (
  <svg width="18" height="12" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 12h18v-2H0v2Zm0-5h18V5H0v2Zm0-7v2h18V0H0Z" fill={color} />
  </svg>
)

export default MenuIcon
