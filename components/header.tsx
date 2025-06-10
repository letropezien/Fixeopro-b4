"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Wrench,
  Menu,
  User,
  Settings,
  LogOut,
  Bell,
  Shield,
  Eye,
  MessageSquare,
  CheckCircle,
  MapPin,
  Trash2,
  X,
} from "lucide-react"
import { StorageService } from "@/lib/storage"

interface Notification {
  id: string
  type: "new_request" | "new_response" | "request_update"
  title: string
  message: string
  requestId: string
  isRead: boolean
  createdAt: string
  distance?: number
  data?: any
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showReadNotifications, setShowReadNotifications] = useState(true)

  // Fonctions pour gérer la persistance des notifications lues
  const getReadNotifications = (userId: string): string[] => {
    const key = `fixeopro_read_notifications_${userId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  const saveReadNotification = (userId: string, notificationId: string) => {
    const key = `fixeopro_read_notifications_${userId}`
    const readNotifications = getReadNotifications(userId)
    if (!readNotifications.includes(notificationId)) {
      readNotifications.push(notificationId)
      localStorage.setItem(key, JSON.stringify(readNotifications))
    }
  }

  const markAllNotificationsAsRead = (userId: string, notificationIds: string[]) => {
    const key = `fixeopro_read_notifications_${userId}`
    const readNotifications = getReadNotifications(userId)
    const allRead = [...new Set([...readNotifications, ...notificationIds])]
    localStorage.setItem(key, JSON.stringify(allRead))
  }

  // Nouvelles fonctions pour gérer la suppression des notifications
  const getDeletedNotifications = (userId: string): string[] => {
    const key = `fixeopro_deleted_notifications_${userId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  const saveDeletedNotification = (userId: string, notificationId: string) => {
    const key = `fixeopro_deleted_notifications_${userId}`
    const deletedNotifications = getDeletedNotifications(userId)
    if (!deletedNotifications.includes(notificationId)) {
      deletedNotifications.push(notificationId)
      localStorage.setItem(key, JSON.stringify(deletedNotifications))
    }
  }

  const removeAllNotifications = (userId: string, notificationIds: string[]) => {
    const key = `fixeopro_deleted_notifications_${userId}`
    const deletedNotifications = getDeletedNotifications(userId)
    const allDeleted = [...new Set([...deletedNotifications, ...notificationIds])]
    localStorage.setItem(key, JSON.stringify(allDeleted))
  }

  useEffect(() => {
    // Fonction pour charger les données utilisateur
    const loadUserData = () => {
      const userId = localStorage.getItem("fixeopro_current_user_id")
      if (userId) {
        const users = JSON.parse(localStorage.getItem("fixeopro_users") || "[]")
        const user = users.find((u: any) => u.id === userId)
        if (user) {
          setCurrentUser(user)
          setIsLoggedIn(true)
          loadNotifications(user)
        }
      } else {
        setCurrentUser(null)
        setIsLoggedIn(false)
        setNotifications([])
        setUnreadCount(0)
      }
    }

    // Charger les données au montage
    loadUserData()

    // Écouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "fixeopro_current_user_id" || e.key === "fixeopro_users") {
        loadUserData()
      }
    }

    // Écouter les événements personnalisés pour les changements de connexion
    const handleLoginChange = () => {
      setTimeout(loadUserData, 100) // Petit délai pour s'assurer que localStorage est mis à jour
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("fixeopro-login-change", handleLoginChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("fixeopro-login-change", handleLoginChange)
    }
  }, [])

  // Ajouter un effet pour rafraîchir périodiquement les notifications
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        loadNotifications(currentUser)
      }, 30000) // Rafraîchir toutes les 30 secondes

      return () => clearInterval(interval)
    }
  }, [currentUser])

  const loadNotifications = (user: any) => {
    if (!user) return

    const allNotifications: Notification[] = []
    const readNotificationIds = getReadNotifications(user.id)
    const deletedNotificationIds = getDeletedNotifications(user.id)

    if (user.userType === "reparateur") {
      // Utiliser les préférences de notification pour filtrer les demandes
      const filteredRequests = StorageService.getFilteredRequestsForRepairer(user)

      // Ajouter les demandes filtrées comme notifications
      filteredRequests.slice(0, 5).forEach((request) => {
        let distance = null
        if (user.coordinates && request.coordinates) {
          distance = StorageService.calculateDistance(
            user.coordinates.lat,
            user.coordinates.lng,
            request.coordinates.lat,
            request.coordinates.lng,
          )
        }

        const notificationId = `filtered_request_${request.id}`

        // Exclure les notifications supprimées
        if (deletedNotificationIds.includes(notificationId)) return

        const isRead = readNotificationIds.includes(notificationId)

        allNotifications.push({
          id: notificationId,
          type: "new_request",
          title: "Nouvelle demande dans votre zone",
          message: `${request.title} - ${request.city}${distance ? ` (${distance.toFixed(1)}km)` : ""}`,
          requestId: request.id,
          isRead: isRead,
          createdAt: request.createdAt,
          distance: distance,
          data: request,
        })
      })

      // Ajouter aussi toutes les nouvelles demandes (non filtrées) mais avec un indicateur différent
      const allRequests = StorageService.getRepairRequests()
      const recentRequests = allRequests
        .filter(
          (request) => request.status === "open" && !filteredRequests.some((filtered) => filtered.id === request.id),
        )
        .slice(0, 3)

      recentRequests.forEach((request) => {
        let distance = null
        if (user.coordinates && request.coordinates) {
          distance = StorageService.calculateDistance(
            user.coordinates.lat,
            user.coordinates.lng,
            request.coordinates.lat,
            request.coordinates.lng,
          )
        }

        const notificationId = `other_request_${request.id}`

        // Exclure les notifications supprimées
        if (deletedNotificationIds.includes(notificationId)) return

        const isRead = readNotificationIds.includes(notificationId)

        allNotifications.push({
          id: notificationId,
          type: "request_update",
          title: "Autre demande disponible",
          message: `${request.title} - ${request.city}${distance ? ` (${distance.toFixed(1)}km)` : ""}`,
          requestId: request.id,
          isRead: isRead,
          createdAt: request.createdAt,
          distance: distance,
          data: request,
        })
      })
    } else {
      // Notifications pour les clients
      const clientRequests = StorageService.getRepairRequestsByClient(user.id)

      clientRequests.forEach((request) => {
        if (request.responses && request.responses.length > 0) {
          request.responses.slice(0, 3).forEach((response: any) => {
            const notificationId = `response_${response.id}`

            // Exclure les notifications supprimées
            if (deletedNotificationIds.includes(notificationId)) return

            const isRead = readNotificationIds.includes(notificationId)

            allNotifications.push({
              id: notificationId,
              type: "new_response",
              title: "Nouvelle réponse à votre demande",
              message: `${response.reparateur?.companyName || response.reparateur?.firstName} a répondu à "${request.title}"`,
              requestId: request.id,
              isRead: isRead,
              createdAt: response.createdAt,
              data: { request, response },
            })
          })
        }
      })
    }

    // Trier par date (plus récent en premier)
    allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setNotifications(allNotifications.slice(0, 8)) // Limiter à 8 notifications
    setUnreadCount(allNotifications.filter((n) => !n.isRead).length)
  }

  const markAsRead = (notificationId: string) => {
    if (!currentUser) return

    // Sauvegarder dans localStorage
    saveReadNotification(currentUser.id, notificationId)

    // Mettre à jour l'état local
    setNotifications((prev) => {
      const updated = prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      )
      // Recalculer le compteur après la mise à jour
      const unread = updated.filter((n) => !n.isRead).length
      setUnreadCount(unread)
      return updated
    })
  }

  const markAllAsRead = () => {
    if (!currentUser) return

    const allNotificationIds = notifications.map((n) => n.id)
    markAllNotificationsAsRead(currentUser.id, allNotificationIds)

    setNotifications((prev) => {
      const updated = prev.map((notification) => ({ ...notification, isRead: true }))
      setUnreadCount(0) // Directement à 0 car toutes sont lues
      return updated
    })
  }

  const deleteNotification = (notificationId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation() // Empêcher la navigation vers la demande
    }

    if (!currentUser) return

    // Sauvegarder dans localStorage
    saveDeletedNotification(currentUser.id, notificationId)

    // Mettre à jour l'état local
    setNotifications((prev) => {
      const updated = prev.filter((notification) => notification.id !== notificationId)
      // Recalculer le compteur après la suppression
      const unread = updated.filter((n) => !n.isRead).length
      setUnreadCount(unread)
      return updated
    })
  }

  const deleteAllNotifications = () => {
    if (!currentUser) return

    const allNotificationIds = notifications.map((n) => n.id)
    removeAllNotifications(currentUser.id, allNotificationIds)

    setNotifications([])
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
        return <Bell className="h-4 w-4 text-blue-600" />
      case "new_response":
        return <MessageSquare className="h-4 w-4 text-green-600" />
      case "request_update":
        return <Eye className="h-4 w-4 text-gray-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificationStyle = (notification: Notification) => {
    if (notification.type === "new_request") {
      return "bg-blue-50 border-l-4 border-l-blue-500"
    }
    if (notification.type === "request_update") {
      return "bg-gray-50 border-l-4 border-l-gray-300"
    }
    return notification.isRead ? "bg-gray-50" : "bg-blue-50"
  }

  const handleLogout = () => {
    localStorage.removeItem("fixeopro_current_user_id")
    setIsLoggedIn(false)
    setCurrentUser(null)
    window.location.href = "/"
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">Fixeo.pro</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Catégories
            </Link>
            <Link href="/liste-demandes" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Liste des demandes
            </Link>
            <Link href="/comment-ca-marche" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Comment ça marche
            </Link>
            <Link href="/tarifs" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Tarifs
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            {!isLoggedIn ? (
              <>
                <Link href="/demande-reparation">
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Wrench className="h-4 w-4 mr-1" />
                    Dépannage
                  </Button>
                </Link>
                <Link href="/devenir-reparateur">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <User className="h-4 w-4 mr-1" />
                    Réparateur
                  </Button>
                </Link>
                <Link href="/connexion">
                  <Button variant="ghost" size="sm" className="text-gray-700">
                    Connexion
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* Actions selon le type d'utilisateur */}
                {currentUser?.userType === "client" && (
                  <>
                    <Link href="/demande-reparation">
                      <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        <Wrench className="h-4 w-4 mr-1" />
                        Nouvelle demande
                      </Button>
                    </Link>
                    <Link href="/mes-demandes">
                      <Button variant="ghost" size="sm">
                        Mes demandes
                      </Button>
                    </Link>
                  </>
                )}

                {currentUser?.userType === "reparateur" && (
                  <Link href="/mes-interventions">
                    <Button variant="outline" size="sm">
                      <Wrench className="h-4 w-4 mr-1" />
                      Mes interventions
                    </Button>
                  </Link>
                )}

                {/* Notifications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-96" align="end">
                    <div className="px-3 py-2 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                          Notifications {unreadCount > 0 && `(${unreadCount} non lues)`}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {notifications.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={deleteAllNotifications} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Tout supprimer
                            </Button>
                          )}
                          {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Tout marquer comme lu
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowReadNotifications(!showReadNotifications)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {showReadNotifications ? "Masquer lues" : "Voir lues"}
                          </Button>
                        </div>
                      </div>
                      {currentUser?.userType === "reparateur" && currentUser?.professional?.notificationPreferences && (
                        <div className="text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          Rayon: {currentUser.professional.notificationPreferences.maxDistance}km
                        </div>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="px-3 py-4 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Aucune notification</p>
                      </div>
                    ) : (
                      <>
                        {notifications
                          .filter((notification) => showReadNotifications || !notification.isRead)
                          .map((notification) => (
                            <DropdownMenuItem
                              key={notification.id}
                              className={`px-3 py-3 cursor-pointer ${getNotificationStyle(notification)} relative group`}
                              onClick={() => {
                                markAsRead(notification.id)
                                window.location.href = `/demande/${notification.requestId}`
                              }}
                            >
                              <div className="flex items-start space-x-3 w-full">
                                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p
                                      className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}
                                    >
                                      {notification.title}
                                    </p>
                                    <div className="flex items-center space-x-1">
                                      {notification.distance && (
                                        <Badge variant="outline" className="text-xs">
                                          {notification.distance.toFixed(1)}km
                                        </Badge>
                                      )}
                                      {!notification.isRead && (
                                        <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                                          Nouveau
                                        </Badge>
                                      )}
                                      {notification.isRead && (
                                        <Badge variant="outline" className="text-xs text-gray-500">
                                          Lu
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <p
                                    className={`text-sm ${!notification.isRead ? "text-gray-800" : "text-gray-600"} line-clamp-2`}
                                  >
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">{getTimeAgo(notification.createdAt)}</p>
                                  <p className="text-xs text-blue-600 mt-1 font-medium">
                                    Cliquer pour voir les détails →
                                  </p>
                                </div>

                                {/* Bouton de suppression */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => deleteNotification(notification.id, e)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </DropdownMenuItem>
                          ))}

                        {!showReadNotifications && notifications.every((n) => n.isRead) && (
                          <div className="px-3 py-4 text-center text-gray-500">
                            <Eye className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Notifications lues masquées</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowReadNotifications(true)}
                              className="text-xs mt-2"
                            >
                              Afficher les notifications lues
                            </Button>
                          </div>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href="/notifications"
                            className="px-3 py-2 text-center text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir toutes les notifications
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Menu utilisateur */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {currentUser?.firstName?.[0]}
                          {currentUser?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {currentUser?.firstName} {currentUser?.lastName}
                      <div className="text-xs text-gray-500 capitalize">
                        {currentUser?.userType === "reparateur" ? "Réparateur" : "Client"}
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link
                        href={currentUser?.userType === "reparateur" ? "/profil-pro" : "/profil"}
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Mon profil
                      </Link>
                    </DropdownMenuItem>
                    {currentUser?.userType === "client" && (
                      <DropdownMenuItem asChild>
                        <Link href="/mes-demandes" className="flex items-center">
                          <Bell className="mr-2 h-4 w-4" />
                          Mes demandes
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {currentUser?.userType === "reparateur" && (
                      <DropdownMenuItem asChild>
                        <Link href="/mes-interventions" className="flex items-center">
                          <Wrench className="mr-2 h-4 w-4" />
                          Mes interventions
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/parametres" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    {currentUser?.userType === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center text-red-600">
                          <Shield className="mr-2 h-4 w-4" />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Menu mobile */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Navigation */}
                <div className="space-y-4">
                  <Link href="/categories" className="block text-lg font-medium text-gray-700 hover:text-blue-600">
                    Catégories
                  </Link>
                  <Link href="/liste-demandes" className="block text-lg font-medium text-gray-700 hover:text-blue-600">
                    Liste des demandes
                  </Link>
                  <Link
                    href="/comment-ca-marche"
                    className="block text-lg font-medium text-gray-700 hover:text-blue-600"
                  >
                    Comment ça marche
                  </Link>
                  <Link href="/tarifs" className="block text-lg font-medium text-gray-700 hover:text-blue-600">
                    Tarifs
                  </Link>
                  <Link href="/contact" className="block text-lg font-medium text-gray-700 hover:text-blue-600">
                    Contact
                  </Link>
                </div>

                {/* Notifications mobile */}
                {isLoggedIn && (
                  <div className="border-t pt-4">
                    <Link
                      href="/notifications"
                      className="flex items-center justify-between text-lg font-medium text-gray-700 hover:text-blue-600"
                    >
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 mr-2" />
                        Notifications
                      </div>
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t pt-6 space-y-3">
                  {!isLoggedIn ? (
                    <>
                      <Link href="/demande-reparation">
                        <Button variant="outline" className="w-full border-blue-600 text-blue-600">
                          <Wrench className="h-4 w-4 mr-2" />
                          Demander un dépannage
                        </Button>
                      </Link>
                      <Link href="/devenir-reparateur">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <User className="h-4 w-4 mr-2" />
                          Devenir réparateur
                        </Button>
                      </Link>
                      <Link href="/connexion">
                        <Button variant="ghost" className="w-full">
                          Se connecter
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="text-center py-2">
                        <p className="font-medium">
                          {currentUser?.firstName} {currentUser?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {currentUser?.userType === "reparateur" ? "Réparateur" : "Client"}
                        </p>
                      </div>
                      {currentUser?.userType === "client" && (
                        <>
                          <Link href="/demande-reparation">
                            <Button variant="outline" className="w-full border-blue-600 text-blue-600">
                              <Wrench className="h-4 w-4 mr-2" />
                              Nouvelle demande
                            </Button>
                          </Link>
                          <Link href="/mes-demandes">
                            <Button variant="ghost" className="w-full">
                              <Bell className="h-4 w-4 mr-2" />
                              Mes demandes
                            </Button>
                          </Link>
                        </>
                      )}
                      <Link href={currentUser?.userType === "reparateur" ? "/profil-pro" : "/profil"}>
                        <Button variant="outline" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Mon profil
                        </Button>
                      </Link>
                      <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700">
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
