"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MapPin, Filter, Wrench, Search, Clock, User } from "lucide-react"
import { StorageService } from "@/lib/storage"

export default function CartePage() {
  const [requests, setRequests] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [filters, setFilters] = useState({
    type: "all", // all, requests, reparateurs
    category: "",
    city: "",
    urgency: "",
  })

  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    try {
      // Récupérer les données au chargement de la page
      const loadedRequests = StorageService.getRepairRequests() || []
      const loadedUsers = StorageService.getUsers() || []

      console.log("Données chargées:", { requests: loadedRequests, users: loadedUsers })

      setRequests(loadedRequests)
      setUsers(loadedUsers)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    }
  }, [])

  // Simuler des coordonnées pour les villes
  const getCityCoordinates = (city: string) => {
    if (!city) return { lat: 48.8566, lng: 2.3522 } // Paris par défaut

    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      paris: { lat: 48.8566, lng: 2.3522 },
      lyon: { lat: 45.764, lng: 4.8357 },
      marseille: { lat: 43.2965, lng: 5.3698 },
      toulouse: { lat: 43.6047, lng: 1.4442 },
      nice: { lat: 43.7102, lng: 7.262 },
      nantes: { lat: 47.2184, lng: -1.5536 },
      strasbourg: { lat: 48.5734, lng: 7.7521 },
      montpellier: { lat: 43.611, lng: 3.8767 },
      bordeaux: { lat: 44.8378, lng: -0.5792 },
      lille: { lat: 50.6292, lng: 3.0573 },
    }

    const cityKey = city.toLowerCase().trim().replace(/\s+/g, "")
    return (
      coordinates[cityKey] || {
        lat: 48.8566 + (Math.random() - 0.5) * 2,
        lng: 2.3522 + (Math.random() - 0.5) * 2,
      }
    )
  }

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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-500"
      case "same-day":
        return "bg-orange-500"
      case "this-week":
        return "bg-yellow-500"
      case "flexible":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getUrgencyLabel = (urgency: string) => {
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
        return "Non spécifié"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carte interactive</h1>
          <p className="text-gray-600">Visualisez les demandes de réparation et les réparateurs près de chez vous</p>
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
                      <SelectValue placeholder={filters.type === "" ? "Tout afficher" : filters.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tout afficher</SelectItem>
                      <SelectItem value="requests">Demandes uniquement</SelectItem>
                      <SelectItem value="reparateurs">Réparateurs uniquement</SelectItem>
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
                      <SelectItem value="">Toutes les catégories</SelectItem>
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
                        <SelectItem value="">Toutes les urgences</SelectItem>
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
                  onClick={() => setFilters({ type: "all", category: "", city: "", urgency: "" })}
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
          </div>

          {/* Carte et détails */}
          <div className="lg:col-span-3">
            {/* Carte simulée */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Carte interactive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 relative overflow-hidden border">
                  {/* Grille de fond pour simuler une carte */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
                      {Array.from({ length: 400 }).map((_, index) => (
                        <div key={index} className="border border-gray-200"></div>
                      ))}
                    </div>
                  </div>

                  {/* Points pour les demandes */}
                  {filteredRequests.map((request) => {
                    if (!request || !request.city) return null

                    const coords = getCityCoordinates(request.city)
                    const x = ((coords.lng + 5) / 10) * 100 // Normalisation approximative
                    const y = ((52 - coords.lat) / 8) * 100 // Normalisation approximative

                    return (
                      <div
                        key={`request-${request.id}`}
                        className={`absolute w-6 h-6 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getUrgencyColor(request.urgency)} hover:scale-125 transition-all duration-200 shadow-lg border-2 border-white flex items-center justify-center`}
                        style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}
                        onClick={() => setSelectedItem({ type: "request", data: request })}
                        title={`Demande: ${request.title} - ${request.city}`}
                      >
                        <Search className="h-3 w-3 text-white" />
                      </div>
                    )
                  })}

                  {/* Points pour les réparateurs */}
                  {filteredReparateurs.map((reparateur) => {
                    if (!reparateur || !reparateur.city) return null

                    const coords = getCityCoordinates(reparateur.city)
                    const x = ((coords.lng + 5) / 10) * 100
                    const y = ((52 - coords.lat) / 8) * 100

                    return (
                      <div
                        key={`reparateur-${reparateur.id}`}
                        className="absolute w-6 h-6 bg-blue-600 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all duration-200 border-2 border-white shadow-lg flex items-center justify-center"
                        style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}
                        onClick={() => setSelectedItem({ type: "reparateur", data: reparateur })}
                        title={`Réparateur: ${reparateur.firstName} ${reparateur.lastName} - ${reparateur.city}`}
                      >
                        <Wrench className="h-3 w-3 text-white" />
                      </div>
                    )
                  })}

                  {/* Légende sur la carte */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span>Urgent</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                        <span>Aujourd'hui</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span>Cette semaine</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>Flexible</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                        <span>Réparateurs</span>
                      </div>
                    </div>
                  </div>

                  {/* Message si aucune donnée */}
                  {filteredRequests.length === 0 && filteredReparateurs.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Aucun résultat trouvé</p>
                        <p className="text-sm text-gray-500">Essayez de modifier vos filtres</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Détails de l'élément sélectionné */}
            {selectedItem && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      {selectedItem.type === "request" ? (
                        <>
                          <Search className="h-5 w-5 mr-2" />
                          Détails de la demande
                        </>
                      ) : (
                        <>
                          <Wrench className="h-5 w-5 mr-2" />
                          Profil du réparateur
                        </>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedItem.type === "request" ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{selectedItem.data.title}</h3>
                        <Badge className={`${getUrgencyColor(selectedItem.data.urgency)} text-white`}>
                          {selectedItem.data.urgencyLabel || getUrgencyLabel(selectedItem.data.urgency)}
                        </Badge>
                      </div>

                      <p className="text-gray-600">{selectedItem.data.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <span className="font-medium">Localisation:</span>
                            <p className="text-gray-600">
                              {selectedItem.data.city}{" "}
                              {selectedItem.data.postalCode && `(${selectedItem.data.postalCode})`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <span className="font-medium">Client:</span>
                            <p className="text-gray-600">
                              {selectedItem.data.client?.firstName || "Client"}{" "}
                              {selectedItem.data.client?.lastName || ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Catégorie:</span>
                          <Badge variant="outline" className="ml-2">
                            {selectedItem.data.category}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <span className="font-medium">Créée le:</span>
                            <p className="text-gray-600">
                              {new Date(selectedItem.data.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            if (selectedItem.data.id) {
                              window.location.href = `/demande/${selectedItem.data.id}`
                            }
                          }}
                        >
                          Voir les détails complets
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Contacter le client
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center font-medium">
                          {selectedItem.data.firstName?.[0] || ""}
                          {selectedItem.data.lastName?.[0] || ""}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {selectedItem.data.firstName || ""} {selectedItem.data.lastName || ""}
                          </h3>
                          <p className="text-gray-600">
                            {selectedItem.data.professional?.companyName || "Réparateur indépendant"}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600">
                        {selectedItem.data.professional?.description || "Aucune description disponible"}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <span className="font-medium">Localisation:</span>
                            <p className="text-gray-600">{selectedItem.data.city || "Non spécifié"}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <span className="font-medium">Expérience:</span>
                            <p className="text-gray-600">
                              {selectedItem.data.professional?.experience || "Non spécifié"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {selectedItem.data.professional?.specialties && (
                        <div>
                          <span className="font-medium text-sm">Spécialités:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedItem.data.professional.specialties.map((specialty: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">Contacter ce réparateur</Button>
                        <Button variant="outline" className="flex-1">
                          Voir le profil complet
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
