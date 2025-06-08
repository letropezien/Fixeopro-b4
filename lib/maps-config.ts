export interface GoogleMapsConfig {
  apiKey: string
  enabled: boolean
  defaultCenter: {
    lat: number
    lng: number
  }
  defaultZoom: number
  useCustomStyle: boolean
  customStyle: string
  markerColors: {
    request: string
    reparateur: string
    urgent: string
    sameDay: string
    thisWeek: string
    flexible: string
  }
}

export class MapsConfigService {
  private static CONFIG_KEY = "fixeo_google_maps_config"

  static getDefaultConfig(): GoogleMapsConfig {
    return {
      apiKey: "",
      enabled: false,
      defaultCenter: {
        lat: 46.603354, // Centre de la France
        lng: 1.888334,
      },
      defaultZoom: 6,
      useCustomStyle: false,
      customStyle: "[]", // Style JSON par défaut (vide)
      markerColors: {
        request: "#3b82f6", // blue
        reparateur: "#10b981", // green
        urgent: "#ef4444", // red
        sameDay: "#f97316", // orange
        thisWeek: "#eab308", // yellow
        flexible: "#22c55e", // green
      },
    }
  }

  static getConfig(): GoogleMapsConfig {
    if (typeof window === "undefined") {
      return this.getDefaultConfig()
    }

    try {
      const config = localStorage.getItem(this.CONFIG_KEY)
      if (config) {
        const parsed = JSON.parse(config)
        return { ...this.getDefaultConfig(), ...parsed }
      }
      return this.getDefaultConfig()
    } catch (error) {
      console.error("Erreur lors de la récupération de la configuration Google Maps:", error)
      return this.getDefaultConfig()
    }
  }

  static saveConfig(config: GoogleMapsConfig): boolean {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config))
      return true
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la configuration Google Maps:", error)
      return false
    }
  }

  static isEnabled(): boolean {
    const config = this.getConfig()
    return config.enabled && !!config.apiKey
  }

  static getApiKey(): string {
    return this.getConfig().apiKey
  }

  static getMapOptions() {
    const config = this.getConfig()
    return {
      center: config.defaultCenter,
      zoom: config.defaultZoom,
      styles: config.useCustomStyle ? JSON.parse(config.customStyle) : [],
    }
  }
}
