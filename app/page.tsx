import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Search, MapPin, Star, Clock, Shield, TrendingUp } from "lucide-react"
import { CategoryImage } from "@/components/category-image"
import { RandomRepairers } from "@/components/random-repairers"
import { CategoriesService } from "@/lib/categories-service"

export default function HomePage() {
  // Récupérer toutes les catégories depuis le service
  const categories = CategoriesService.getEnabledCategories()

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
              <Link key={index} href={`/categories/${category.id}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden">
                  <div className="relative">
                    <CategoryImage
                      category={category.id}
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
                        {(4 + Math.random()).toFixed(1)}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-green-600 text-white shadow-lg">
                        {Math.random() > 0.5 ? "Intervention 2h" : "Disponible 24/7"}
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

                    <p className="text-gray-700 font-medium mb-3">{category.description}</p>

                    {/* Sous-catégories */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {category.subCategories.slice(0, 3).map((subCat, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {subCat.name}
                          </Badge>
                        ))}
                        {category.subCategories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.subCategories.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Informations pratiques */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {Math.floor(Math.random() * 200) + 50}+ réparateurs
                        </span>
                        <span className="font-semibold text-blue-600">
                          À partir de {Math.floor(Math.random() * 50) + 30}€
                        </span>
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

      {/* Section Réparateurs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos réparateurs professionnels</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez notre réseau de réparateurs qualifiés prêts à intervenir pour tous vos besoins
            </p>
          </div>

          <RandomRepairers />

          <div className="text-center mt-10">
            <Link href="/liste-reparateurs">
              <Button variant="outline" size="lg">
                Voir tous les réparateurs
              </Button>
            </Link>
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
