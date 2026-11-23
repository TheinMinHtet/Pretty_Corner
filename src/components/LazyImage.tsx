'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

export default function LazyImage({
  className = '',
  priority = false,
  alt,
  fill,
  onLoad,
  ...props
}: ImageProps) {
  const srcKey = typeof props.src === 'string' ? props.src : JSON.stringify(props.src);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(priority ? srcKey : null);
  const isLoaded = priority || loadedSrc === srcKey;

  const handleLoad: ImageProps['onLoad'] = (event) => {
    setLoadedSrc(srcKey);
    if (onLoad) {
      onLoad(event);
    }
  };

  if (fill) {
    return (
      <>
        {!isLoaded && (
          <div
            aria-hidden="true"
            className="absolute inset-0 skeleton-shimmer pointer-events-none"
          />
        )}
        <Image
          {...props}
          fill
          alt={alt}
          priority={priority}
          loading={priority ? undefined : props.loading ?? 'lazy'}
          onLoad={handleLoad}
          className={className}
        />
      </>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 skeleton-shimmer pointer-events-none"
        />
      )}
      <Image
        {...props}
        alt={alt}
        priority={priority}
        loading={priority ? undefined : props.loading ?? 'lazy'}
        onLoad={handleLoad}
        className={className}
      />
    </div>
  );
}
