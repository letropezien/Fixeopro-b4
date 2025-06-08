"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Filter } from "lucide-react"
import { StorageService } from "@/lib/storage"
import GoogleMaps from "@/components/google-maps"

export default function CartePage() {
  const [requests, setRequests] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [filters, setFilters] = useState({
    type: "requests", // requests, reparateurs, all
    category: "",
    city: "",
    urgency: "",
  })

  useEffect(() => {
    try {
      // Récupérer les données au chargement de la page
      const loadedRequests = StorageService.getRepairRequests() || []
      const loadedUsers = StorageService.getUsers() || []
      const user = StorageService.getCurrentUser()

      console.log("Données chargées:", { requests: loadedRequests, users: loadedUsers })

      setRequests(loadedRequests)
      setUsers(loadedUsers)
      setCurrentUser(user)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    }
  }, [])

  const filteredRequests = requests.filter((request) => {
    if (!request) return false

    return (
      (filters.type === "all" || filters.type === "requests") &&
      (!filters.category ||
        (request.category && request.category.toLowerCase().includes(filters.category.toLowerCase()))) &&
      (!filters.city || (request.city && request.city.toLowerCase().includes(filters.city.toLowerCase()))) &&
      (!filters.urgency || request.urgency === filters.urgency)
    )
  })

  const filteredReparateurs = users.filter((user) => {
    if (!user) return false

    return (
      user.userType === "reparateur" &&
      (filters.type === "all" || filters.type === "reparateurs") &&
      (!filters.city || (user.city && user.city.toLowerCase().includes(filters.city.toLowerCase())))
    )
  })

  // Convertir les données en marqueurs pour la carte
  const mapMarkers = [
    ...filteredRequests.map((request) => ({
      id: request.id,
      type: "request" as const,
      title: request.title,
      city: request.city,
      category: request.category,
      urgency: request.urgency,
      urgencyLabel: request.urgencyLabel,
      coordinates: request.coordinates || StorageService.generateCoordinatesForCity(request.city),
      data: request,
    })),
    ...filteredReparateurs.map((reparateur) => ({
      id: reparateur.id,
      type: "reparateur" as const,
      title: `${reparateur.firstName} ${reparateur.lastName}`,
      city: reparateur.city,
      coordinates: StorageService.generateCoordinatesForCity(reparateur.city),
      data: reparateur,
    })),
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carte des demandes de dépannage</h1>
          <p className="text-gray-600">Visualisez les demandes de réparation par ville en temps réel</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filtres */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Affichage</label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requests">Demandes uniquement</SelectItem>
                      <SelectItem value="reparateurs">Réparateurs uniquement</SelectItem>
                      <SelectItem value="all">Tout afficher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Catégorie</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="électroménager">Électroménager</SelectItem>
                      <SelectItem value="informatique">Informatique</SelectItem>
                      <SelectItem value="plomberie">Plomberie</SelectItem>
                      <SelectItem value="électricité">Électricité</SelectItem>
                      <SelectItem value="chauffage">Chauffage</SelectItem>
                      <SelectItem value="téléphonie">Téléphonie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Ville</label>
                  <Input
                    placeholder="Rechercher une ville"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  />
                </div>

                {(filters.type === "all" || filters.type === "requests") && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Urgence</label>
                    <Select
                      value={filters.urgency}
                      onValueChange={(value) => setFilters({ ...filters, urgency: value })}
                    >
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
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setFilters({ type: "requests", category: "", city: "", urgency: "" })}
                >
                  Réinitialiser
                </Button>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Demandes affichées</span>
                  <Badge variant="secondary">{filteredRequests.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Réparateurs affichés</span>
                  <Badge variant="secondary">{filteredReparateurs.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Villes couvertes</span>
                  <Badge variant="secondary">
                    {
                      new Set(
                        [...filteredRequests.map((r) => r?.city), ...filteredReparateurs.map((r) => r?.city)].filter(
                          Boolean,
                        ),
                      ).size
                    }
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Informations sur l'accès aux données */}
            {currentUser?.userType === "reparateur" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">Accès aux données</CardTitle>
                </CardHeader>
                <CardContent>
                  {StorageService.canContactClients(currentUser) ? (
                    <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                      <p className="font-medium">✓ Accès complet</p>
                      <p>Vous pouvez voir toutes les informations des clients.</p>
                    </div>
                  ) : (
                    <div className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
                      <p className="font-medium">⚠ Accès limité</p>
                      <p>Les noms sont masqués. Souscrivez pour un accès complet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Carte virtuelle */}
          <div className="lg:col-span-3">
            <GoogleMaps
              markers={mapMarkers}
              currentUser={currentUser}
              showPersonalData={currentUser?.userType === "reparateur"}
              standalone={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
