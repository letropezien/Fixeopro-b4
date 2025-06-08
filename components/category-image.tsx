"use client"

import { useState } from "react"
import Image from "next/image"

interface CategoryImageProps {
  category: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
}

export function CategoryImage({ category, alt, className, fill, width, height }: CategoryImageProps) {
  const [imageError, setImageError] = useState(false)

  const imageSrc = imageError
    ? `/placeholder.svg?height=${height || 200}&width=${width || 300}&text=${category}`
    : `/images/categories/${category.toLowerCase().replace(/é/g, "e").replace(/è/g, "e")}.png`

  return (
    <Image
      src={imageSrc || "/placeholder.svg"}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}
