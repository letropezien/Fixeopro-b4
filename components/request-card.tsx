"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Euro, Phone, Mail, User, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import Link from "next/link"

interface RequestCardProps {
  id: string
  title: string
  description: string
  category: string
  location: string
  clientName: string
  clientEmail: string
  clientPhone: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
  createdAt: string
  budget?: number
  photos?: string[]
  urgency: "low" | "medium" | "high"
  showContactInfo?: boolean
  onContact?: () => void
  onAccept?: () => void
  className?: string
}

export function RequestCard({
  id,
  title,
  description,
  category,
  location,
  clientName,
  clientEmail,
  clientPhone,
  status,
  createdAt,
  budget,
  photos,
  urgency,
  showContactInfo = false,
  onContact,
  onAccept,
  className = "",
}: RequestCardProps) {
  const { user } = useAuth()
  const [canViewContacts, setCanViewContacts] = useState(false)
  const [contactReason, setContactReason] = useState<string>("")

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setCanViewContacts(false)
        setContactReason("Vous devez être connecté")
        return
      }

      if (user.type === "admin") {
        setCanViewContacts(true)
        return
      }

      if (user.type === "client") {
        // Les clients peuvent voir leurs propres demandes
        setCanViewContacts(user.id === clientEmail) // Assuming clientEmail is used as identifier
        if (user.id !== clientEmail) {
          setContactReason("Vous ne pouvez voir que vos propres demandes")
        }
        return
      }

      if (user.type === "repairer") {
        const response = await api.checkSubscription(user.id)
        if (response.success && response.data) {
          setCanViewContacts(response.data.canViewContacts)
          setContactReason(response.data.reason || "")
        }
      }
    }

    checkAccess()
  }, [user, clientEmail])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateDescription = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</CardTitle>
          <div className="flex gap-2 ml-2">
            <Badge className={getStatusColor(status)} variant="secondary">
              {status === "pending" && "En attente"}
              {status === "accepted" && "Acceptée"}
              {status === "in_progress" && "En cours"}
              {status === "completed" && "Terminée"}
              {status === "cancelled" && "Annulée"}
            </Badge>
            <Badge className={getUrgencyColor(urgency)} variant="secondary">
              {urgency === "high" && "Urgent"}
              {urgency === "medium" && "Moyen"}
              {urgency === "low" && "Faible"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">{truncateDescription(description)}</p>

        {/* Category and Location */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Budget */}
        {budget && (
          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
            <Euro className="h-4 w-4" />
            <span>Budget: {budget}€</span>
          </div>
        )}

        {/* Photos */}
        {photos && photos.length > 0 && (
          <div className="flex gap-2">
            {photos.slice(0, 3).map((photo, index) => (
              <img
                key={index}
                src={photo || "/placeholder.svg"}
                alt={`Photo ${index + 1}`}
                className="w-16 h-16 object-cover rounded-md border"
              />
            ))}
            {photos.length > 3 && (
              <div className="w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center text-xs text-gray-500">
                +{photos.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t pt-4">
          {canViewContacts ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{clientName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${clientEmail}`} className="text-blue-600 hover:underline">
                  {clientEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href={`tel:${clientPhone}`} className="text-blue-600 hover:underline">
                  {clientPhone}
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-yellow-800">
                <Lock className="h-4 w-4" />
                <span className="font-medium">Informations masquées</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                {contactReason || "Abonnez-vous pour voir les coordonnées du client"}
              </p>
              {user?.type === "repairer" && (
                <div className="mt-2 flex gap-2">
                  <Link href="/tarifs">
                    <Button size="sm" variant="outline" className="text-xs">
                      S'abonner
                    </Button>
                  </Link>
                  <Link href="/devenir-reparateur">
                    <Button size="sm" variant="outline" className="text-xs">
                      Période d'essai
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/demande/${id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Voir détails
            </Button>
          </Link>

          {onContact && canViewContacts && (
            <Button onClick={onContact} className="flex-1">
              Contacter
            </Button>
          )}

          {onAccept && status === "pending" && user?.type === "repairer" && (
            <Button onClick={onAccept} className="flex-1">
              Accepter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Export as named export
