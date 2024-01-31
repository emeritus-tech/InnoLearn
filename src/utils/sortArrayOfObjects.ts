// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortArrayOfObjects = <T extends Record<string, any>>({
  array,
  sortByKey,
  sortType
}: {
  array: T[]
  sortByKey: string
  sortType: 'asc' | 'desc'
}): T[] => {
  array.sort((a: T, b: T) => {
    if (sortType === 'asc') {
      return a[sortByKey] - b[sortByKey]
    } else {
      return b[sortByKey] - a[sortByKey]
    }
  })
  return array
}
