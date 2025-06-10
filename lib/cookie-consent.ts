export interface CookiePreferences {
  essential: boolean // Toujours true, non modifiable
  analytics: boolean
  marketing: boolean
  functional: boolean
  hasConsented: boolean
  consentDate: string
  lastUpdated: string
}

export class CookieConsentService {
  private static readonly STORAGE_KEY = "fixeopro_cookie_consent"
  private static readonly CONSENT_VERSION = "1.0"

  static getDefaultPreferences(): CookiePreferences {
    return {
      essential: true, // Toujours activé
      analytics: false,
      marketing: false,
      functional: false,
      hasConsented: false,
      consentDate: "",
      lastUpdated: new Date().toISOString(),
    }
  }

  static getPreferences(): CookiePreferences {
    if (typeof window === "undefined") return this.getDefaultPreferences()

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return this.getDefaultPreferences()

      const preferences = JSON.parse(stored)
      return { ...this.getDefaultPreferences(), ...preferences }
    } catch (error) {
      console.error("Erreur lors du chargement des préférences cookies:", error)
      return this.getDefaultPreferences()
    }
  }

  static savePreferences(preferences: Partial<CookiePreferences>): void {
    if (typeof window === "undefined") return

    try {
      const current = this.getPreferences()
      const updated: CookiePreferences = {
        ...current,
        ...preferences,
        essential: true, // Toujours true
        hasConsented: true,
        consentDate: current.consentDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))

      // Déclencher un événement pour notifier les autres composants
      window.dispatchEvent(
        new CustomEvent("cookiePreferencesChanged", {
          detail: updated,
        }),
      )
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des préférences:", error)
    }
  }

  static acceptAll(): void {
    this.savePreferences({
      analytics: true,
      marketing: true,
      functional: true,
    })
  }

  static rejectAll(): void {
    this.savePreferences({
      analytics: false,
      marketing: false,
      functional: false,
    })
  }

  static hasConsented(): boolean {
    return this.getPreferences().hasConsented
  }

  static canUseAnalytics(): boolean {
    return this.getPreferences().analytics
  }

  static canUseMarketing(): boolean {
    return this.getPreferences().marketing
  }

  static canUseFunctional(): boolean {
    return this.getPreferences().functional
  }

  static resetConsent(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.STORAGE_KEY)
  }

  // Méthodes pour gérer les cookies selon les préférences
  static setCookie(
    name: string,
    value: string,
    days = 30,
    type: "essential" | "analytics" | "marketing" | "functional" = "essential",
  ): void {
    if (typeof window === "undefined") return

    const preferences = this.getPreferences()

    // Vérifier si le type de cookie est autorisé
    if (type !== "essential" && !preferences[type]) {
      return // Ne pas définir le cookie si non autorisé
    }

    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }

  static getCookie(name: string): string | null {
    if (typeof window === "undefined") return null

    const nameEQ = name + "="
    const ca = document.cookie.split(";")

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  static deleteCookie(name: string): void {
    if (typeof window === "undefined") return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }

  // Nettoyer les cookies selon les nouvelles préférences
  static cleanupCookies(): void {
    const preferences = this.getPreferences()

    if (!preferences.analytics) {
      // Supprimer les cookies analytics
      this.deleteCookie("_ga")
      this.deleteCookie("_gid")
      this.deleteCookie("_gat")
    }

    if (!preferences.marketing) {
      // Supprimer les cookies marketing
      this.deleteCookie("_fbp")
      this.deleteCookie("_fbc")
    }

    if (!preferences.functional) {
      // Supprimer les cookies fonctionnels
      this.deleteCookie("user_preferences")
    }
  }
}
