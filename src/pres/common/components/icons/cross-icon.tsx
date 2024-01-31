/* eslint-disable max-len  */
interface Props {
  color?: string
}
export const CROSS_ICON_COLORS = {
  WHITE: 'white',
  BLACK: 'black'
}
const CrossIcon = ({ color = CROSS_ICON_COLORS.WHITE }: Props): JSX.Element => (
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="16" width="16" data-testid="cross-icon">
    <path
      fill={color}
      d="M16 1.61143L14.3886 0L8 6.38857L1.61143 0L0 1.61143L6.38857 8L0 14.3886L1.61143 16L8 9.61143L14.3886 16L16 14.3886L9.61143 8L16 1.61143Z"
    />
  </svg>
)

export default CrossIcon
