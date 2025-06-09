import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Search, MessageSquare, Wrench, Star } from "lucide-react"

export default function CommentCaMarchePage() {
  const steps = [
    {
      number: "1",
      icon: Search,
      title: "Décrivez votre problème",
      description: "Expliquez en quelques mots ce qui ne fonctionne pas et où vous vous trouvez.",
    },
    {
      number: "2",
      icon: MessageSquare,
      title: "Recevez des devis",
      description: "Les réparateurs de votre région vous contactent avec leurs propositions.",
    },
    {
      number: "3",
      icon: Wrench,
      title: "Choisissez votre réparateur",
      description: "Comparez les profils, tarifs et disponibilités pour faire votre choix.",
    },
    {
      number: "4",
      icon: Star,
      title: "Problème résolu !",
      description: "Le réparateur intervient et vous pouvez noter la prestation.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trouvez et contactez un réparateur en 4 étapes simples
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Pourquoi utiliser FixeoPro ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Rapide</h3>
              <p className="text-gray-600">
                Trouvez un réparateur en quelques minutes, intervention possible le jour même
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Sécurisé</h3>
              <p className="text-gray-600">Tous nos réparateurs sont vérifiés et les paiements sont sécurisés</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Économique</h3>
              <p className="text-gray-600">Comparez les devis et choisissez le meilleur rapport qualité-prix</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prêt à commencer ?</h2>
          <p className="text-gray-600 mb-6">Décrivez votre problème et trouvez le bon réparateur dès maintenant</p>
          <Link href="/demande-reparation">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Faire ma demande
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
