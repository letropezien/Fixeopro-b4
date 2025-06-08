"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, User, Search } from "lucide-react"
import { StorageService } from "@/lib/storage"
import Link from "next/link"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [requests, setRequests] = useState(StorageService.getRepairRequests())
  const category = decodeURIComponent(params.category)

  useEffect(() => {
    setRequests(StorageService.getRepairRequests())
  }, [])

  const categoryRequests = requests.filter((request) => request.category.toLowerCase() === category.toLowerCase())

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "same-day":
        return "bg-orange-100 text-orange-800"
      case "this-week":
        return "bg-yellow-100 text-yellow-800"
      case "flexible":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Il y a moins d'1h"
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      électroménager: "🔌",
      informatique: "💻",
      plomberie: "🔧",
      électricité: "⚡",
      chauffage: "🔥",
      serrurerie: "🔑",
      multimédia: "📱",
      téléphonie: "📞",
      climatisation: "❄️",
    }
    return icons[category.toLowerCase()] || "🔧"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getCategoryIcon(category)}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">Réparations {category}</h1>
          <p className="text-gray-600">
            {categoryRequests.length} demande{categoryRequests.length > 1 ? "s" : ""} en cours dans cette catégorie
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4 mb-8">
          <Link href="/demande-reparation">
            <Button className="bg-blue-600 hover:bg-blue-700">Créer une demande</Button>
          </Link>
          <Link href="/carte">
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Voir sur la carte
            </Button>
          </Link>
        </div>

        {/* Liste des demandes */}
        {categoryRequests.length > 0 ? (
          <div className="space-y-6">
            {categoryRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getUrgencyColor(request.urgency)}>{request.urgencyLabel}</Badge>
                        <span className="text-sm text-gray-500">{getTimeAgo(request.createdAt)}</span>
                      </div>
                      <CardTitle className="text-xl">{request.title}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.city} ({request.postalCode})
                      </div>
                      {request.budget && <div className="text-sm text-gray-600">Budget: {request.budget}€</div>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{request.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        {request.client.firstName} {request.client.lastName}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {request.responses} réponse{request.responses > 1 ? "s" : ""}
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-1" />
                      Voir les détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">{getCategoryIcon(category)}</div>
              <h3 className="text-lg font-semibold mb-2">Aucune demande en cours</h3>
              <p className="text-gray-600 mb-6">Soyez le premier à publier une demande dans la catégorie {category}</p>
              <Link href="/demande-reparation">
                <Button className="bg-blue-600 hover:bg-blue-700">Créer la première demande</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Informations sur la catégorie */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>À propos des réparations {category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Types de pannes courantes :</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {category.toLowerCase() === "électroménager" && (
                    <>
                      <li>• Lave-linge qui ne démarre pas</li>
                      <li>• Réfrigérateur qui ne refroidit plus</li>
                      <li>• Four qui ne chauffe pas</li>
                      <li>• Lave-vaisselle qui fuit</li>
                    </>
                  )}
                  {category.toLowerCase() === "informatique" && (
                    <>
                      <li>• Ordinateur qui ne démarre pas</li>
                      <li>• Écran cassé</li>
                      <li>• Problème de virus</li>
                      <li>• Récupération de données</li>
                    </>
                  )}
                  {category.toLowerCase() === "plomberie" && (
                    <>
                      <li>• Fuite d'eau</li>
                      <li>• Canalisation bouchée</li>
                      <li>• Robinet qui goutte</li>
                      <li>• Chauffe-eau en panne</li>
                    </>
                  )}
                  {category.toLowerCase() === "téléphonie" && (
                    <>
                      <li>• Écran de smartphone cassé</li>
                      <li>• Problème de batterie</li>
                      <li>• Téléphone qui ne charge plus</li>
                      <li>• Problème de réseau</li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Conseils avant l'intervention :</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Décrivez précisément le problème</li>
                  <li>• Notez les circonstances de la panne</li>
                  <li>• Préparez les documents de garantie</li>
                  <li>• Libérez l'accès à l'appareil</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
