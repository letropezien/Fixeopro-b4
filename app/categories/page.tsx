"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"
import { CategoryImage } from "@/components/category-image"

export default function CategoriesPage() {
  const categories = [
    {
      name: "Électroménager",
      slug: "electromenager",
      image: "/images/categories/electromenager.png",
      count: "150+ réparateurs",
      description:
        "Réparation et dépannage de tous vos appareils électroménagers : lave-linge, lave-vaisselle, réfrigérateur, four, micro-ondes, aspirateur. Nos experts interviennent rapidement pour diagnostiquer et réparer vos équipements défaillants. Service de qualité avec pièces détachées d'origine et garantie sur les réparations.",
      services: ["Lave-linge", "Lave-vaisselle", "Réfrigérateur", "Four", "Micro-ondes", "Aspirateur"],
      avgPrice: "80-150€",
      responseTime: "2-4h",
    },
    {
      name: "Informatique",
      slug: "informatique",
      image: "/images/categories/informatique.png",
      count: "120+ réparateurs",
      description:
        "Dépannage informatique à domicile et en atelier : réparation d'ordinateurs, laptops, tablettes, récupération de données, installation de logiciels, nettoyage de virus. Nos techniciens certifiés interviennent sur toutes marques et tous systèmes d'exploitation pour résoudre vos problèmes informatiques.",
      services: ["Ordinateur portable", "PC de bureau", "Tablette", "Récupération données", "Virus", "Installation"],
      avgPrice: "60-120€",
      responseTime: "1-3h",
    },
    {
      name: "Plomberie",
      slug: "plomberie",
      image: "/images/categories/plomberie.png",
      count: "200+ réparateurs",
      description:
        "Services de plomberie d'urgence et programmée : réparation de fuites, débouchage de canalisations, installation de robinetterie, réparation de chauffe-eau, dépannage de WC. Plombiers qualifiés disponibles 24h/24 pour tous vos problèmes de plomberie avec intervention rapide.",
      services: ["Fuite d'eau", "Débouchage", "Robinetterie", "Chauffe-eau", "WC", "Canalisation"],
      avgPrice: "90-200€",
      responseTime: "30min-2h",
    },
    {
      name: "Électricité",
      slug: "electricite",
      image: "/images/categories/electricite.png",
      count: "180+ réparateurs",
      description:
        "Dépannage électrique par des électriciens agréés : panne de courant, court-circuit, installation d'éclairage, réparation de prises, mise aux normes électriques, installation de tableaux électriques. Intervention sécurisée avec respect des normes en vigueur et certificat de conformité.",
      services: ["Panne électrique", "Court-circuit", "Éclairage", "Prises", "Tableau électrique", "Mise aux normes"],
      avgPrice: "70-180€",
      responseTime: "1-3h",
    },
    {
      name: "Chauffage",
      slug: "chauffage",
      image: "/images/categories/chauffage.png",
      count: "90+ réparateurs",
      description:
        "Réparation et entretien de systèmes de chauffage : chaudière gaz, fioul, électrique, pompe à chaleur, radiateurs, plancher chauffant. Chauffagistes qualifiés RGE pour dépannage d'urgence, entretien annuel et installation de nouveaux équipements avec garantie constructeur.",
      services: ["Chaudière", "Radiateur", "Pompe à chaleur", "Plancher chauffant", "Thermostat", "Entretien"],
      avgPrice: "100-250€",
      responseTime: "2-4h",
    },
    {
      name: "Serrurerie",
      slug: "serrurerie",
      image: "/images/categories/serrurerie.png",
      count: "110+ réparateurs",
      description:
        "Services de serrurerie d'urgence 24h/24 : ouverture de porte claquée, remplacement de serrures, installation de systèmes de sécurité, blindage de porte, reproduction de clés. Serruriers agréés assurance avec devis gratuit et intervention sans casse quand c'est possible.",
      services: ["Ouverture de porte", "Serrure", "Blindage", "Clés", "Sécurité", "Coffre-fort"],
      avgPrice: "80-200€",
      responseTime: "30min-1h",
    },
    {
      name: "Multimédia",
      slug: "multimedia",
      image: "/images/categories/multimedia.png",
      count: "80+ réparateurs",
      description:
        "Réparation d'équipements multimédia et audiovisuels : télévision, home cinéma, chaîne hi-fi, console de jeux, projecteur, installation antenne. Techniciens spécialisés pour diagnostic, réparation et installation de vos équipements de divertissement avec pièces d'origine.",
      services: ["Télévision", "Home cinéma", "Console", "Projecteur", "Antenne", "Audio"],
      avgPrice: "70-150€",
      responseTime: "2-4h",
    },
    {
      name: "Téléphonie",
      slug: "telephonie",
      image: "/images/categories/telephonie.png",
      count: "95+ réparateurs",
      description:
        "Réparation de téléphones et équipements de communication : smartphone, téléphone fixe, installation de lignes téléphoniques, réparation d'écrans, remplacement de batteries, récupération de données. Service rapide avec pièces détachées de qualité et garantie sur les réparations.",
      services: ["Smartphone", "Écran", "Batterie", "Téléphone fixe", "Récupération", "Accessoires"],
      avgPrice: "50-120€",
      responseTime: "1-2h",
    },
    {
      name: "Climatisation",
      slug: "climatisation",
      image: "/images/categories/climatisation.png",
      count: "70+ réparateurs",
      description:
        "Installation, réparation et entretien de systèmes de climatisation : climatiseur split, multi-split, gainable, mobile, pompe à chaleur réversible. Frigoristes qualifiés pour dépannage, recharge en fluide frigorigène, nettoyage et maintenance préventive de vos équipements de climatisation.",
      services: ["Climatiseur", "Entretien", "Recharge gaz", "Installation", "Pompe à chaleur", "Ventilation"],
      avgPrice: "90-200€",
      responseTime: "2-4h",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Toutes nos catégories de réparation</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Découvrez tous les domaines d'expertise de nos réparateurs professionnels. Des interventions rapides et de
            qualité pour tous vos besoins de dépannage.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>800+ réparateurs certifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Intervention sous 2h</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Partout en France</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8">
            {categories.map((category, index) => (
              <Card key={category.slug} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? "md:grid-flow-col-dense" : ""}`}>
                  {/* Image */}
                  <div className={`relative h-64 md:h-80 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                    <CategoryImage
                      category={category.slug}
                      alt={`Réparation ${category.name}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white">{category.count}</Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-8 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl md:text-3xl text-blue-900 mb-2">{category.name}</CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">Prix moyen:</span>
                          <span>{category.avgPrice}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{category.responseTime}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <p className="text-gray-700 mb-6 leading-relaxed">{category.description}</p>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Services inclus :</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href={`/categories/${category.slug}`} className="flex-1">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Voir les réparateurs
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href="/demande-reparation" className="flex-1">
                          <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                            Demander un devis
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Vous ne trouvez pas votre catégorie ?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Contactez-nous ! Nous avons des experts dans de nombreux autres domaines et nous pouvons vous mettre en
            relation avec le bon professionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Nous contacter
              </Button>
            </Link>
            <Link href="/demande-reparation">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Faire une demande personnalisée
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
