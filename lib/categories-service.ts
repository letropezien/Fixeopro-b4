export interface SubCategory {
  name: string
  description: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  image: string
  subCategories: SubCategory[]
  enabled: boolean
}

export class CategoriesService {
  private static readonly STORAGE_KEY = "fixeopro_categories"

  static getDefaultCategories(): Category[] {
    return [
      {
        id: "electromenager",
        name: "Électroménager",
        description:
          "Réparation de tous vos appareils électroménagers : lave-linge, lave-vaisselle, réfrigérateur, four...",
        icon: "🔧",
        image: "/images/categories/electromenager.png",
        enabled: true,
        subCategories: [
          { name: "Lave-linge", description: "Réparation et entretien lave-linge" },
          { name: "Lave-vaisselle", description: "Dépannage lave-vaisselle" },
          { name: "Réfrigérateur", description: "Réparation frigo et congélateur" },
          { name: "Four", description: "Réparation four et micro-ondes" },
          { name: "Aspirateur", description: "Dépannage aspirateur" },
        ],
      },
      {
        id: "informatique",
        name: "Informatique",
        description: "Dépannage informatique, réparation PC, récupération de données, suppression de virus...",
        icon: "💻",
        image: "/images/categories/informatique.png",
        enabled: true,
        subCategories: [
          { name: "Ordinateur portable", description: "Réparation PC portable" },
          { name: "Ordinateur fixe", description: "Dépannage PC de bureau" },
          { name: "Récupération données", description: "Récupération fichiers perdus" },
          { name: "Suppression virus", description: "Nettoyage et sécurisation" },
          { name: "Installation logiciels", description: "Configuration et installation" },
        ],
      },
      {
        id: "plomberie",
        name: "Plomberie",
        description: "Intervention plomberie : fuites, débouchage, installation sanitaire, chauffe-eau...",
        icon: "🔧",
        image: "/images/categories/plomberie.png",
        enabled: true,
        subCategories: [
          { name: "Fuite d'eau", description: "Réparation fuites et joints" },
          { name: "Débouchage", description: "Débouchage canalisations" },
          { name: "Chauffe-eau", description: "Installation et réparation" },
          { name: "Robinetterie", description: "Changement robinets" },
          { name: "WC", description: "Réparation toilettes" },
        ],
      },
      {
        id: "electricite",
        name: "Électricité",
        description: "Travaux électriques : installation, dépannage, mise aux normes, éclairage...",
        icon: "⚡",
        image: "/images/categories/electricite.png",
        enabled: true,
        subCategories: [
          { name: "Panne électrique", description: "Diagnostic et réparation" },
          { name: "Tableau électrique", description: "Installation et mise aux normes" },
          { name: "Éclairage", description: "Installation luminaires" },
          { name: "Prises électriques", description: "Ajout et réparation prises" },
          { name: "Interrupteurs", description: "Installation interrupteurs" },
        ],
      },
      {
        id: "chauffage",
        name: "Chauffage",
        description: "Entretien et réparation systèmes de chauffage : chaudière, radiateurs, pompe à chaleur...",
        icon: "🔥",
        image: "/images/categories/chauffage.png",
        enabled: true,
        subCategories: [
          { name: "Chaudière gaz", description: "Entretien et réparation" },
          { name: "Chaudière fioul", description: "Maintenance chaudière fioul" },
          { name: "Pompe à chaleur", description: "Installation et dépannage PAC" },
          { name: "Radiateurs", description: "Réparation radiateurs" },
          { name: "Plancher chauffant", description: "Dépannage chauffage au sol" },
        ],
      },
      {
        id: "serrurerie",
        name: "Serrurerie",
        description: "Services serrurerie : ouverture de porte, changement serrure, blindage, sécurisation...",
        icon: "🔐",
        image: "/images/categories/serrurerie.png",
        enabled: true,
        subCategories: [
          { name: "Ouverture porte", description: "Ouverture porte claquée" },
          { name: "Changement serrure", description: "Remplacement serrures" },
          { name: "Blindage porte", description: "Sécurisation entrée" },
          { name: "Clés cassées", description: "Extraction clés cassées" },
          { name: "Serrure bloquée", description: "Déblocage mécanisme" },
        ],
      },
      {
        id: "multimedia",
        name: "Multimédia",
        description: "Installation et réparation équipements audiovisuels : TV, home cinéma, consoles...",
        icon: "📺",
        image: "/images/categories/multimedia.png",
        enabled: true,
        subCategories: [
          { name: "Télévision", description: "Réparation TV et écrans" },
          { name: "Home cinéma", description: "Installation système audio" },
          { name: "Console de jeux", description: "Réparation PlayStation, Xbox" },
          { name: "Chaîne Hi-Fi", description: "Dépannage équipement audio" },
          { name: "Projecteur", description: "Installation et réparation" },
        ],
      },
      {
        id: "telephonie",
        name: "Téléphonie",
        description: "Réparation smartphones et tablettes : écran cassé, batterie, boutons, récupération données...",
        icon: "📱",
        image: "/images/categories/telephonie.png",
        enabled: true,
        subCategories: [
          { name: "Écran cassé", description: "Remplacement écran smartphone" },
          { name: "Batterie", description: "Changement batterie" },
          { name: "Boutons défaillants", description: "Réparation boutons" },
          { name: "Prise de charge", description: "Réparation connecteur" },
          { name: "Récupération données", description: "Sauvegarde données mobiles" },
        ],
      },
      {
        id: "climatisation",
        name: "Climatisation",
        description: "Installation et maintenance climatisation : clim réversible, pompe à chaleur air/air...",
        icon: "❄️",
        image: "/images/categories/climatisation.png",
        enabled: true,
        subCategories: [
          { name: "Climatisation murale", description: "Installation clim split" },
          { name: "Climatisation mobile", description: "Réparation clim portable" },
          { name: "Pompe à chaleur air/air", description: "Installation PAC réversible" },
          { name: "Entretien climatisation", description: "Maintenance annuelle" },
          { name: "Recharge gaz", description: "Recharge fluide frigorigène" },
        ],
      },
    ]
  }

