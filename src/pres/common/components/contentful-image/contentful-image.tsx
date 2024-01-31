import { Asset } from 'contentful'
import Image, { ImageProps } from 'next/image'
import { useMemo } from 'react'
import { getAssetTypeContent, imageLoader } from 'utils/contentful'

interface ContentfulImageProps extends Omit<ImageProps, 'src'> {
  src: Asset | string | undefined
  title?: string
}

function ContentfulImage({ src, ...props }: ContentfulImageProps) {
  const source = useMemo(() => getAssetTypeContent(src), [src])

  if (!source) return null
  const extension = source.split('.').pop() || ''
  const modifiedSource = !['svg', 'webp'].includes(extension) ? `${source}?fm=webp` : source

  return <Image src={modifiedSource} {...props} loader={imageLoader} />
}

export default ContentfulImage
