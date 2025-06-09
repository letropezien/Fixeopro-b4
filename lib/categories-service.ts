export interface SubCategory {
  id: string
  name: string
  description?: string
  keywords?: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
  subCategories: SubCategory[]
  enabled: boolean
  image?: string // Ajout du champ pour l'image d'illustration
}

export interface CategorySettings {
  tvaEnabled: boolean
  tvaRate: number
}

export class CategoriesService {
  private static readonly STORAGE_KEY = "fixeopro_categories"
  private static readonly SETTINGS_KEY = "fixeopro_categories_settings"

  static getDefaultCategories(): Category[] {
    return [
      {
        id: "electromenager",
        name: "Électroménager",
        icon: "🧰",
        description: "Réparation d'appareils électroménagers",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "lave-linge", name: "Lave-linge", description: "Réparation de machines à laver" },
          { id: "lave-vaisselle", name: "Lave-vaisselle", description: "Réparation de lave-vaisselles" },
          { id: "refrigerateur", name: "Réfrigérateur", description: "Réparation de réfrigérateurs et congélateurs" },
          { id: "four", name: "Four", description: "Réparation de fours et micro-ondes" },
          { id: "plaque-cuisson", name: "Plaque de cuisson", description: "Réparation de plaques de cuisson" },
          { id: "hotte", name: "Hotte", description: "Réparation de hottes aspirantes" },
          { id: "seche-linge", name: "Sèche-linge", description: "Réparation de sèche-linges" },
          { id: "aspirateur", name: "Aspirateur", description: "Réparation d'aspirateurs" },
          { id: "petit-electromenager", name: "Petit électroménager", description: "Réparation de petits appareils" },
          { id: "autre-electromenager", name: "Autre électroménager", description: "Autres appareils électroménagers" },
        ],
      },
      {
        id: "informatique",
        name: "Informatique",
        icon: "💻",
        description: "Réparation d'ordinateurs et matériel informatique",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "pc-portable", name: "PC Portable", description: "Réparation d'ordinateurs portables" },
          { id: "pc-fixe", name: "PC Fixe", description: "Réparation d'ordinateurs de bureau" },
          { id: "mac", name: "Mac", description: "Réparation d'ordinateurs Apple" },
          { id: "imprimante", name: "Imprimante", description: "Réparation d'imprimantes et scanners" },
          { id: "reseau", name: "Réseau", description: "Installation et dépannage réseau" },
          { id: "logiciel", name: "Logiciel", description: "Dépannage logiciel et système d'exploitation" },
          { id: "virus", name: "Virus", description: "Suppression de virus et malwares" },
          { id: "donnees", name: "Données", description: "Récupération de données" },
          { id: "peripherique", name: "Périphérique", description: "Réparation de périphériques" },
          { id: "autre-informatique", name: "Autre informatique", description: "Autres problèmes informatiques" },
        ],
      },
      {
        id: "telephonie",
        name: "Téléphonie",
        icon: "📱",
        description: "Réparation de smartphones et téléphones",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "iphone", name: "iPhone", description: "Réparation d'iPhone" },
          { id: "samsung", name: "Samsung", description: "Réparation de téléphones Samsung" },
          { id: "huawei", name: "Huawei", description: "Réparation de téléphones Huawei" },
          { id: "xiaomi", name: "Xiaomi", description: "Réparation de téléphones Xiaomi" },
          { id: "ecran", name: "Écran", description: "Remplacement d'écrans cassés" },
          { id: "batterie", name: "Batterie", description: "Remplacement de batteries" },
          { id: "connecteur", name: "Connecteur", description: "Réparation de connecteurs" },
          { id: "tablette", name: "Tablette", description: "Réparation de tablettes" },
          { id: "telephone-fixe", name: "Téléphone fixe", description: "Réparation de téléphones fixes" },
          { id: "autre-telephonie", name: "Autre téléphonie", description: "Autres problèmes de téléphonie" },
        ],
      },
      {
        id: "electronique",
        name: "Électronique",
        icon: "📺",
        description: "Réparation d'appareils électroniques",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "tv", name: "TV", description: "Réparation de téléviseurs" },
          { id: "console", name: "Console de jeux", description: "Réparation de consoles de jeux" },
          { id: "audio", name: "Audio", description: "Réparation d'équipements audio" },
          { id: "appareil-photo", name: "Appareil photo", description: "Réparation d'appareils photo" },
          { id: "drone", name: "Drone", description: "Réparation de drones" },
          { id: "home-cinema", name: "Home cinéma", description: "Réparation de systèmes home cinéma" },
          { id: "enceinte", name: "Enceinte", description: "Réparation d'enceintes" },
          { id: "casque", name: "Casque audio", description: "Réparation de casques audio" },
          { id: "autre-electronique", name: "Autre électronique", description: "Autres appareils électroniques" },
        ],
      },
      {
        id: "plomberie",
        name: "Plomberie",
        icon: "🚿",
        description: "Réparation et installation de plomberie",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "fuite", name: "Fuite d'eau", description: "Réparation de fuites d'eau" },
          { id: "debouchage", name: "Débouchage", description: "Débouchage de canalisations" },
          { id: "chauffe-eau", name: "Chauffe-eau", description: "Réparation de chauffe-eau" },
          { id: "robinetterie", name: "Robinetterie", description: "Réparation et installation de robinetterie" },
          { id: "wc", name: "WC", description: "Réparation de toilettes" },
          { id: "douche", name: "Douche", description: "Installation et réparation de douches" },
          { id: "baignoire", name: "Baignoire", description: "Installation et réparation de baignoires" },
          { id: "evier", name: "Évier", description: "Installation et réparation d'éviers" },
          { id: "canalisation", name: "Canalisation", description: "Réparation de canalisations" },
          { id: "autre-plomberie", name: "Autre plomberie", description: "Autres problèmes de plomberie" },
        ],
      },
      {
        id: "electricite",
        name: "Électricité",
        icon: "⚡",
        description: "Réparation et installation électrique",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "panne", name: "Panne électrique", description: "Réparation de pannes électriques" },
          { id: "tableau", name: "Tableau électrique", description: "Installation et mise aux normes de tableaux" },
          { id: "prise", name: "Prise", description: "Installation et réparation de prises" },
          { id: "interrupteur", name: "Interrupteur", description: "Installation et réparation d'interrupteurs" },
          { id: "eclairage", name: "Éclairage", description: "Installation et réparation d'éclairage" },
          { id: "court-circuit", name: "Court-circuit", description: "Réparation de courts-circuits" },
          { id: "installation", name: "Installation complète", description: "Installation électrique complète" },
          { id: "diagnostic", name: "Diagnostic", description: "Diagnostic électrique" },
          { id: "domotique", name: "Domotique", description: "Installation de systèmes domotiques" },
          { id: "autre-electricite", name: "Autre électricité", description: "Autres problèmes électriques" },
        ],
      },
      {
        id: "chauffage",
        name: "Chauffage",
        icon: "🔥",
        description: "Réparation et installation de chauffage",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "chaudiere", name: "Chaudière", description: "Réparation et entretien de chaudières" },
          { id: "radiateur", name: "Radiateur", description: "Installation et réparation de radiateurs" },
          { id: "pompe-chaleur", name: "Pompe à chaleur", description: "Installation et réparation de PAC" },
          { id: "thermostat", name: "Thermostat", description: "Installation et réparation de thermostats" },
          { id: "plancher-chauffant", name: "Plancher chauffant", description: "Installation et réparation" },
          { id: "cheminee", name: "Cheminée", description: "Installation et réparation de cheminées" },
          { id: "poele", name: "Poêle", description: "Installation et réparation de poêles" },
          { id: "entretien", name: "Entretien", description: "Entretien de systèmes de chauffage" },
          { id: "autre-chauffage", name: "Autre chauffage", description: "Autres problèmes de chauffage" },
        ],
      },
      {
        id: "climatisation",
        name: "Climatisation",
        icon: "❄️",
        description: "Réparation et installation de climatisation",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "clim-split", name: "Climatiseur split", description: "Installation et réparation de splits" },
          { id: "clim-mobile", name: "Climatiseur mobile", description: "Réparation de climatiseurs mobiles" },
          { id: "clim-reversible", name: "Climatiseur réversible", description: "Installation et réparation" },
          { id: "entretien-clim", name: "Entretien", description: "Entretien de climatiseurs" },
          { id: "recharge-gaz", name: "Recharge gaz", description: "Recharge de gaz climatiseur" },
          { id: "ventilation", name: "Ventilation", description: "Installation et réparation de VMC" },
          { id: "autre-climatisation", name: "Autre climatisation", description: "Autres problèmes de climatisation" },
        ],
      },
      {
        id: "serrurerie",
        name: "Serrurerie",
        icon: "🔒",
        description: "Réparation et installation de serrures",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "ouverture-porte", name: "Ouverture de porte", description: "Ouverture de portes claquées" },
          { id: "changement-serrure", name: "Changement de serrure", description: "Remplacement de serrures" },
          { id: "blindage", name: "Blindage", description: "Installation de portes blindées" },
          { id: "coffre-fort", name: "Coffre-fort", description: "Ouverture et réparation de coffres-forts" },
          { id: "cle", name: "Reproduction de clés", description: "Reproduction de clés" },
          { id: "verrou", name: "Verrou", description: "Installation de verrous" },
          { id: "porte-garage", name: "Porte de garage", description: "Réparation de portes de garage" },
          { id: "portail", name: "Portail", description: "Réparation et motorisation de portails" },
          { id: "autre-serrurerie", name: "Autre serrurerie", description: "Autres problèmes de serrurerie" },
        ],
      },
      {
        id: "vitrerie",
        name: "Vitrerie",
        icon: "🪟",
        description: "Réparation et installation de vitres",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "vitre-cassee", name: "Vitre cassée", description: "Remplacement de vitres cassées" },
          { id: "double-vitrage", name: "Double vitrage", description: "Installation de double vitrage" },
          { id: "fenetre", name: "Fenêtre", description: "Installation et réparation de fenêtres" },
          { id: "baie-vitree", name: "Baie vitrée", description: "Installation et réparation de baies vitrées" },
          { id: "vitrine", name: "Vitrine", description: "Réparation et installation de vitrines" },
          { id: "miroir", name: "Miroir", description: "Installation de miroirs" },
          { id: "verre-securite", name: "Verre de sécurité", description: "Installation de verre sécurisé" },
          { id: "autre-vitrerie", name: "Autre vitrerie", description: "Autres problèmes de vitrerie" },
        ],
      },
      {
        id: "menuiserie",
        name: "Menuiserie",
        icon: "🪚",
        description: "Réparation et installation de menuiserie",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "porte", name: "Porte", description: "Installation et réparation de portes" },
          { id: "fenetre-bois", name: "Fenêtre bois", description: "Installation et réparation de fenêtres en bois" },
          { id: "placard", name: "Placard", description: "Installation et réparation de placards" },
          { id: "parquet", name: "Parquet", description: "Installation et réparation de parquets" },
          { id: "escalier", name: "Escalier", description: "Installation et réparation d'escaliers" },
          { id: "meuble", name: "Meuble sur mesure", description: "Fabrication de meubles sur mesure" },
          { id: "cuisine", name: "Cuisine", description: "Installation de cuisines" },
          { id: "terrasse-bois", name: "Terrasse bois", description: "Installation de terrasses en bois" },
          { id: "autre-menuiserie", name: "Autre menuiserie", description: "Autres travaux de menuiserie" },
        ],
      },
      {
        id: "jardinage",
        name: "Jardinage",
        icon: "🌱",
        description: "Réparation d'outils de jardinage",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "tondeuse", name: "Tondeuse", description: "Réparation de tondeuses" },
          { id: "taille-haie", name: "Taille-haie", description: "Réparation de taille-haies" },
          { id: "tronconneuse", name: "Tronçonneuse", description: "Réparation de tronçonneuses" },
          { id: "debroussailleuse", name: "Débroussailleuse", description: "Réparation de débroussailleuses" },
          { id: "motoculteur", name: "Motoculteur", description: "Réparation de motoculteurs" },
          { id: "souffleur", name: "Souffleur", description: "Réparation de souffleurs" },
          { id: "arrosage", name: "Système d'arrosage", description: "Réparation de systèmes d'arrosage" },
          { id: "robot-tondeuse", name: "Robot tondeuse", description: "Réparation de robots tondeuses" },
          { id: "autre-jardinage", name: "Autre jardinage", description: "Autres outils de jardinage" },
        ],
      },
      {
        id: "automobile",
        name: "Automobile",
        icon: "🚗",
        description: "Réparation automobile",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "diagnostic", name: "Diagnostic", description: "Diagnostic automobile" },
          { id: "batterie-auto", name: "Batterie", description: "Remplacement de batteries" },
          { id: "freinage", name: "Freinage", description: "Réparation de systèmes de freinage" },
          { id: "vidange", name: "Vidange", description: "Vidange et entretien" },
          { id: "pneu", name: "Pneus", description: "Changement et réparation de pneus" },
          { id: "carrosserie", name: "Carrosserie", description: "Réparation de carrosserie" },
          { id: "electrique-auto", name: "Électrique", description: "Réparation électrique automobile" },
          { id: "climatisation-auto", name: "Climatisation", description: "Réparation de climatisation automobile" },
          { id: "mecanique", name: "Mécanique", description: "Réparation mécanique" },
          { id: "autre-automobile", name: "Autre automobile", description: "Autres réparations automobiles" },
        ],
      },
      {
        id: "nettoyage",
        name: "Nettoyage",
        icon: "🧹",
        description: "Services de nettoyage",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "nettoyage-maison", name: "Maison", description: "Nettoyage de maisons" },
          { id: "nettoyage-bureau", name: "Bureau", description: "Nettoyage de bureaux" },
          { id: "nettoyage-vitres", name: "Vitres", description: "Nettoyage de vitres" },
          { id: "nettoyage-moquette", name: "Moquette", description: "Nettoyage de moquettes" },
          { id: "nettoyage-canape", name: "Canapé", description: "Nettoyage de canapés" },
          { id: "desinfection", name: "Désinfection", description: "Services de désinfection" },
          { id: "autre-nettoyage", name: "Autre nettoyage", description: "Autres services de nettoyage" },
        ],
      },
      {
        id: "demenagement",
        name: "Déménagement",
        icon: "📦",
        description: "Services de déménagement",
        enabled: true,
        image: "/placeholder.svg?height=200&width=300",
        subCategories: [
          { id: "demenagement-complet", name: "Déménagement complet", description: "Service complet de déménagement" },
          { id: "transport-meuble", name: "Transport de meubles", description: "Transport de meubles spécifiques" },
          { id: "montage-meuble", name: "Montage de meubles", description: "Montage et démontage de meubles" },
          { id: "emballage", name: "Emballage", description: "Services d'emballage" },
          { id: "garde-meuble", name: "Garde-meuble", description: "Services de garde-meuble" },
          { id: "autre-demenagement", name: "Autre déménagement", description: "Autres services de déménagement" },
        ],
      },
    ]
  }

  static getDefaultSettings(): CategorySettings {
    return {
      tvaEnabled: true,
      tvaRate: 20,
    }
  }

  static getCategories(): Category[] {
    try {
      const storedCategories = localStorage.getItem(this.STORAGE_KEY)
      if (!storedCategories) {
        const defaultCategories = this.getDefaultCategories()
        this.saveCategories(defaultCategories)
        return defaultCategories
      }
      return JSON.parse(storedCategories)
    } catch (error) {
      console.error("Error loading categories:", error)
      return this.getDefaultCategories()
    }
  }

  static getSettings(): CategorySettings {
    try {
      const storedSettings = localStorage.getItem(this.SETTINGS_KEY)
      if (!storedSettings) {
        const defaultSettings = this.getDefaultSettings()
        this.saveSettings(defaultSettings)
        return defaultSettings
      }
      return JSON.parse(storedSettings)
    } catch (error) {
      console.error("Error loading category settings:", error)
      return this.getDefaultSettings()
    }
  }

  static saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories))
    } catch (error) {
      console.error("Error saving categories:", error)
    }
  }

  static saveSettings(settings: CategorySettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Error saving category settings:", error)
    }
  }

  static getCategoryById(id: string): Category | undefined {
    const categories = this.getCategories()
    return categories.find((cat) => cat.id === id)
  }

  static updateCategory(id: string, updates: Partial<Category>): void {
    const categories = this.getCategories()
    const index = categories.findIndex((cat) => cat.id === id)
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates }
      this.saveCategories(categories)
    }
  }

  static toggleCategoryStatus(id: string): void {
    const categories = this.getCategories()
    const index = categories.findIndex((cat) => cat.id === id)
    if (index !== -1) {
      categories[index].enabled = !categories[index].enabled
      this.saveCategories(categories)
    }
  }

  static getEnabledCategories(): Category[] {
    return this.getCategories().filter((cat) => cat.enabled)
  }

  static getSubCategoryById(categoryId: string, subCategoryId: string): SubCategory | undefined {
    const category = this.getCategoryById(categoryId)
    return category?.subCategories.find((sub) => sub.id === subCategoryId)
  }

  // Nouvelle méthode pour mettre à jour l'image d'une catégorie
  static updateCategoryImage(id: string, imageUrl: string): void {
    const categories = this.getCategories()
    const index = categories.findIndex((cat) => cat.id === id)
    if (index !== -1) {
      categories[index].image = imageUrl
      this.saveCategories(categories)
    }
  }
}
