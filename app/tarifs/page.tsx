import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X } from "lucide-react"

export default function TarifsPage() {
  const plans = [
    {
      name: "Essentiel",
      price: "29€",
      description: "Idéal pour les réparateurs indépendants qui débutent",
      features: [
        "Accès aux demandes clients",
        "Profil professionnel",
        "5 réponses par mois",
        "Support par email",
        "Visibilité standard",
      ],
      limitations: ["Pas de mise en avant", "Fonctionnalités limitées"],
      cta: "Démarrer",
      popular: false,
      id: "basic",
    },
    {
      name: "Professionnel",
      price: "59€",
      description: "Notre formule la plus populaire pour développer votre activité",
      features: [
        "Accès illimité aux demandes",
        "Profil premium avec photos",
        "Réponses illimitées",
        "Priorité dans les résultats",
        "Support téléphonique",
        "Statistiques détaillées",
        "Badge Pro",
      ],
      limitations: [],
      cta: "Choisir Pro",
      popular: true,
      id: "pro",
    },
    {
      name: "Premium",
      price: "99€",
      description: "Pour les professionnels qui veulent maximiser leur visibilité",
      features: [
        "Tous les avantages Pro",
        "Badge 'Expert certifié'",
        "Mise en avant géographique",
        "Support prioritaire 24/7",
        "Formation continue",
        "API d'intégration",
        "Publicité dans les newsletters",
      ],
      limitations: [],
      cta: "Choisir Premium",
      popular: false,
      id: "premium",
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Nos tarifs</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choisissez la formule qui correspond le mieux à vos besoins et développez votre activité de réparation
        </p>
      </div>

      {/* Bannière essai gratuit */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 mb-12 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">15 jours d'essai gratuit</h2>
        <p className="text-lg mb-4">
          Testez toutes les fonctionnalités de la formule de votre choix pendant 15 jours, sans engagement
        </p>
        <Link href="/devenir-reparateur">
          <Button variant="outline" className="bg-white text-green-600 hover:bg-gray-100">
            Commencer l'essai gratuit
          </Button>
        </Link>
      </div>

      {/* Grille de tarifs */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? "border-green-500 shadow-lg shadow-green-100" : "border-gray-200"}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">Populaire</Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start text-gray-500">
                    <X className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={`/devenir-reparateur?plan=${plan.id}`} className="w-full">
                <Button
                  className={`w-full ${
                    plan.popular ? "bg-green-500 hover:bg-green-600" : "bg-gray-800 hover:bg-gray-900"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Comparaison des fonctionnalités */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Comparaison des fonctionnalités</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left border">Fonctionnalités</th>
                <th className="p-4 text-center border">Essentiel</th>
                <th className="p-4 text-center border bg-green-50">Professionnel</th>
                <th className="p-4 text-center border">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border font-medium">Accès aux demandes</td>
                <td className="p-4 text-center border">Limité</td>
                <td className="p-4 text-center border bg-green-50">Illimité</td>
                <td className="p-4 text-center border">Illimité</td>
              </tr>
              <tr>
                <td className="p-4 border font-medium">Réponses mensuelles</td>
                <td className="p-4 text-center border">5</td>
                <td className="p-4 text-center border bg-green-50">Illimité</td>
                <td className="p-4 text-center border">Illimité</td>
              </tr>
              <tr>
                <td className="p-4 border font-medium">Profil personnalisé</td>
                <td className="p-4 text-center border">Basique</td>
                <td className="p-4 text-center border bg-green-50">Premium</td>
                <td className="p-4 text-center border">Premium+</td>
              </tr>
              <tr>
                <td className="p-4 border font-medium">Support client</td>
                <td className="p-4 text-center border">Email</td>
                <td className="p-4 text-center border bg-green-50">Téléphone & Email</td>
                <td className="p-4 text-center border">Prioritaire 24/7</td>
              </tr>
              <tr>
                <td className="p-4 border font-medium">Visibilité dans les résultats</td>
                <td className="p-4 text-center border">Standard</td>
                <td className="p-4 text-center border bg-green-50">Prioritaire</td>
                <td className="p-4 text-center border">Premium</td>
              </tr>
              <tr>
                <td className="p-4 border font-medium">Badge de certification</td>
                <td className="p-4 text-center border">
                  <X className="h-5 w-5 text-gray-400 mx-auto" />
                </td>
                <td className="p-4 text-center border bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="p-4 text-center border">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="p-4 border font-medium">Statistiques et analyses</td>
                <td className="p-4 text-center border">Basiques</td>
                <td className="p-4 text-center border bg-green-50">Détaillées</td>
                <td className="p-4 text-center border">Avancées</td>
              </tr>
              <tr>
                <td className="p-4 border font-medium">API d'intégration</td>
                <td className="p-4 text-center border">
                  <X className="h-5 w-5 text-gray-400 mx-auto" />
                </td>
                <td className="p-4 text-center border bg-green-50">
                  <X className="h-5 w-5 text-gray-400 mx-auto" />
                </td>
                <td className="p-4 text-center border">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Questions fréquentes</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Puis-je changer de formule ?</h3>
              <p className="text-gray-600">
                Oui, vous pouvez changer de formule à tout moment. Les changements prennent effet immédiatement.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Y a-t-il des frais cachés ?</h3>
              <p className="text-gray-600">
                Non, nos tarifs sont transparents. Aucun frais d'inscription ou de résiliation.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Comment fonctionne l'essai gratuit ?</h3>
              <p className="text-gray-600">
                15 jours d'accès complet à toutes les fonctionnalités. Aucune carte bancaire requise.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Puis-je annuler à tout moment ?</h3>
              <p className="text-gray-600">
                Oui, aucun engagement. Résiliation possible à tout moment depuis votre profil.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="mt-16 text-center bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Prêt à rejoindre FixeoPro ?</h2>
        <p className="text-lg text-gray-600 mb-6">Commencez dès aujourd'hui avec 15 jours d'essai gratuit</p>
        <div className="space-x-4">
          <Link href="/devenir-reparateur">
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
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
