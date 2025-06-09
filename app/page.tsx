import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wrench, Search, MapPin, Star, Clock, Shield } from "lucide-react"

export default function HomePage() {
  const categories = [
    { name: "Électroménager", icon: "🔌", count: "150+ réparateurs" },
    { name: "Informatique", icon: "💻", count: "200+ réparateurs" },
    { name: "Plomberie", icon: "🔧", count: "180+ réparateurs" },
    { name: "Électricité", icon: "⚡", count: "120+ réparateurs" },
    { name: "Chauffage", icon: "🔥", count: "90+ réparateurs" },
    { name: "Serrurerie", icon: "🔐", count: "75+ réparateurs" },
  ]

  const features = [
    {
      icon: Search,
      title: "Trouvez rapidement",
      description: "Des réparateurs qualifiés près de chez vous en quelques clics",
    },
    {
      icon: Star,
      title: "Qualité garantie",
      description: "Tous nos réparateurs sont vérifiés et notés par les clients",
    },
    {
      icon: Clock,
      title: "Intervention rapide",
      description: "Dépannage d'urgence possible le jour même",
    },
    {
      icon: Shield,
      title: "Paiement sécurisé",
      description: "Transactions protégées et garantie satisfaction",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Trouvez le bon réparateur
              <span className="text-blue-600"> près de chez vous</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              FixeoPro vous met en relation avec des réparateurs qualifiés pour tous vos besoins de dépannage. Rapide,
              fiable et au meilleur prix.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demande-reparation">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  <Wrench className="mr-2 h-5 w-5" />
                  Demander un dépannage
                </Button>
              </Link>
              <Link href="/devenir-reparateur">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Devenir réparateur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos catégories de dépannage</h2>
            <p className="text-lg text-gray-600">Des experts dans tous les domaines pour répondre à vos besoins</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={`/categories/${category.name.toLowerCase()}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/categories">
              <Button variant="outline" size="lg">
                Voir toutes les catégories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir FixeoPro ?</h2>
            <p className="text-lg text-gray-600">Une plateforme conçue pour simplifier vos dépannages</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à trouver votre réparateur ?</h2>
          <p className="text-xl text-blue-100 mb-8">Décrivez votre problème et recevez des devis en quelques minutes</p>
          <Link href="/demande-reparation">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              <MapPin className="mr-2 h-5 w-5" />
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
