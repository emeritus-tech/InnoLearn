import { useEffect, useState } from 'react'
const useProgramDuration = (startDate: string, endTime: string) => {
  const [programDuration, setProgramDuration] = useState({})

  useEffect(() => {
    const getProgramDuration = () => {
      const diffTime = Math.abs(new Date().valueOf() - new Date(`${startDate}T${endTime}`).valueOf())
      let days = diffTime / (24 * 60 * 60 * 1000)
      let hours = (days % 1) * 24
      let minutes = (hours % 1) * 60
      let secs = (minutes % 1) * 60
      ;[days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)]
      return { days, hours, minutes, secs }
    }

    if (typeof window !== 'undefined') {
      const duration = getProgramDuration()
      setProgramDuration(duration)
    }
  }, [endTime, startDate])

  return programDuration
}

export default useProgramDuration
