export interface PricingPlanConfig {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  popular?: boolean
  maxRequests: number
  contactAccess: boolean
  priority: "low" | "medium" | "high"
}

export const pricingPlans: PricingPlanConfig[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: 19,
    period: "mois",
    description: "Parfait pour débuter",
    features: [
      "Accès aux demandes de réparation",
      "Profil professionnel",
      "Jusqu'à 10 demandes par mois",
      "Support par email",
      "Géolocalisation basique",
    ],
    maxRequests: 10,
    contactAccess: false,
    priority: "low",
  },
  {
    id: "professionnel",
    name: "Professionnel",
    price: 39,
    period: "mois",
    description: "Pour les professionnels actifs",
    features: [
      "Tout du plan Essentiel",
      "Accès aux coordonnées clients",
      "Jusqu'à 50 demandes par mois",
      "Support prioritaire",
      "Statistiques avancées",
      'Badge "Professionnel"',
    ],
    popular: true,
    maxRequests: 50,
    contactAccess: true,
    priority: "medium",
  },
  {
    id: "premium",
    name: "Premium",
    price: 79,
    period: "mois",
    description: "Pour les entreprises",
    features: [
      "Tout du plan Professionnel",
      "Demandes illimitées",
      "Support téléphonique",
      "Référencement prioritaire",
      "Outils de gestion avancés",
      "API d'intégration",
      'Badge "Premium"',
    ],
    maxRequests: -1, // illimité
    contactAccess: true,
    priority: "high",
  },
]

export const getTrialPlan = (): PricingPlanConfig => ({
  id: "trial",
  name: "Essai Gratuit",
  price: 0,
  period: "15 jours",
  description: "Testez gratuitement pendant 15 jours",
  features: [
    "Accès complet pendant 15 jours",
    "Toutes les fonctionnalités Premium",
    "Support inclus",
    "Aucun engagement",
  ],
  maxRequests: -1,
  contactAccess: true,
  priority: "high",
})
