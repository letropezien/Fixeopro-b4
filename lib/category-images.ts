export interface CategoryImage {
  id: string
  name: string
  imageUrl: string
  uploadedAt: Date
  seoAlt: string
  seoTitle: string
}

export class CategoryImagesService {
  private static readonly STORAGE_KEY = "fixeopro_category_images"

  static getCategories(): string[] {
    return [
      "electromenager",
      "informatique",
      "plomberie",
      "electricite",
      "chauffage",
      "serrurerie",
      "multimedia",
      "telephonie",
      "climatisation",
    ]
  }

  static getCategoryConfig() {
    return {
      electromenager: {
        name: "Électroménager",
        seoTitle: "Réparation Électroménager - Dépannage Rapide à Domicile",
        seoAlt: "Technicien réparant électroménager - lave-linge, lave-vaisselle, réfrigérateur",
        imageUrl: "/images/categories/electromenager.png",
        keywords: ["réparation électroménager", "dépannage lave-linge", "réparateur frigo", "service à domicile"],
      },
      informatique: {
        name: "Informatique",
        seoTitle: "Dépannage Informatique - Réparation PC et Mac à Domicile",
        seoAlt: "Expert informatique réparant ordinateur portable - dépannage PC professionnel",
        imageUrl: "/images/categories/informatique.png",
        keywords: ["dépannage informatique", "réparation PC", "récupération données", "virus ordinateur"],
      },
      plomberie: {
        name: "Plomberie",
        seoTitle: "Plombier Urgence - Réparation Fuite et Débouchage 24h/24",
        seoAlt: "Plombier professionnel réparant fuite d'eau - intervention urgente",
        imageUrl: "/images/categories/plomberie.png",
        keywords: ["plombier urgence", "fuite eau", "débouchage canalisation", "chauffe-eau"],
      },
      electricite: {
        name: "Électricité",
        seoTitle: "Électricien Certifié - Installation et Dépannage Électrique",
        seoAlt: "Électricien travaillant sur tableau électrique - installation sécurisée",
        imageUrl: "/images/categories/electricite.png",
        keywords: ["électricien certifié", "panne électrique", "tableau électrique", "mise aux normes"],
      },
      chauffage: {
        name: "Chauffage",
        seoTitle: "Chauffagiste Expert - Entretien et Réparation Chaudière",
        seoAlt: "Technicien chauffagiste entretenant chaudière - système de chauffage",
        imageUrl: "/images/categories/chauffage.png",
        keywords: ["chauffagiste", "entretien chaudière", "pompe à chaleur", "radiateur"],
      },
      serrurerie: {
        name: "Serrurerie",
        seoTitle: "Serrurier Professionnel - Ouverture Porte et Sécurisation",
        seoAlt: "Serrurier installant serrure de sécurité - blindage de porte",
        imageUrl: "/images/categories/serrurerie.png",
        keywords: ["serrurier", "ouverture porte", "changement serrure", "blindage sécurité"],
      },
      multimedia: {
        name: "Multimédia",
        seoTitle: "Technicien Audiovisuel - Installation TV et Home Cinéma",
        seoAlt: "Technicien installant système home cinéma - équipement audiovisuel",
        imageUrl: "/images/categories/multimedia.png",
        keywords: ["installation TV", "home cinéma", "système audio", "console jeux"],
      },
      telephonie: {
        name: "Téléphonie",
        seoTitle: "Réparation Smartphone - Écran Cassé et Batterie Express",
        seoAlt: "Réparateur changeant écran smartphone - réparation mobile express",
        imageUrl: "/images/categories/telephonie.png",
        keywords: ["réparation smartphone", "écran cassé", "batterie téléphone", "pièces origine"],
      },
      climatisation: {
        name: "Climatisation",
        seoTitle: "Frigoriste Climatisation - Installation et Maintenance Clim",
        seoAlt: "Frigoriste installant climatisation - système de refroidissement",
        imageUrl: "/images/categories/climatisation.png",
        keywords: ["frigoriste", "installation climatisation", "maintenance clim", "réparation froid"],
      },
    }
  }

  static getCategoryImages(): CategoryImage[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static getCategoryImage(categoryId: string): CategoryImage | null {
    const images = this.getCategoryImages()
    return images.find((img) => img.id === categoryId) || null
  }

  static getDefaultImageUrl(category: string): string {
    const config = this.getCategoryConfig()
    const categoryConfig = config[category.toLowerCase() as keyof typeof config]
    return categoryConfig?.imageUrl || `/placeholder.svg?height=400&width=600&query=réparation ${category}`
  }

  static getCategorySEO(category: string) {
    const config = this.getCategoryConfig()
    const categoryConfig = config[category.toLowerCase() as keyof typeof config]
    return {
      title: categoryConfig?.seoTitle || `Réparation ${category}`,
      alt: categoryConfig?.seoAlt || `Réparation ${category} professionnel`,
      keywords: categoryConfig?.keywords || [`réparation ${category}`],
    }
  }

  static saveCategoryImage(categoryId: string, categoryName: string, imageUrl: string): void {
    if (typeof window === "undefined") return

    const images = this.getCategoryImages()
    const existingIndex = images.findIndex((img) => img.id === categoryId)
    const seo = this.getCategorySEO(categoryId)

    const newImage: CategoryImage = {
      id: categoryId,
      name: categoryName,
      imageUrl,
      uploadedAt: new Date(),
      seoAlt: seo.alt,
      seoTitle: seo.title,
    }

    if (existingIndex >= 0) {
      images[existingIndex] = newImage
    } else {
      images.push(newImage)
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images))
  }

  static deleteCategoryImage(categoryId: string): void {
    if (typeof window === "undefined") return

    const images = this.getCategoryImages()
    const filtered = images.filter((img) => img.id !== categoryId)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
  }

  static getStats() {
    const images = this.getCategoryImages()
    const categories = this.getCategories()

    return {
      totalCategories: categories.length,
      customizedCategories: images.length,
      percentageCustomized: Math.round((images.length / categories.length) * 100),
    }
  }
}
