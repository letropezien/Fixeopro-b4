"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, MessageSquare, Eye, Plus, User } from "lucide-react"
import { StorageService } from "@/lib/storage"
import Link from "next/link"

export default function MesDemandesPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier si nous sommes dans un environnement navigateur
    if (typeof window !== "undefined") {
      const user = StorageService.getCurrentUser()
      setCurrentUser(user)

      if (user) {
        const clientRequests = StorageService.getRepairRequestsByClient(user.id)
        setRequests(clientRequests)
      }
      setIsLoading(false)
    }
  }, [])

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
        return "Ouverte"
      case "in_progress":
        return "En cours"
      case "completed":
        return "Terminée"
      case "cancelled":
        return "Annulée"
      default:
        return "Inconnue"
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!currentUser || currentUser.userType !== "client") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès client requis</h2>
            <p className="text-gray-600 mb-4">Cette page est réservée aux clients de la plateforme.</p>
            <Button asChild>
              <Link href="/connexion">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Demandes de Dépannage</h1>
              <p className="text-gray-600">Suivez l'état de vos demandes et les réponses des réparateurs</p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/demande-reparation">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle demande
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
              <p className="text-sm text-gray-600">Total demandes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter((r) => r.status === "open").length}
              </div>
              <p className="text-sm text-gray-600">Ouvertes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {requests.reduce((total, r) => total + (r.responses?.length || 0), 0)}
              </div>
              <p className="text-sm text-gray-600">Réponses reçues</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {requests.filter((r) => r.status === "completed").length}
              </div>
              <p className="text-sm text-gray-600">Terminées</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des demandes */}
        <div className="space-y-6">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline">{request.category}</Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>{request.urgencyLabel}</Badge>
                      <Badge className={getStatusColor(request.status)}>{getStatusLabel(request.status)}</Badge>
                      <span className="text-sm text-gray-500">{getTimeAgo(request.createdAt)}</span>
                    </div>
                    <CardTitle className="text-xl">{request.title}</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {request.city} ({request.postalCode})
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {request.responses?.length || 0} réponse{(request.responses?.length || 0) > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{request.description}</p>

                {/* Réponses récentes */}
                {request.responses && request.responses.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Dernières réponses :</h4>
                    <div className="space-y-2">
                      {request.responses.slice(0, 2).map((response: any, index: number) => (
                        <div key={index} className="bg-white rounded p-3 border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">
                              {response.reparateur?.companyName ||
                                `${response.reparateur?.firstName} ${response.reparateur?.lastName}`}
                            </span>
                            <span className="text-xs text-gray-500">{getTimeAgo(response.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {response.text.length > 100 ? `${response.text.substring(0, 100)}...` : response.text}
                          </p>
                        </div>
                      ))}
                      {request.responses.length > 2 && (
                        <p className="text-sm text-gray-500 text-center">
                          +{request.responses.length - 2} autre{request.responses.length - 2 > 1 ? "s" : ""} réponse
                          {request.responses.length - 2 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Créée le {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                    {request.budget && <div>Budget: {request.budget}</div>}
                  </div>

                  <div className="flex space-x-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/demande/${request.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir les détails
                      </Link>
                    </Button>
                    {request.responses && request.responses.length > 0 && (
                      <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                        <Link href={`/demande/${request.id}#responses`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Voir les réponses ({request.responses.length})
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {requests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune demande pour le moment</h3>
              <p className="text-gray-600 mb-4">Vous n'avez pas encore créé de demande de dépannage.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/demande-reparation">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer ma première demande
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
