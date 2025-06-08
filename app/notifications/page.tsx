"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, MapPin, User, MessageSquare, Eye, CheckCircle } from "lucide-react"
import { StorageService } from "@/lib/storage"
import Link from "next/link"

interface Notification {
  id: string
  type: "new_request" | "new_response" | "request_update"
  title: string
  message: string
  requestId: string
  isRead: boolean
  createdAt: string
  data?: any
}

export default function NotificationsPage() {
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (currentUser) {
      loadNotifications()
    }
  }, [currentUser])

  const loadNotifications = () => {
    if (!currentUser) return

    const allNotifications: Notification[] = []

    if (currentUser.userType === "reparateur") {
      // Notifications pour les réparateurs
      const requests = StorageService.getRepairRequests()
      const specialties = currentUser.professional?.specialties || []

      // Nouvelles demandes dans les spécialités
      const relevantRequests = requests.filter(
        (request) =>
          request.status === "open" &&
          specialties.some((specialty) => request.category.toLowerCase().includes(specialty.toLowerCase())),
      )

      relevantRequests.forEach((request) => {
        allNotifications.push({
          id: `new_request_${request.id}`,
          type: "new_request",
          title: "Nouvelle demande dans votre spécialité",
          message: `${request.title} - ${request.city}`,
          requestId: request.id,
          isRead: false,
          createdAt: request.createdAt,
          data: request,
        })
      })
    } else {
      // Notifications pour les clients
      const clientRequests = StorageService.getRepairRequestsByClient(currentUser.id)

      clientRequests.forEach((request) => {
        if (request.responses && request.responses.length > 0) {
          request.responses.forEach((response: any) => {
            allNotifications.push({
              id: `response_${response.id}`,
              type: "new_response",
              title: "Nouvelle réponse à votre demande",
              message: `${response.reparateur?.companyName || response.reparateur?.firstName} a répondu à "${request.title}"`,
              requestId: request.id,
              isRead: false,
              createdAt: response.createdAt,
              data: { request, response },
            })
          })
        }
      })
    }

    // Trier par date (plus récent en premier)
    allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setNotifications(allNotifications)
    setUnreadCount(allNotifications.filter((n) => !n.isRead).length)
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    setUnreadCount(0)
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_request":
        return <Bell className="h-5 w-5 text-blue-600" />
      case "new_response":
        return <MessageSquare className="h-5 w-5 text-green-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return "bg-gray-50 border-gray-200"

    switch (type) {
      case "new_request":
        return "bg-blue-50 border-blue-200"
      case "new_response":
        return "bg-green-50 border-green-200"
      default:
        return "bg-yellow-50 border-yellow-200"
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour voir vos notifications.</p>
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Bell className="h-8 w-8 mr-3" />
                Notifications
              </h1>
              <p className="text-gray-600">
                {currentUser.userType === "reparateur"
                  ? "Nouvelles demandes dans vos spécialités"
                  : "Réponses à vos demandes de dépannage"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
              <p className="text-sm text-gray-600">Total notifications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <p className="text-sm text-gray-600">Non lues</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
              <p className="text-sm text-gray-600">Lues</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des notifications */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all duration-200 hover:shadow-md ${getNotificationColor(notification.type, notification.isRead)}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Nouveau
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">{getTimeAgo(notification.createdAt)}</span>
                      </div>
                    </div>

                    <p className={`mb-3 ${notification.isRead ? "text-gray-600" : "text-gray-800"}`}>
                      {notification.message}
                    </p>

                    {notification.data && notification.type === "new_request" && (
                      <div className="bg-white rounded-lg p-3 border mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{notification.data.city}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-gray-400" />
                              <span>
                                {notification.data.client?.firstName} {notification.data.client?.lastName}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline">{notification.data.category}</Badge>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Button asChild size="sm" onClick={() => markAsRead(notification.id)}>
                        <Link href={`/demande/${notification.requestId}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir les détails
                        </Link>
                      </Button>

                      {!notification.isRead && (
                        <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                          Marquer comme lu
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
              <p className="text-gray-600 mb-4">
                {currentUser.userType === "reparateur"
                  ? "Vous n'avez pas de nouvelles demandes dans vos spécialités pour le moment."
                  : "Vous n'avez pas de nouvelles réponses à vos demandes pour le moment."}
              </p>
              <Button asChild>
                <Link href={currentUser.userType === "reparateur" ? "/demandes-disponibles" : "/demande-reparation"}>
                  {currentUser.userType === "reparateur" ? "Voir toutes les demandes" : "Créer une demande"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
