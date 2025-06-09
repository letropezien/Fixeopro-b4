"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, MessageSquare, Eye, Lock, Info } from "lucide-react"
import Link from "next/link"
import { StorageService } from "@/lib/storage"

interface RequestCardProps {
  request: any
  showClientInfo?: boolean
  showActions?: boolean
  showResponses?: boolean
  isCompact?: boolean
}

export function RequestCard({
  request,
  showClientInfo = false,
  showActions = true,
  showResponses = true,
  isCompact = false,
}: RequestCardProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [canViewClientInfo, setCanViewClientInfo] = useState(false)

  useEffect(() => {
    // Vérifier si nous sommes dans un environnement navigateur
    if (typeof window !== "undefined") {
      const user = StorageService.getCurrentUser()
      setCurrentUser(user)

      // Vérifier si l'utilisateur peut voir les informations du client
      if (user) {
        // Admin peut tout voir
        if (user.userType === "admin") {
          setCanViewClientInfo(true)
        }
        // Client peut voir ses propres demandes
        else if (user.userType === "client" && user.id === request.clientId) {
          setCanViewClientInfo(true)
        }
        // Réparateur avec abonnement actif ou en période d'essai
        else if (user.userType === "reparateur") {
          if (user.subscription?.status === "active") {
            setCanViewClientInfo(true)
          } else if (user.subscription?.status === "trial") {
            const trialEndDate = new Date(user.subscription.endDate)
            setCanViewClientInfo(trialEndDate > new Date())
          }
        }
      }
    }
  }, [request.clientId])

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

  return (
    <Card className={`hover:shadow-md transition-shadow ${isCompact ? "p-2" : ""}`}>
      <CardHeader className={isCompact ? "p-2" : ""}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline">{request.category}</Badge>
              <Badge className={getUrgencyColor(request.urgency)}>{request.urgencyLabel}</Badge>
              <Badge className={getStatusColor(request.status)}>{getStatusLabel(request.status)}</Badge>
              <span className="text-sm text-gray-500">{getTimeAgo(request.createdAt)}</span>
            </div>
            <CardTitle className={isCompact ? "text-lg" : "text-xl"}>{request.title}</CardTitle>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              {request.city} ({request.postalCode})
            </div>
            {showResponses && request.responses && (
              <div className="flex items-center text-sm text-gray-600">
                <MessageSquare className="h-4 w-4 mr-1" />
                {request.responses.length || 0} réponse{(request.responses?.length || 0) > 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={isCompact ? "p-2" : ""}>
        <p className={`text-gray-700 mb-4 ${isCompact ? "line-clamp-2" : ""}`}>{request.description}</p>

        {/* Informations client */}
        {showClientInfo && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              Informations client
              {!canViewClientInfo && <Lock className="h-4 w-4 ml-2 text-amber-500" />}
            </h4>

            {canViewClientInfo ? (
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Nom :</span> {request.client.firstName} {request.client.lastName}
                </p>
                {request.client.email && (
                  <p className="text-sm">
                    <span className="font-medium">Email :</span> {request.client.email}
                  </p>
                )}
                {request.client.phone && (
                  <p className="text-sm">
                    <span className="font-medium">Téléphone :</span> {request.client.phone}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded p-2 text-sm text-amber-800">
                <div className="flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Informations masquées</p>
                    <p className="text-xs mt-1">
                      {currentUser?.userType === "reparateur"
                        ? "Abonnez-vous ou profitez de votre période d'essai pour voir les coordonnées des clients."
                        : "Seuls les réparateurs abonnés peuvent voir les coordonnées des clients."}
                    </p>
                    {currentUser?.userType === "reparateur" && (
                      <Button size="sm" variant="outline" className="mt-2 h-7 text-xs" asChild>
                        <Link href="/tarifs">Voir les abonnements</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Réponses récentes */}
        {showResponses && request.responses && request.responses.length > 0 && !isCompact && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
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
              {isCompact
                ? getTimeAgo(request.createdAt)
                : `Créée le ${new Date(request.createdAt).toLocaleDateString("fr-FR")}`}
            </div>
            {request.budget && !isCompact && <div>Budget: {request.budget}</div>}
          </div>

          {showActions && (
            <div className="flex space-x-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/demande/${request.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  {isCompact ? "Détails" : "Voir les détails"}
                </Link>
              </Button>
              {showResponses && request.responses && request.responses.length > 0 && !isCompact && (
                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                  <Link href={`/demande/${request.id}#responses`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Voir les réponses ({request.responses.length})
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RequestCard
