export interface PaymentGatewayConfig {
  paypal: {
    enabled: boolean
    mode: "sandbox" | "live"
    clientId: string
    clientSecret: string
    webhookId?: string
    currency: string
  }
  stripe: {
    enabled: boolean
    mode: "test" | "live"
    publishableKey: string
    secretKey: string
    webhookSecret: string
    currency: string
  }
  general: {
    defaultCurrency: string
    taxRate: number
    commission: number
    minimumAmount: number
    maximumAmount: number
    tvaEnabled: boolean
  }
}

export class PaymentConfigService {
  private static readonly STORAGE_KEY = "fixeopro_payment_config"

  static getDefaultConfig(): PaymentGatewayConfig {
    return {
      paypal: {
        enabled: false,
        mode: "sandbox",
        clientId: "",
        clientSecret: "",
        webhookId: "",
        currency: "EUR",
      },
      stripe: {
        enabled: false,
        mode: "test",
        publishableKey: "",
        secretKey: "",
        webhookSecret: "",
        currency: "EUR",
      },
      general: {
        defaultCurrency: "EUR",
        taxRate: 20,
        commission: 10,
        minimumAmount: 10,
        maximumAmount: 5000,
        tvaEnabled: true,
      },
    }
  }

  static getConfig(): PaymentGatewayConfig {
    try {
      const storedConfig = localStorage.getItem(this.STORAGE_KEY)
      if (!storedConfig) {
        const defaultConfig = this.getDefaultConfig()
        this.saveConfig(defaultConfig)
        return defaultConfig
      }
      return JSON.parse(storedConfig)
    } catch (error) {
      console.error("Error loading payment config:", error)
      return this.getDefaultConfig()
    }
  }

  static saveConfig(config: PaymentGatewayConfig): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config))
      return true
    } catch (error) {
      console.error("Error saving payment config:", error)
      return false
    }
  }

  static validatePayPalConfig(config: PaymentGatewayConfig["paypal"]): string[] {
    const errors: string[] = []

    if (!config.enabled) {
      return errors
    }

    if (!config.clientId) {
      errors.push("Client ID est requis")
    } else if (!config.clientId.startsWith("A")) {
      errors.push("Client ID invalide (doit commencer par 'A')")
    }

    if (!config.clientSecret) {
      errors.push("Client Secret est requis")
    } else if (!config.clientSecret.startsWith("E")) {
      errors.push("Client Secret invalide (doit commencer par 'E')")
    }

    if (config.webhookId && !config.webhookId.startsWith("WH-")) {
      errors.push("Webhook ID invalide (doit commencer par 'WH-')")
    }

    return errors
  }

  static validateStripeConfig(config: PaymentGatewayConfig["stripe"]): string[] {
    const errors: string[] = []

    if (!config.enabled) {
      return errors
    }

    if (!config.publishableKey) {
      errors.push("Clé publique est requise")
    } else {
      const prefix = config.mode === "test" ? "pk_test_" : "pk_live_"
      if (!config.publishableKey.startsWith(prefix)) {
        errors.push(`Clé publique invalide (doit commencer par '${prefix}')`)
      }
    }

    if (!config.secretKey) {
      errors.push("Clé secrète est requise")
    } else {
      const prefix = config.mode === "test" ? "sk_test_" : "sk_live_"
      if (!config.secretKey.startsWith(prefix)) {
        errors.push(`Clé secrète invalide (doit commencer par '${prefix}')`)
      }
    }

    if (!config.webhookSecret) {
      errors.push("Webhook Secret est requis")
    } else if (!config.webhookSecret.startsWith("whsec_")) {
      errors.push("Webhook Secret invalide (doit commencer par 'whsec_')")
    }

    return errors
  }

  static async testPayPalConnection(config: PaymentGatewayConfig["paypal"]): Promise<{
    success: boolean
    message: string
  }> {
    // Simulation d'un test de connexion
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!config.clientId || !config.clientSecret) {
          resolve({
            success: false,
            message: "Client ID et Client Secret sont requis",
          })
          return
        }

        if (config.clientId.startsWith("A") && config.clientSecret.startsWith("E")) {
          resolve({
            success: true,
            message: "Connexion à PayPal établie avec succès",
          })
        } else {
          resolve({
            success: false,
            message: "Identifiants PayPal invalides",
          })
        }
      }, 1000)
    })
  }

  static async testStripeConnection(config: PaymentGatewayConfig["stripe"]): Promise<{
    success: boolean
    message: string
  }> {
    // Simulation d'un test de connexion
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!config.publishableKey || !config.secretKey) {
          resolve({
            success: false,
            message: "Clé publique et Clé secrète sont requises",
          })
          return
        }

        const pubPrefix = config.mode === "test" ? "pk_test_" : "pk_live_"
        const secPrefix = config.mode === "test" ? "sk_test_" : "sk_live_"

        if (config.publishableKey.startsWith(pubPrefix) && config.secretKey.startsWith(secPrefix)) {
          resolve({
            success: true,
            message: "Connexion à Stripe établie avec succès",
          })
        } else {
          resolve({
            success: false,
            message: "Identifiants Stripe invalides",
          })
        }
      }, 1000)
    })
  }
}
