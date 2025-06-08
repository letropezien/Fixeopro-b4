"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Filter, MapPin, Search, Wrench, Clock, User, Plus, Minus, RotateCcw } from "lucide-react"
import { StorageService } from "@/lib/storage"

export default function CartePage() {
  const [requests, setRequests] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [mapZoom, setMapZoom] = useState(1)
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 })
  const [filters, setFilters] = useState({
    type: "requests",
    category: "",
    city: "",
    urgency: "",
  })

  useEffect(() => {
    try {
      const loadedRequests = StorageService.getRepairRequests() || []
      const loadedUsers = StorageService.getUsers() || []
      const user = StorageService.getCurrentUser()

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
      (!filters.category || request.category?.toLowerCase().includes(filters.category.toLowerCase())) &&
      (!filters.city || request.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
      (!filters.urgency || request.urgency === filters.urgency)
    )
  })

  const filteredReparateurs = users.filter((user) => {
    if (!user) return false
    return (
      user.userType === "reparateur" &&
      (filters.type === "all" || filters.type === "reparateurs") &&
      (!filters.city || user.city?.toLowerCase().includes(filters.city.toLowerCase()))
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

  const canViewPersonalData = () => {
    if (!currentUser || currentUser.userType !== "reparateur") return false
    if (currentUser.subscription?.status === "active") return true
    if (currentUser.subscription?.status === "trial") {
      const expiresAt = new Date(currentUser.subscription.endDate)
      return expiresAt > new Date()
    }
    return false
  }

  const maskPersonalData = (text: string) => {
    if (canViewPersonalData()) return text
    return text.replace(/[a-zA-ZÀ-ÿ]/g, "*")
  }

  // Coordonnées des villes françaises
  const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
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
    rennes: { lat: 48.1173, lng: -1.6778 },
    reims: { lat: 49.2583, lng: 4.0317 },
    toulon: { lat: 43.1242, lng: 5.928 },
    grenoble: { lat: 45.1885, lng: 5.7245 },
    dijon: { lat: 47.3215, lng: 5.0415 },
    angers: { lat: 47.4784, lng: -0.5632 },
    villeurbanne: { lat: 45.7797, lng: 4.8814 },
    clermont: { lat: 45.7797, lng: 3.0863 },
    aix: { lat: 43.5297, lng: 5.4474 },
    brest: { lat: 48.3905, lng: -4.4861 },
  }

  const convertToMapCoordinates = (lat: number, lng: number) => {
    // Conversion des coordonnées GPS vers les coordonnées de la carte SVG
    const mapWidth = 800
    const mapHeight = 600

    // Limites approximatives de la France
    const bounds = {
      north: 51.1,
      south: 41.3,
      east: 9.6,
      west: -5.1,
    }

    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * mapWidth
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * mapHeight

    return { x: x * mapZoom + mapCenter.x, y: y * mapZoom + mapCenter.y }
  }

  const getMarkerPosition = (city: string, coordinates?: { lat: number; lng: number }) => {
    if (coordinates) {
      return convertToMapCoordinates(coordinates.lat, coordinates.lng)
    }

    const cityKey = city?.toLowerCase().trim().replace(/\s+/g, "")
    const coords = cityCoordinates[cityKey]

    if (coords) {
      return convertToMapCoordinates(coords.lat, coords.lng)
    }

    // Position par défaut (centre de la France)
    return convertToMapCoordinates(46.603354, 1.888334)
  }

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev / 1.2, 0.5))
  }

  const handleResetView = () => {
    setMapZoom(1)
    setMapCenter({ x: 0, y: 0 })
  }

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
                      <SelectValue placeholder={filters.type ? filters.type : "Sélectionner"} />
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
                  {canViewPersonalData() ? (
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

          {/* Carte */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Carte interactive de France
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleZoomIn}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleZoomOut}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleResetView}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border"
                  style={{ height: "600px" }}
                >
                  {/* Carte SVG de la France */}
                  <svg
                    viewBox="0 0 800 600"
                    className="w-full h-full"
                    style={{ transform: `scale(${mapZoom}) translate(${mapCenter.x}px, ${mapCenter.y}px)` }}
                  >
                    {/* Contour de la France */}
                    <path
                      d="M158,206 L168,196 L178,186 L188,176 L198,166 L218,156 L238,146 L258,136 L278,126 L298,116 L318,106 L338,96 L358,86 L378,76 L398,66 L418,56 L438,46 L458,36 L478,26 L498,16 L518,6 L538,16 L558,26 L578,36 L598,46 L618,56 L638,66 L658,76 L678,86 L698,96 L718,106 L738,116 L758,126 L778,136 L788,146 L798,156 L798,176 L798,196 L798,216 L798,236 L798,256 L798,276 L798,296 L798,316 L798,336 L798,356 L798,376 L798,396 L798,416 L798,436 L798,456 L798,476 L798,496 L798,516 L798,536 L798,556 L798,576 L798,596 L778,596 L758,596 L738,596 L718,596 L698,596 L678,596 L658,596 L638,596 L618,596 L598,596 L578,596 L558,596 L538,596 L518,596 L498,596 L478,596 L458,596 L438,596 L418,596 L398,596 L378,596 L358,596 L338,596 L318,596 L298,596 L278,596 L258,596 L238,596 L218,596 L198,596 L178,596 L158,596 L138,596 L118,596 L98,596 L78,596 L58,596 L38,596 L18,596 L8,596 L8,576 L8,556 L8,536 L8,516 L8,496 L8,476 L8,456 L8,436 L8,416 L8,396 L8,376 L8,356 L8,336 L8,316 L8,296 L8,276 L8,256 L8,236 L8,216 L8,196 L18,196 L28,196 L38,196 L48,196 L58,196 L68,196 L78,196 L88,196 L98,196 L108,196 L118,196 L128,196 L138,196 L148,196 Z"
                      fill="#e5f3ff"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      className="drop-shadow-sm"
                    />

                    {/* Marqueurs pour les demandes */}
                    {filteredRequests.map((request) => {
                      if (!request || !request.city) return null
                      const position = getMarkerPosition(request.city, request.coordinates)

                      return (
                        <g key={`request-${request.id}`}>
                          <circle
                            cx={position.x}
                            cy={position.y}
                            r="8"
                            className={`${getUrgencyColor(request.urgency)} cursor-pointer hover:scale-110 transition-transform duration-200 drop-shadow-md`}
                            fill="currentColor"
                            stroke="white"
                            strokeWidth="2"
                            onClick={() => setSelectedItem({ type: "request", data: request })}
                          />
                          <circle cx={position.x} cy={position.y} r="4" fill="white" className="pointer-events-none" />
                        </g>
                      )
                    })}

                    {/* Marqueurs pour les réparateurs */}
                    {filteredReparateurs.map((reparateur) => {
                      if (!reparateur || !reparateur.city) return null
                      const position = getMarkerPosition(reparateur.city, reparateur.coordinates)

                      return (
                        <g key={`reparateur-${reparateur.id}`}>
                          <rect
                            x={position.x - 8}
                            y={position.y - 8}
                            width="16"
                            height="16"
                            fill="#3b82f6"
                            stroke="white"
                            strokeWidth="2"
                            className="cursor-pointer hover:scale-110 transition-transform duration-200 drop-shadow-md"
                            onClick={() => setSelectedItem({ type: "reparateur", data: reparateur })}
                          />
                          <rect
                            x={position.x - 4}
                            y={position.y - 4}
                            width="8"
                            height="8"
                            fill="white"
                            className="pointer-events-none"
                          />
                        </g>
                      )
                    })}
                  </svg>

                  {/* Légende */}
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
                        <div className="w-3 h-3 bg-blue-600 mr-2"></div>
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
              <Card className="mt-6">
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
                          {getUrgencyLabel(selectedItem.data.urgency)}
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
                              {canViewPersonalData()
                                ? `${selectedItem.data.client?.firstName || "Client"} ${selectedItem.data.client?.lastName || ""}`
                                : maskPersonalData(
                                    `${selectedItem.data.client?.firstName || "Client"} ${selectedItem.data.client?.lastName || ""}`,
                                  )}
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
                        {canViewPersonalData() && (
                          <Button variant="outline" className="flex-1">
                            Contacter le client
                          </Button>
                        )}
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
