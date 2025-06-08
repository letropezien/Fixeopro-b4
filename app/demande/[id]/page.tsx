"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, User, Phone, Mail, Calendar, MessageSquare, Star } from "lucide-react"
import { StorageService } from "@/lib/storage"
import Link from "next/link"

interface DemandeDetailPageProps {
  params: {
    id: string
  }
}

export default function DemandeDetailPage({ params }: DemandeDetailPageProps) {
  const [request, setRequest] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())

  useEffect(() => {
    const allRequests = StorageService.getRepairRequests()
    const foundRequest = allRequests.find((r) => r.id === params.id)
    setRequest(foundRequest)
  }, [params.id])

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Demande introuvable</h2>
            <p className="text-gray-600 mb-4">Cette demande n'existe pas ou a été supprimée.</p>
            <Link href="/profil">
              <Button>Retour à mon profil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "En attente"
      case "in_progress":
        return "En cours"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  // Simuler des réponses de réparateurs
  const mockResponses = [
    {
      id: 1,
      reparateur: {
        name: "Jean Dupont",
        company: "Réparations Express",
        rating: 4.8,
        avatar: "",
        phone: "01 23 45 67 89",
        email: "jean@reparations-express.fr",
      },
      message:
        "Bonjour, je peux intervenir dès aujourd'hui pour votre problème. J'ai 15 ans d'expérience dans ce domaine.",
      price: "80€",
      availability: "Aujourd'hui 14h-18h",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      reparateur: {
        name: "Marie Martin",
        company: "TechRepair Pro",
        rating: 4.9,
        avatar: "",
        phone: "01 98 76 54 32",
        email: "marie@techrepair.fr",
      },
      message: "Spécialiste de ce type de panne. Intervention possible demain matin avec garantie 6 mois.",
      price: "75€",
      availability: "Demain 9h-12h",
      createdAt: "2024-01-15T11:15:00Z",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profil" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Retour à mon profil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{request.title}</h1>
          <div className="flex items-center space-x-4">
            <Badge className={getUrgencyColor(request.urgency)}>{request.urgencyLabel}</Badge>
            <Badge className={getStatusColor(request.status)}>{getStatusLabel(request.status)}</Badge>
            <span className="text-gray-500 text-sm">
              Créée le {new Date(request.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Détails de la demande */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description du problème</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{request.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Catégorie :</span>
                    <p className="text-gray-600 capitalize">{request.category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Urgence :</span>
                    <p className="text-gray-600">{request.urgencyLabel}</p>
                  </div>
                  {request.budget && (
                    <div>
                      <span className="font-medium text-gray-700">Budget :</span>
                      <p className="text-gray-600">{request.budget}€</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Réponses :</span>
                    <p className="text-gray-600">
                      {request.responses} réparateur{request.responses > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Réponses des réparateurs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Réponses des réparateurs ({mockResponses.length})
                </CardTitle>
                <CardDescription>Les professionnels intéressés par votre demande</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockResponses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={response.reparateur.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {response.reparateur.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{response.reparateur.name}</h4>
                              <p className="text-sm text-gray-600">{response.reparateur.company}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-sm text-yellow-600 mb-1">
                                <Star className="h-4 w-4 mr-1 fill-current" />
                                {response.reparateur.rating}
                              </div>
                              <p className="text-lg font-semibold text-green-600">{response.price}</p>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3">{response.message}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {response.availability}
                            </div>

                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4 mr-1" />
                                Appeler
                              </Button>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Mail className="h-4 w-4 mr-1" />
                                Contacter
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {mockResponses.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aucune réponse pour le moment</h3>
                      <p className="text-gray-600">Les réparateurs vont bientôt répondre à votre demande</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{request.city}</p>
                <p className="text-gray-600">{request.postalCode}</p>
                {request.address && <p className="text-sm text-gray-600 mt-2">{request.address}</p>}
                <Link href="/carte">
                  <Button variant="outline" className="w-full mt-4">
                    Voir sur la carte
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Votre demande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut :</span>
                  <Badge className={getStatusColor(request.status)}>{getStatusLabel(request.status)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Réponses :</span>
                  <span className="font-medium">{request.responses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Créée le :</span>
                  <span className="font-medium">{new Date(request.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Modifier la demande
                </Button>
                <Button variant="outline" className="w-full">
                  Marquer comme résolue
                </Button>
                <Button variant="destructive" className="w-full">
                  Annuler la demande
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
