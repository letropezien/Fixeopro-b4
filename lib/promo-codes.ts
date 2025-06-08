export interface PromoCode {
  id: string
  code: string
  description: string
  type: "percentage" | "fixed"
  value: number // Pourcentage ou montant fixe
  validFrom: string
  validUntil: string
  maxUses: number
  currentUses: number
  isActive: boolean
  applicablePlans: string[] // ["essentiel", "professionnel", "premium"] ou ["all"]
  createdAt: string
  createdBy: string
}

export interface PromoCodeUsage {
  id: string
  promoCodeId: string
  userId: string
  usedAt: string
  originalAmount: number
  discountAmount: number
  finalAmount: number
}

export class PromoCodeService {
  private static STORAGE_KEY = "fixeo_promo_codes"
  private static USAGE_KEY = "fixeo_promo_usage"

  static getPromoCodes(): PromoCode[] {
    if (typeof window === "undefined") return []
    try {
      const codes = localStorage.getItem(this.STORAGE_KEY)
      return codes ? JSON.parse(codes) : []
    } catch (error) {
      console.error("Erreur lors de la récupération des codes promo:", error)
      return []
    }
  }

  static savePromoCode(promoCode: PromoCode): boolean {
    try {
      const codes = this.getPromoCodes()
      const existingIndex = codes.findIndex((c) => c.id === promoCode.id)

      if (existingIndex >= 0) {
        codes[existingIndex] = promoCode
      } else {
        codes.push(promoCode)
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(codes))
      return true
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du code promo:", error)
      return false
    }
  }

  static deletePromoCode(codeId: string): boolean {
    try {
      const codes = this.getPromoCodes()
      const filteredCodes = codes.filter((c) => c.id !== codeId)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCodes))
      return true
    } catch (error) {
      console.error("Erreur lors de la suppression du code promo:", error)
      return false
    }
  }

  static validatePromoCode(
    code: string,
    planId: string,
    userId: string,
  ): {
    isValid: boolean
    promoCode?: PromoCode
    error?: string
  } {
    const promoCodes = this.getPromoCodes()
    const promoCode = promoCodes.find((p) => p.code.toLowerCase() === code.toLowerCase() && p.isActive)

    if (!promoCode) {
      return { isValid: false, error: "Code promo invalide" }
    }

    const now = new Date()
    const validFrom = new Date(promoCode.validFrom)
    const validUntil = new Date(promoCode.validUntil)

    if (now < validFrom) {
      return { isValid: false, error: "Ce code promo n'est pas encore valide" }
    }

    if (now > validUntil) {
      return { isValid: false, error: "Ce code promo a expiré" }
    }

    if (promoCode.currentUses >= promoCode.maxUses) {
      return { isValid: false, error: "Ce code promo a atteint sa limite d'utilisation" }
    }

    if (!promoCode.applicablePlans.includes("all") && !promoCode.applicablePlans.includes(planId)) {
      return { isValid: false, error: "Ce code promo n'est pas valide pour ce forfait" }
    }

    // Vérifier si l'utilisateur a déjà utilisé ce code
    const usages = this.getPromoUsages()
    const userUsage = usages.find((u) => u.promoCodeId === promoCode.id && u.userId === userId)
    if (userUsage) {
      return { isValid: false, error: "Vous avez déjà utilisé ce code promo" }
    }

    return { isValid: true, promoCode }
  }

  static calculateDiscount(
    originalAmount: number,
    promoCode: PromoCode,
  ): {
    discountAmount: number
    finalAmount: number
  } {
    let discountAmount = 0

    if (promoCode.type === "percentage") {
      discountAmount = (originalAmount * promoCode.value) / 100
    } else {
      discountAmount = Math.min(promoCode.value, originalAmount)
    }

    const finalAmount = Math.max(0, originalAmount - discountAmount)

    return { discountAmount, finalAmount }
  }

  static usePromoCode(
    promoCodeId: string,
    userId: string,
    originalAmount: number,
    discountAmount: number,
    finalAmount: number,
  ): boolean {
    try {
      // Enregistrer l'utilisation
      const usage: PromoCodeUsage = {
        id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        promoCodeId,
        userId,
        usedAt: new Date().toISOString(),
        originalAmount,
        discountAmount,
        finalAmount,
      }

      const usages = this.getPromoUsages()
      usages.push(usage)
      localStorage.setItem(this.USAGE_KEY, JSON.stringify(usages))

      // Incrémenter le compteur d'utilisation du code promo
      const promoCodes = this.getPromoCodes()
      const promoCode = promoCodes.find((p) => p.id === promoCodeId)
      if (promoCode) {
        promoCode.currentUses += 1
        this.savePromoCode(promoCode)
      }

      return true
    } catch (error) {
      console.error("Erreur lors de l'utilisation du code promo:", error)
      return false
    }
  }

  static getPromoUsages(): PromoCodeUsage[] {
    if (typeof window === "undefined") return []
    try {
      const usages = localStorage.getItem(this.USAGE_KEY)
      return usages ? JSON.parse(usages) : []
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisations:", error)
      return []
    }
  }

  static initDemoPromoCodes(): void {
    const existingCodes = this.getPromoCodes()
    if (existingCodes.length === 0) {
      const demoCodes: PromoCode[] = [
        {
          id: "promo_1",
          code: "BIENVENUE20",
          description: "20% de réduction pour les nouveaux réparateurs",
          type: "percentage",
          value: 20,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          maxUses: 100,
          currentUses: 0,
          isActive: true,
          applicablePlans: ["all"],
          createdAt: new Date().toISOString(),
          createdBy: "admin",
        },
        {
          id: "promo_2",
          code: "PREMIUM10",
          description: "10€ de réduction sur le forfait Premium",
          type: "fixed",
          value: 10,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          maxUses: 50,
          currentUses: 0,
          isActive: true,
          applicablePlans: ["premium"],
          createdAt: new Date().toISOString(),
          createdBy: "admin",
        },
      ]

      demoCodes.forEach((code) => this.savePromoCode(code))
    }
  }
}

// Initialiser les codes promo de démonstration
if (typeof window !== "undefined") {
  PromoCodeService.initDemoPromoCodes()
}
