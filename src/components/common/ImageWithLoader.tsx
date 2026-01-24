import { useState } from 'react'
import type { ImgHTMLAttributes } from 'react'
import { KynaSpinner } from './PageLoader'

export type ImageWithLoaderProps = {
  src: string
  alt: string
  containerClassName?: string
  imageClassName?: string
  loading?: ImgHTMLAttributes<HTMLImageElement>['loading']
  spinnerSize?: number
}

export function ImageWithLoader({
  src,
  alt,
  containerClassName = '',
  imageClassName = '',
  loading = 'lazy',
  spinnerSize = 38,
}: ImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative ${containerClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="absolute inset-0">
            <div className="kyna-shimmer-bg h-full w-full" />
          </div>
          <div className="relative flex items-center justify-center">
            <KynaSpinner size={spinnerSize} />
          </div>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        className={`block h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imageClassName}`}
      />
    </div>
  )
}

