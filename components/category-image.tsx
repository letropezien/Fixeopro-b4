"use client"

import { useState } from "react"
import Image from "next/image"
import { CategoryImagesService } from "@/lib/category-images"

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

  // Utiliser le service pour obtenir l'image personnalisée ou par défaut
  const getImageSrc = () => {
    if (imageError) {
      return `/placeholder.svg?height=${height || 200}&width=${width || 300}&text=${category}`
    }

    const customImage = CategoryImagesService.getCategoryImage(category.toLowerCase())
    if (customImage?.imageUrl) {
      return customImage.imageUrl
    }

    // Image par défaut avec query pour génération automatique
    return `/placeholder.svg?height=${height || 200}&width=${width || 300}&query=réparation ${category} professionnel`
  }

  return (
    <Image
      src={getImageSrc() || "/placeholder.svg"}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}
