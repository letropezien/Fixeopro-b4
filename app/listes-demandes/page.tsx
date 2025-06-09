"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Calendar,
  Euro,
  User,
  Search,
  Filter,
  Clock,
  MessageSquare,
  Eye,
  Wrench,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { StorageService, type RepairRequest } from "@/lib/storage"
import { RequestStatusBadge } from "@/components/request-status-badge"

export default function ListeDemandesPage() {
  const [requests, setRequests] = useState<RepairRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RepairRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    "électroménager",
    "plomberie",
    "électricité",
    "informatique",
    "téléphonie",
    "chauffage",
    "climatisation",
    "électronique",
    "autres",
  ]

  const departments = [
    "75", // Paris
    "69", // Rhône
    "13", // Bouches-du-Rhône
    "31", // Haute-Garonne
    "06", // Alpes-Maritimes
    "59", // Nord
    "33", // Gironde
    "67", // Bas-Rhin
    "34", // Hérault
    "44", // Loire-Atlantique
  ]

  useEffect(() => {
    loadRequests()
    // Actualiser les demandes toutes les 10 secondes
    const interval = setInterval(loadRequests, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, categoryFilter, statusFilter, urgencyFilter, departmentFilter])

  const loadRequests = () => {
    setIsLoading(true)
    try {
      // Récupérer toutes les demandes via le StorageService
      const allRequests = StorageService.getRepairRequests()

      // Trier par date de création (plus récentes en premier)
      const sortedRequests = allRequests.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      setRequests(sortedRequests)
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    // Filtrer par catégorie
    if (categoryFilter !== "all") {
      filtered = filtered.filter((request) => request.category === categoryFilter)
    }

    // Filtrer par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // Filtrer par urgence
    if (urgencyFilter !== "all") {
      filtered = filtered.filter((request) => request.urgency === urgencyFilter)
    }

    // Filtrer par département
    if (departmentFilter !== "all") {
      filtered = filtered.filter((request) => request.department === departmentFilter)
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.client.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredRequests(filtered)
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "same-day":
        return <Badge className="bg-red-500">Aujourd'hui</Badge>
      case "urgent":
        return <Badge className="bg-red-500">Urgent</Badge>
      case "this-week":
        return <Badge className="bg-orange-500">Cette semaine</Badge>
      case "flexible":
        return <Badge className="bg-green-500">Flexible</Badge>
      default:
        return <Badge variant="outline">{urgency}</Badge>
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

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Il y a moins d'1h"
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Chargement des demandes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Liste des demandes de dépannage</h1>
            <p className="text-gray-600 mt-2">
              Découvrez les demandes de réparation près de chez vous ({filteredRequests.length} demandes)
            </p>
          </div>
          <Button onClick={loadRequests} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{requests.length}</p>
              <p className="text-sm text-gray-600">Total demandes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{requests.filter((r) => r.status === "open").length}</p>
              <p className="text-sm text-gray-600">Ouvertes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {requests.filter((r) => r.urgency === "urgent" || r.urgency === "same-day").length}
              </p>
              <p className="text-sm text-gray-600">Urgentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {requests.filter((r) => new Date(r.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-sm text-gray-600">Aujourd'hui</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par titre, description, ville ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="open">Ouvertes</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes urgences</SelectItem>
                  <SelectItem value="same-day">Aujourd'hui</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="this-week">Cette semaine</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous départements</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <div className="space-y-6">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Photo d'illustration */}
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {request.photos && request.photos.length > 0 ? (
                      <img
                        src={request.photos[0] || "/placeholder.svg"}
                        alt={request.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Wrench className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Contenu principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{request.title}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>

                        {/* Informations principales */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-2" />
                            {request.client.firstName} {request.client.lastName}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2" />
                            {request.city} ({request.postalCode})
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Euro className="h-4 w-4 mr-2" />
                            {request.budget}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {request.responses?.length || 0} réponses
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline">{request.category}</Badge>
                          <RequestStatusBadge status={request.status} />
                          {getUrgencyBadge(request.urgency)}
                          {request.department && <Badge variant="outline">Dép. {request.department}</Badge>}
                        </div>

                        {/* Date et temps */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(request.createdAt)}
                          </div>
                          <div className="flex items-center text-sm text-blue-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {getTimeAgo(request.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <Link href={`/demande/${request.id}`}>
                          <Button size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </Button>
                        </Link>
                        {request.photos && request.photos.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            +{request.photos.length - 1} photos
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune demande trouvée</h3>
                {requests.length === 0 ? (
                  <div>
                    <p className="text-gray-600 mb-4">Aucune demande de dépannage n'a été créée pour le moment.</p>
                    <Link href="/demande-reparation">
                      <Button>
                        <Wrench className="h-4 w-4 mr-2" />
                        Créer une demande
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Aucune demande ne correspond à vos critères de recherche. Essayez de modifier les filtres.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination ou load more si nécessaire */}
      {filteredRequests.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Affichage de {filteredRequests.length} demande{filteredRequests.length > 1 ? "s" : ""} sur {requests.length}{" "}
            au total
          </p>
        </div>
      )}
    </div>
  )
}
