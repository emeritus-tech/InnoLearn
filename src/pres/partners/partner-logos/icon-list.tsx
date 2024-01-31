import React, { ReactElement, useMemo } from 'react'
import { splitArrayIntoChunks } from 'utils/common'

type IconListProps = {
  isExtraSmallDevice: boolean | undefined
  isMobileScreen: boolean | undefined
  isTabletAndDesktop: boolean | undefined
  isMediumDevice: boolean | undefined
  logos: ReactElement[]
}

const IconList: React.FC<IconListProps> = ({ isExtraSmallDevice, isMobileScreen, isTabletAndDesktop, isMediumDevice, logos }) => {
  const arrayChunkForAnyDevice = useMemo(() => {
    const arrayChunk = (chunk: number) => splitArrayIntoChunks({ arr: logos, chunk })
    return arrayChunk(
      isExtraSmallDevice
        ? 1 // 0px to 575px - 1 logo in a row
        : isMobileScreen
        ? 2 // 576px to 767px - 2 logos in a row
        : logos.length === 4 && isMediumDevice
        ? 2 // 768px to 1199px - 2 logos in a row (if logo lenth is 4)
        : logos.length === 4 && isTabletAndDesktop
        ? 4 // 1200px and above - 4 logos in row (if logo lenth is 4)
        : isTabletAndDesktop
        ? 3 // 768px to 1399px - 3 logos in row
        : 5 // >= 1400px - 5 logos in row
    )
  }, [isExtraSmallDevice, isMobileScreen, isTabletAndDesktop, isMediumDevice, logos])

  return (
    <>
      {arrayChunkForAnyDevice.map((chunk, index) => (
        <div key={index} className="display--flex logo-wrapper">
          {chunk}
        </div>
      ))}
    </>
  )
}

export default IconList
