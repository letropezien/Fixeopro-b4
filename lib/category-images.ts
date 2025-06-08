export interface CategoryImage {
  id: string
  name: string
  imageUrl: string
  uploadedAt: Date
}

export class CategoryImagesService {
  private static readonly STORAGE_KEY = "fixeopro_category_images"

  static getCategories(): string[] {
    return [
      "plomberie",
      "electricite",
      "chauffage",
      "climatisation",
      "serrurerie",
      "vitrerie",
      "menuiserie",
      "peinture",
      "carrelage",
      "jardinage",
      "nettoyage",
      "demenagement",
      "informatique",
      "electromenager",
      "automobile",
      "autres",
    ]
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

  static saveCategoryImage(categoryId: string, categoryName: string, imageUrl: string): void {
    if (typeof window === "undefined") return

    const images = this.getCategoryImages()
    const existingIndex = images.findIndex((img) => img.id === categoryId)

    const newImage: CategoryImage = {
      id: categoryId,
      name: categoryName,
      imageUrl,
      uploadedAt: new Date(),
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

  static getDefaultImageUrl(category: string): string {
    return `/images/categories/${category.toLowerCase().replace(/é/g, "e").replace(/è/g, "e")}.png`
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
