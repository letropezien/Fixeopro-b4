"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Euro, User, Phone, Mail, Filter, Lock, MessageSquare, Search, RefreshCw } from "lucide-react"
import { StorageService } from "@/lib/storage"
import { DepartmentService } from "@/lib/departments"
import { DepartmentSelector } from "@/components/department-selector"
import Link from "next/link"

export default function ListesDemandesPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "",
    urgency: "",
    city: "",
    department: "",
    search: "",
  })

  const loadData = () => {
    setIsLoading(true)
    try {
      // Charger l'utilisateur actuel
      const user = StorageService.getCurrentUser()
      setCurrentUser(user)

      // Charger les demandes de réparation
      const loadedRequests = StorageService.getRepairRequests()
      console.log("Demandes chargées:", loadedRequests)

      // Nettoyer et valider les données
      const cleanedRequests = loadedRequests.map((request) => ({
        ...request,
        // S'assurer que responses est un nombre
        responses: Array.isArray(request.responses)
          ? request.responses.length
          : typeof request.responses === "number"
            ? request.responses
            : 0,
        // S'assurer que les champs texte sont des chaînes
        title: String(request.title || ""),
        description: String(request.description || ""),
        category: String(request.category || ""),
        city: String(request.city || ""),
        postalCode: String(request.postalCode || ""),
        urgency: String(request.urgency || "flexible"),
        // S'assurer que client est un objet valide
        client: request.client || {},
        // S'assurer que photos est un tableau
        photos: Array.isArray(request.photos) ? request.photos : [],
        // S'assurer que createdAt est une chaîne
        createdAt: String(request.createdAt || new Date().toISOString()),
      }))

      // Trier par date (plus récentes en premier)
      const sortedRequests = cleanedRequests.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      setRequests(sortedRequests)
      setFilteredRequests(sortedRequests)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      setRequests([])
      setFilteredRequests([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Appliquer les filtres
    let filtered = [...requests]

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(
        (request) => request.category && request.category.toLowerCase().includes(filters.category.toLowerCase()),
      )
    }

    if (filters.urgency && filters.urgency !== "all") {
      filtered = filtered.filter((request) => request.urgency === filters.urgency)
    }

    if (filters.city) {
      filtered = filtered.filter(
        (request) => request.city && request.city.toLowerCase().includes(filters.city.toLowerCase()),
      )
    }

    if (filters.department && filters.department !== "all") {
      filtered = filtered.filter((request) => {
        // Filtrer par département
        if (request.department) {
          return request.department === filters.department
        }
        // Fallback : détecter le département à partir du code postal
        const dept = DepartmentService.getDepartmentFromPostalCode(request.postalCode)
        return dept?.code === filters.department
      })
    }

    if (filters.search) {
      filtered = filtered.filter(
        (request) =>
          (request.title && request.title.toLowerCase().includes(filters.search.toLowerCase())) ||
          (request.description && request.description.toLowerCase().includes(filters.search.toLowerCase())),
      )
    }

    setFilteredRequests(filtered)
  }, [filters, requests])

  const getUrgencyColor = (urgency) => {
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

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "Urgent"
      case "same-day":
        return "Aujourd'hui"
      case "this-week":
        return "Cette semaine"
      case "flexible":
        return "Flexible"
      default:
        return "Non défini"
    }
  }

  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) return "Il y a moins d'1h"
      if (diffInHours < 24) return `Il y a ${diffInHours}h`
      const diffInDays = Math.floor(diffInHours / 24)
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`
    } catch (error) {
      return "Date inconnue"
    }
  }

  const canViewClientDetails = () => {
    if (!currentUser) return false
    if (currentUser.userType !== "reparateur") return false

    // Vérifier si le réparateur a un abonnement actif ou est en période d'essai
    if (currentUser.subscription?.status === "active") return true
    if (currentUser.subscription?.status === "trial") {
      const expiresAt = new Date(currentUser.subscription.endDate)
      return expiresAt > new Date()
    }

    return false
  }

  const maskPersonalData = (text) => {
    if (canViewClientDetails()) return text
    return text.replace(/[a-zA-ZÀ-ÿ]/g, "*")
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      urgency: "",
      city: "",
      department: "",
      search: "",
    })
  }

  const getDepartmentName = (postalCode, departmentCode) => {
    try {
      if (departmentCode) {
        const dept = DepartmentService.getDepartmentByCode(departmentCode)
        return dept ? `${dept.code} - ${dept.name}` : departmentCode
      }
      const dept = DepartmentService.getDepartmentFromPostalCode(postalCode)
      return dept ? `${dept.code} - ${dept.name}` : "Non défini"
    } catch (error) {
      return "Non défini"
    }
  }

  // Statistiques par département
  const departmentStats = filteredRequests.reduce((acc, request) => {
    try {
      const deptCode =
        request.department || DepartmentService.getDepartmentFromPostalCode(request.postalCode)?.code || "unknown"
      acc[deptCode] = (acc[deptCode] || 0) + 1
      return acc
    } catch (error) {
      return acc
    }
  }, {})

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mr-3" />
            <span className="text-lg">Chargement des demandes...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Listes des Demandes de Dépannage</h1>
              <p className="text-gray-600">Découvrez toutes les demandes de réparation disponibles sur la plateforme</p>
            </div>
            <Button onClick={loadData} variant="outline" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Recherche et Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par titre ou description..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Département</label>
                <DepartmentSelector
                  value={filters.department}
                  onValueChange={(value) => setFilters({ ...filters, department: value })}
                  placeholder="Tous les départements"
                  showSearch={false}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="electromenager">Électroménager</SelectItem>
                    <SelectItem value="informatique">Informatique</SelectItem>
                    <SelectItem value="plomberie">Plomberie</SelectItem>
                    <SelectItem value="electricite">Électricité</SelectItem>
                    <SelectItem value="chauffage">Chauffage</SelectItem>
                    <SelectItem value="telephonie">Téléphonie</SelectItem>
                    <SelectItem value="serrurerie">Serrurerie</SelectItem>
                    <SelectItem value="multimedia">Multimédia</SelectItem>
                    <SelectItem value="climatisation">Climatisation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Urgence</label>
                <Select value={filters.urgency} onValueChange={(value) => setFilters({ ...filters, urgency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les urgences</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="same-day">Aujourd'hui</SelectItem>
                    <SelectItem value="this-week">Cette semaine</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={resetFilters} className="w-full">
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredRequests.length}</div>
              <p className="text-sm text-gray-600">Demandes trouvées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredRequests.filter((r) => r.urgency === "urgent").length}
              </div>
              <p className="text-sm text-gray-600">Demandes urgentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredRequests.filter((r) => (r.responses || 0) === 0).length}
              </div>
              <p className="text-sm text-gray-600">Sans réponse</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(departmentStats).length}</div>
              <p className="text-sm text-gray-600">Départements</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(filteredRequests.map((r) => r.city).filter(Boolean)).size}
              </div>
              <p className="text-sm text-gray-600">Villes couvertes</p>
            </CardContent>
          </Card>
        </div>

        {/* Message d'information pour les non-réparateurs */}
        {(!currentUser || currentUser.userType !== "reparateur") && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start">
                <Lock className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Accès limité aux informations</h3>
                  <p className="text-blue-800 mb-3">
                    Les coordonnées complètes des clients sont réservées aux réparateurs avec un abonnement actif. Les
                    noms et prénoms sont masqués pour protéger la vie privée.
                  </p>
                  <div className="flex space-x-3">
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/devenir-reparateur">Devenir réparateur</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/tarifs">Voir les abonnements</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des demandes */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline">{request.category || "Non défini"}</Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>{getUrgencyLabel(request.urgency)}</Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {getDepartmentName(request.postalCode, request.department)}
                      </Badge>
                      <span className="text-sm text-gray-500">{getTimeAgo(request.createdAt)}</span>
                    </div>
                    <CardTitle className="text-xl">{request.title || "Demande sans titre"}</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {request.city || "Ville non définie"} ({request.postalCode || "Code postal non défini"})
                    </div>
                    {request.budget && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Euro className="h-4 w-4 mr-1" />
                        {String(request.budget)}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{request.description || "Aucune description disponible"}</p>

                {/* Affichage des photos si disponibles */}
                {request.photos && request.photos.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Photos du problème :</p>
                    <div className="flex space-x-2">
                      {request.photos.slice(0, 3).map((photo, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=64&width=64&text=Photo"
                            }}
                          />
                        </div>
                      ))}
                      {request.photos.length > 3 && (
                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{request.photos.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      {canViewClientDetails() ? (
                        <span>
                          {String(request.client?.firstName || "Prénom")} {String(request.client?.lastName || "Nom")}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Lock className="h-3 w-3 mr-1" />
                          {maskPersonalData("Jean Dupont")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {Number(request.responses || 0)} réponse{Number(request.responses || 0) > 1 ? "s" : ""}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {canViewClientDetails() && (
                      <>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          {String(request.client?.phone || "06 ** ** ** **")}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </>
                    )}
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Link href={`/demande/${request.id}`}>Voir les détails</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune demande trouvée</h3>
              <p className="text-gray-600 mb-4">
                {requests.length === 0
                  ? "Aucune demande de dépannage n'a encore été créée sur la plateforme."
                  : filters.department
                    ? `Aucune demande trouvée dans le département ${filters.department}`
                    : "Essayez de modifier vos critères de recherche ou vos filtres"}
              </p>
              {requests.length === 0 ? (
                <Button asChild>
                  <Link href="/demande-reparation">Créer une demande</Link>
                </Button>
              ) : (
                <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