  static getCategories(): Category[] {
    if (typeof window === "undefined") {
      return this.getDefaultCategories()
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const categories = JSON.parse(stored)
        // Vérifier si les images sont présentes, sinon utiliser les valeurs par défaut
        const defaultCategories = this.getDefaultCategories()
        return categories.map((cat: Category) => {
          const defaultCat = defaultCategories.find((d) => d.id === cat.id)
          return {
            ...cat,
            image:
              cat.image || defaultCat?.image || `/placeholder.svg?height=300&width=400&query=réparation ${cat.name}`,
          }
        })
      }
      return this.getDefaultCategories()
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
      return this.getDefaultCategories()
    }
  }

  static getEnabledCategories(): Category[] {
    return this.getCategories().filter((category) => category.enabled)
  }

  static getCategoryById(id: string): Category | null {
    const categories = this.getCategories()
    return categories.find((category) => category.id === id) || null
  }

  static saveCategories(categories: Category[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des catégories:", error)
    }
  }

  static updateCategory(updatedCategory: Category): void {
    const categories = this.getCategories()
    const index = categories.findIndex((cat) => cat.id === updatedCategory.id)

    if (index !== -1) {
      categories[index] = updatedCategory
      this.saveCategories(categories)
    }
  }

  static toggleCategoryStatus(categoryId: string): void {
    const categories = this.getCategories()
    const category = categories.find((cat) => cat.id === categoryId)

    if (category) {
      category.enabled = !category.enabled
      this.saveCategories(categories)
    }
  }

  static resetCategories(): void {
    if (typeof window === "undefined") return

    const defaultCategories = this.getDefaultCategories()
    this.saveCategories(defaultCategories)
  }

  static addCategory(category: Omit<Category, "id">): Category {
    const categories = this.getCategories()
    const newCategory: Category = {
      ...category,
      id: category.name.toLowerCase().replace(/\s+/g, "-").replace(/[éèê]/g, "e"),
    }

    categories.push(newCategory)
    this.saveCategories(categories)
    return newCategory
  }

  static deleteCategory(categoryId: string): void {
    const categories = this.getCategories().filter((cat) => cat.id !== categoryId)
    this.saveCategories(categories)
  }

  static getStats() {
    const categories = this.getCategories()
    const enabledCategories = categories.filter((cat) => cat.enabled)

    return {
      total: categories.length,
      enabled: enabledCategories.length,
      disabled: categories.length - enabledCategories.length,
    }
  }
}
