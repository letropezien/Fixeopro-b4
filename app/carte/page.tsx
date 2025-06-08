"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MapPin, Filter, Wrench, Search } from "lucide-react"
import { StorageService } from "@/lib/storage"

export default function CartePage() {
  const [requests, setRequests] = useState(StorageService.getRepairRequests())
  const [users, setUsers] = useState(StorageService.getUsers())
  const [filters, setFilters] = useState({
    type: "all", // all, requests, reparateurs
    category: "",
    city: "",
    urgency: "",
  })

  const [selectedItem, setSelectedItem] = useState<any>("")

  useEffect(() => {
    setRequests(StorageService.getRepairRequests())
    setUsers(StorageService.getUsers())
  }, [])

  // Simuler des coordonnées pour les villes
  const getCityCoordinates = (city: string) => {
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

    const cityKey = city.toLowerCase().replace(/\s+/g, "")
    return coordinates[cityKey] || { lat: 48.8566 + (Math.random() - 0.5) * 2, lng: 2.3522 + (Math.random() - 0.5) * 2 }
  }

  const filteredRequests = requests.filter((request) => {
    return (
      (filters.type === "all" || filters.type === "requests") &&
      (!filters.category || request.category.toLowerCase().includes(filters.category.toLowerCase())) &&
      (!filters.city || request.city.toLowerCase().includes(filters.city.toLowerCase())) &&
      (!filters.urgency || request.urgency === filters.urgency)
    )
  })

  const filteredReparateurs = users.filter((user) => {
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
                      <SelectValue />
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
                        [...filteredRequests.map((r) => r.city), ...filteredReparateurs.map((r) => r.city)].filter(
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
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                  {/* Simulation d'une carte */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>

                  {/* Points pour les demandes */}
                  {filteredRequests.map((request, index) => {
                    const coords = getCityCoordinates(request.city)
                    const x = ((coords.lng + 5) / 10) * 100 // Normalisation approximative
                    const y = ((52 - coords.lat) / 8) * 100 // Normalisation approximative

                    return (
                      <div
                        key={`request-${request.id}`}
                        className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getUrgencyColor(request.urgency)} hover:scale-125 transition-transform`}
                        style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}
                        onClick={() => setSelectedItem({ type: "request", data: request })}
                        title={`Demande: ${request.title} - ${request.city}`}
                      />
                    )
                  })}

                  {/* Points pour les réparateurs */}
                  {filteredReparateurs.map((reparateur, index) => {
                    if (!reparateur.city) return null
                    const coords = getCityCoordinates(reparateur.city)
                    const x = ((coords.lng + 5) / 10) * 100
                    const y = ((52 - coords.lat) / 8) * 100

                    return (
                      <div
                        key={`reparateur-${reparateur.id}`}
                        className="absolute w-4 h-4 bg-blue-600 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform border-2 border-white"
                        style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}
                        onClick={() => setSelectedItem({ type: "reparateur", data: reparateur })}
                        title={`Réparateur: ${reparateur.firstName} ${reparateur.lastName} - ${reparateur.city}`}
                      />
                    )
                  })}

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 p-4 rounded-lg text-center">
                      <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">Carte interactive</p>
                      <p className="text-sm text-gray-500">
                        🔴 Demandes urgentes • 🟠 Aujourd'hui • 🟡 Cette semaine • 🟢 Flexible
                      </p>
                      <p className="text-sm text-gray-500 mt-1">🔵 Réparateurs disponibles</p>
                    </div>
                  </div>
                </div>

                {/* Légende */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
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
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-2 border border-white"></div>
                    <span>Réparateurs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails de l'élément sélectionné */}
            {selectedItem && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
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
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedItem.type === "request" ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{selectedItem.data.title}</h3>
                        <Badge
                          className={getUrgencyColor(selectedItem.data.urgency).replace("bg-", "bg-") + " text-white"}
                        >
                          {selectedItem.data.urgencyLabel}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{selectedItem.data.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Localisation:</span>
                          <p>
                            {selectedItem.data.city} ({selectedItem.data.postalCode})
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Client:</span>
                          <p>
                            {selectedItem.data.client.firstName} {selectedItem.data.client.lastName}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Catégorie:</span>
                          <p>{selectedItem.data.category}</p>
                        </div>
                        <div>
                          <span className="font-medium">Réponses:</span>
                          <p>{selectedItem.data.responses}</p>
                        </div>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Voir les détails complets</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center font-medium">
                          {selectedItem.data.firstName[0]}
                          {selectedItem.data.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {selectedItem.data.firstName} {selectedItem.data.lastName}
                          </h3>
                          <p className="text-gray-600">
                            {selectedItem.data.professional?.companyName || "Réparateur indépendant"}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600">{selectedItem.data.professional?.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Localisation:</span>
                          <p>{selectedItem.data.city}</p>
                        </div>
                        <div>
                          <span className="font-medium">Expérience:</span>
                          <p>{selectedItem.data.professional?.experience}</p>
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
                      <Button className="w-full bg-green-600 hover:bg-green-700">Contacter ce réparateur</Button>
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
