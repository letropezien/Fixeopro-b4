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
      electromenager: "/images/categories/electromenager.jpg",
      informatique: "/images/categories/informatique.jpg",
      plomberie: "/images/categories/plomberie.jpg",
      electricite: "/images/categories/electricite.jpg",
      chauffage: "/images/categories/chauffage.jpg",
      serrurerie: "/images/categories/serrurerie.jpg",
      multimedia: "/images/categories/multimedia.jpg",
      telephonie: "/images/categories/telephonie.jpg",
      climatisation: "/images/categories/climatisation.jpg",
      vitrerie: "/images/categories/vitrerie.jpg",
      menuiserie: "/images/categories/menuiserie.jpg",
      jardinage: "/images/categories/jardinage.jpg",
      automobile: "/images/categories/automobile.jpg",
      nettoyage: "/images/categories/nettoyage.jpg",
      demenagement: "/images/categories/demenagement.jpg",
      electronique: "/images/categories/electronique.jpg",
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
      vitrerie: "Vitrier remplaçant vitre cassée - installation double vitrage",
      menuiserie: "Menuisier fabriquant meuble sur mesure - réparation porte en bois",
      jardinage: "Jardinier réparant tondeuse - entretien outils de jardinage",
      automobile: "Mécanicien réparant voiture - diagnostic automobile professionnel",
      nettoyage: "Service de nettoyage professionnel - désinfection maison et bureau",
      demenagement: "Service de déménagement - transport de meubles sécurisé",
      electronique: "Réparation appareils électroniques - TV, console, appareil photo",
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
