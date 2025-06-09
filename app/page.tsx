import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Search, MapPin, Star, Clock, Shield, TrendingUp } from "lucide-react"
import { CategoryImage } from "@/components/category-image"

export default function HomePage() {
  const categories = [
    {
      name: "Électroménager",
      slug: "electromenager",
      icon: "🔌",
      description: "Réparation rapide de tous vos appareils électroménagers",
      seoText:
        "Nos experts réparent lave-linge, lave-vaisselle, réfrigérateurs et fours avec garantie. Intervention rapide et pièces d'origine.",
      count: "150+ réparateurs",
      avgPrice: "À partir de 45€",
      rating: 4.8,
      urgency: "Intervention 2h",
    },
    {
      name: "Informatique",
      slug: "informatique",
      icon: "💻",
      description: "Dépannage PC, Mac et récupération de données",
      seoText:
        "Techniciens certifiés pour dépannage informatique, installation logiciels, nettoyage virus et optimisation performances.",
      count: "200+ réparateurs",
      avgPrice: "À partir de 60€",
      rating: 4.9,
      urgency: "Intervention 1h30",
    },
    {
      name: "Plomberie",
      slug: "plomberie",
      icon: "🔧",
      description: "Intervention urgente pour fuites et débouchages",
      seoText:
        "Plombiers qualifiés disponibles 24h/24 pour fuites, débouchages, installations sanitaires et chauffe-eau.",
      count: "180+ réparateurs",
      avgPrice: "À partir de 80€",
      rating: 4.7,
      urgency: "Urgence 24h/24",
    },
    {
      name: "Électricité",
      slug: "electricite",
      icon: "⚡",
      description: "Installation électrique et dépannage sécurisé",
      seoText:
        "Électriciens certifiés pour pannes électriques, installations, tableaux électriques et mise aux normes de sécurité.",
      count: "120+ réparateurs",
      avgPrice: "À partir de 70€",
      rating: 4.8,
      urgency: "Intervention 2h",
    },
    {
      name: "Chauffage",
      slug: "chauffage",
      icon: "🔥",
      description: "Entretien et réparation de systèmes de chauffage",
      seoText:
        "Techniciens spécialisés en chaudières, radiateurs, pompes à chaleur et systèmes de climatisation pour votre confort.",
      count: "90+ réparateurs",
      avgPrice: "À partir de 90€",
      rating: 4.6,
      urgency: "Intervention 2h30",
    },
    {
      name: "Serrurerie",
      slug: "serrurerie",
      icon: "🔐",
      description: "Ouverture de porte et sécurisation rapide",
      seoText:
        "Serruriers professionnels pour ouverture de porte, changement serrures, blindage et installation systèmes sécurité.",
      count: "75+ réparateurs",
      avgPrice: "À partir de 65€",
      rating: 4.9,
      urgency: "Intervention 45min",
    },
    {
      name: "Multimédia",
      slug: "multimedia",
      icon: "📺",
      description: "Installation et réparation équipements audiovisuels",
      seoText:
        "Techniciens audiovisuels pour réparation TV, installation home cinéma, consoles de jeux et systèmes audio.",
      count: "85+ réparateurs",
      avgPrice: "À partir de 55€",
      rating: 4.7,
      urgency: "Intervention 1h30",
    },
    {
      name: "Téléphonie",
      slug: "telephonie",
      icon: "📱",
      description: "Réparation smartphone et tablette express",
      seoText:
        "Réparateurs mobiles spécialisés écrans cassés, batteries, pannes logicielles avec pièces d'origine et garantie.",
      count: "110+ réparateurs",
      avgPrice: "À partir de 40€",
      rating: 4.8,
      urgency: "Réparation 1h",
    },
    {
      name: "Climatisation",
      slug: "climatisation",
      icon: "❄️",
      description: "Installation et maintenance climatisation",
      seoText:
        "Frigoristes certifiés pour installation, entretien et dépannage climatisation résidentielle et professionnelle.",
      count: "60+ réparateurs",
      avgPrice: "À partir de 85€",
      rating: 4.6,
      urgency: "Intervention 2h",
    },
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

      {/* Statistiques */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2500+</div>
              <div className="text-gray-600">Réparateurs actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">15000+</div>
              <div className="text-gray-600">Réparations réalisées</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">2h</div>
              <div className="text-gray-600">Temps de réponse</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Version complète et professionnelle */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos catégories de dépannage</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des experts qualifiés dans tous les domaines pour répondre à vos besoins de réparation et dépannage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link key={index} href={`/categories/${category.slug}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden">
                  <div className="relative">
                    <CategoryImage
                      category={category.slug}
                      alt={`Réparation ${category.name}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      width={400}
                      height={200}
                    />
                    <div className="absolute top-4 left-4">
                      <div className="text-3xl bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                        {category.icon}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white text-gray-900 shadow-lg">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {category.rating}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-green-600 text-white shadow-lg">{category.urgency}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>

                    <p className="text-gray-700 font-medium mb-3">{category.description}</p>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{category.seoText}</p>

                    {/* Informations pratiques */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {category.count}
                        </span>
                        <span className="font-semibold text-blue-600">{category.avgPrice}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          Disponible 7j/7
                        </span>
                        <span className="text-green-600 font-medium">Devis gratuit</span>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-green-600 transition-colors">
                      Trouver un réparateur
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/categories">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Voir toutes les catégories en détail
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
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

      {/* Témoignages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
            <p className="text-lg text-gray-600">Des milliers de clients satisfaits nous font confiance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Intervention très rapide pour ma panne de lave-linge. Le réparateur était professionnel et le prix très
                correct."
              </p>
              <div className="font-semibold text-gray-900">Marie L. - Paris</div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Excellent service ! Mon ordinateur a été réparé en 2h. Je recommande vivement cette plateforme."
              </p>
              <div className="font-semibold text-gray-900">Pierre M. - Lyon</div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Fuite d'eau réparée en urgence un dimanche. Service impeccable et réparateur très compétent."
              </p>
              <div className="font-semibold text-gray-900">Sophie D. - Marseille</div>
            </Card>
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
