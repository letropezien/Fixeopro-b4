"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Shield, TrendingUp } from "lucide-react"
import { CategoriesService, type Category } from "@/lib/categories-service"

// Données additionnelles pour l'affichage
const getCategoryDisplayData = (categoryId: string) => {
  const data = {
    electromenager: {
      count: "150+ réparateurs",
      avgPrice: "À partir de 45€",
      avgTime: "2h",
      rating: 4.8,
    },
    informatique: {
      count: "200+ réparateurs",
      avgPrice: "À partir de 60€",
      avgTime: "1h30",
      rating: 4.9,
    },
    telephonie: {
      count: "110+ réparateurs",
      avgPrice: "À partir de 40€",
      avgTime: "1h",
      rating: 4.8,
    },
    electronique: {
      count: "95+ réparateurs",
      avgPrice: "À partir de 55€",
      avgTime: "1h45",
      rating: 4.7,
    },
    plomberie: {
      count: "180+ réparateurs",
      avgPrice: "À partir de 80€",
      avgTime: "1h",
      rating: 4.7,
    },
    electricite: {
      count: "120+ réparateurs",
      avgPrice: "À partir de 70€",
      avgTime: "2h",
      rating: 4.8,
    },
    chauffage: {
      count: "90+ réparateurs",
      avgPrice: "À partir de 90€",
      avgTime: "2h30",
      rating: 4.6,
    },
    climatisation: {
      count: "60+ réparateurs",
      avgPrice: "À partir de 85€",
      avgTime: "2h",
      rating: 4.6,
    },
    serrurerie: {
      count: "75+ réparateurs",
      avgPrice: "À partir de 65€",
      avgTime: "45min",
      rating: 4.9,
    },
    vitrerie: {
      count: "65+ réparateurs",
      avgPrice: "À partir de 75€",
      avgTime: "1h15",
      rating: 4.7,
    },
    menuiserie: {
      count: "70+ réparateurs",
      avgPrice: "À partir de 85€",
      avgTime: "3h",
      rating: 4.8,
    },
    jardinage: {
      count: "55+ réparateurs",
      avgPrice: "À partir de 50€",
      avgTime: "1h30",
      rating: 4.5,
    },
    automobile: {
      count: "130+ réparateurs",
      avgPrice: "À partir de 60€",
      avgTime: "2h",
      rating: 4.7,
    },
    nettoyage: {
      count: "85+ réparateurs",
      avgPrice: "À partir de 40€",
      avgTime: "2h30",
      rating: 4.6,
    },
    demenagement: {
      count: "45+ réparateurs",
      avgPrice: "À partir de 120€",
      avgTime: "4h",
      rating: 4.7,
    },
    multimedia: {
      count: "100+ réparateurs",
      avgPrice: "À partir de 55€",
      avgTime: "1h30",
      rating: 4.8,
    },
  }

  // Valeurs par défaut si la catégorie n'est pas trouvée
  return (
    data[categoryId as keyof typeof data] || {
      count: "50+ réparateurs",
      avgPrice: "À partir de 50€",
      avgTime: "2h",
      rating: 4.5,
    }
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Charger les catégories depuis le service
    const loadCategories = () => {
      try {
        // Forcer la réinitialisation des catégories pour s'assurer que Multimédia est présent
        CategoriesService.resetCategories()

        // Charger toutes les catégories
        const allCategories = CategoriesService.getCategories()
        console.log(
          "Catégories chargées:",
          allCategories.map((c) => c.name),
        )
        setCategories(allCategories)
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Fonction pour extraire les services à partir des sous-catégories
  const getServicesFromSubcategories = (category: Category) => {
    return category.subCategories.map((sub) => sub.name)
  }

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
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-gray-500">
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
          {isLoading ? (
            // Skeleton loader pendant le chargement
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => {
                const displayData = getCategoryDisplayData(category.id)
                const services = getServicesFromSubcategories(category)

                return (
                  <Link key={category.id} href={`/categories/${category.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden">
                      <div className="relative">
                        <img
                          src={category.image || `/placeholder.svg?height=200&width=300&text=${category.name}`}
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
                            {displayData.rating}
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

                        {/* Services inclus */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Services inclus :</h4>
                          <div className="flex flex-wrap gap-1">
                            {services.slice(0, 3).map((service, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{services.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Informations pratiques */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              {displayData.count}
                            </span>
                            <span className="font-semibold text-blue-600">{displayData.avgPrice}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              Intervention en {displayData.avgTime}
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
                )
              })}
            </div>
          )}
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
