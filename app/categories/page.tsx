import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Shield, TrendingUp } from "lucide-react"

export default function CategoriesPage() {
  const categories = [
    {
      name: "Électroménager",
      slug: "electromenager",
      icon: "🔌",
      image: "/placeholder.svg?height=200&width=300&text=Électroménager",
      description: "Réparation et dépannage de tous vos appareils électroménagers",
      longDescription:
        "Nos experts en électroménager interviennent rapidement pour réparer vos lave-linge, lave-vaisselle, réfrigérateurs, fours, micro-ondes et tous autres appareils. Service de qualité avec garantie sur les réparations.",
      count: "150+ réparateurs",
      avgPrice: "À partir de 45€",
      avgTime: "2h",
      rating: 4.8,
      services: ["Lave-linge", "Lave-vaisselle", "Réfrigérateur", "Four", "Micro-ondes", "Aspirateur"],
      seoKeywords: "réparation électroménager, dépannage lave-linge, réparateur réfrigérateur",
    },
    {
      name: "Informatique",
      slug: "informatique",
      icon: "💻",
      image: "/placeholder.svg?height=200&width=300&text=Informatique",
      description: "Dépannage informatique, réparation PC et Mac, récupération de données",
      longDescription:
        "Problème informatique ? Nos techniciens certifiés interviennent pour le dépannage PC, Mac, installation de logiciels, récupération de données, nettoyage virus et optimisation de performances.",
      count: "200+ réparateurs",
      avgPrice: "À partir de 60€",
      avgTime: "1h30",
      rating: 4.9,
      services: ["Dépannage PC", "Réparation Mac", "Récupération données", "Installation logiciels", "Nettoyage virus"],
      seoKeywords: "dépannage informatique, réparation ordinateur, technicien PC",
    },
    {
      name: "Plomberie",
      slug: "plomberie",
      icon: "🔧",
      image: "/placeholder.svg?height=200&width=300&text=Plomberie",
      description: "Intervention rapide pour fuites, débouchages et installations sanitaires",
      longDescription:
        "Fuite d'eau, canalisation bouchée, installation sanitaire ? Nos plombiers qualifiés interviennent en urgence 24h/24 pour tous vos problèmes de plomberie avec matériel professionnel.",
      count: "180+ réparateurs",
      avgPrice: "À partir de 80€",
      avgTime: "1h",
      rating: 4.7,
      services: ["Fuite d'eau", "Débouchage", "Installation sanitaire", "Chauffe-eau", "Robinetterie"],
      seoKeywords: "plombier urgence, réparation fuite, débouchage canalisation",
    },
    {
      name: "Électricité",
      slug: "electricite",
      icon: "⚡",
      image: "/placeholder.svg?height=200&width=300&text=Électricité",
      description: "Installation électrique, dépannage et mise aux normes par des pros",
      longDescription:
        "Panne électrique, installation défaillante, mise aux normes ? Nos électriciens certifiés interviennent pour tous travaux électriques en respectant les normes de sécurité.",
      count: "120+ réparateurs",
      avgPrice: "À partir de 70€",
      avgTime: "2h",
      rating: 4.8,
      services: ["Panne électrique", "Installation", "Tableau électrique", "Éclairage", "Prise électrique"],
      seoKeywords: "électricien urgence, dépannage électrique, installation électrique",
    },
    {
      name: "Chauffage",
      slug: "chauffage",
      icon: "🔥",
      image: "/placeholder.svg?height=200&width=300&text=Chauffage",
      description: "Entretien et réparation de systèmes de chauffage et climatisation",
      longDescription:
        "Problème de chauffage ou climatisation ? Nos techniciens spécialisés interviennent sur chaudières, radiateurs, pompes à chaleur et systèmes de climatisation pour votre confort.",
      count: "90+ réparateurs",
      avgPrice: "À partir de 90€",
      avgTime: "2h30",
      rating: 4.6,
      services: ["Chaudière", "Radiateur", "Pompe à chaleur", "Climatisation", "Entretien"],
      seoKeywords: "réparation chauffage, dépannage chaudière, technicien climatisation",
    },
    {
      name: "Serrurerie",
      slug: "serrurerie",
      icon: "🔐",
      image: "/placeholder.svg?height=200&width=300&text=Serrurerie",
      description: "Ouverture de porte, changement de serrure et sécurisation",
      longDescription:
        "Porte claquée, serrure cassée, besoin de sécuriser ? Nos serruriers interviennent rapidement pour ouverture de porte, changement de serrure et installation de systèmes de sécurité.",
      count: "75+ réparateurs",
      avgPrice: "À partir de 65€",
      avgTime: "45min",
      rating: 4.9,
      services: ["Ouverture de porte", "Changement serrure", "Blindage", "Clés", "Sécurisation"],
      seoKeywords: "serrurier urgence, ouverture porte, changement serrure",
    },
    {
      name: "Multimédia",
      slug: "multimedia",
      icon: "📺",
      image: "/placeholder.svg?height=200&width=300&text=Multimédia",
      description: "Installation et réparation TV, home cinéma et équipements audio",
      longDescription:
        "Problème de TV, installation home cinéma, panne de console ? Nos techniciens multimédia interviennent pour l'installation et la réparation de tous vos équipements audiovisuels.",
      count: "85+ réparateurs",
      avgPrice: "À partir de 55€",
      avgTime: "1h30",
      rating: 4.7,
      services: ["Réparation TV", "Home cinéma", "Console de jeux", "Installation antenne", "Audio"],
      seoKeywords: "réparation TV, installation home cinéma, technicien audiovisuel",
    },
    {
      name: "Téléphonie",
      slug: "telephonie",
      icon: "📱",
      image: "/placeholder.svg?height=200&width=300&text=Téléphonie",
      description: "Réparation smartphone, tablette et accessoires mobiles",
      longDescription:
        "Écran cassé, problème de batterie, panne logicielle ? Nos réparateurs mobiles interviennent rapidement pour la réparation de smartphones, tablettes et accessoires avec pièces d'origine.",
      count: "110+ réparateurs",
      avgPrice: "À partir de 40€",
      avgTime: "1h",
      rating: 4.8,
      services: ["Écran cassé", "Batterie", "Réparation logicielle", "Tablette", "Accessoires"],
      seoKeywords: "réparation smartphone, écran cassé, réparateur mobile",
    },
    {
      name: "Climatisation",
      slug: "climatisation",
      icon: "❄️",
      image: "/placeholder.svg?height=200&width=300&text=Climatisation",
      description: "Installation, entretien et dépannage de systèmes de climatisation",
      longDescription:
        "Installation de climatisation, entretien ou dépannage ? Nos techniciens frigoristes certifiés interviennent pour tous types de systèmes de climatisation résidentiels et professionnels.",
      count: "60+ réparateurs",
      avgPrice: "À partir de 85€",
      avgTime: "2h",
      rating: 4.6,
      services: ["Installation", "Entretien", "Dépannage", "Nettoyage", "Maintenance"],
      seoKeywords: "installation climatisation, entretien climatiseur, technicien frigoriste",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec SEO */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Toutes nos catégories de <span className="text-blue-600">réparation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Trouvez le bon réparateur selon votre besoin. Nos experts qualifiés couvrent tous les domaines du
              dépannage et de la réparation avec intervention rapide et garantie.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Réparateurs vérifiés</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Intervention rapide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <span>Service de qualité</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-12 bg-gray-50">
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

      {/* Grille des catégories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link key={index} href={`/categories/${category.slug}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden">
                  <div className="relative">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={`Réparation ${category.name}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="text-4xl bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                        {category.icon}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white text-gray-900 shadow-lg">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {category.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                    <p className="text-sm text-gray-500 mb-4">{category.longDescription}</p>

                    {/* Services inclus */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Services inclus :</h4>
                      <div className="flex flex-wrap gap-1">
                        {category.services.slice(0, 3).map((service, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {category.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.services.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

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
                          Intervention en {category.avgTime}
                        </span>
                        <span className="text-green-600 font-medium">Disponible 7j/7</span>
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
        </div>
      </section>

      {/* Section SEO et avantages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Pourquoi choisir nos réparateurs professionnels ?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Réparateurs certifiés et assurés</h3>
                    <p className="text-gray-600">
                      Tous nos professionnels sont vérifiés, qualifiés et disposent d'une assurance responsabilité
                      civile professionnelle.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Intervention rapide garantie</h3>
                    <p className="text-gray-600">
                      Délai d'intervention moyen de 2h pour les urgences, disponibilité 7j/7 selon les spécialités.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-6 w-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Garantie satisfaction</h3>
                    <p className="text-gray-600">
                      Garantie sur toutes les réparations, système d'évaluation transparent et service client dédié.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Comment ça fonctionne ?</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-gray-700">Décrivez votre problème en quelques clics</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-gray-700">Recevez des devis gratuits de réparateurs qualifiés</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-gray-700">Choisissez votre réparateur selon vos critères</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p className="text-gray-700">Profitez d'une réparation professionnelle garantie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Vous ne trouvez pas votre catégorie ?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Décrivez votre problème et nous vous mettrons en relation avec le bon professionnel spécialisé
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/demande-reparation">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Faire une demande personnalisée
              </Button>
            </Link>
            <Link href="/devenir-reparateur">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600"
              >
                Devenir réparateur partenaire
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
