export const currentResolution = (
  isTabletActive: boolean | undefined,
  isMobileScreen: boolean | undefined,
  isTabletLandscape: boolean | undefined,
  isWiderDesktop: boolean | undefined,
  isLargerDevice: boolean | undefined
) => {
  if (isTabletLandscape) {
    return 'isTabletLandscape'
  } else if (isWiderDesktop) {
    return 'isDesktop'
  } else if (isLargerDevice) {
    return 'isLargerDevice'
  } else if (isMobileScreen) {
    return 'isMobile'
  } else if (isTabletActive) {
    return 'isTablet'
  } else return ''
}
