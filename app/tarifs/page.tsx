import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X } from "lucide-react"
import Link from "next/link"

export default function TarifsPage() {
  const plans = [
    {
      id: "basic",
      name: "Essentiel",
      price: "29€",
      period: "/mois",
      description: "Parfait pour débuter sur FixeoPro",
      features: [
        "Accès aux demandes clients",
        "Profil professionnel basique",
        "5 réponses par mois",
        "Support par email",
        "Statistiques de base",
      ],
      limitations: ["Réponses limitées", "Pas de mise en avant", "Support standard"],
      color: "border-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
    },
    {
      id: "pro",
      name: "Professionnel",
      price: "59€",
      period: "/mois",
      description: "Le plus populaire pour les professionnels actifs",
      popular: true,
      features: [
        "Accès illimité aux demandes",
        "Profil premium avec photos",
        "Réponses illimitées",
        "Priorité dans les résultats",
        "Support téléphonique",
        "Statistiques détaillées",
        "Badge 'Professionnel vérifié'",
        "Notifications en temps réel",
      ],
      limitations: [],
      color: "border-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "premium",
      name: "Premium",
      price: "99€",
      period: "/mois",
      description: "Pour les experts qui veulent maximiser leur visibilité",
      features: [
        "Tous les avantages Professionnel",
        "Badge 'Expert certifié'",
        "Mise en avant géographique",
        "Support prioritaire 24/7",
        "Formation continue incluse",
        "API d'intégration",
        "Rapport mensuel personnalisé",
        "Accès aux demandes en avant-première",
        "Outil de gestion client intégré",
      ],
      limitations: [],
      color: "border-purple-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ]

  const freeFeatures = [
    "15 jours d'essai gratuit",
    "Aucun engagement",
    "Résiliation à tout moment",
    "Accès complet pendant l'essai",
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tarifs pour les professionnels</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez l'abonnement qui correspond à vos besoins et développez votre activité
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-green-900 mb-2">🎉 Offre de lancement</h3>
            <p className="text-green-800 text-sm">
              15 jours d'essai gratuit pour tous les nouveaux inscrits. Aucun engagement, résiliation à tout moment.
            </p>
          </div>
        </div>

        {/* Gratuit pour les particuliers */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Gratuit pour les particuliers</h2>
            <p className="text-blue-800 mb-4">
              FixeoPro est entièrement gratuit pour les particuliers qui cherchent un réparateur
            </p>
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-blue-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plans tarifaires */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.color} ${plan.popular ? "shadow-xl scale-105" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  Le plus populaire
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">✅ Inclus :</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-red-700">❌ Limitations :</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <X className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link href={`/devenir-reparateur?plan=${plan.id}`}>
                  <Button className={`w-full ${plan.buttonColor}`}>
                    {plan.popular ? "Commencer l'essai gratuit" : "Choisir ce plan"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparaison détaillée */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Comparaison détaillée</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Fonctionnalités</th>
                  <th className="px-6 py-4 text-center font-semibold">Essentiel</th>
                  <th className="px-6 py-4 text-center font-semibold">Professionnel</th>
                  <th className="px-6 py-4 text-center font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">Accès aux demandes clients</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Réponses par mois</td>
                  <td className="px-6 py-4 text-center">5</td>
                  <td className="px-6 py-4 text-center">Illimitées</td>
                  <td className="px-6 py-4 text-center">Illimitées</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Support client</td>
                  <td className="px-6 py-4 text-center">Email</td>
                  <td className="px-6 py-4 text-center">Email + Téléphone</td>
                  <td className="px-6 py-4 text-center">24/7 Prioritaire</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Mise en avant</td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">Priorité</td>
                  <td className="px-6 py-4 text-center">Géographique</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Statistiques</td>
                  <td className="px-6 py-4 text-center">Basiques</td>
                  <td className="px-6 py-4 text-center">Détaillées</td>
                  <td className="px-6 py-4 text-center">Rapport mensuel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Tarifs */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Questions sur les tarifs</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je changer d'abonnement ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oui, vous pouvez changer d'abonnement à tout moment. Les changements prennent effet immédiatement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Y a-t-il des frais cachés ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Non, nos tarifs sont transparents. Aucun frais d'inscription, de mise en service ou de résiliation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment fonctionne l'essai gratuit ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  15 jours d'accès complet à toutes les fonctionnalités. Aucune carte bancaire requise pour commencer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je annuler à tout moment ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oui, aucun engagement. Vous pouvez résilier votre abonnement à tout moment depuis votre profil.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à rejoindre FixeoPro ?</h2>
          <p className="text-xl text-gray-600 mb-8">Commencez dès aujourd'hui avec 15 jours d'essai gratuit</p>
          <Link href="/devenir-reparateur">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 mr-4">
              Commencer l'essai gratuit
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Nous contacter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
