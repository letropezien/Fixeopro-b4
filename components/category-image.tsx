"use client"

import { useState } from "react"
import Image from "next/image"
import { CategoryImagesService } from "@/lib/category-images"

interface CategoryImageProps {
  category: string
  alt?: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
}

export function CategoryImage({ category, alt, className, fill, width, height, priority = false }: CategoryImageProps) {
  const [imageError, setImageError] = useState(false)

  const getImageSrc = () => {
    if (imageError) {
      return `/placeholder.svg?height=${height || 300}&width=${width || 400}&text=${category}`
    }

    // Utiliser l'image personnalisée si elle existe
    const customImage = CategoryImagesService.getCategoryImage(category.toLowerCase())
    if (customImage?.imageUrl) {
      return customImage.imageUrl
    }

    // Utiliser l'image par défaut du dossier public
    const defaultImages: Record<string, string> = {
      electromenager: "/images/categories/electromenager.png",
      informatique: "/images/categories/informatique.png",
      plomberie: "/images/categories/plomberie.png",
      electricite: "/images/categories/electricite.png",
      chauffage: "/images/categories/chauffage.png",
      serrurerie: "/images/categories/serrurerie.png",
      multimedia: "/images/categories/multimedia.png",
      telephonie: "/images/categories/telephonie.png",
      climatisation: "/images/categories/climatisation.png",
    }

    return (
      defaultImages[category.toLowerCase()] ||
      `/placeholder.svg?height=${height || 300}&width=${width || 400}&query=réparation ${category} professionnel`
    )
  }

  const getAltText = () => {
    if (alt) return alt

    const altTexts: Record<string, string> = {
      electromenager: "Technicien réparant électroménager - lave-linge, lave-vaisselle, réfrigérateur",
      informatique: "Expert informatique réparant ordinateur portable - dépannage PC professionnel",
      plomberie: "Plombier professionnel réparant fuite d'eau - intervention urgente",
      electricite: "Électricien travaillant sur tableau électrique - installation sécurisée",
      chauffage: "Technicien chauffagiste entretenant chaudière - système de chauffage",
      serrurerie: "Serrurier installant serrure de sécurité - blindage de porte",
      multimedia: "Technicien installant système home cinéma - équipement audiovisuel",
      telephonie: "Réparateur changeant écran smartphone - réparation mobile express",
      climatisation: "Frigoriste installant climatisation - système de refroidissement",
    }

    return altTexts[category.toLowerCase()] || `Réparation ${category} professionnel`
  }

  return (
    <Image
      src={getImageSrc() || "/placeholder.svg"}
      alt={getAltText()}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      priority={priority}
      onError={() => setImageError(true)}
      sizes={fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined}
    />
  )
}
