export interface SiteSettings {
  // Informations générales
  siteName: string
  siteUrl: string
  description: string

  // Contact
  contactEmail: string
  supportPhone: string
  contactPhone: string

  // Adresse
  companyName: string
  address: string
  city: string
  postalCode: string
  country: string

  // Horaires
  openingHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }

  // Réseaux sociaux
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }

  // Paramètres techniques
  maintenanceMode: boolean
  allowRegistrations: boolean
  emailVerificationRequired: boolean

  // Dernière mise à jour
  lastUpdated: string
}

export class SiteSettingsService {
  private static readonly STORAGE_KEY = "fixeopro_site_settings"

  static getDefaultSettings(): SiteSettings {
    return {
      siteName: "FixeoPro",
      siteUrl: "https://fixeopro.fr",
      description: "La plateforme de référence pour trouver un expert en réparation près de chez vous.",

      contactEmail: "contact@fixeopro.fr",
      supportPhone: "01 23 45 67 89",
      contactPhone: "01 23 45 67 89",

      companyName: "FixeoPro SAS",
      address: "123 Rue de la Réparation",
      city: "Paris",
      postalCode: "75001",
      country: "France",

      openingHours: {
        monday: "8h-20h",
        tuesday: "8h-20h",
        wednesday: "8h-20h",
        thursday: "8h-20h",
        friday: "8h-20h",
        saturday: "9h-17h",
        sunday: "Support en ligne uniquement",
      },

      socialMedia: {
        facebook: "https://facebook.com/fixeopro",
        twitter: "https://twitter.com/fixeopro",
        instagram: "https://instagram.com/fixeopro",
        linkedin: "https://linkedin.com/company/fixeopro",
      },

      maintenanceMode: false,
      allowRegistrations: true,
      emailVerificationRequired: true,

      lastUpdated: new Date().toISOString(),
    }
  }

  static getSettings(): SiteSettings {
    if (typeof window === "undefined") return this.getDefaultSettings()

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) {
        const defaultSettings = this.getDefaultSettings()
        this.saveSettings(defaultSettings)
        return defaultSettings
      }
      return { ...this.getDefaultSettings(), ...JSON.parse(stored) }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error)
      return this.getDefaultSettings()
    }
  }

  static saveSettings(settings: SiteSettings): void {
    if (typeof window === "undefined") return

    try {
      settings.lastUpdated = new Date().toISOString()
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres:", error)
    }
  }

  static updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    const currentSettings = this.getSettings()
    const newSettings = { ...currentSettings, ...updates }
    this.saveSettings(newSettings)
    return newSettings
  }

  static resetToDefaults(): SiteSettings {
    const defaultSettings = this.getDefaultSettings()
    this.saveSettings(defaultSettings)
    return defaultSettings
  }
}
