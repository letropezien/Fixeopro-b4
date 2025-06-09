import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CategoriesPage() {
  const categories = [
    {
      name: "Électroménager",
      icon: "🔌",
      description: "Réparation de lave-linge, lave-vaisselle, réfrigérateur, four...",
      count: "150+ réparateurs",
    },
    {
      name: "Informatique",
      icon: "💻",
      description: "Dépannage PC, Mac, installation logiciels, récupération données...",
      count: "200+ réparateurs",
    },
    {
      name: "Plomberie",
      icon: "🔧",
      description: "Fuite, débouchage, installation sanitaire, chauffe-eau...",
      count: "180+ réparateurs",
    },
    {
      name: "Électricité",
      icon: "⚡",
      description: "Installation électrique, panne, tableau électrique, éclairage...",
      count: "120+ réparateurs",
    },
    {
      name: "Chauffage",
      icon: "🔥",
      description: "Chaudière, radiateur, pompe à chaleur, climatisation...",
      count: "90+ réparateurs",
    },
    {
      name: "Serrurerie",
      icon: "🔐",
      description: "Ouverture de porte, changement serrure, blindage...",
      count: "75+ réparateurs",
    },
    {
      name: "Multimédia",
      icon: "📺",
      description: "TV, home cinéma, console de jeux, installation antenne...",
      count: "85+ réparateurs",
    },
    {
      name: "Téléphonie",
      icon: "📱",
      description: "Réparation smartphone, tablette, écran cassé...",
      count: "110+ réparateurs",
    },
    {
      name: "Climatisation",
      icon: "❄️",
      description: "Installation, entretien, dépannage climatisation...",
      count: "60+ réparateurs",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Toutes nos catégories</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trouvez le bon réparateur selon votre besoin. Nos experts couvrent tous les domaines du dépannage.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <Link key={index} href={`/categories/${category.name.toLowerCase()}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
                  <p className="text-blue-600 font-medium text-sm">{category.count}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vous ne trouvez pas votre catégorie ?</h2>
          <p className="text-gray-600 mb-6">
            Décrivez votre problème et nous vous mettrons en relation avec le bon professionnel
          </p>
          <Link href="/demande-reparation">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Faire une demande personnalisée
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
