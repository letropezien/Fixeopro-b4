export interface PaymentGatewayConfig {
  paypal: {
    enabled: boolean
    mode: "sandbox" | "live"
    clientId: string
    clientSecret: string
    webhookId?: string
    currency: string
    testMode: boolean
  }
  stripe: {
    enabled: boolean
    mode: "test" | "live"
    publishableKey: string
    secretKey: string
    webhookSecret: string
    currency: string
    testMode: boolean
  }
  general: {
    defaultCurrency: string
    taxRate: number
    tvaEnabled: boolean
    commission: number
    allowedCurrencies: string[]
    minimumAmount: number
    maximumAmount: number
  }
}

export class PaymentConfigService {
  private static CONFIG_KEY = "fixeo_payment_gateways"

  static getDefaultConfig(): PaymentGatewayConfig {
    return {
      paypal: {
        enabled: false,
        mode: "sandbox",
        clientId: "",
        clientSecret: "",
        webhookId: "",
        currency: "EUR",
        testMode: true,
      },
      stripe: {
        enabled: false,
        mode: "test",
        publishableKey: "",
        secretKey: "",
        webhookSecret: "",
        currency: "EUR",
        testMode: true,
      },
      general: {
        defaultCurrency: "EUR",
        taxRate: 20,
        tvaEnabled: true,
        commission: 5,
        allowedCurrencies: ["EUR", "USD", "GBP"],
        minimumAmount: 1,
        maximumAmount: 10000,
      },
    }
  }

  static getConfig(): PaymentGatewayConfig {
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
      console.error("Erreur lors de la récupération de la configuration:", error)
      return this.getDefaultConfig()
    }
  }

  static saveConfig(config: PaymentGatewayConfig): boolean {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config))
      return true
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      return false
    }
  }

  static validatePayPalConfig(config: PaymentGatewayConfig["paypal"]): string[] {
    const errors: string[] = []

    if (config.enabled) {
      if (!config.clientId) {
        errors.push("Client ID PayPal requis")
      }
      if (!config.clientSecret) {
        errors.push("Client Secret PayPal requis")
      }
      if (config.clientId && !config.clientId.startsWith(config.mode === "sandbox" ? "AX" : "AX")) {
        errors.push("Format Client ID PayPal invalide")
      }
    }

    return errors
  }

  static validateStripeConfig(config: PaymentGatewayConfig["stripe"]): string[] {
    const errors: string[] = []

    if (config.enabled) {
      if (!config.publishableKey) {
        errors.push("Clé publique Stripe requise")
      }
      if (!config.secretKey) {
        errors.push("Clé secrète Stripe requise")
      }
      if (config.publishableKey && !config.publishableKey.startsWith("pk_")) {
        errors.push("Format clé publique Stripe invalide")
      }
      if (config.secretKey && !config.secretKey.startsWith("sk_")) {
        errors.push("Format clé secrète Stripe invalide")
      }
      if (config.testMode && config.publishableKey && !config.publishableKey.includes("test")) {
        errors.push("Utilisez les clés de test Stripe en mode test")
      }
    }

    return errors
  }

  static async testPayPalConnection(config: PaymentGatewayConfig["paypal"]): Promise<{
    success: boolean
    message: string
  }> {
    try {
      // Simulation du test de connexion PayPal
      if (!config.clientId || !config.clientSecret) {
        return { success: false, message: "Identifiants PayPal manquants" }
      }

      // Ici, vous feriez un vrai appel à l'API PayPal
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulation d'un test réussi
      return { success: true, message: "Connexion PayPal réussie" }
    } catch (error) {
      return { success: false, message: "Erreur de connexion PayPal" }
    }
  }

  static async testStripeConnection(config: PaymentGatewayConfig["stripe"]): Promise<{
    success: boolean
    message: string
  }> {
    try {
      // Simulation du test de connexion Stripe
      if (!config.publishableKey || !config.secretKey) {
        return { success: false, message: "Clés Stripe manquantes" }
      }

      // Ici, vous feriez un vrai appel à l'API Stripe
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulation d'un test réussi
      return { success: true, message: "Connexion Stripe réussie" }
    } catch (error) {
      return { success: false, message: "Erreur de connexion Stripe" }
    }
  }

  static getEnabledGateways(): string[] {
    const config = this.getConfig()
    const enabled: string[] = []

    if (config.paypal.enabled) enabled.push("paypal")
    if (config.stripe.enabled) enabled.push("stripe")

    return enabled
  }

  static isGatewayEnabled(gateway: "paypal" | "stripe"): boolean {
    const config = this.getConfig()
    return config[gateway].enabled
  }
}
