import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Clock, Shield, Star, MapPin, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const categories = [
    { name: "Électroménager", icon: "🔌", count: "150+ réparateurs" },
    { name: "Informatique", icon: "💻", count: "120+ réparateurs" },
    { name: "Plomberie", icon: "🔧", count: "200+ réparateurs" },
    { name: "Électricité", icon: "⚡", count: "180+ réparateurs" },
    { name: "Chauffage", icon: "🔥", count: "90+ réparateurs" },
    { name: "Serrurerie", icon: "🔑", count: "110+ réparateurs" },
    { name: "Multimédia", icon: "📱", count: "80+ réparateurs" },
    { name: "Téléphonie", icon: "📞", count: "95+ réparateurs" },
    { name: "Climatisation", icon: "❄️", count: "70+ réparateurs" },
  ]

  const features = [
    {
      icon: Clock,
      title: "Intervention rapide",
      description: "Trouvez un réparateur disponible immédiatement",
    },
    {
      icon: Shield,
      title: "Professionnels certifiés",
      description: "Tous nos réparateurs sont vérifiés et qualifiés",
    },
    {
      icon: Star,
      title: "Qualité garantie",
      description: "Évaluations clients pour un service de qualité",
    },
    {
      icon: MapPin,
      title: "Proximité locale",
      description: "Des experts près de chez vous",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Wrench className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">🔧 FixeoPro.fr</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Trouvez rapidement un expert pour vos réparations et dépannages
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/demande-reparation">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Demander une réparation
              </Button>
            </Link>
            <Link href="/devenir-reparateur">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Devenir réparateur
              </Button>
            </Link>
          </div>

          {/* Action rapide */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-center mb-4">Action rapide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/demande-reparation" className="block">
                <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <h4 className="font-semibold text-blue-900 mb-2">J'ai besoin d'une réparation</h4>
                    <p className="text-sm text-gray-600">Décrivez votre problème et trouvez un expert</p>
                    <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700">Commencer maintenant</Button>
                  </div>
                </div>
              </Link>

              <Link href="/devenir-reparateur" className="block">
                <div className="border-2 border-green-200 rounded-lg p-4 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer">
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👨‍🔧</span>
                    </div>
                    <h4 className="font-semibold text-green-900 mb-2">Je suis un réparateur</h4>
                    <p className="text-sm text-gray-600">Rejoignez notre réseau de professionnels</p>
                    <Button className="mt-3 w-full bg-green-600 hover:bg-green-700">S'inscrire maintenant</Button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              FixeoPro.fr est la plateforme de référence pour toute personne à la recherche d'un professionnel de la
              réparation ou du dépannage, près de chez elle. Notre mission est simple : vous trouver un expert qualifié,
              rapidement, et en toute confiance.
            </p>
            <p className="text-gray-600 mb-8">
              Que vous soyez confronté à une panne d'électroménager, un problème électrique, une fuite de plomberie, ou
              un équipement high-tech en panne, FixeoPro.fr vous met en relation avec des réparateurs certifiés,
              sélectionnés pour leur fiabilité, leur expertise et leur proximité.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">✅ Une plateforme simple, rapide et efficace</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <CardTitle>1. Décrivez votre panne</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Vous décrivez votre panne ou votre besoin via un formulaire intuitif.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <CardTitle>2. Nous trouvons l'expert</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Nous identifions pour vous les experts disponibles dans votre région.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <CardTitle>3. Mise en relation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vous recevez rapidement une mise en relation avec un professionnel de confiance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">🛠️ Tous les domaines de réparation couverts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={`/categories/${category.name.toLowerCase()}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={`/images/categories/${category.name.toLowerCase().replace("é", "e").replace("è", "e")}.jpg`}
                      alt={`Réparation ${category.name}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-2 text-lg">{category.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/categories">
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Voir toutes les catégories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">🔍 Pourquoi choisir FixeoPro.fr ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Gain de temps
                </h3>
                <p className="text-gray-600 text-sm">
                  Fini les recherches interminables sur Internet ou les appels sans réponse.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Transparence
                </h3>
                <p className="text-gray-600 text-sm">
                  Pas de frais cachés, vous êtes informé du tarif avant l'intervention.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Local presence */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">📍 Une présence locale pour plus de proximité</h2>
          <p className="text-lg text-gray-700 mb-8">
            Nous croyons en l'importance de l'artisanat local. C'est pourquoi FixeoPro.fr privilégie les professionnels
            de votre région, pour une intervention plus rapide et un service plus humain.
          </p>
          <p className="text-xl font-semibold text-blue-600 mb-8">
            FixeoPro.fr, c'est bien plus qu'un annuaire de réparateurs. C'est une solution sur mesure, pensée pour vous
            simplifier la vie.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">➡️ Prêt à commencer ?</h2>
          <p className="text-xl mb-8">
            Inscrivez-vous gratuitement ou faites une demande d'intervention dès maintenant
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demande-reparation">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Demander une intervention
              </Button>
            </Link>
            <Link href="/devenir-reparateur">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
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
