"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Euro, User, Phone, Mail, Filter, Lock, MessageSquare, Search } from "lucide-react"
import { StorageService } from "@/lib/storage"
import Link from "next/link"

export default function ListesDemandesPage() {
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const [requests, setRequests] = useState(StorageService.getRepairRequests())
  const [filteredRequests, setFilteredRequests] = useState(requests)
  const [filters, setFilters] = useState({
    category: "",
    urgency: "",
    city: "",
    search: "",
  })

  useEffect(() => {
    // Recharger les demandes à chaque visite de la page
    const loadedRequests = StorageService.getRepairRequests()
    setRequests(loadedRequests)
    setFilteredRequests(loadedRequests)
  }, [])

  useEffect(() => {
    // Appliquer les filtres
    let filtered = requests

    if (filters.category) {
      filtered = filtered.filter((request) => request.category.toLowerCase().includes(filters.category.toLowerCase()))
    }

    if (filters.urgency) {
      filtered = filtered.filter((request) => request.urgency === filters.urgency)
    }

    if (filters.city) {
      filtered = filtered.filter((request) => request.city.toLowerCase().includes(filters.city.toLowerCase()))
    }

    if (filters.search) {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          request.description.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    setFilteredRequests(filtered)
  }, [filters, requests])

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

  const maskPersonalData = (text: string) => {
    if (canViewClientDetails()) return text
    return text.replace(/[a-zA-ZÀ-ÿ]/g, "*")
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      urgency: "",
      city: "",
      search: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Listes des Demandes de Dépannage</h1>
          <p className="text-gray-600">Découvrez toutes les demandes de réparation disponibles sur la plateforme</p>
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
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electromenager">Toutes les catégories</SelectItem>
                    <SelectItem value="electromenager">Électroménager</SelectItem>
                    <SelectItem value="informatique">Informatique</SelectItem>
                    <SelectItem value="plomberie">Plomberie</SelectItem>
                    <SelectItem value="electricite">Électricité</SelectItem>
                    <SelectItem value="chauffage">Chauffage</SelectItem>
                    <SelectItem value="telephonie">Téléphonie</SelectItem>
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
                    <SelectItem value="urgent">Toutes les urgences</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                {filteredRequests.filter((r) => r.responses === 0).length}
              </div>
              <p className="text-sm text-gray-600">Sans réponse</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(filteredRequests.map((r) => r.city)).size}
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
                      <Badge variant="outline">{request.category}</Badge>
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
                    {request.budget && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Euro className="h-4 w-4 mr-1" />
                        {request.budget}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{request.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      {canViewClientDetails() ? (
                        <>
                          {request.client.firstName} {request.client.lastName}
                        </>
                      ) : (
                        <span className="flex items-center">
                          <Lock className="h-3 w-3 mr-1" />
                          {maskPersonalData("Jean Dupont")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {request.responses} réponse{request.responses > 1 ? "s" : ""}
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
                          {request.client.phone || "06 ** ** ** **"}
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

        {filteredRequests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune demande trouvée</h3>
              <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche ou vos filtres</p>
              <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
