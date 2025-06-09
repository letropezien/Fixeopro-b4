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
}

export class CategoriesService {
  private static readonly STORAGE_KEY = "fixeopro_categories"
  private static readonly SETTINGS_KEY = "fixeopro_category_settings"

  static getDefaultCategories(): Category[] {
    return [
      {
        id: "electromenager",
        name: "Électroménager",
        icon: "🔌",
        description: "Réparation et dépannage d'appareils électroménagers",
        enabled: true,
        subCategories: [
          { id: "lave-linge", name: "Lave-linge", description: "Réparation lave-linge, tambour, pompe" },
          { id: "lave-vaisselle", name: "Lave-vaisselle", description: "Dépannage lave-vaisselle, bras lavage" },
          { id: "refrigerateur", name: "Réfrigérateur", description: "Réparation frigo, congélateur, thermostat" },
          { id: "four", name: "Four", description: "Réparation four électrique, gaz, micro-ondes" },
          { id: "micro-ondes", name: "Micro-ondes", description: "Dépannage micro-ondes, magnétron" },
          { id: "aspirateur", name: "Aspirateur", description: "Réparation aspirateur, moteur, brosse" },
          { id: "seche-linge", name: "Sèche-linge", description: "Dépannage sèche-linge, résistance" },
          { id: "cafetiere", name: "Cafetière", description: "Réparation machine à café, expresso" },
          { id: "robot-cuisine", name: "Robot de cuisine", description: "Dépannage robot, mixeur, blender" },
          { id: "fer-repasser", name: "Fer à repasser", description: "Réparation fer, centrale vapeur" },
        ],
      },
      {
        id: "informatique",
        name: "Informatique",
        icon: "💻",
        description: "Dépannage informatique et réparation d'ordinateurs",
        enabled: true,
        subCategories: [
          {
            id: "ordinateur-portable",
            name: "Ordinateur portable",
            description: "Réparation PC portable, écran, clavier",
          },
          { id: "ordinateur-fixe", name: "Ordinateur fixe", description: "Dépannage PC fixe, tour, composants" },
          { id: "mac", name: "Mac", description: "Réparation MacBook, iMac, Mac mini" },
          { id: "imprimante", name: "Imprimante", description: "Dépannage imprimante, scanner, cartouches" },
          { id: "ecran", name: "Écran", description: "Réparation moniteur, écran LCD, LED" },
          { id: "disque-dur", name: "Disque dur", description: "Récupération données, SSD, HDD" },
          { id: "virus", name: "Virus", description: "Nettoyage virus, malware, optimisation" },
          { id: "reseau", name: "Réseau", description: "Configuration WiFi, box, routeur" },
          { id: "logiciel", name: "Logiciel", description: "Installation, configuration logiciels" },
          { id: "sauvegarde", name: "Sauvegarde", description: "Sauvegarde données, cloud, NAS" },
        ],
      },
      {
        id: "telephonie",
        name: "Téléphonie",
        icon: "📱",
        description: "Réparation smartphone, tablette et accessoires",
        enabled: true,
        subCategories: [
          { id: "iphone", name: "iPhone", description: "Réparation iPhone, écran, batterie" },
          { id: "samsung", name: "Samsung", description: "Dépannage Samsung Galaxy, écran, charge" },
          { id: "huawei", name: "Huawei", description: "Réparation Huawei, Honor, écran tactile" },
          { id: "xiaomi", name: "Xiaomi", description: "Dépannage Xiaomi, Redmi, batterie" },
          { id: "tablette", name: "Tablette", description: "Réparation iPad, tablette Android" },
          { id: "ecran-tactile", name: "Écran tactile", description: "Remplacement écran cassé, tactile" },
          { id: "batterie", name: "Batterie", description: "Changement batterie, autonomie" },
          { id: "connecteur-charge", name: "Connecteur de charge", description: "Réparation prise charge, USB-C" },
          { id: "appareil-photo", name: "Appareil photo", description: "Réparation caméra, objectif" },
          { id: "haut-parleur", name: "Haut-parleur", description: "Dépannage son, micro, écouteurs" },
        ],
      },
      {
        id: "electronique",
        name: "Électronique",
        icon: "📺",
        description: "Réparation TV, audio et électronique grand public",
        enabled: true,
        subCategories: [
          { id: "television", name: "Télévision", description: "Réparation TV LCD, LED, OLED, plasma" },
          { id: "console-jeux", name: "Console de jeux", description: "Dépannage PlayStation, Xbox, Nintendo" },
          { id: "chaine-hifi", name: "Chaîne Hi-Fi", description: "Réparation chaîne, amplificateur" },
          { id: "enceinte", name: "Enceinte", description: "Dépannage enceinte, bluetooth, son" },
          { id: "casque", name: "Casque", description: "Réparation casque audio, écouteurs" },
          { id: "appareil-photo", name: "Appareil photo", description: "Dépannage reflex, compact, objectif" },
          { id: "camescope", name: "Caméscope", description: "Réparation caméra, vidéo" },
          { id: "drone", name: "Drone", description: "Dépannage drone, hélice, caméra" },
          { id: "montre-connectee", name: "Montre connectée", description: "Réparation smartwatch, bracelet" },
          { id: "home-cinema", name: "Home cinéma", description: "Installation, dépannage système audio" },
        ],
      },
      {
        id: "plomberie",
        name: "Plomberie",
        icon: "🔧",
        description: "Intervention plomberie, fuite, débouchage",
        enabled: true,
        subCategories: [
          { id: "fuite-eau", name: "Fuite d'eau", description: "Réparation fuite, canalisation, joint" },
          { id: "debouchage", name: "Débouchage", description: "Débouchage évier, WC, canalisation" },
          { id: "chauffe-eau", name: "Chauffe-eau", description: "Dépannage ballon eau chaude, résistance" },
          { id: "robinetterie", name: "Robinetterie", description: "Réparation robinet, mitigeur, cartouche" },
          { id: "wc", name: "WC", description: "Dépannage toilettes, chasse d'eau, mécanisme" },
          { id: "douche", name: "Douche", description: "Réparation douche, pommeau, flexible" },
          { id: "baignoire", name: "Baignoire", description: "Dépannage baignoire, vidage, joint" },
          {
            id: "lave-vaisselle-plomberie",
            name: "Raccordement lave-vaisselle",
            description: "Installation, raccordement",
          },
          { id: "lave-linge-plomberie", name: "Raccordement lave-linge", description: "Installation, évacuation" },
          { id: "canalisation", name: "Canalisation", description: "Réparation tuyau, PVC, cuivre" },
        ],
      },
      {
        id: "electricite",
        name: "Électricité",
        icon: "⚡",
        description: "Installation électrique, dépannage, mise aux normes",
        enabled: true,
        subCategories: [
          { id: "panne-electrique", name: "Panne électrique", description: "Dépannage coupure, court-circuit" },
          { id: "tableau-electrique", name: "Tableau électrique", description: "Réparation disjoncteur, différentiel" },
          {
            id: "prise-electrique",
            name: "Prise électrique",
            description: "Installation, réparation prise, interrupteur",
          },
          { id: "eclairage", name: "Éclairage", description: "Installation luminaire, LED, variateur" },
          { id: "chauffage-electrique", name: "Chauffage électrique", description: "Dépannage radiateur, convecteur" },
          { id: "volet-roulant", name: "Volet roulant", description: "Réparation moteur, télécommande" },
          { id: "portail-electrique", name: "Portail électrique", description: "Dépannage automatisme, moteur" },
          { id: "alarme", name: "Alarme", description: "Installation, dépannage système alarme" },
          { id: "videophone", name: "Visiophone", description: "Installation interphone, portier vidéo" },
          { id: "mise-aux-normes", name: "Mise aux normes", description: "Conformité électrique, diagnostic" },
        ],
      },
      {
        id: "chauffage",
        name: "Chauffage",
        icon: "🔥",
        description: "Entretien et réparation systèmes de chauffage",
        enabled: true,
        subCategories: [
          { id: "chaudiere-gaz", name: "Chaudière gaz", description: "Dépannage chaudière gaz, entretien" },
          { id: "chaudiere-fioul", name: "Chaudière fioul", description: "Réparation chaudière mazout, brûleur" },
          { id: "pompe-chaleur", name: "Pompe à chaleur", description: "Dépannage PAC air/eau, géothermie" },
          { id: "radiateur", name: "Radiateur", description: "Réparation radiateur, purge, thermostat" },
          { id: "plancher-chauffant", name: "Plancher chauffant", description: "Dépannage sol chauffant, régulation" },
          { id: "poele-bois", name: "Poêle à bois", description: "Entretien poêle, conduit, ramonage" },
          { id: "poele-granules", name: "Poêle à granulés", description: "Dépannage poêle pellets, vis sans fin" },
          { id: "insert", name: "Insert", description: "Réparation insert, foyer fermé" },
          { id: "cheminee", name: "Cheminée", description: "Entretien cheminée, conduit, fumée" },
          { id: "regulation", name: "Régulation", description: "Programmateur, thermostat, sonde" },
        ],
      },
      {
        id: "climatisation",
        name: "Climatisation",
        icon: "❄️",
        description: "Installation et dépannage climatisation",
        enabled: true,
        subCategories: [
          { id: "climatiseur-split", name: "Climatiseur split", description: "Dépannage clim split, unité extérieure" },
          { id: "climatiseur-mobile", name: "Climatiseur mobile", description: "Réparation clim portable, gaz" },
          { id: "climatiseur-reversible", name: "Climatiseur réversible", description: "Dépannage clim chaud/froid" },
          { id: "ventilation", name: "Ventilation", description: "VMC, extracteur, aération" },
          { id: "recharge-gaz", name: "Recharge gaz", description: "Recharge fluide frigorigène, R32" },
          { id: "nettoyage-clim", name: "Nettoyage climatisation", description: "Entretien, désinfection, filtre" },
          {
            id: "installation-clim",
            name: "Installation climatisation",
            description: "Pose climatiseur, raccordement",
          },
          {
            id: "thermostat-clim",
            name: "Thermostat climatisation",
            description: "Programmateur, régulation température",
          },
        ],
      },
      {
        id: "serrurerie",
        name: "Serrurerie",
        icon: "🔐",
        description: "Ouverture porte, serrure, sécurisation",
        enabled: true,
        subCategories: [
          {
            id: "ouverture-porte",
            name: "Ouverture de porte",
            description: "Porte claquée, clé cassée, serrure bloquée",
          },
          {
            id: "changement-serrure",
            name: "Changement serrure",
            description: "Remplacement serrure, cylindre, barillet",
          },
          {
            id: "blindage-porte",
            name: "Blindage de porte",
            description: "Porte blindée, sécurisation, anti-effraction",
          },
          { id: "cles", name: "Clés", description: "Reproduction clés, clé cassée, double" },
          { id: "serrure-3-points", name: "Serrure 3 points", description: "Installation serrure multipoints" },
          {
            id: "serrure-electronique",
            name: "Serrure électronique",
            description: "Serrure connectée, digicode, badge",
          },
          { id: "coffre-fort", name: "Coffre-fort", description: "Ouverture, installation coffre-fort" },
          { id: "rideau-metallique", name: "Rideau métallique", description: "Dépannage rideau, moteur, lames" },
          { id: "grille-securite", name: "Grille de sécurité", description: "Installation grille, protection fenêtre" },
        ],
      },
      {
        id: "vitrerie",
        name: "Vitrerie",
        icon: "🪟",
        description: "Remplacement vitre, miroiterie, double vitrage",
        enabled: true,
        subCategories: [
          { id: "vitre-cassee", name: "Vitre cassée", description: "Remplacement vitre, carreau, glace" },
          { id: "double-vitrage", name: "Double vitrage", description: "Réparation double vitrage, buée, joint" },
          { id: "miroir", name: "Miroir", description: "Pose miroir, découpe sur mesure" },
          { id: "baie-vitree", name: "Baie vitrée", description: "Réparation porte-fenêtre, coulissant" },
          { id: "velux", name: "Velux", description: "Dépannage fenêtre de toit, mécanisme" },
          { id: "vitrine", name: "Vitrine", description: "Remplacement vitrine magasin, commerce" },
          { id: "pare-brise", name: "Pare-brise", description: "Réparation impact, remplacement" },
          { id: "verre-securite", name: "Verre sécurisé", description: "Verre trempé, feuilleté, anti-effraction" },
        ],
      },
      {
        id: "menuiserie",
        name: "Menuiserie",
        icon: "🪚",
        description: "Réparation bois, fenêtre, porte, meuble",
        enabled: true,
        subCategories: [
          { id: "porte-bois", name: "Porte en bois", description: "Réparation porte, gond, serrure" },
          { id: "fenetre-bois", name: "Fenêtre bois", description: "Dépannage fenêtre, crémone, joint" },
          { id: "volet-bois", name: "Volet bois", description: "Réparation volet battant, persienne" },
          { id: "parquet", name: "Parquet", description: "Réparation parquet, lame, ponçage" },
          { id: "escalier", name: "Escalier", description: "Dépannage escalier, marche, rampe" },
          { id: "placard", name: "Placard", description: "Réparation placard, porte coulissante" },
          { id: "meuble", name: "Meuble", description: "Réparation meuble, tiroir, charnière" },
          { id: "cloison", name: "Cloison", description: "Réparation cloison, placo, isolation" },
          { id: "terrasse-bois", name: "Terrasse bois", description: "Entretien terrasse, lame, structure" },
        ],
      },
      {
        id: "jardinage",
        name: "Jardinage",
        icon: "🌱",
        description: "Entretien jardin, réparation outils de jardinage",
        enabled: true,
        subCategories: [
          { id: "tondeuse", name: "Tondeuse", description: "Réparation tondeuse, moteur, lame" },
          { id: "taille-haie", name: "Taille-haie", description: "Dépannage taille-haie, lame, moteur" },
          { id: "tronconneuse", name: "Tronçonneuse", description: "Réparation tronçonneuse, chaîne, guide" },
          { id: "debroussailleuse", name: "Débroussailleuse", description: "Dépannage débroussailleuse, fil, tête" },
          { id: "motoculteur", name: "Motoculteur", description: "Réparation motobineuse, fraise, moteur" },
          { id: "souffleur", name: "Souffleur", description: "Dépannage souffleur, aspirateur feuilles" },
          { id: "arrosage", name: "Arrosage", description: "Système arrosage automatique, programmateur" },
          { id: "serre", name: "Serre", description: "Réparation serre, vitrage, structure" },
          { id: "portail-jardin", name: "Portail jardin", description: "Dépannage portail, gond, serrure" },
          { id: "abri-jardin", name: "Abri de jardin", description: "Réparation cabane, toiture, porte" },
        ],
      },
      {
        id: "automobile",
        name: "Automobile",
        icon: "🚗",
        description: "Réparation automobile, diagnostic, entretien",
        enabled: true,
        subCategories: [
          { id: "diagnostic-auto", name: "Diagnostic", description: "Diagnostic électronique, panne moteur" },
          { id: "batterie-auto", name: "Batterie", description: "Remplacement batterie, alternateur" },
          { id: "freinage", name: "Freinage", description: "Réparation frein, plaquette, disque" },
          { id: "embrayage", name: "Embrayage", description: "Dépannage embrayage, pédale, disque" },
          { id: "climatisation-auto", name: "Climatisation auto", description: "Recharge clim, compresseur, gaz" },
          { id: "echappement", name: "Échappement", description: "Réparation pot échappement, silencieux" },
          { id: "suspension", name: "Suspension", description: "Amortisseur, ressort, triangle" },
          { id: "carrosserie", name: "Carrosserie", description: "Réparation carrosserie, rayure, bosse" },
          { id: "vitrage-auto", name: "Vitrage auto", description: "Pare-brise, vitre latérale, impact" },
          { id: "electronique-auto", name: "Électronique auto", description: "Autoradio, GPS, calculateur" },
        ],
      },
      {
        id: "nettoyage",
        name: "Nettoyage",
        icon: "🧽",
        description: "Services de nettoyage et entretien",
        enabled: true,
        subCategories: [
          { id: "nettoyage-maison", name: "Nettoyage maison", description: "Ménage, entretien domicile" },
          { id: "nettoyage-bureau", name: "Nettoyage bureau", description: "Entretien locaux professionnels" },
          { id: "nettoyage-vitres", name: "Nettoyage vitres", description: "Lavage vitres, baies vitrées" },
          { id: "nettoyage-moquette", name: "Nettoyage moquette", description: "Shampoing moquette, tapis" },
          { id: "nettoyage-facade", name: "Nettoyage façade", description: "Ravalement, nettoyage mur extérieur" },
          { id: "demoussage", name: "Démoussage", description: "Démoussage toiture, terrasse" },
          { id: "desinfection", name: "Désinfection", description: "Désinfection, traitement sanitaire" },
        ],
      },
      {
        id: "demenagement",
        name: "Déménagement",
        icon: "📦",
        description: "Services de déménagement et transport",
        enabled: true,
        subCategories: [
          { id: "demenagement-complet", name: "Déménagement complet", description: "Déménagement clé en main" },
          { id: "transport-meuble", name: "Transport meuble", description: "Livraison, transport mobilier" },
          { id: "emballage", name: "Emballage", description: "Emballage, protection objets fragiles" },
          { id: "stockage", name: "Stockage", description: "Garde-meuble, self-stockage" },
          { id: "monte-meuble", name: "Monte-meuble", description: "Monte-charge, grue, manutention" },
          { id: "nettoyage-fin-bail", name: "Nettoyage fin de bail", description: "Ménage état des lieux" },
        ],
      },
    ]
  }

