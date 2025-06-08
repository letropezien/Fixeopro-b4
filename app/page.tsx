"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Clock,
  Star,
  Wrench,
  Smartphone,
  Laptop,
  Car,
  Home,
  Zap,
  Droplets,
  Wind,
  Shield,
  Settings,
} from "lucide-react"
import { StorageService } from "@/lib/storage"

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const [showAdminSetup, setShowAdminSetup] = useState(false)

  useEffect(() => {
    // Vérifier si un admin existe
    const users = StorageService.getUsers()
    const adminExists = users.some((user) => user.userType === "admin")
    setShowAdminSetup(!adminExists)
  }, [])

  const categories = [
    { name: "Électroménager", icon: Home, color: "bg-blue-500", count: "150+ réparateurs" },
    { name: "Informatique", icon: Laptop, color: "bg-purple-500", count: "200+ réparateurs" },
    { name: "Téléphonie", icon: Smartphone, color: "bg-green-500", count: "180+ réparateurs" },
    { name: "Automobile", icon: Car, color: "bg-red-500", count: "120+ réparateurs" },
    { name: "Électricité", icon: Zap, color: "bg-yellow-500", count: "90+ réparateurs" },
    { name: "Plomberie", icon: Droplets, color: "bg-cyan-500", count: "110+ réparateurs" },
    { name: "Chauffage", icon: Wind, color: "bg-orange-500", count: "80+ réparateurs" },
    { name: "Serrurerie", icon: Shield, color: "bg-gray-500", count: "60+ réparateurs" },
  ]

  const recentRequests = [
    {
      id: 1,
      title: "Réparation machine à laver",
      category: "Électroménager",
      location: "Paris 15ème",
      urgency: "Urgent",
      time: "Il y a 5 min",
      responses: 3,
    },
    {
      id: 2,
      title: "Écran iPhone cassé",
      category: "Téléphonie",
      location: "Lyon 3ème",
      urgency: "Cette semaine",
      time: "Il y a 12 min",
      responses: 7,
    },
    {
      id: 3,
      title: "Problème de chauffage",
      category: "Chauffage",
      location: "Marseille 8ème",
      urgency: "Aujourd'hui",
      time: "Il y a 18 min",
      responses: 2,
    },
    {
      id: 4,
      title: "Ordinateur qui ne démarre plus",
      category: "Informatique",
      location: "Toulouse Centre",
      urgency: "Flexible",
      time: "Il y a 25 min",
      responses: 5,
    },
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Urgent":
        return "bg-red-100 text-red-800"
      case "Aujourd'hui":
        return "bg-orange-100 text-orange-800"
      case "Cette semaine":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trouvez le bon réparateur
            <br />
            <span className="text-blue-200">près de chez vous</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Connectez-vous avec des professionnels qualifiés pour tous vos besoins de réparation. Rapide, fiable et
            transparent.
          </p>

          {/* Admin Setup Alert */}
          {showAdminSetup && (
            <div className="mb-8 max-w-md mx-auto">
              <div className="bg-yellow-500 text-yellow-900 p-4 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Settings className="h-5 w-5 mr-2" />
                  <span className="font-medium">Configuration requise</span>
                </div>
                <p className="text-sm mb-3">Configurez votre compte administrateur pour sécuriser la plateforme</p>
                <Link href="/admin-setup">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    <Shield className="h-4 w-4 mr-2" />
                    Configurer l'admin
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/demande-reparation">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                <Search className="mr-2 h-5 w-5" />
                Demander une réparation
              </Button>
            </Link>
            <Link href="/devenir-reparateur">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              >
                <Wrench className="mr-2 h-5 w-5" />
                Devenir réparateur
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nos catégories de services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des professionnels qualifiés dans tous les domaines pour répondre à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Link key={index} href={`/categories/${category.name.toLowerCase()}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.count}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
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

      {/* Recent Requests Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Demandes récentes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les dernières demandes de réparation publiées par nos clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {recentRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location}
                      </CardDescription>
                    </div>
                    <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {request.time}
                    </div>
                    <div className="flex items-center text-sm text-blue-600">
                      <Star className="h-4 w-4 mr-1" />
                      {request.responses} réponse{request.responses > 1 ? "s" : ""}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/listes-demandes">
              <Button variant="outline" size="lg">
                Voir toutes les demandes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à Fixeo.pro pour leurs réparations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demande-reparation">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Publier une demande
              </Button>
            </Link>
            <Link href="/devenir-reparateur">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Rejoindre comme réparateur
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
