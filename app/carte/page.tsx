"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Filter, Search, Wrench, Clock, User, MapPin, Lock, AlertCircle, RefreshCw } from "lucide-react"
import { StorageService } from "@/lib/storage"
import LeafletMap from "@/components/leaflet-map"

export default function CartePage() {
  const [requests, setRequests] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    type: "all",
    category: "",
    city: "",
    urgency: "",
  })

  useEffect(() => {
    // Délai pour éviter les erreurs d'hydratation
    const timer = setTimeout(() => {
      loadData()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("[CartePage] Début du chargement des données")

      // Vérifier si nous sommes côté client
      if (typeof window === "undefined") {
        console.log("[CartePage] Côté serveur, attente...")
        return
      }

      // Initialiser les données de démonstration si nécessaire
      StorageService.initDemoData()

      // Charger les données
      const loadedRequests = StorageService.getRepairRequests()
      const loadedUsers = StorageService.getUsers()
      const user = StorageService.getCurrentUser()

      console.log("[CartePage] Données chargées:", {
        requests: loadedRequests.length,
        users: loadedUsers.length,
        currentUser: user?.email,
      })

      // Vérifier et corriger les coordonnées manquantes
      const requestsWithCoords = loadedRequests.map((request) => {
        if (!request.coordinates) {
          request.coordinates = StorageService.generateCoordinatesForCity(request.city || "Paris")
        }
        return request
      })

      const usersWithCoords = loadedUsers.map((user) => {
        if (user.userType === "reparateur" && !user.coordinates) {
          user.coordinates = StorageService.generateCoordinatesForCity(user.city || "Paris")
        }
        return user
      })

      setRequests(requestsWithCoords)
      setUsers(usersWithCoords)
      setCurrentUser(user)

      console.log("[CartePage] État mis à jour avec succès")
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err)
      setError("Erreur lors du chargement des données. Veuillez rafraîchir la page.")
    } finally {
      setLoading(false)
    }
  }

  // Fonction de filtrage sécurisée
  const getFilteredRequests = () => {
    try {
      if (!Array.isArray(requests)) return []

      return requests.filter((request) => {
        if (!request) return false
        return (
          (filters.type === "all" || filters.type === "requests") &&
          (!filters.category || request.category?.toLowerCase().includes(filters.category.toLowerCase())) &&
          (!filters.city || request.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
          (!filters.urgency || request.urgency === filters.urgency)
        )
      })
    } catch (err) {
      console.error("Erreur lors du filtrage des demandes:", err)
      return []
    }
  }

  const getFilteredReparateurs = () => {
    try {
      if (!Array.isArray(users)) return []

      return users.filter((user) => {
        if (!user) return false
        return (
          user.userType === "reparateur" &&
          (filters.type === "all" || filters.type === "reparateurs") &&
          (!filters.city || user.city?.toLowerCase().includes(filters.city.toLowerCase()))
        )
      })
    } catch (err) {
      console.error("Erreur lors du filtrage des réparateurs:", err)
      return []
    }
  }

  const filteredRequests = getFilteredRequests()
  const filteredReparateurs = getFilteredReparateurs()

  // Convertir les données en marqueurs pour la carte
  const getMapMarkers = () => {
    try {
      const requestMarkers = filteredRequests.map((request) => ({
        id: request.id || `request_${Math.random()}`,
        type: "request" as const,
        position: request.coordinates || { lat: 48.8566, lng: 2.3522 },
        title: request.title || "Demande sans titre",
        data: request,
      }))

      const reparateurMarkers = filteredReparateurs.map((reparateur) => ({
        id: reparateur.id || `reparateur_${Math.random()}`,
        type: "reparateur" as const,
        position: reparateur.coordinates || StorageService.generateCoordinatesForCity(reparateur.city || "Paris"),
        title: `${reparateur.firstName || ""} ${reparateur.lastName || ""}`.trim() || "Réparateur",
        data: reparateur,
      }))

      const allMarkers = [...requestMarkers, ...reparateurMarkers]
      console.log("[CartePage] Marqueurs créés:", allMarkers.length)
      return allMarkers
    } catch (err) {
      console.error("Erreur lors de la création des marqueurs:", err)
      return []
    }
  }

  const mapMarkers = getMapMarkers()

  const canViewPersonalData = () => {
    try {
      if (!currentUser || currentUser.userType !== "reparateur") return false
      if (currentUser.subscription?.status === "active") return true
      if (currentUser.subscription?.status === "trial") {
        const expiresAt = new Date(currentUser.subscription.endDate)
        return expiresAt > new Date()
      }
      return false
    } catch (err) {
      console.error("Erreur lors de la vérification des permissions:", err)
      return false
    }
  }

  const maskPersonalData = (text: string) => {
    try {
      if (canViewPersonalData()) return text
      return text.replace(/[a-zA-ZÀ-ÿ]/g, "*")
    } catch (err) {
      console.error("Erreur lors du masquage des données:", err)
      return "***"
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

  const handleMarkerClick = (marker: any) => {
    try {
      console.log("[CartePage] Marqueur cliqué:", marker.title)
      setSelectedItem(marker)
    } catch (err) {
      console.error("Erreur lors de la sélection du marqueur:", err)
    }
  }

  const resetFilters = () => {
    try {
      setFilters({ type: "all", category: "", city: "", urgency: "" })
    } catch (err) {
      console.error("Erreur lors de la réinitialisation des filtres:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement de la carte des dépannages...</p>
              <p className="text-sm text-gray-500 mt-2">Initialisation des données...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Card>
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-red-600">Erreur de chargement</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="space-x-2">
                  <Button onClick={loadData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Recharger la page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carte des demandes de dépannage</h1>
          <p className="text-gray-600">Visualisez les demandes de réparation et les réparateurs en temps réel</p>
          <div className="mt-2 text-sm text-gray-500">
            {mapMarkers.length} marqueurs • {filteredRequests.length} demandes • {filteredReparateurs.length}{" "}
            réparateurs
          </div>
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
                      <SelectValue
                        placeholder={
                          filters.type === ""
                            ? "Tout afficher"
                            : filters.type === "all"
                              ? "Tout afficher"
                              : filters.type === "requests"
                                ? "Demandes uniquement"
                                : "Réparateurs uniquement"
                        }
                      />
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
                      <SelectValue placeholder={filters.category === "" ? "Toutes" : filters.category} />
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
                        <SelectValue placeholder={filters.urgency === "" ? "Toutes" : filters.urgency} />
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

                <Button variant="outline" className="w-full" onClick={resetFilters}>
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
                  <span className="text-sm text-gray-600">Total marqueurs</span>
                  <Badge variant="secondary">{mapMarkers.length}</Badge>
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
            <LeafletMap
              markers={mapMarkers}
              onMarkerClick={handleMarkerClick}
              height="700px"
              center={{ lat: 46.603354, lng: 1.888334 }}
            />

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
                              {canViewPersonalData() ? (
                                `${selectedItem.data.client?.firstName || "Client"} ${selectedItem.data.client?.lastName || ""}`
                              ) : (
                                <span className="flex items-center">
                                  <Lock className="h-3 w-3 mr-1" />
                                  {maskPersonalData("Jean Dupont")}
                                </span>
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
