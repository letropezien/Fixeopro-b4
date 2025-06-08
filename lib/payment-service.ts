export interface PaymentConfig {
  paypal: {
    clientId: string
    clientSecret: string
    environment: "sandbox" | "live"
    enabled: boolean
  }
  stripe: {
    publishableKey: string
    secretKey: string
    webhookSecret: string
    enabled: boolean
  }
  platform: {
    currency: string
    taxRate: number
    commission: number
  }
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  amount?: number
  method?: "stripe" | "paypal"
}

export class PaymentService {
  private static CONFIG_KEY = "fixeo_payment_config"

  static getConfig(): PaymentConfig {
    if (typeof window === "undefined") {
      return this.getDefaultConfig()
    }

    try {
      const config = localStorage.getItem(this.CONFIG_KEY)
      return config ? JSON.parse(config) : this.getDefaultConfig()
    } catch (error) {
      console.error("Erreur lors de la récupération de la configuration:", error)
      return this.getDefaultConfig()
    }
  }

  static saveConfig(config: PaymentConfig): boolean {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config))
      return true
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la configuration:", error)
      return false
    }
  }

  private static getDefaultConfig(): PaymentConfig {
    return {
      paypal: {
        clientId: "",
        clientSecret: "",
        environment: "sandbox",
        enabled: false,
      },
      stripe: {
        publishableKey: "",
        secretKey: "",
        webhookSecret: "",
        enabled: false,
      },
      platform: {
        currency: "EUR",
        taxRate: 20,
        commission: 5,
      },
    }
  }

  static async processStripePayment(
    amount: number,
    cardData: {
      number: string
      expiry: string
      cvv: string
      name: string
    },
  ): Promise<PaymentResult> {
    try {
      const config = this.getConfig()

      if (!config.stripe.enabled || !config.stripe.publishableKey) {
        return {
          success: false,
          error: "Stripe n'est pas configuré",
        }
      }

      // Simulation du paiement Stripe
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Validation basique des données de carte
      if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
        return {
          success: false,
          error: "Données de carte incomplètes",
        }
      }

      // Simuler une chance d'échec de 5%
      if (Math.random() < 0.05) {
        return {
          success: false,
          error: "Paiement refusé par votre banque",
        }
      }

      const transactionId = `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        success: true,
        transactionId,
        amount,
        method: "stripe",
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erreur lors du paiement Stripe",
      }
    }
  }

  static async processPayPalPayment(amount: number): Promise<PaymentResult> {
    try {
      const config = this.getConfig()

      if (!config.paypal.enabled || !config.paypal.clientId) {
        return {
          success: false,
          error: "PayPal n'est pas configuré",
        }
      }

      // Vérifier que PayPal SDK est chargé
      if (!window.paypal) {
        return {
          success: false,
          error: "PayPal SDK non chargé",
        }
      }

      return new Promise((resolve) => {
        window.paypal
          .Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: amount.toFixed(2),
                      currency_code: config.platform.currency,
                    },
                  },
                ],
              })
            },
            onApprove: async (data: any, actions: any) => {
              try {
                const order = await actions.order.capture()
                resolve({
                  success: true,
                  transactionId: order.id,
                  amount,
                  method: "paypal",
                })
              } catch (error: any) {
                resolve({
                  success: false,
                  error: error.message || "Erreur lors de la capture PayPal",
                })
              }
            },
            onError: (err: any) => {
              resolve({
                success: false,
                error: "Erreur PayPal: " + err.message,
              })
            },
          })
          .render("#paypal-button-container")
      })
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erreur lors du paiement PayPal",
      }
    }
  }

  static calculateTotal(
    baseAmount: number,
    promoCode?: any,
  ): {
    baseAmount: number
    discountAmount: number
    taxAmount: number
    finalAmount: number
  } {
    const config = this.getConfig()

    let discountAmount = 0
    if (promoCode) {
      if (promoCode.type === "percentage") {
        discountAmount = (baseAmount * promoCode.value) / 100
      } else {
        discountAmount = Math.min(promoCode.value, baseAmount)
      }
    }

    const discountedAmount = baseAmount - discountAmount
    const taxAmount = (discountedAmount * config.platform.taxRate) / 100
    const finalAmount = discountedAmount + taxAmount

    return {
      baseAmount,
      discountAmount,
      taxAmount,
      finalAmount,
    }
  }

  static loadPayPalSDK(clientId: string, environment: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.paypal) {
        resolve(true)
        return
      }

      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture`
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  static loadStripeSDK(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Stripe) {
        resolve(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://js.stripe.com/v3/"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }
}

// Types globaux pour PayPal et Stripe
declare global {
  interface Window {
    paypal?: any
    Stripe?: any
  }
}