  static getCategories(): Category[] {
    if (typeof window === "undefined") return this.getDefaultCategories()

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const categories = JSON.parse(stored)
        // Fusionner avec les catégories par défaut pour les nouvelles
        const defaultCategories = this.getDefaultCategories()
        const mergedCategories = defaultCategories.map((defaultCat) => {
          const storedCat = categories.find((cat: Category) => cat.id === defaultCat.id)
          return storedCat ? { ...defaultCat, ...storedCat } : defaultCat
        })
        return mergedCategories
      }
      return this.getDefaultCategories()
    } catch {
      return this.getDefaultCategories()
    }
  }

  static saveCategories(categories: Category[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories))
  }

  static getCategoryById(id: string): Category | null {
    const categories = this.getCategories()
    return categories.find((cat) => cat.id === id) || null
  }

  static getEnabledCategories(): Category[] {
    return this.getCategories().filter((cat) => cat.enabled)
  }

  static getSubCategoriesByCategory(categoryId: string): SubCategory[] {
    const category = this.getCategoryById(categoryId)
    return category?.subCategories || []
  }

  static toggleCategoryStatus(categoryId: string): void {
    const categories = this.getCategories()
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId)
    if (categoryIndex >= 0) {
      categories[categoryIndex].enabled = !categories[categoryIndex].enabled
      this.saveCategories(categories)
    }
  }

  static updateCategory(categoryId: string, updates: Partial<Category>): void {
    const categories = this.getCategories()
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId)
    if (categoryIndex >= 0) {
      categories[categoryIndex] = { ...categories[categoryIndex], ...updates }
      this.saveCategories(categories)
    }
  }

  static getSettings() {
    if (typeof window === "undefined") return { tvaEnabled: true, tvaRate: 20 }

    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY)
      return stored ? JSON.parse(stored) : { tvaEnabled: true, tvaRate: 20 }
    } catch {
      return { tvaEnabled: true, tvaRate: 20 }
    }
  }

  static saveSettings(settings: { tvaEnabled: boolean; tvaRate: number }): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
  }
}
